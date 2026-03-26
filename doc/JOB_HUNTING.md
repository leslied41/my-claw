# Job Hunting System — Design & Usage Guide

## Overview

The job hunting system is a semi-autonomous agent workflow built on top of OpenClaw. It discovers, filters, scores, and prepares job applications — then hands off to you for the final submission. Everything is driven by **slash commands (skills)** and a small set of **markdown state files**.

---

## Design Patterns

### Skills as entry points

All workflow logic lives in skill files (`workspace/skills/*.md`). Nothing is preloaded into the agent's context by default — job hunting context only exists when a skill is invoked. This keeps non-job conversations lean and prevents irrelevant context from polluting unrelated tasks.

```
User invokes /job-hunt (or cron fires)
  → agent reads skills/job-hunt/SKILL.md
  → skill loads JOB_PIPELINE.md, SEARCH_QUERIES.md, RESUME.md
  → discover → filter → score → tailor resume → cover letter → notify
  → state written back to jobs/
  → context discarded
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
Agent does:  discover → filter → score → tailor resume → cover letter → notify (fully automated)
You do:      review materials → open job URL → apply → /job-applied JOB-XXX
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
│   └── JOB_HUNTING.md           ← This file
├── jobs/
│   ├── JOB_PIPELINE.md          ← Live CRM table: all jobs and their status
│   ├── SEARCH_QUERIES.md        ← Curated Seek/LinkedIn query bank (agent-maintained)
│   └── applications/
│       ├── YYYY-MM-DD_Company_Role.md         ← Application file (score, tailoring notes, cover letter)
│       └── YYYY-MM-DD_Company_Role_RESUME.md  ← Tailored resume (ready to submit)
└── skills/
    ├── job-hunt/
    │   ├── SKILL.md             ← Full pipeline: discovery → scoring → tailoring → notify
    │   └── scripts/
    │       └── seek-fetch.js    ← Playwright scraper for Seek search + job pages
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
| `scored` | Relevance score ≥ 6.0, application file created |
| `materials_ready` | Tailoring notes, tailored resume, and cover letter written |
| `applied` | You submitted the application |
| `discarded` | Failed a hard filter |
| `weak_match` | Score < 6.0 |
| `skipped` | You passed on it |
| `expired` | Listing closed (> 30 days old) |

---

## The 6-Phase Workflow

### Phase 1 — Discovery

**Seek (primary — 3–4 queries per sweep):** Runs `seek-fetch.js` via Bash for each query in `SEARCH_QUERIES.md`. Returns title, company, salary, location, workType, URL per listing. Each result is deduped against `JOB_PIPELINE.md` before adding to the working list.

**LinkedIn (supplementary — 2 queries max):** Brave Search snippets only. LinkedIn blocks all automated fetching, so snippets are the best available source. Do not attempt to WebFetch LinkedIn URLs.

Target: 15–25 candidates total.

> **Why three different fetch tools?**
> | Tool | Used for | Why |
> |---|---|---|
> | `seek-fetch.js` (headless Playwright) | Seek search results + Seek job pages | Seek actively blocks plain HTTP requests — needs a real browser |
> | WebFetch | Company's own about/website | Regular public webpages have no bot protection — fast and simple |
> | Brave Search | LinkedIn job snippets | LinkedIn blocks all automated access; Brave gives us titles/companies/URLs from search engine results |

### Phase 2 — Hard Filters

Applied immediately after discovery using search result data — **no full page fetch needed**. Instant discard if any of:
- Salary stated and base (excl. super) **< $115k** — if a range, use midpoint
- Employment type is **contract or casual only**
- Location is not **Melbourne, Brisbane, or Sydney** and not remote-friendly

Salary unknown → proceed (don't discard on missing data).

Full job pages are only fetched for jobs that **survive** hard filters, avoiding wasted fetches on roles that would be discarded anyway.

### Phase 3 — Relevance Scoring

Scored against `RESUME.md` across four weighted dimensions:

| Dimension | Weight | How scored |
|---|---|---|
| Technical skills match | 40% | Must-have tech skills covered ÷ total must-haves × 10 |
| Experience level match | 25% | ~4 years — mid-level roles score highest |
| Domain/industry fit | 20% | Same domain = 10, adjacent = 6, unrelated = 2 |
| Nice-to-have coverage | 15% | Proportion of nice-to-haves covered × 10 |

**Threshold: score ≥ 6.0 → proceed. Below 6.0 → archived as `weak_match`.**

Score breakdown is saved in every application file so the threshold can be tuned over time.

### Phase 4 — Resume Tailoring

`RESUME.md` is never modified. Instead, tailoring notes are written into the application file:

1. **Keyword mapping** — JD terms mapped to resume equivalents, gaps flagged
2. **Summary rewrite** — 2–3 sentences mirroring the JD's language
3. **Experience bullet reorder** — most relevant bullets moved to top
4. **Skills table reorder** — most relevant categories shown first
5. **Gap note** — honest statement of anything missing

A tailored resume (`YYYY-MM-DD_Company_Role_RESUME.md`) is generated from `RESUME.md` applying these notes.

### Phase 5 — Cover Letter

250–350 words, four paragraphs:

1. **Hook** — role + specific company/product reference (fetched from their about page)
2. **Evidence** — 1–2 quantified achievements matching JD core requirements
3. **Company Fit** — specific to their tech/mission/scale, no generic filler
4. **Close** — confident, not grovelling

Tone calibrated: startup < ~50 people (direct, informal) vs enterprise (formal, reliability-focused).

### Phase 6 — Notification

Once materials are ready, the agent sends a WhatsApp summary:

```
Job sweep complete. [N] new matches, [Y] discarded.

