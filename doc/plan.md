# OpenClaw Job Hunting Agent — Implementation Plan

## Architecture Overview

Everything runs through **skills (slash commands)** and a small set of **state files**. Skills contain all workflow logic and instructions — job context only loads when a skill is invoked, keeping non-job conversations lean.

**Three fetch tools, each with a specific role:**

| Tool | Used for | Why |
|---|---|---|
| `seek-fetch.js` (headless Playwright) | Seek search results + Seek job pages | Seek blocks plain HTTP — needs a real browser to scrape |
| WebFetch | Company's own about/website | Regular public webpages — fast, no browser overhead needed |
| Brave Search | LinkedIn job snippets | LinkedIn blocks all automated access; search engine snippets give us title/company/URL |

Other integrations: WhatsApp (notifications to Leslie).

```
workspace/
  jobs/
    JOB_PIPELINE.md       ← live state: pipeline tracker / CRM table
    SEARCH_QUERIES.md     ← live state: curated Seek/LinkedIn query bank
    applications/
      YYYY-MM-DD_Company_Role.md  ← one file per job (generated)
    memory/
      heartbeat-state.json  ← tracks which jobs have been reminded
  skills/
    job-hunt/
      SKILL.md            ← discovery + analysis workflow + search protocol
      scripts/
        seek-fetch.js     ← Playwright scraper for Seek search + job pages
    job-review/
      SKILL.md            ← review pending_review items, apply/skip decisions
    job-status/
      SKILL.md            ← print pipeline summary
    job-apply/
      SKILL.md            ← resume tailoring + cover letter generation
  HEARTBEAT.md            ← updated with pipeline check
  PREFERENCES.md          ← updated to permit autonomous job searches
```

**What lives where:**
- `skills/` — all static instructions, protocols, and templates (never updated by the agent)
- `jobs/` — mutable state only: the pipeline table, query bank, and per-job application files

---

## The 7-Phase Workflow

### Phase 1 — Job Discovery (Automated, 2x daily)
- **`seek-fetch.js` (Playwright)** — primary Seek discovery, runs 3–4 queries per sweep. Launches headless Chromium, scrapes search results directly. Returns title, company, salary, location, workType, URL. Individual job pages fetched with `--url` mode when full description is needed (capped at 5 per run).
- **Brave Search** — LinkedIn snippets only (2 queries max). LinkedIn blocks all automated access; search engine snippets give us enough to discover titles, companies, and URLs.
- **Dedup** against `JOB_PIPELINE.md` before any processing
- Search queries sourced from `SEARCH_QUERIES.md`; agent refines them over time (adds quality notes, retires dead queries)

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

### Phase 3 — Material Generation (per application, via `/job-apply`)

**Data gathering first:**
1. If the application file has the full Seek job description (fetched during job-hunt) — use it directly
2. If only summary data exists — re-fetch using `seek-fetch.js --url [SOURCE_URL]` to get the complete description
3. WebFetch the **company's own website** (e.g. `acme.com/about`) — separate from the Seek listing, gives mission, team size, product context for the cover letter

**Resume tailoring** — not a full rewrite, tailoring notes written into the application file:
1. Keyword mapping (JD terms → resume equivalents, gaps flagged)
2. Summary rewrite (2–3 sentences, mirrors JD language)
3. Experience bullet reordering (most relevant → top)
4. Skills table reordering
5. Gap acknowledgment

A fully tailored resume (`YYYY-MM-DD_Company_Role_RESUME.md`) is then generated from `RESUME.md` with the tailoring applied. `RESUME.md` itself is never modified.

**Cover letter** — 4 paragraphs, 250–350 words:
1. **Hook**: role + specific company/product reference (from the company website)
2. **Evidence**: 1–2 quantified achievements matching JD core requirements
3. **Company Fit**: specific to their tech/mission/scale (no generic filler)
4. **Close**: confident, not grovelling

Tone calibrated: startup < 50 people (direct/informal) vs enterprise (formal, emphasise reliability).

### Phase 5 — Pipeline Tracking
`JOB_PIPELINE.md` is a markdown table tracking every job:

