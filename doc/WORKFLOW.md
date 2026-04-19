# Job Hunting System — Workflow & Design Guide

## Overview

The job hunting system is a semi-autonomous agent workflow built on top of OpenClaw. It discovers, filters, scores, and prepares job applications — then hands off to you for the final submission. Everything is driven by **slash commands (skills)** and a small set of **markdown state files**.

---

## Design Patterns

### Skills as entry points

All workflow logic lives in skill files (`workspace/skills/*.md`). Nothing is preloaded into the agent's context by default — job hunting context only exists when a skill is invoked. This keeps non-job conversations lean and prevents irrelevant context from polluting unrelated tasks.

```
/job-hunt (cron or manual)
  → discover → filter → score → create application file → update pipeline → notify → trigger /job-materials

/job-materials (cron 4x/day or triggered by /job-hunt)
  → pick top 3 scored → fetch company about page → tailor resume + cover letter → notify batch
  → remaining scored jobs picked up in next run (processes 3 per run until queue is clear)
```

### Mutable state vs. static instructions

| Directory | Purpose | Written by |
|---|---|---|
| `skills/` | Workflow instructions, templates, protocols | You only |
| `jobs/` | Live pipeline state, search queries, application files | Agent only |
| `RESUME.md` | Source of truth for your experience | You only |

Skills are never modified by the agent. The agent only writes to `jobs/`.

### You control the gate

The agent moves jobs autonomously through the pipeline up to `materials_ready`. You apply yourself and mark jobs done with `/job-applied`.

```
/job-hunt:      discover → filter → score → create application file → notify sweep → trigger /job-materials
/job-materials: pick top 3 scored → tailor resume + cover letter → notify batch ready
You:            review materials → open job URL → apply → /job-applied JOB-XXX
```

### Markdown over database

All state is stored in markdown files. The agent reads and writes state using the same tools it uses for everything else — no separate database, no special tooling. The pipeline table in `JOB_PIPELINE.md` is a plain markdown table.

---

## Architecture

```
workspace/
├── RESUME.md                    ← Your skills and experience (source of truth)
├── PROJECTS.md                  ← Project history analysed from GitHub (maintained by /github-analyse)
├── HEARTBEAT.md                 ← Background cleanup tasks (expiry, archival)
├── doc/
│   └── WORKFLOW.md              ← This file
├── jobs/
│   ├── JOB_PIPELINE.md          ← Live CRM table: all jobs and their status
│   ├── SEARCH_QUERIES.md        ← Curated Seek/LinkedIn query bank (agent-maintained)
│   └── applications/
│       ├── YYYY-MM-DD_Company_Role.md         ← Application file (full JD, score, tailoring notes, cover letter)
│       └── YYYY-MM-DD_Company_Role_RESUME.md  ← Tailored resume (ready to submit)
└── skills/
    ├── job-hunt/
    │   ├── SKILL.md             ← Discovery → filter → score → create application file → notify → trigger job-materials
    │   └── scripts/
    │       └── seek-fetch.js    ← Playwright scraper for Seek search + job pages
    ├── job-materials/
    │   └── SKILL.md             ← Pick top 3 scored → tailor resume + cover letter → notify batch
    ├── job-applied/
    │   └── SKILL.md             ← Mark a job as applied in the pipeline
    ├── github-analyse/
    │   └── SKILL.md             ← Analyse a GitHub repo and write to PROJECTS.md
    └── md-to-pdf/
        ├── SKILL.md             ← Convert tailored resume markdown to PDF
        └── scripts/
            └── md-to-pdf.js    ← Playwright-based markdown→PDF converter
```

---

## Pipeline

```
discovered → filtered → scored → materials_ready → applied
                ↓            ↓
          discarded      weak_match        ← archived, no further work
```

| State | Meaning |
|---|---|
| `discovered` | URL found, not yet fetched |
| `filtered` | Passed hard filters (salary, location, employment type) |
| `scored` | Relevance score ≥ 5.5, application file created with verbatim job description |
| `materials_ready` | Tailoring notes, tailored resume, and cover letter written |
| `applied` | You submitted the application |
| `discarded` | Failed a hard filter |
| `weak_match` | Score < 6.0 |
| `skipped` | You passed on it |
| `auto-skipped` | Automatically skipped by the agent |
| `expired` | Listing closed (> 30 days old) |

---

## Workflow

### Phase 1 — Discovery (`/job-hunt`)

**Seek (primary — 3–4 queries per sweep):** Runs `seek-fetch.js` via Bash for each query in `SEARCH_QUERIES.md`. Returns title, company, salary, location, workType, URL per listing. Each result is deduped against `JOB_PIPELINE.md` before adding to the working list.

