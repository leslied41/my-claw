---
name: job-hunt
description: >
  Run a full job discovery sweep — search Seek and LinkedIn for new software
  engineering roles, filter by salary/location, score against the user's resume,
  generate tailored resume and cover letter for each strong match, and notify
  via WhatsApp. Use this whenever asked to search for jobs, find new roles,
  run a sweep, or "kick off the job hunt". Also invoked by the daily cron job.
  Do not use if the human only wants to review jobs already in the pipeline —
  use /job-review for that.
compatibility: Requires Brave Search (LinkedIn only) and Bash to run skills/job-hunt/scripts/seek-fetch.js. Requires WebFetch for company about pages.
---

## Step 1 — Load state

Read these files before doing anything:
- `workspace/jobs/JOB_PIPELINE.md` — to know what jobs already exist (for dedup)
- `workspace/jobs/SEARCH_QUERIES.md` — to get the current query bank
- `workspace/RESUME.md` — Leslie's skills and experience (source of truth)
- `workspace/PROJECTS.md` — detailed project history with tech stack and context (use this alongside RESUME.md for richer scoring and more specific cover letters — pull concrete project examples and skill depth from here)

---

## Step 2 — Discover jobs

> Run all scripts from the skill directory: `cd workspace/skills/job-hunt`

**For Seek** (primary — run 3–4 queries per sweep):

