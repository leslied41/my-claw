# Job Hunting System — Design & Usage Guide

## Overview

The job hunting system is a semi-autonomous agent workflow built on top of OpenClaw. It discovers, filters, scores, and prepares job applications — then hands off to you for the final submission. Everything is driven by **slash commands (skills)** and a small set of **markdown state files**.

---

## Design Patterns

### Skills as entry points

All workflow logic lives in skill files (`workspace/skills/*.md`). Nothing is preloaded into the agent's context by default — job hunting context only exists when a skill is invoked. This keeps non-job conversations lean and prevents irrelevant context from polluting unrelated tasks.

```
User invokes /job-hunt
  → agent reads skills/job-hunt.md
  → skill instructions load jobs/JOB_PIPELINE.md, SEARCH_QUERIES.md, RESUME.md
  → work happens
  → state written back to jobs/
  → context discarded
```

### Mutable state vs. static instructions

| Directory | Purpose | Written by |
|---|---|---|
| `skills/` | Workflow instructions, templates, protocols | Leslie only |
| `jobs/` | Live pipeline state, search queries, application files | Agent only |
| `RESUME.md` | Source of truth for Leslie's experience | Leslie only |

Skills are never modified by the agent. The agent only writes to `jobs/`.

### You control the gate

The agent moves jobs autonomously through the pipeline up to `pending_review`. Nothing is submitted without your explicit action. This avoids automated submission detection and keeps you in control of what goes out.

```
Agent does:  discover → filter → score → tailor → cover letter → pre-fill form → notify you
You do:      review the pre-filled form → click Submit
```

### Markdown over database

All state is stored in markdown files. This means the agent can read and write state using the same tools it uses for everything else — no separate database, no special tooling. The pipeline table in `JOB_PIPELINE.md` is a plain markdown table.

---

## Architecture

```
workspace/
├── RESUME.md                    ← Leslie's skills and experience (source of truth)
├── PREFERENCES.md               ← Agent behaviour rules (web search permissions, etc.)
├── HEARTBEAT.md                 ← Background check tasks (stale job reminders)
├── doc/
│   └── plan.md                  ← Implementation plan and design decisions
├── jobs/
│   ├── JOB_PIPELINE.md          ← Live CRM table: all jobs and their status
│   ├── SEARCH_QUERIES.md        ← Curated Seek/LinkedIn query bank (agent-maintained)
│   ├── memory/
│   │   └── heartbeat-state.json ← Tracks which jobs have been reminded (prevents spam)
│   └── applications/
│       └── YYYY-MM-DD_Company_Role.md  ← One file per job
└── skills/
    ├── job-hunt.md              ← Discovery + filtering + scoring workflow
    ├── job-apply.md             ← Resume tailoring + cover letter + form pre-fill
    ├── job-review.md            ← Review pending jobs, apply/skip decisions
    └── job-status.md            ← Read-only pipeline snapshot
```

---

## Pipeline

```
discovered → filtered → scored → materials_ready → pending_review → applied
                ↓            ↓
          discarded      weak_match        ← archived, no further work
```

| State | Meaning |
|---|---|
| `discovered` | URL found, not yet fetched |
| `filtered` | Passed hard filters (salary, location, employment type) |
| `scored` | Relevance score ≥ 6.0, application file created |
| `materials_ready` | Tailoring notes and cover letter written |
| `pending_review` | Form pre-filled, waiting for Leslie to submit |
| `applied` | Submitted |
| `discarded` | Failed a hard filter |
| `weak_match` | Score < 6.0 |
| `skipped` | Leslie passed on it |

---

## The 7-Phase Workflow

### Phase 1 — Discovery

Runs via **Brave Search** using queries from `SEARCH_QUERIES.md`. Up to 6 queries per run, rotated across runs. Targets Seek (primary) and LinkedIn (snippets only — no auth, bot detection too aggressive for full page fetches).

- Deduplicates against `JOB_PIPELINE.md` before processing
- Collects 10–20 candidate URLs before fetching full pages
- Falls back to Chrome DevTools (headless) if Seek blocks WebFetch

### Phase 2 — Hard Filters

Instant discard (no further processing) if any of:
- Salary stated and base (excl. super) **< $115k** — if a range, use midpoint
- Employment type is **contract or casual only**
- Location is not **Melbourne, Brisbane, or Sydney** and not remote-friendly

