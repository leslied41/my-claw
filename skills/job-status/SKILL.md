---
name: job-status
description: >
  Show a read-only snapshot of the job search pipeline — counts by status,
  total tracked, and a nudge if anything needs action. Use this whenever the
  human asks how the job hunt is going, wants a count of applications, asks
  "what's in the pipeline", or needs a quick check-in on progress. This is
  the lightweight overview; it makes zero changes. For reviewing individual
  jobs, use /job-review. For applying, use /job-apply.
---

## Step 1 — Load pipeline

Read `workspace/jobs/JOB_PIPELINE.md`.

---

## Step 2 — Count and display

Tally jobs by status. The goal is a quick, honest snapshot — not a
wall of text. Use this exact format:

```
📋 Job Pipeline — [today's date]

Active
  discovered      [N]
  filtered        [N]
  scored          [N]
  materials_ready [N]
  pending_review  [N]  ← action needed
  applied         [N]

Archived
  weak_match      [N]
  discarded       [N]
  skipped         [N]

Total tracked: [N]
```

Then add one of these context lines depending on what the numbers show:

- If `pending_review` > 0 → `Run /job-review to see what's waiting.`
- If `scored` or `materials_ready` > 0 → `[N] job(s) ready for /job-apply.`
- If everything is 0 or all archived → `Queue is clear. Run /job-hunt to search for new jobs.`

---

Read only. No writes, no state changes.
