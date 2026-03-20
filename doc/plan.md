# OpenClaw Job Hunting Agent — Implementation Plan

## Architecture Overview

Everything runs through **skills (slash commands)** and a small set of **state files**. Skills contain all workflow logic and instructions — job context only loads when a skill is invoked, keeping non-job conversations lean. No external integrations needed beyond what's already configured (Brave Search, WebFetch, WhatsApp/Telegram).

```
workspace/
  jobs/
    JOB_PIPELINE.md       ← live state: pipeline tracker / CRM table
    SEARCH_QUERIES.md     ← live state: curated Seek/LinkedIn query bank
    applications/
      YYYY-MM-DD_Company_Role.md  ← one file per job (generated)
  skills/
    job-hunt.md           ← discovery + analysis workflow + search protocol
    job-review.md         ← review pending_review items, apply/skip decisions
    job-status.md         ← print pipeline summary
    job-apply.md          ← submission handoff + resume tailoring + cover letter template
  HEARTBEAT.md            ← updated with pipeline check
  PREFERENCES.md          ← updated to permit autonomous job searches
```

**What lives where:**
- `skills/` — all static instructions, protocols, and templates (never updated by the agent)
- `jobs/` — mutable state only: the pipeline table, query bank, and per-job application files

---

## The 7-Phase Workflow

### Phase 1 — Job Discovery (Automated, 2x daily)
- **Brave Search** with `site:seek.com.au "software engineer" Melbourne` style queries — returns actual job URLs without scraping friction
- **Direct Seek URL fetch** for search results pages + individual job pages (Seek is publicly fetchable without auth)
- **LinkedIn**: used for discovery via Brave Search snippets only (requires auth for full pages, so just use the snippet data)
- **Dedup** against `JOB_PIPELINE.md` before any processing
- Search queries sourced from `SEARCH_QUERIES.md`; agent refines them over time

### Phase 2 — Job Analysis
Each fetched job gets structured extraction into an application file:
- Title, company, salary, location, hybrid/remote policy
- Must-have vs nice-to-have requirements mapped against your skills
- **Match Score**: STRONG / MODERATE / WEAK
- Weak matches: logged but not processed further

