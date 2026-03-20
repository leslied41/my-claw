---
name: job-apply
description: >
  Prepare full application materials for a specific job and pre-fill the submission
  form. Use this skill when given a JOB-ID and asked to apply, prepare an application,
  write a cover letter, tailor the resume, or get a job ready for submission. Requires
  a JOB-ID argument (e.g. /job-apply JOB-003). Do not use without a JOB-ID — use
  /job-review to browse pending jobs first if you don't have an ID.
compatibility: Requires WebFetch for company about page. Chrome DevTools for Seek Easy Apply form pre-fill.
---

Usage: `/job-apply JOB-003`

## Step 1 — Load job context

Read:
- `workspace/jobs/applications/` — find the file for the given JOB-ID
- `workspace/RESUME.md` — source of truth for experience and skills
- `workspace/jobs/JOB_PIPELINE.md` — to update status

If no application file exists for the given JOB-ID, stop and say so — do not proceed.

---

## Step 2 — Fetch company about page

WebFetch the company's about/careers page (find URL from the job listing or by searching `[Company name] about`). Extract:
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

## Step 4 — Cover letter

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

## Step 5 — Mark materials ready

Update the job's status to `materials_ready` in `JOB_PIPELINE.md` now that tailoring notes and cover letter are complete.

---

## Step 6 — Pre-fill application form

**If application method is Seek Easy Apply:**

1. Use Chrome DevTools to navigate to the job URL
2. Click "Easy Apply"
3. Fill in fields:
   - Name: Zhonghui Duan (Leslie)
   - Email: leslied41@gmail.com
   - Phone: 0468 911 943
   - Cover letter field: paste the generated cover letter
   - Any other fields: fill from RESUME.md as appropriate
4. **Do NOT click submit.** Stop at the final review screen.
5. Take a screenshot of the filled form.
6. Send screenshot to Leslie on WhatsApp with:
   ```
   JOB-XXX ready: [Title] @ [Company]
   Form is pre-filled. Open Seek to review and submit:
   [URL]

   Reply "done XXX" when submitted, or "skip XXX" to pass.
   ```

**If application method is direct email:**
- Draft the email: To: [email], Subject: "Application for [Role] — Zhonghui Duan", Body: cover letter
- Send draft to Leslie on WhatsApp — do NOT send the email directly
- Include the recipient address and subject so Leslie can send it herself

**If application method is external link / LinkedIn:**
- Send Leslie the URL and the cover letter text on WhatsApp
- Note any specific instructions from the JD

---

## Step 7 — Update pipeline

Set job status to `pending_review` in `JOB_PIPELINE.md` once the WhatsApp notification is sent.

When Leslie replies "done XXX": set status to `applied`, record the date.

---

## Gotchas

- **Seek login wall**: Seek Easy Apply sometimes requires login. If Chrome DevTools hits a login wall, screenshot it and send to WhatsApp asking Leslie to log in first, then retry.
- **Cover letter character limits**: Some Seek forms cap cover letters at 4,000 characters. If the cover letter exceeds this, trim Paragraph 3 first — it's the most cuttable.
- **"Apply on company website"**: If Seek redirects to an external ATS (Workday, Greenhouse, Lever), treat as "external link" — send URL + cover letter to WhatsApp.
- **Company about page 404**: If the about page is down, check LinkedIn company page as fallback. If that's also unavailable, proceed with what's in the job listing and note the gap.
- **Gap note in cover letter**: Only address a gap in the cover letter if it's a must-have requirement. Nice-to-have gaps are not worth drawing attention to.
