---
name: job-hunt
description: >
  Run a full job discovery, filtering, and scoring sweep — search for new software
  engineering roles on Seek and LinkedIn, apply salary/location filters, score
  relevance against Leslie's resume, and create application files for strong matches.
  Use this skill when asked to search for jobs, find new positions, run a job sweep,
  check for new listings, or kick off the job-hunting process. This is also what the
  morning and afternoon cron jobs invoke automatically. Do not use if the user only
  wants to review jobs already in the pipeline — use /job-review for that.
compatibility: Requires Brave Search (LinkedIn only) and Bash to run skills/job-hunt/scripts/seek-fetch.js.
---

## Step 1 — Load state

Read these files before doing anything:
- `workspace/jobs/JOB_PIPELINE.md` — to know what jobs already exist (for dedup)
- `workspace/jobs/SEARCH_QUERIES.md` — to get the current query bank
- `workspace/RESUME.md` — to have Leslie's skills/experience ready for scoring

---

## Step 2 — Discover jobs

**For Seek** (primary — run 3–4 queries per sweep):

Use the scraper script via Bash for each query in the Seek section of `SEARCH_QUERIES.md` (rotate, don't repeat same queries every run):

```bash
node /home/node/.openclaw/workspace/skills/job-hunt/scripts/seek-fetch.js \
  --query "software engineer" --location "Melbourne"
```

Returns JSON: title, company, salary, location, workType, URL. Dedup each result against `JOB_PIPELINE.md` before adding to the working list.

**For LinkedIn** (supplementary — 2 queries max per sweep):

Run Brave Search queries from the LinkedIn section of `SEARCH_QUERIES.md` (snippets only). Extract title, company, location, URL. Do not attempt to fetch LinkedIn URLs — they block all automated access.

Target: 15–25 candidates total before filtering.

---

## Step 3 — Get full job details (when needed)

Script results include title, company, salary, location, and work type — sufficient for hard filters and often for scoring too. Only fetch the full page when must-have requirements are missing:

```bash
node /home/node/.openclaw/workspace/skills/job-hunt/scripts/seek-fetch.js \
  --url "https://www.seek.com.au/job/12345"
```

Cap at **5 full-page fetches per run**. For LinkedIn jobs needing more detail, WebFetch the company's own careers page instead (search `[Company] [Role] site:[company.com]/careers`).

---

## Step 4 — Hard filters

Discard immediately (no further processing) if ANY of these are true:
- Salary is explicitly stated AND base (excl. super) < $115k
  - If salary is a range (e.g. $110–130k), use the midpoint ($120k) — proceed if midpoint ≥ $115k
- Employment type is contract or casual only
- Location is not Melbourne, Brisbane, or Sydney AND not remote-friendly (no mention of remote/hybrid/WFH)

Log discarded jobs to the **Archived Jobs** table in `JOB_PIPELINE.md` with reason. Do not create application files for them.

---

## Step 5 — Relevance scoring

For each job that passes hard filters, score against `workspace/RESUME.md`:

| Dimension | Weight | How to score (0–10) |
|---|---|---|
| Technical skills match | 40% | Count must-have tech skills Leslie has ÷ total must-haves × 10 |
| Experience level match | 25% | Junior (<3yr)=3, Mid(3-5yr)=7, Senior(5yr+)=10; Leslie has ~4 years |
| Domain/industry fit | 20% | Has Leslie worked in a similar domain? Same=10, Adjacent=6, Unrelated=2 |
| Nice-to-have coverage | 15% | How many nice-to-haves does Leslie cover? Proportion × 10 |

**Weighted score = (tech×0.4) + (exp×0.25) + (domain×0.2) + (nth×0.15)**

- Score ≥ 6.0 → proceed to Step 6
- Score < 6.0 → log as `weak_match` in Archived Jobs table, stop

---

## Step 6 — Create application file

For each job with score ≥ 6.0, create `workspace/jobs/applications/YYYY-MM-DD_Company_Role.md`:

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
(filled in by /job-apply)

## Cover Letter
(filled in by /job-apply)
```

---

## Step 7 — Update pipeline

Add each new job to the **Active Jobs** table in `JOB_PIPELINE.md` with status `scored`.

Cap: if more than 5 jobs reach `scored` status in this run, stop processing and leave the rest as `discovered` for the next run.

---

## Step 8 — Notify

After the run, send a WhatsApp summary to Leslie (+61468911943):

```
Job sweep complete. [N] new jobs found, [X] passed filters (score ≥ 6.0), [Y] discarded.

Top matches:
• JOB-001: [Title] @ [Company] — Score: X.X | $[salary] | [arrangement]
• JOB-002: ...

Open Claw and run /job-review to see full details and decide.
```

If nothing new was found: `Job sweep done — no new matches this run.`

---

## Step 9 — Update SEARCH_QUERIES.md

After each run, add a brief quality note to the queries that were used (e.g. "returned 0 relevant results 2026-03-20" or "good signal"). Retire queries that consistently return nothing useful.

---

## Gotchas

- **Script path**: Always use the full absolute path `/home/node/.openclaw/workspace/skills/job-hunt/scripts/seek-fetch.js` — relative paths will fail depending on working directory.
- **Script takes ~15–20s per run**: It launches a real browser. This is normal — don't retry if it's slow.
- **Salary in package terms**: Some listings say "$130k package" — treat this as base (super is included), which means actual base is ~$118k. Still above threshold — proceed.
- **"Salary competitive" / "market rate"**: Treat as unknown salary — do not discard.
- **Contract roles with permanent option**: If a listing says "contract with view to perm", treat as contract-only — discard.
- **Remote roles based in Sydney/Melbourne/Brisbane**: A role listed as "remote, must be AU-based" with no city counts as remote-friendly — proceed.
- **LinkedIn snippet truncation**: LinkedIn search results often cut off at ~200 chars. Don't discard based on truncated snippet alone — mark as `discovered` and note partial data.