```
discovered → filtered → scored → materials_ready → pending_review → applied
                ↓            ↓
           discarded    weak_match  (logged, no further work)
```

Claw moves jobs autonomously through `pending_review`. **You control the gate** — nothing gets submitted without your final action.

`materials_ready` is set by `/job-apply` after tailoring notes and cover letter are written, before form pre-fill. This lets you distinguish "materials done" from "form submitted for review".

### Phase 6 — Notification & Handoff
When materials are ready, Claw messages you on WhatsApp:
```
JOB-XXX ready: [Title] @ [Company]
Score: X.X | $[salary] | [arrangement]

Apply here: [job URL]

Tailored resume: jobs/applications/YYYY-MM-DD_Company_Role_RESUME.md
Cover letter + notes: jobs/applications/YYYY-MM-DD_Company_Role.md

Reply "done XXX" when applied, or "skip XXX" to pass.
```

You review the tailored resume and cover letter, open the job URL, and apply yourself. Claw never submits on your behalf — no auth, no form automation, no bot-detection risk.

### Phase 7 — Skills

Four slash commands cover all job-hunting interactions:

| Skill | Contains | When to use |
|---|---|---|
| `/job-hunt` | Discovery workflow, search protocol, job analysis logic | Manually trigger a sweep; also what crons run |
| `/job-review` | Review logic, apply/skip flow | Review all `pending_review` jobs |
| `/job-status` | Pipeline summary format | Quick look at current pipeline |
| `/job-apply <id>` | Resume tailoring protocol, cover letter template, submission handoff | Apply to a specific job |

Each skill reads `JOB_PIPELINE.md` and relevant `applications/` files as needed — nothing is preloaded.

### Phase 8 — Cron Schedule
- `1:47 PM AEST, Mon–Fri` — daily discovery sweep → runs `/job-hunt`
- `9:00 AM AEST, daily` — heartbeat check → reads `HEARTBEAT.md`, sends stale reminders, auto-skips after 7 days
- No `/job-hunt` on weekends — AU job listings are Mon–Fri; heartbeat runs every day

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| Skills contain all instructions | Workflow logic lives in skills, not separate protocol files — fewer files, single source of truth per skill |
| agentskills.io skill format | Each skill is a `skill-name/SKILL.md` folder with YAML frontmatter — compatible with the open agent skill spec |
| jobs/ holds state only | `JOB_PIPELINE.md`, `SEARCH_QUERIES.md`, and `applications/` are the only files the agent writes to |
| Skills as entry points | Job context only loads when a skill is invoked — non-job chats stay lean and general-purpose |
| Hard salary filter first | Salary < $115k base (excl. super) → discard immediately, no analysis wasted |
| Weighted relevance score, threshold 6.0 | Objective, auditable gate — score breakdown saved per job so threshold can be tuned |
| Salary unknown → proceed | Don't discard on missing data; many roles omit salary and are still worth pursuing |
| Melbourne, Brisbane, or Sydney | All three cities in scope; queries and hard filter updated to match |
| Playwright script for Seek, Brave Search for LinkedIn | seek-fetch.js scrapes Seek directly (reliable, fast); Brave Search used only for LinkedIn snippets |
| Agent generates materials, you apply | Removes auth complexity entirely; no form automation means no bot-detection risk and no Seek login dependency |
| No Chrome for LinkedIn | LinkedIn bot detection is too aggressive — snippets only |
| Markdown files, not a database | Claw already reads workspace files as context; keeps everything in one mental model |
| Tailoring notes, not full resume rewrites | Auditable, fast, `RESUME.md` stays as single source of truth |
| Max 5 fully-processed jobs per cron run | Prevents slow/expensive runs when many listings appear at once |
| PREFERENCES.md exception for job crons | Autonomous web search pre-approved for job skills — no per-session approval needed |
| 48h reminder then silence for pending_review | Avoids spamming you; auto-skip after 7 days of no response |
| Heartbeat state in heartbeat-state.json | Prevents duplicate reminders across sessions; tracked in `jobs/memory/heartbeat-state.json` |

---

## File Inventory