**LinkedIn (supplementary — 2 queries max):** Brave Search snippets only. LinkedIn blocks all automated fetching, so snippets are the best available source. Do not attempt to WebFetch LinkedIn URLs.

Target: 15–25 candidates total.

> **Why three different fetch tools?**
> | Tool | Used for | Why |
> |---|---|---|
> | `seek-fetch.js` (headless Playwright) | Seek search results + Seek job pages | Seek actively blocks plain HTTP requests — needs a real browser |
> | WebFetch | Company's own about/website | Regular public webpages have no bot protection — fast and simple |
> | Brave Search | LinkedIn job snippets | LinkedIn blocks all automated access; Brave gives us titles/companies/URLs from search engine results |

### Phase 2 — Hard Filters (`/job-hunt`)

Applied immediately after discovery using search result data — **no full page fetch needed**. Instant discard if any of:
- Salary stated and base (excl. super) **< $115k** — if a range, use midpoint
- Employment type is **contract or casual only**
- Location is not **Melbourne, Brisbane, or Sydney** and not remote-friendly

Salary unknown → proceed (don't discard on missing data).

Full job pages are only fetched for jobs that **survive** hard filters, avoiding wasted fetches on roles that would be discarded anyway.

### Phase 3 — Relevance Scoring (`/job-hunt`)

Scored against `RESUME.md` and `PROJECTS.md` across four weighted dimensions:

| Dimension | Weight | How scored |
|---|---|---|
| Technical skills match | 40% | Must-have tech skills covered ÷ total must-haves × 10 |
| Experience level match | 25% | Junior (<3yr)=3, Mid(3-5yr)=10, Senior(5yr+)=7; Leslie has ~4yr (mid) |
| Domain/industry fit | 20% | Same domain = 10, adjacent = 6, unrelated = 2 |
| Nice-to-have coverage | 15% | Proportion of nice-to-haves covered × 10 |

**Threshold: score ≥ 5.5 → proceed. Below 5.5 → archived as `weak_match`.**

### Phase 4 — Application File Creation (`/job-hunt`)

For each scored job, an application file is created with the **complete verbatim job description** from seek-fetch.js — no summarising, no truncating. This is the only time the Seek listing is fetched. `/job-materials` works entirely from this file and never needs to re-fetch anything from Seek.

After creating application files, job-hunt updates the pipeline to `scored`, adds a brief quality note to each query used in `SEARCH_QUERIES.md`, sends a brief sweep summary, and triggers `/job-materials`.

```
Job sweep complete. [N] new jobs scored, [Y] discarded.
```

### Phase 5 — Materials Generation (`/job-materials`)

Runs after job-hunt, and independently 4x per day via cron. Each run:

1. Loads `RESUME.md`, `PROJECTS.md`, and `USER.md` as reference data
2. Finds all `scored` jobs in the pipeline
3. Picks the top 3 by score
4. For each: reads the application file → fetches company about page → writes tailoring notes → generates tailored resume + cover letter
5. Updates status to `materials_ready`
6. Sends one WhatsApp batch notification:

```
[N] job(s) ready to apply:

• JOB-001: [Title] @ [Company] — Score: X.X | $[salary] | [arrangement]
  Apply: [job URL]
  Resume: jobs/applications/YYYY-MM-DD_Company_Role_RESUME.md
  Notes: jobs/applications/YYYY-MM-DD_Company_Role.md

[N] more jobs still queued — will process next run.   ← if >3 scored remain
```

`RESUME.md` is never modified — tailoring notes are written into the application file only.

You review the materials, open the job URL, apply yourself, then run `/job-applied JOB-XXX`.

---

## Automation

| Job | Schedule | What it does |
|---|---|---|
| Job hunt | 2x daily (morning + evening) | Runs `/job-hunt` |
| Materials | 4x daily | Runs `/job-materials` — processes top 3 scored jobs per run |
| Heartbeat | Periodic | Expires stale active jobs (> 30 days), cleans archived entries (> 60 days) |

**Expiry & cleanup (heartbeat):**
- Active jobs (`discovered`, `filtered`, `scored`, `materials_ready`) older than 30 days → moved to Archived as `expired`
- Archived entries older than 60 days → deleted entirely, along with their application files

---

## Slash Commands

### `/job-hunt`
Runs discovery and scoring. Invoked by the daily cron or manually on demand.

**What it does:** loads pipeline + queries + resume + projects → runs `seek-fetch.js` for Seek, Brave Search for LinkedIn snippets → hard filters → fetches full job pages (batch, one browser session) → scores → creates application files with verbatim job descriptions → updates pipeline to `scored` → adds quality notes to SEARCH_QUERIES.md → sends brief sweep summary → triggers `/job-materials`.

---

### `/job-materials`
Generates application materials for the top 3 scored jobs. Invoked by `/job-hunt` and runs independently via cron 4x daily.

**What it does:** loads resume + projects + user context → finds all `scored` jobs → picks top 3 by score → reads application file → fetches company about page → writes tailoring notes + tailored resume + cover letter → updates status to `materials_ready` → sends one WhatsApp batch notification (with queued count if >3 remain). Exits silently if no scored jobs waiting.

---

### `/job-applied JOB-XXX`
Mark a job as applied. Updates status to `applied` and sets today's date in the pipeline.

---

### `/github-analyse <repo-url>`
Analyses a GitHub repository and writes a structured project entry to `PROJECTS.md`. Works with no README — uses GitHub API metadata, file tree, manifest files, entry points, and test files. Overwrites existing entries rather than duplicating.

Run this for each of your projects before running `/job-hunt` for the first time, so the agent has rich project context for scoring and cover letters.

---

### `/md-to-pdf [file | JOB-ID]`
Converts any markdown file to PDF. Manually triggered only.

- With a file path: converts that file directly
- With a JOB-ID: finds the tailored resume for that job and converts it
- Without an argument: asks which file to convert

Output saved alongside the input file with `.pdf` extension.

---

## Application File Format

Each job gets a file at `jobs/applications/YYYY-MM-DD_Company_Role.md`. The Job Description section is always the complete verbatim text from the Seek listing — this is what `/job-materials` uses to generate tailored content.

```markdown
# [Job Title] @ [Company]

**Status:** scored
**ID:** JOB-001
**Added:** 2026-03-20
**Source URL:** https://seek.com.au/...

## Job Details
- **Salary:** $130–150k
- **Location:** Melbourne CBD, hybrid
- **Application method:** Seek Easy Apply

## Job Description
[complete verbatim text from seek-fetch.js — all responsibilities, requirements,
tech stack mentions, team context, and any other detail present in the listing]

## Relevance Score: 8.2 / 10
| Dimension | Score | Notes |
|---|---|---|
| Technical skills match (40%) | 9/10 | React ✓ TypeScript ✓ Python ✓ |
| Experience level match (25%) | 8/10 | Senior role, ~4 years experience |
| Domain/industry fit (20%) | 7/10 | SaaS adjacent to previous work |
| Nice-to-have coverage (15%) | 8/10 | Docker ✓ AWS ✓ Kubernetes ✗ |

## Requirements
### Must-have
- React, TypeScript, Python
- 4+ years experience

### Nice-to-have
- Kubernetes, Terraform

## Tailoring Notes
(filled by /job-materials)

## Cover Letter
(filled by /job-materials)
```

---

## Failure Modes

| Failure | What happens |
|---|---|
| seek-fetch.js is slow | Normal — script launches real browser (~15–20s). Don't retry. |
| Seek changes selectors | Update `data-automation` selectors in `seek-fetch.js`; test with `--url` mode |
| LinkedIn truncated (no auth) | Seek/company careers page used for full JD |
| Active jobs not actioned after 30 days | Heartbeat marks them `expired` and archives silently |
| Application file bloat | Archived entries deleted after 60 days along with their application files |

---

## Key Design Decisions

| Decision | Why |
|---|---|
| Skills contain all instructions | Single source of truth per workflow — no separate protocol files |
| `jobs/` holds state only | Clean separation between instructions (skills) and data (jobs) |
| Hard salary filter first | No point scoring a job that pays under threshold |
| Salary unknown → proceed | Many roles omit salary; don't miss good jobs on missing data |
| Playwright for Seek, Brave Search for LinkedIn | seek-fetch.js scrapes Seek directly (reliable, fast); Brave Search used only for LinkedIn snippets |
| No Chrome for LinkedIn | Bot detection too aggressive — snippets only |
| Verbatim job description in application file | `/job-materials` works entirely from the application file — no re-fetching Seek listings |
| Batch fetch with `--urls-file` | One browser launch for all URLs — avoids crashes on low-memory servers |
| Separate `/job-materials` skill with cap of 3 | Keeps job-hunt fast; materials generation runs independently and spreads load throughout the day |
| Agent generates materials, you apply | Removes auth complexity entirely; avoids automated submission detection; you stay in control |
| Tailoring notes, not resume rewrites | `RESUME.md` stays as single source of truth; notes are auditable |
| Markdown files, not a database | Agent reads/writes using the same tools as everything else |
