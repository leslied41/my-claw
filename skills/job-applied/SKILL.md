---
name: job-applied
description: >
  Mark a job as applied in the pipeline. Use this when the user says they've
  applied to a job, "mark JOB-XXX as done", "I applied to JOB-XXX", or any
  similar confirmation that an application was submitted. Updates the status
  to `applied` and sets today's date in the Updated column.
---

Usage: `/job-applied JOB-001`

---

## Step 1 — Find the job

Read `workspace/jobs/JOB_PIPELINE.md`. Locate the row with the given JOB-ID in the Active Jobs table.

If not found, say so and stop.

---

## Step 2 — Update status

In that row, set:
- **Status** → `applied`
- **Updated** → today's date (YYYY-MM-DD)

---

## Step 3 — Confirm

Reply:
```
✓ JOB-XXX marked as applied — [Title] @ [Company]
```
