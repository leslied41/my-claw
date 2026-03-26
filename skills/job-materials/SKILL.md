---
name: job-materials
description: >
  Generate tailored resume and cover letter for the top scored jobs waiting
  in the pipeline. Use this when asked to prepare application materials, or
  when there are scored jobs ready to process. Also triggered automatically
  by /job-hunt and runs on its own cron schedule throughout the day.
  Picks the top 3 jobs by score, generates materials for each, updates
  the pipeline to materials_ready, and sends one WhatsApp batch notification.
  Exits silently if no scored jobs are waiting.
compatibility: Requires WebFetch for company about pages.
---

## Step 1 — Load reference data

Read these files before doing anything — they are the source of truth for generating tailored content:

- `workspace/RESUME.md` — skills, experience, and contact details
- `workspace/PROJECTS.md` — detailed project history with tech stack and context; use this for concrete examples, skill depth, and quantified achievements in cover letters
- `workspace/USER.md` — personal context about the candidate

---

## Step 2 — Check for work

Read `workspace/jobs/JOB_PIPELINE.md`. Find all jobs with status `scored`.

If none, exit silently — nothing to do.

---

## Step 3 — Pick top 3

Sort scored jobs by relevance score descending. Take the top 3.

---

## Step 4 — Generate materials for each job

For each of the 3 jobs, read its application file at `workspace/jobs/applications/YYYY-MM-DD_Company_Role.md`.

### 4a — Fetch company about page

WebFetch the company's **own website** about/careers page (not the Seek listing). Extract:
- Company mission / what they build
- Team size (startup or enterprise — affects cover letter tone)
- Tech stack they use internally
- Any specific product or initiative relevant to the candidate's background

If unreachable, check LinkedIn company page as fallback. If both unavailable, proceed with job listing context only.

### 4b — Tailoring notes

With the job description and company context in hand, write into the application file under **Tailoring Notes** (do NOT modify `RESUME.md`):

1. **Keyword mapping** — list each significant term from the job description, map to the resume equivalent, note gaps:
   | JD term | Resume equivalent | Gap? |
   |---|---|---|

2. **Summary rewrite** — 2–3 sentences foregrounding the most relevant skills. Mirror the job description's language; reference the company's product/domain from the about page.

3. **Experience bullet reorder** — list which bullets should move to the top based on the job requirements.

4. **Skills table reorder** — which skill category rows should appear first based on what the role prioritises.

5. **Gap note** — honest statement of any genuine gaps between job requirements and the candidate's experience.

### 4c — Tailored resume

Generate `workspace/jobs/applications/YYYY-MM-DD_Company_Role_RESUME.md` from `workspace/RESUME.md` applying the tailoring notes:

1. Replace summary with the rewritten version (mirrors job description language, references company domain)
2. Reorder experience bullets (most relevant to this role's requirements first)
3. Reorder skills table categories (most relevant to the role first)
4. Substitute keywords from the job description where they are genuine equivalents — never fabricate
5. Do NOT add missing skills — leave gap note in application file only

Everything else must be identical to `RESUME.md`.

### 4d — Cover letter

Write a 250–350 word cover letter into the application file under **Cover Letter**, drawing on both sources:

**Paragraph 1 — Hook** (uses company about page)
Specific reference to the company's product or mission and how it connects to the candidate's relevant work. No generic openers.

**Paragraph 2 — Evidence** (uses job description requirements)
One or two specific, quantified achievements that directly address the role's core requirements. Mirror the job description's language. Pull from `RESUME.md`.

**Paragraph 3 — Company Fit** (uses both sources)
What specifically appeals: the role's tech stack, the company's mission, team scale, product domain. No generic statements ("great culture", "exciting opportunity").

**Paragraph 4 — Close**
Confident, not grovelling. Available for interview. Contact details from `RESUME.md`.

**Tone:** startup < ~50 people → direct, informal. Enterprise/government → formal, emphasise reliability and production track record.

---

## Step 5 — Update pipeline

For each processed job, update its status to `materials_ready` and set today's date in the `Updated` column of `JOB_PIPELINE.md`.

---

## Step 6 — Notify

Send one WhatsApp batch message:

```
[N] job(s) ready to apply:

• JOB-XXX: [Title] @ [Company] — Score: X.X | $[salary] | [arrangement]
  Apply: [job URL]
  Resume: jobs/applications/YYYY-MM-DD_Company_Role_RESUME.md
  Notes: jobs/applications/YYYY-MM-DD_Company_Role.md

• JOB-YYY: ...
```

If more `scored` jobs remain in the pipeline beyond the 3 processed, add:
```
[N] more jobs still queued — will process next run.
```
