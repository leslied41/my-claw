---
name: job-hunt
description: >
  Run a full job discovery sweep — search for new software engineering roles on
  Seek and LinkedIn, apply salary/location filters, score relevance against
  Leslie's resume, generate tailored resume and cover letter for each strong
  match, and notify Leslie on WhatsApp with everything ready to apply.
  Use this skill when asked to search for jobs, find new positions, run a job
  sweep, or kick off the job-hunting process. This is also what the daily cron
  job invokes automatically. Do not use if the user only wants to review jobs
  already in the pipeline — use /job-review for that.
compatibility: Requires Brave Search (LinkedIn only) and Bash to run skills/job-hunt/scripts/seek-fetch.js. Requires WebFetch for company about pages.
---

## Step 1 — Load state

Read these files before doing anything:
- `workspace/jobs/JOB_PIPELINE.md` — to know what jobs already exist (for dedup)
- `workspace/jobs/SEARCH_QUERIES.md` — to get the current query bank
- `workspace/RESUME.md` — to have Leslie's skills/experience ready for scoring and tailoring

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
   node /home/node/.openclaw/workspace/skills/job-hunt/scripts/seek-fetch.js \
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

## Job Description
[full description from seek-fetch.js]

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
(filled in by Step 7)

## Cover Letter
(filled in by Step 7)
```

---

## Step 7 — Generate application materials

For each scored job, generate materials using **two data sources together**:
- **Job page** (from Step 4): full description, requirements, responsibilities, tech stack asked for
- **Company about page** (fetched below): mission, product, team size, company tech stack

### 7a — Fetch company about page

WebFetch the company's **own website** about/careers page (not the Seek listing). Extract:
- Company mission / what they build
- Team size (startup or enterprise — affects cover letter tone)
- Tech stack they use internally
- Any specific product or initiative relevant to Leslie's background

If unreachable, check LinkedIn company page as fallback. If both unavailable, proceed with job listing context only.

### 7b — Tailoring notes

With both sources in hand, write into the application file under **Tailoring Notes** (do NOT modify `RESUME.md`):

1. **Keyword mapping** — list each significant term from the job description (Step 4), map to Leslie's resume equivalent, note gaps:
   | JD term | Resume equivalent | Gap? |
   |---|---|---|

2. **Summary rewrite** — 2–3 sentences foregrounding the most relevant skills. Mirror the job description's language; reference the company's product/domain from the about page.

3. **Experience bullet reorder** — list which bullets should move to the top based on the job requirements.

4. **Skills table reorder** — which skill category rows should appear first based on what the role prioritises.

5. **Gap note** — honest statement of any genuine gaps between job requirements and Leslie's experience.

### 7c — Tailored resume

Generate `workspace/jobs/applications/YYYY-MM-DD_Company_Role_RESUME.md` from `RESUME.md` applying the tailoring notes:

1. Replace summary with the rewritten version (mirrors job description language, references company domain)
2. Reorder experience bullets (most relevant to this role's requirements first)
3. Reorder skills table categories (most relevant to the role first)
4. Substitute keywords from the job description where they are genuine equivalents — never fabricate
5. Do NOT add missing skills — leave gap note in application file only

Everything else must be identical to `RESUME.md`.

### 7d — Cover letter

Write a 250–350 word cover letter into the application file under **Cover Letter**, drawing on both sources:

**Paragraph 1 — Hook** (uses company about page)
"I'm applying for the [Role] at [Company]. [Company]'s work on [specific product/mission from about page] aligns directly with my recent work on [Leslie's most relevant project] — both involve [shared technical challenge]."

**Paragraph 2 — Evidence** (uses job description requirements from Step 4)
One or two specific, quantified achievements that directly address the role's core requirements. Mirror the job description's language. Pull from `RESUME.md`.

**Paragraph 3 — Company Fit** (uses both sources)
What specifically appeals: the role's tech stack, the company's mission, team scale, product domain. No generic statements ("great culture", "exciting opportunity").

**Paragraph 4 — Close**
Confident, not grovelling. Available for interview. Contact: leslied41@gmail.com / 0468 911 943.

**Tone:** startup < ~50 people → direct, informal. Enterprise/government → formal, emphasise reliability and production track record.

---

## Step 8 — Update pipeline

Add each new job to the **Active Jobs** table in `JOB_PIPELINE.md` with status `materials_ready`.

---

## Step 9 — Notify

After the run, send one WhatsApp summary to Leslie (+61468911943):

```
Job sweep complete. [N] new matches, [Y] discarded.

• JOB-001: [Title] @ [Company] — Score: X.X | $[salary] | [arrangement]
  Apply: [job URL]
  Resume: jobs/applications/YYYY-MM-DD_Company_Role_RESUME.md
  Notes: jobs/applications/YYYY-MM-DD_Company_Role.md

• JOB-002: ...

Reply "done XXX" when applied, or "skip XXX" to pass.
```

If nothing new was found: `Job sweep done — no new matches this run.`

---

## Step 10 — Update SEARCH_QUERIES.md

After each run, add a brief quality note to the queries that were used (e.g. "returned 0 relevant results 2026-03-21" or "good signal"). Retire queries that consistently return nothing useful.

---

## Gotchas

- **Script path**: Always use the full absolute path `/home/node/.openclaw/workspace/skills/job-hunt/scripts/seek-fetch.js` — relative paths will fail depending on working directory.
- **Script is slow**: Each browser launch takes ~15–20s. Use `--urls-file` for batch fetching (one launch for all URLs) — never call `--url` in a loop, it will crash on low-memory servers.
- **Salary in package terms**: Some listings say "$130k package" — treat this as base (super is included), actual base ~$118k. Still above threshold — proceed.
- **"Salary competitive" / "market rate"**: Treat as unknown salary — do not discard.
- **Contract roles with permanent option**: If a listing says "contract with view to perm", treat as contract-only — discard.
- **Remote roles based in Sydney/Melbourne/Brisbane**: A role listed as "remote, must be AU-based" with no city counts as remote-friendly — proceed.
- **LinkedIn snippet truncation**: LinkedIn results often cut off at ~200 chars. Don't discard based on truncated snippet alone — mark as `discovered` and note partial data.
- **Gap note in cover letter**: Only address a gap if it's a must-have requirement. Nice-to-have gaps are not worth drawing attention to.
