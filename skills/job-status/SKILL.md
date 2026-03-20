---
name: job-status
description: >
  Print a read-only summary of the current job pipeline — counts by status, total
  tracked, and a prompt if any jobs need action. Use this skill when asked for a
  pipeline overview, job count, status update, hunting progress, or a quick summary
  of where things stand. Makes no changes to any files. For detailed job review
  and apply/skip decisions, use /job-review instead.
---

## Step 1 — Load pipeline

Read `workspace/jobs/JOB_PIPELINE.md`.

---

## Step 2 — Print summary

Count jobs by status and display:

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

If `pending_review` > 0, add:
```
Run /job-review to see what's waiting.
```

If `scored` or `materials_ready` > 0, add:
```
[N] job(s) ready for /job-apply.
```

If everything is 0 or only archived:
```
Queue is clear. Run /job-hunt to search for new jobs.
```

---

No state changes. No file writes. Read only.
