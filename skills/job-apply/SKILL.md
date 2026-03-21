---
name: job-apply
description: >
  Generate tailored application materials for a specific job: tailored resume,
  cover letter, and keyword-mapped tailoring notes. Notifies Leslie on WhatsApp
  with the job URL and materials so she can apply manually. Use this skill when
  given a JOB-ID and asked to apply, prepare an application, write a cover letter,
  or tailor the resume. Requires a JOB-ID argument (e.g. /job-apply JOB-003).
  Do not use without a JOB-ID — use /job-review to browse pending jobs first.
compatibility: Requires seek-fetch.js (Playwright) for Seek job page re-fetch if description missing. Requires WebFetch for company about page.
---

Usage: `/job-apply JOB-003`

## Step 1 — Load job context

Read:
- `workspace/jobs/applications/` — find the file for the given JOB-ID
- `workspace/RESUME.md` — source of truth for experience and skills
- `workspace/jobs/JOB_PIPELINE.md` — to update status

If no application file exists for the given JOB-ID, stop and say so — do not proceed.

If the application file exists but has no full job description (only the extracted requirements), re-fetch the Seek job page to get the complete description:

```bash
node /home/node/.openclaw/workspace/skills/job-hunt/scripts/seek-fetch.js \
  --url "[SOURCE_URL from application file]"
```

Update the application file with the full description before proceeding.

---

## Step 2 — Fetch company about page

WebFetch the company's **own website** about/careers page (not the Seek listing — find the URL from the job listing or by searching `[Company name] about`). Extract:
- Company mission / what they build
- Team size (startup or enterprise — affects tone)
- Tech stack mentions
- Any specific product or initiative relevant to Leslie's background

If the about page is unreachable, note this and proceed with what's available in the job listing.

---

## Step 3 — Resume tailoring notes

Produce tailoring notes (do NOT modify `RESUME.md`). Write these into the application file under **Tailoring Notes**:

1. **Keyword mapping** — list each significant JD term, map to Leslie's resume equivalent, note any gaps:
   | JD term | Resume equivalent | Gap? |
   |---|---|---|

2. **Summary rewrite** — 2–3 sentences foregrounding the most relevant skills for this specific role. Mirror the JD's language.

3. **Experience bullet reorder** — within each job entry, list which bullets should move to the top for this role.

4. **Skills table reorder** — which skill category rows should appear first.

5. **Gap note** — honest statement of any genuine gaps. Used to decide whether to address in cover letter.

---

## Step 4 — Tailored resume

Using `RESUME.md` as the base and the tailoring notes from Step 3, produce a fully tailored resume document. Save it as:

`workspace/jobs/applications/YYYY-MM-DD_Company_Role_RESUME.md`

(Same date and slug as the application file, with `_RESUME` appended.)

Apply the tailoring notes in this order:

1. **Summary** — replace the summary section with the rewritten 2–3 sentence summary from the tailoring notes
2. **Experience bullets** — within each job entry, reorder bullets so the most relevant ones appear first (per the reorder list in tailoring notes)
3. **Skills table** — reorder the skill category rows so the most relevant categories appear first
4. **Keywords** — where a JD term was mapped to a resume equivalent, ensure the resume uses the JD's exact wording (e.g. if JD says "CI/CD pipelines" and resume says "build pipelines", update to match) — only for genuine equivalents, never fabricate
5. **Gap note** — do NOT add missing skills to the resume; leave the gap note in the application file only

Everything else (structure, formatting, contact info, all other content) must be identical to `RESUME.md`. This is a targeted reorder + rephrase, not a rewrite.

---

## Step 5 — Cover letter

Write a 250–350 word cover letter in plain text. Four paragraphs:

**Paragraph 1 — Hook**
"I'm applying for the [Role] at [Company]. [Company]'s work on [specific product/mission from their site] aligns directly with my recent work on [Leslie's most relevant project] — both involve [shared technical challenge]."

**Paragraph 2 — Evidence**
One or two specific, quantified achievements that directly address the JD's core requirements. Mirror the JD's language. Pull from `RESUME.md`.

**Paragraph 3 — Company Fit**
What specifically appeals: tech stack, mission, team scale, product domain. Sourced from the about page. No generic statements ("great culture", "exciting opportunity").

**Paragraph 4 — Close**
Confident, not grovelling. Available for interview. Contact: leslied41@gmail.com / 0468 911 943.

**Tone calibration:**
- Startup (< ~50 people): direct, informal, show personality
- Enterprise / government: formal, emphasise reliability, production track record

Write the cover letter into the application file under **Cover Letter**.

---

## Step 6 — Mark materials ready

Update the job's status to `materials_ready` in `JOB_PIPELINE.md` now that tailoring notes, tailored resume, and cover letter are complete.

---

## Step 7 — Notify

Send WhatsApp to Leslie (+61468911943):

```
JOB-XXX ready: [Title] @ [Company]
Score: X.X | $[salary] | [arrangement]

Apply here: [job URL]

Tailored resume: jobs/applications/YYYY-MM-DD_Company_Role_RESUME.md
Cover letter + notes: jobs/applications/YYYY-MM-DD_Company_Role.md

Reply "done XXX" when applied, or "skip XXX" to pass.
```

Then set job status to `pending_review` in `JOB_PIPELINE.md`.

When Leslie replies "done XXX": set status to `applied`, record the date.

---

## Gotchas

- **Company about page 404**: If the about page is down, check LinkedIn company page as fallback. If that's also unavailable, proceed with what's in the job listing and note the gap.
- **Gap note in cover letter**: Only address a gap in the cover letter if it's a must-have requirement. Nice-to-have gaps are not worth drawing attention to.