### Phase 3 — Resume Tailoring (per application)
Not a full rewrite — **tailoring notes** that live in the application file:
1. Keyword mapping (JD terms → your resume equivalents)
2. Summary rewrite (2-3 sentences, role-specific)
3. Experience bullet reordering (most relevant → top)
4. Skills table reordering
5. Gap acknowledgment (honest note if something's missing)

`RESUME.md` stays untouched as the source of truth. Full tailoring protocol is embedded in `skills/job-apply.md`.

### Phase 4 — Cover Letter Generation
**4-paragraph template** embedded in `skills/job-apply.md`:
1. **Hook**: Name the role + one specific company/product reference (requires fetching their about page)
2. **Evidence**: 1-2 quantified achievements matching JD core requirements
3. **Company Fit**: Why *this* company specifically (no generic "great culture" language)
4. **Close**: Confident, not grovelling

Tone calibrated: startup < 50 people (direct/informal) vs enterprise (formal, emphasise reliability).

### Phase 5 — Pipeline Tracking
`JOB_PIPELINE.md` is a markdown table tracking every job:

```
discovered → analysed → materials_ready → pending_review → applied → interview → offer
```

Claw moves jobs autonomously through `pending_review`. **You control the gate** — nothing gets submitted without your explicit "apply 001".

### Phase 6 — Submission Handoff
When materials are ready, Claw messages you on WhatsApp:
```
Job ready: Software Engineer @ Acme Corp (Melbourne)
Match: STRONG | Salary: $130-150k | Seek Easy Apply

Reply "apply 001" to submit, "skip 001" to pass, or "review" to see full draft.
```

- **Direct email roles**: Claw composes and sends the email for you
- **Seek/LinkedIn Easy Apply**: Claw gives you the URL + exact steps + pre-written cover letter to paste
- **Future**: If browser automation ever gets added to OpenClaw, Seek Easy Apply becomes fully automatable

### Phase 7 — Skills

Four slash commands cover all job-hunting interactions:

| Skill | Contains | When to use |
|---|---|---|
| `/job-hunt` | Discovery workflow, search protocol, job analysis logic | Manually trigger a sweep; also what crons run |
| `/job-review` | Review logic, apply/skip flow | Review all `pending_review` jobs |
| `/job-status` | Pipeline summary format | Quick look at current pipeline |
| `/job-apply <id>` | Resume tailoring protocol, cover letter template, submission handoff | Apply to a specific job |

Each skill reads `JOB_PIPELINE.md` and relevant `applications/` files as needed — nothing is preloaded.

### Phase 8 — Cron Schedule (weekdays only)
- `8:23 AM AEST` — morning discovery sweep → runs `/job-hunt`
- `1:47 PM AEST` — afternoon sweep → runs `/job-hunt`
- No weekends — AU job listings are Mon-Fri

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| Skills contain all instructions | Workflow logic lives in skills, not separate protocol files — fewer files, single source of truth per skill |
| jobs/ holds state only | `JOB_PIPELINE.md`, `SEARCH_QUERIES.md`, and `applications/` are the only files the agent writes to |
| Skills as entry points | Job context only loads when a skill is invoked — non-job chats stay lean and general-purpose |
| Markdown files, not a database | Claw already reads workspace files as context; keeps everything in one mental model |
| Tailoring notes, not full resume rewrites | Auditable, fast, `RESUME.md` stays as single source of truth |
| Max 5 fully-processed jobs per cron run | Prevents slow/expensive runs when many listings appear at once |
| PREFERENCES.md exception for job crons | Currently blocks all autonomous web searches — needs explicit exception |
| 48h reminder then silence for pending_review | Avoids spamming you; auto-skip after 7 days of no response |

---

## File Inventory

| File | Created by | Read by | Updated by |
|---|---|---|---|
| `jobs/JOB_PIPELINE.md` | Setup | Agent (via skills) | Agent (after every action) |
| `jobs/SEARCH_QUERIES.md` | Setup | Agent (via job-hunt skill) | Agent (learning over time) |
| `jobs/applications/*.md` | Agent | Agent + Leslie | Agent (status changes) |
| `skills/job-hunt.md` | Setup | Agent (on invocation) | Leslie only |
| `skills/job-review.md` | Setup | Agent (on invocation) | Leslie only |
| `skills/job-status.md` | Setup | Agent (on invocation) | Leslie only |
| `skills/job-apply.md` | Setup | Agent (on invocation) | Leslie only |
| `HEARTBEAT.md` | Setup (update) | Agent (heartbeat) | Agent (state tracking) |
| `PREFERENCES.md` | Setup (update) | Agent (session start) | Leslie only |

---

## Implementation Sequence

1. Update `PREFERENCES.md` — grant autonomous search for job crons
2. Create `skills/job-hunt.md` — discovery workflow + search protocol + job analysis logic
3. Create `skills/job-apply.md` — resume tailoring protocol + cover letter template + submission handoff
4. Create `skills/job-review.md` — review flow
5. Create `skills/job-status.md` — pipeline summary format
6. Initialise `jobs/JOB_PIPELINE.md` — empty table with schema
7. Create `jobs/SEARCH_QUERIES.md` — initial Seek/LinkedIn query bank
8. Update `HEARTBEAT.md` — add pipeline check
9. Create 2 cron jobs via `openclaw cron` (invoke `/job-hunt`)

**Before activating crons**: do one manual `/job-hunt` in chat and review the first application file output. Adjust skill content before going autonomous.

---

## Failure Modes & Mitigations

| Failure | Mitigation |
|---|---|
| Seek blocks the fetcher | Fall back to Brave Search snippet for basic info; flag as "partial data" in pipeline |
| LinkedIn truncation without auth | Use LinkedIn only for discovery snippets; find full JD on company careers page |
| Too many jobs in one run | Cap at 5 fully-processed jobs per run; rest stay as `discovered` for next run |
| Pipeline fills with stale pending_review | Heartbeat re-pings after 48h (once only); auto-skip after 7 days |
| Application file bloat over weeks | After 30 days, move `skipped`/`rejected` to `jobs/applications/archive/` |

---

*Created: 2026-03-19*
*Updated: 2026-03-20 — skills-first architecture; static protocol files absorbed into skills*