• JOB-001: [Title] @ [Company] — Score: X.X | $[salary] | [arrangement]
  Apply: [job URL]
  Resume: jobs/applications/YYYY-MM-DD_Company_Role_RESUME.md
  Notes: jobs/applications/YYYY-MM-DD_Company_Role.md

• JOB-002: ...
```

You review the materials, open the job URL, and apply yourself. Run `/job-applied JOB-XXX` when done.

---

## Automation

| Job | Schedule | What it does |
|---|---|---|
| Daily sweep | 1:47 PM AEST, Mon–Fri | Runs `/job-hunt` |
| Heartbeat | Periodic | Expires stale active jobs (> 30 days), cleans archived entries (> 60 days) |

**Expiry & cleanup (heartbeat):**
- Active jobs (`discovered`, `filtered`, `scored`, `materials_ready`) older than 30 days → moved to Archived as `expired`
- Archived entries older than 60 days → deleted entirely, along with their application files

---

## Slash Commands

### `/job-hunt`
Runs the full pipeline end-to-end. Invoked by the daily cron or manually on demand.

**What it does:** loads pipeline + queries + resume → runs `seek-fetch.js` for Seek, Brave Search for LinkedIn snippets → hard filters → fetches full job pages (batch, one browser session) → scores → generates tailored resume + cover letter for each match → notifies via WhatsApp → updates query quality notes.

---

### `/job-applied JOB-XXX`
Mark a job as applied. Updates status to `applied` and sets today's date in the pipeline.

---

### `/github-analyse <repo-url>`
Analyses a GitHub repository and writes a structured project entry to `PROJECTS.md`. Works with no README — uses GitHub API metadata, file tree, manifest files, entry points, and test files. If the repo already exists in `PROJECTS.md`, the entry is overwritten not duplicated.

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

Each job gets a file at `jobs/applications/YYYY-MM-DD_Company_Role.md`:

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
(filled by /job-hunt)

## Cover Letter
(filled by /job-hunt)
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
| Agent generates materials, you apply | Removes auth complexity entirely; avoids automated submission detection; you stay in control |
| Tailoring notes, not resume rewrites | `RESUME.md` stays as single source of truth; notes are auditable |
| Markdown files, not a database | Agent reads/writes using the same tools as everything else |