Use the scraper script via Bash for each query in the Seek section of `SEARCH_QUERIES.md` (rotate, don't repeat same queries every run):

```bash
node scripts/seek-fetch.js \
  --query "software engineer" --location "Melbourne"
```

Returns JSON: title, company, salary, location, workType, URL. Dedup each result against `JOB_PIPELINE.md` before adding to the working list.

**For LinkedIn** (supplementary — 2 queries max per sweep):

Run Brave Search queries from the LinkedIn section of `SEARCH_QUERIES.md` (snippets only). Extract title, company, location, URL. Do not attempt to fetch LinkedIn URLs — they block all automated access.

Target: 15–25 candidates total before filtering.

---

## Step 3 — Hard filters

Search result data (title, company, salary, location, workType) is sufficient for hard filters — no full page fetch needed yet. Discard immediately if ANY of these are true:
<!-- only filter out when salary, location, workType is specified — if not specified, pass to next step -->
- Salary is explicitly stated AND base (excl. super) < $115k
  - If salary is a range (e.g. $110–130k), use the midpoint ($120k) — proceed if midpoint ≥ $115k
- Employment type is contract or casual only
- Location is not Melbourne, Brisbane, or Sydney AND not remote-friendly (no mention of remote/hybrid/WFH)

Log discarded jobs to the **Archived Jobs** table in `JOB_PIPELINE.md` with reason. Do not create application files for them.

---

## Step 4 — Get full job details

For every Seek job that passed hard filters, fetch all full job pages in a **single browser session** using `--urls-file`. Do not call `--url` repeatedly — each call launches a new browser and will crash on low-memory servers.

1. Collect all Seek URLs that passed hard filters into a JSON array and write to a temp file:
   ```
   /tmp/seek-urls.json  →  ["https://www.seek.com.au/job/123", "https://www.seek.com.au/job/456", ...]
   ```

2. Run one batch fetch:
   ```bash
   node scripts/seek-fetch.js \
     --urls-file /tmp/seek-urls.json
   ```

   Returns a JSON array with full details (title, company, location, salary, workType, description) for each URL. If a URL fails, it returns `{ url, fetchError }` — treat as partial data and proceed.

For LinkedIn jobs, WebFetch the company's own careers page instead (search `[Company] [Role] site:[company.com]/careers`).

---

## Step 5 — Relevance scoring

For each job with full details, score against `workspace/RESUME.md`:

| Dimension | Weight | How to score (0–10) |
|---|---|---|
| Technical skills match | 40% | Count must-have tech skills Leslie has ÷ total must-haves × 10 |
| Experience level match | 25% | Junior (<3yr)=3, Mid(3-5yr)=7, Senior(5yr+)=10; Leslie has ~4 years |
| Domain/industry fit | 20% | Has Leslie worked in a similar domain? Same=10, Adjacent=6, Unrelated=2 |
| Nice-to-have coverage | 15% | How many nice-to-haves does Leslie cover? Proportion × 10 |

**Weighted score = (tech×0.4) + (exp×0.25) + (domain×0.2) + (nth×0.15)**

- Score ≥ 5.5 → proceed to Step 6
- Score < 5.5 → log as `weak_match` in Archived Jobs table, stop

**Always compute and record the numeric score before logging a weak_match.** Do not log a job as `weak_match` with only a qualitative reason — the score must appear in the Reason column (e.g. `Score 5.1 < 5.5 — deep learning/HPC research, no stack match`).

**Frontend roles are valid.** Leslie has strong React, Vue.js, TypeScript, and Next.js experience. Do not pre-filter or penalise a role simply because it is frontend-focused or "frontend-heavy". Score it normally — it may pass on tech match (React/Vue/TS) even if domain or experience dimensions score lower.

---

## Step 6 — Create application file

For each job with score ≥ 5.5, create `workspace/jobs/applications/YYYY-MM-DD_Company_Role.md`.

**The Job Description section must contain the complete, verbatim text from seek-fetch.js — no summarising, no truncating.** This is the only time the Seek listing is fetched. `/job-materials` works entirely from this file and must not need to re-fetch anything from Seek.

```markdown
# [Job Title] @ [Company]

**Status:** scored
**ID:** JOB-XXX (next sequential number from pipeline)
**Added:** YYYY-MM-DD
**Source URL:** [url]

## Job Details
- **Salary:** [stated or "not stated"]
- **Location:** [location + arrangement]
- **Application method:** [Seek Easy Apply / email: x@y.com / external URL]

## Job Description
[complete verbatim text from seek-fetch.js — all responsibilities, requirements,
tech stack mentions, team context, and any other detail present in the listing]

## Relevance Score: X.X / 10
| Dimension | Score | Notes |
|---|---|---|
| Technical skills match (40%) | X/10 | [which skills matched, which didn't] |
| Experience level match (25%) | X/10 | [reasoning] |
| Domain/industry fit (20%) | X/10 | [reasoning] |
| Nice-to-have coverage (15%) | X/10 | [notes] |

## Requirements
### Must-have
- [list]

### Nice-to-have
- [list]

## Tailoring Notes
(filled by /job-materials)

## Cover Letter
(filled by /job-materials)
```

---

## Step 7 — Update pipeline

Add each new job to the **Active Jobs** table in `JOB_PIPELINE.md` with status `scored`.

---

## Step 8 — Notify sweep result

Send a brief WhatsApp summary:

```
Job sweep complete. [N] new jobs scored, [Y] discarded.
```

If nothing new was found: `Job sweep done — no new matches this run.`

---

## Step 8 — Update SEARCH_QUERIES.md

After each run, add a brief quality note to the queries that were used (e.g. "returned 0 relevant results 2026-03-21" or "good signal"). Retire queries that consistently return nothing useful.

---

## Step 9 — Trigger job-materials

Run `/job-materials` to start generating application materials for the top scored jobs.

---

## Gotchas

- **Script path**: Always `cd workspace/skills/job-hunt` before running scripts — then use `node scripts/seek-fetch.js`. Relative paths work correctly when run from the skill directory.
- **Script is slow**: Each browser launch takes ~15–20s. Use `--urls-file` for batch fetching (one launch for all URLs) — never call `--url` in a loop, it will crash on low-memory servers.
- **Salary in package terms**: Some listings say "$130k package" — treat this as base (super is included), actual base ~$118k. Still above threshold — proceed.
- **"Salary competitive" / "market rate"**: Treat as unknown salary — do not discard.
- **Contract roles with permanent option**: If a listing says "contract with view to perm", treat as contract-only — discard.
- **Remote roles based in Sydney/Melbourne/Brisbane**: A role listed as "remote, must be AU-based" with no city counts as remote-friendly — proceed.
- **LinkedIn snippet truncation**: LinkedIn results often cut off at ~200 chars. Don't discard based on truncated snippet alone — mark as `discovered` and note partial data.
- **Gap note in cover letter**: Only address a gap if it's a must-have requirement. Nice-to-have gaps are not worth drawing attention to.
