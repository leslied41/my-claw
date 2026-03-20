# OpenClaw Job Hunting Agent — Implementation Plan

## Architecture Overview

Everything runs through **skills (slash commands)** and a small set of **state files**. Skills contain all workflow logic and instructions — job context only loads when a skill is invoked, keeping non-job conversations lean. Integrations: Brave Search, WebFetch, WhatsApp/Telegram (already configured), plus **Chrome DevTools MCP** for browser automation on the Hetzner server.

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
- **Brave Search** with `site:seek.com.au "software engineer" Melbourne` style queries — primary discovery method, fast and zero detection risk
- **Chrome DevTools MCP** (fallback) — if Seek blocks WebFetch, use headless Chrome to fetch the full job page
- **LinkedIn**: Brave Search snippets only — Chrome MCP not used for LinkedIn (bot detection too aggressive)
- **Dedup** against `JOB_PIPELINE.md` before any processing
- Search queries sourced from `SEARCH_QUERIES.md`; agent refines them over time

### Phase 2 — Job Filtering & Scoring

**Step 1 — Hard filters (instant discard, no further processing):**
- Salary stated and base (excl. super) < $115k → discard, log reason
- Salary not stated → proceed (don't discard on unknown)
- Role is contract/casual only → discard
- Location is not Melbourne or remote-friendly → discard

**Step 2 — Relevance scoring against `RESUME.md`:**

Score each dimension 0–10, then compute a weighted total:

| Dimension | Weight | What to look for |
|---|---|---|
| Technical skills match | 40% | How many must-have tech skills does Leslie have? |
| Experience level match | 25% | Does seniority/years align? |
| Domain/industry fit | 20% | Has Leslie worked in this domain before? |
| Nice-to-have coverage | 15% | Bonus skills that add signal |

**Threshold: weighted score ≥ 6.0 → proceed to Phase 3. Below 6.0 → log as `weak_match` and stop.**

Each application file records the score breakdown so you can audit and calibrate the threshold over time.

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

Claw moves jobs autonomously through `pending_review`. **You control the gate** — nothing gets submitted without your final action.

Pipeline states:
```
discovered → filtered → scored → materials_ready → pending_review → applied
                ↓           ↓
           discarded    weak_match  (logged, no further work)
```

### Phase 6 — Submission Handoff
When materials are ready, Claw messages you on WhatsApp:
```
Job ready: Software Engineer @ Acme Corp (Melbourne)
Match: STRONG | Salary: $130-150k | Seek Easy Apply

Reply "apply 001" to review + submit, "skip 001" to pass.
```

When you reply "apply 001", Claw uses **Chrome DevTools MCP** to:
1. Navigate to the job page
2. Pre-fill the application form (name, contact, cover letter)
3. Take a screenshot and send it to you on WhatsApp for final review

**You do the final click to submit** — Claw never submits on your behalf. This keeps you in control and avoids automated submission detection.

- **Direct email roles**: Claw drafts the email, you review and send
- **Seek Easy Apply**: Claw pre-fills, you submit
- **LinkedIn**: manual only — Claw gives you the URL and cover letter to paste yourself

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
| Hard salary filter first | Salary < $115k base (excl. super) → discard immediately, no analysis wasted |
| Weighted relevance score, threshold 6.0 | Objective, auditable gate — score breakdown saved per job so threshold can be tuned |
| Salary unknown → proceed | Don't discard on missing data; many roles omit salary and are still worth pursuing |
| Brave Search for discovery, Chrome MCP as fallback | Brave Search is fast and detection-safe; Chrome MCP steps in only when Seek blocks WebFetch |
| Chrome MCP pre-fills, you submit | Avoids automated submission detection; keeps you in the loop for the final action |
| No Chrome MCP for LinkedIn | LinkedIn bot detection is too aggressive — snippets only |
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

1. Install Chrome DevTools MCP on Hetzner server (Chromium + Node.js v20.19+ + MCP config)
2. Update `PREFERENCES.md` — grant autonomous search for job crons
3. Create `skills/job-hunt.md` — discovery workflow + search protocol + job analysis logic
4. Create `skills/job-apply.md` — resume tailoring protocol + cover letter template + form pre-fill instructions
5. Create `skills/job-review.md` — review flow
6. Create `skills/job-status.md` — pipeline summary format
7. Initialise `jobs/JOB_PIPELINE.md` — empty table with schema
8. Create `jobs/SEARCH_QUERIES.md` — initial Seek/LinkedIn query bank
9. Update `HEARTBEAT.md` — add pipeline check
10. Create 2 cron jobs via `openclaw cron` (invoke `/job-hunt`)

**Before activating crons**: do one manual `/job-hunt` in chat and review the first application file output. Adjust skill content before going autonomous.

---

## Failure Modes & Mitigations

| Failure | Mitigation |
|---|---|
| Salary range listed as a span (e.g. $110–130k) | Use the midpoint to evaluate; if midpoint ≥ $115k, proceed |
| Seek blocks WebFetch | Fall back to Chrome DevTools MCP headless fetch |
| Chrome MCP unavailable (Chromium not running) | Fall back to Brave Search snippet; flag as "partial data" in pipeline |
| LinkedIn truncation without auth | Use LinkedIn only for discovery snippets; find full JD on company careers page |
| Too many jobs in one run | Cap at 5 fully-processed jobs per run; rest stay as `discovered` for next run |
| Pipeline fills with stale pending_review | Heartbeat re-pings after 48h (once only); auto-skip after 7 days |
| Application file bloat over weeks | After 30 days, move `skipped`/`rejected` to `jobs/applications/archive/` |

---

*Created: 2026-03-19*
*Updated: 2026-03-20 — skills-first architecture; static protocol files absorbed into skills; Chrome DevTools MCP added for browser automation; final submission remains manual*