Salary unknown → proceed (don't discard on missing data).

### Phase 3 — Relevance Scoring

Scored against `RESUME.md` across four weighted dimensions:

| Dimension | Weight | How scored |
|---|---|---|
| Technical skills match | 40% | Must-have tech skills Leslie has ÷ total must-haves × 10 |
| Experience level match | 25% | Leslie has ~4 years — mid-level roles score highest |
| Domain/industry fit | 20% | Same domain = 10, adjacent = 6, unrelated = 2 |
| Nice-to-have coverage | 15% | Proportion of nice-to-haves Leslie covers × 10 |

**Threshold: score ≥ 6.0 → proceed. Below 6.0 → archived as `weak_match`.**

Score breakdown is saved in every application file so the threshold can be tuned over time.

### Phase 4 — Resume Tailoring

`RESUME.md` is never modified. Instead, tailoring notes are written into the application file:

1. **Keyword mapping** — JD terms mapped to resume equivalents, gaps flagged
2. **Summary rewrite** — 2–3 sentences mirroring the JD's language
3. **Experience bullet reorder** — most relevant bullets moved to top
4. **Skills table reorder** — most relevant categories shown first
5. **Gap note** — honest statement of anything missing

### Phase 5 — Cover Letter

250–350 words, four paragraphs:

1. **Hook** — role + specific company/product reference (fetched from their about page)
2. **Evidence** — 1–2 quantified achievements matching JD core requirements
3. **Company Fit** — specific to their tech/mission/scale, no generic filler
4. **Close** — confident, not grovelling

Tone calibrated: startup < ~50 people (direct, informal) vs enterprise (formal, reliability-focused).

### Phase 6 — Form Pre-fill & Notification

Depending on application method:

| Method | What the agent does |
|---|---|
| **Seek Easy Apply** | Uses Chrome DevTools to navigate → click Easy Apply → fill form → screenshot → WhatsApp you |
| **Direct email** | Drafts the email → sends draft to WhatsApp for you to send |
| **External / LinkedIn** | Sends you the URL + cover letter text on WhatsApp |

**The agent never submits. You do the final action.**

WhatsApp message format:
```
JOB-XXX ready: [Title] @ [Company]
Form is pre-filled. Open Seek to review and submit:
[URL]

Reply "done XXX" when submitted, or "skip XXX" to pass.
```

### Phase 7 — Status Updates

- `done XXX` → status set to `applied`, date recorded
- `skip XXX` → moved to Archived with status `skipped`

---

## Automation (Cron)

Three cron jobs run automatically (configured in `.openclaw/cron/jobs.json`):

| Job | Schedule | What it does |
|---|---|---|
| Morning sweep | 8:23 AM AEST, Mon–Fri | Runs `/job-hunt` |
| Afternoon sweep | 1:47 PM AEST, Mon–Fri | Runs `/job-hunt` |
| Heartbeat check | 9:00 AM AEST, daily | Checks for stale `pending_review` jobs |

**Heartbeat behaviour:**
- Jobs in `pending_review` for > 48 hours → one WhatsApp reminder (once only per job)
- Jobs in `pending_review` for > 7 days → auto-skipped
- No reminders sent between 23:00–08:00 AEST
- Reminder state tracked in `jobs/memory/heartbeat-state.json`

---

## Slash Commands

### `/job-hunt`
Runs a full discovery sweep. What the crons run automatically — also invoke manually to trigger on demand.

**What it does:** loads pipeline + queries + resume → runs Brave Search → fetches job pages → filters → scores → creates application files → notifies you on WhatsApp → updates query quality notes.

**Cap:** max 10 URLs fetched, max 5 jobs scored per run. The rest stay as `discovered` for the next run.

---

### `/job-status`
Read-only pipeline snapshot. Shows counts by status.

```
📋 Job Pipeline — 2026-03-20

Active
  discovered      3
  filtered        1
  scored          2
  materials_ready 1
  pending_review  2  ← action needed
  applied         5

Archived
  weak_match      8
  discarded       4
  skipped         1

Total tracked: 27
```

---

### `/job-review`
Shows all `pending_review` jobs with key details. Use this to browse ready applications and make decisions.

**Displays for each job:**
- Score, salary, location, application method
- Top skills matched and any gaps
- Tailored summary

**Commands available during review:**
```
/job-apply JOB-001   → prepare form and cover letter
skip JOB-001         → pass on this job
review JOB-001       → show full application file
```

Also flags stale jobs (> 48h) and auto-skips anything > 7 days old.

---

### `/job-apply <JOB-ID>`
Prepares full application materials for a specific job and pre-fills the form.

**Steps:**
1. Loads job file + resume
2. Fetches company about page
3. Writes tailoring notes into application file
4. Sets status → `materials_ready`
5. Writes cover letter into application file
6. Pre-fills the application form (Seek Easy Apply) via Chrome DevTools
7. Screenshots the filled form
8. Sends screenshot + URL to WhatsApp
9. Sets status → `pending_review`

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
| Experience level match (25%) | 8/10 | Senior role, Leslie is borderline |
| Domain/industry fit (20%) | 7/10 | SaaS adjacent to IMOS work |
| Nice-to-have coverage (15%) | 8/10 | Docker ✓ AWS ✓ Kubernetes ✗ |

## Requirements
### Must-have
- React, TypeScript, Python
- 4+ years experience

### Nice-to-have
- Kubernetes, Terraform

## Tailoring Notes
(filled by /job-apply)

## Cover Letter
(filled by /job-apply)
```

---

## Failure Modes

| Failure | What happens |
|---|---|
| Seek blocks WebFetch | Falls back to Chrome DevTools headless fetch |
| Chrome DevTools unavailable | Falls back to Brave Search snippet; flagged as "partial data" |
| LinkedIn truncated (no auth) | Seek/company careers page used for full JD |
| Too many jobs in one run | Capped at 5 scored per run; rest stay `discovered` |
| Stale `pending_review` | Heartbeat re-pings after 48h (once); auto-skipped after 7 days |
| Application file bloat | After 30 days, move skipped/rejected to `jobs/applications/archive/` |

---

## Key Design Decisions

| Decision | Why |
|---|---|
| Skills contain all instructions | Single source of truth per workflow — no separate protocol files |
| `jobs/` holds state only | Clean separation between instructions (skills) and data (jobs) |
| Hard salary filter first | No point scoring a job that pays under threshold |
| Salary unknown → proceed | Many roles omit salary; don't miss good jobs on missing data |
| Brave Search primary, Chrome fallback | Brave is fast and detection-safe; Chrome steps in only when needed |
| No Chrome for LinkedIn | Bot detection too aggressive — snippets only |
| Tailoring notes, not resume rewrites | `RESUME.md` stays as single source of truth; notes are auditable |
| Agent pre-fills, you submit | Avoids automated submission detection; you stay in the loop |
| Markdown files, not a database | Agent reads/writes using the same tools as everything else |
| Max 5 scored per cron run | Prevents slow/expensive runs when many listings appear at once |