| File | Created by | Read by | Updated by |
|---|---|---|---|
| `jobs/JOB_PIPELINE.md` | Setup | Agent (via skills) | Agent (after every action) |
| `jobs/SEARCH_QUERIES.md` | Setup | Agent (via job-hunt skill) | Agent (learning over time) |
| `jobs/applications/*.md` | Agent | Agent + Leslie | Agent (status changes) |
| `jobs/memory/heartbeat-state.json` | Setup | Agent (heartbeat cron) | Agent (tracks reminded jobs) |
| `skills/job-hunt/SKILL.md` | Setup | Agent (on invocation) | Leslie only |
| `skills/job-hunt/scripts/seek-fetch.js` | Setup | Agent (via Bash) | Leslie only |
| `skills/job-review/SKILL.md` | Setup | Agent (on invocation) | Leslie only |
| `skills/job-status/SKILL.md` | Setup | Agent (on invocation) | Leslie only |
| `skills/job-apply/SKILL.md` | Setup | Agent (on invocation) | Leslie only |
| `HEARTBEAT.md` | Setup | Agent (heartbeat cron daily) | Leslie only |
| `PREFERENCES.md` | Setup | Agent (session start) | Leslie only |
| `doc/JOB_HUNTING.md` | Setup | Reference | Leslie only |

---

## Implementation Sequence

1. ✅ Rebuild Docker image with `--build-arg OPENCLAW_INSTALL_BROWSER=1` — Playwright Chromium in image
2. ✅ Set `browser.executablePath` in `openclaw.json` → `/home/node/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome`
3. ✅ Update `PREFERENCES.md` — grant autonomous search for job crons
4. ✅ Create `skills/job-hunt/SKILL.md` — discovery workflow + search protocol + job analysis logic
4a. ✅ Create `skills/job-hunt/scripts/seek-fetch.js` — Playwright Seek scraper (replaces Brave Search for Seek)
5. ✅ Create `skills/job-apply/SKILL.md` — resume tailoring protocol + cover letter template + form pre-fill instructions
6. ✅ Create `skills/job-review/SKILL.md` — review flow
7. ✅ Create `skills/job-status/SKILL.md` — pipeline summary format
8. ✅ Initialise `jobs/JOB_PIPELINE.md` — empty table with schema
9. ✅ Create `jobs/SEARCH_QUERIES.md` — Seek queries for Melbourne, Brisbane, Sydney + LinkedIn snippets
10. ✅ Update `HEARTBEAT.md` — pending_review check with 48h reminder + 7-day auto-skip
11. ✅ Create `jobs/memory/heartbeat-state.json` — reminder state tracker
12. ✅ Create 3 cron jobs — morning sweep, afternoon sweep, daily heartbeat
13. ✅ Create `doc/JOB_HUNTING.md` — full design and usage reference

**Next step**: do one manual `/job-hunt` in chat and review the first application file output. Adjust skill content before trusting the crons fully.

---

## Failure Modes & Mitigations

| Failure | Mitigation |
|---|---|
| Salary range listed as a span (e.g. $110–130k) | Use the midpoint to evaluate; if midpoint ≥ $115k, proceed |
| seek-fetch.js slow | Script launches real browser (~15–20s per run) — normal, don't retry |
| Seek changes selectors | Update `data-automation` selectors in `seek-fetch.js`; test with `--url` mode |
| LinkedIn truncation without auth | Use LinkedIn only for discovery snippets; find full JD on company careers page |
| Too many jobs in one run | Cap at 5 fully-processed jobs per run; rest stay as `discovered` for next run |
| Pipeline fills with stale pending_review | Heartbeat re-pings after 48h (once only); auto-skip after 7 days |
| Application file bloat over weeks | After 30 days, move `skipped`/`rejected` to `jobs/applications/archive/` |

---

*Created: 2026-03-19*
*Updated: 2026-03-20 — fully implemented: browser live (Playwright Chromium), 3 crons active, heartbeat state tracker added, Brisbane/Sydney added to scope, materials_ready state wired in, WhatsApp message wording fixed, interview/offer tracking descoped*
