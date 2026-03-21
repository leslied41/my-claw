---
name: job-review
description: >
  Show all jobs currently awaiting a decision and prompt for apply/skip actions.
  Use this skill when asked to review pending jobs, see what's ready to apply for,
  check the application queue, browse job matches, or decide on applications.
  Also handles stale job warnings and auto-skips jobs with no response after 7 days.
  Do not use just to see pipeline counts — use /job-status for that.
---

## Step 1 — Load pipeline

Read `workspace/jobs/JOB_PIPELINE.md`. Filter rows where Status = `pending_review`.

If no jobs are in `pending_review`:
- Check for jobs in `scored` or `materials_ready` status
- If any exist, offer to run `/job-apply` on them
- Otherwise reply: "Nothing in the queue right now. Run /job-hunt to search for new jobs."

---

## Step 2 — Display each pending job

For each `pending_review` job, read its application file and show:

```
─────────────────────────────────────
JOB-001 | Senior Software Engineer @ Acme Corp
Score: 8.2/10 | $130–150k | Hybrid Melbourne
Apply via: Seek Easy Apply
Added: 2026-03-20

Top skills match: React ✓, TypeScript ✓, Python ✓
Gap: Kubernetes (nice-to-have only)

Summary: [the 2–3 sentence summary rewrite from tailoring notes]
─────────────────────────────────────
```

---

## Step 3 — Prompt for decision

After listing all pending jobs:

```
Commands:
  /job-apply JOB-001   → generate tailored resume and cover letter
  skip JOB-001         → pass on this job
  review JOB-001       → show full application file
```

When Leslie says `skip JOB-XXX`:
- Move the job to Archived table in `JOB_PIPELINE.md` with status `skipped`
- Confirm: "JOB-XXX skipped."

---

## Step 4 — Stale job check

While reviewing, also flag any `pending_review` jobs older than 48 hours that haven't been actioned:

```
⚠ JOB-002 has been waiting 3 days — skip it or apply?
(It will be auto-skipped after 7 days of no response.)
```

Auto-skip any `pending_review` jobs older than 7 days: move to Archived with reason `auto-skipped: no response after 7 days`.

---

## Gotchas

- **Application file missing**: If a `pending_review` job has no application file, display what's available from the pipeline table and note the file is missing. Offer to re-run `/job-apply` for it.
- **"review JOB-XXX"**: When asked to show the full file, print the entire application file content including tailoring notes and cover letter.
- **Multiple skips**: If Leslie says "skip all" or "skip the rest", confirm before acting — list the jobs that would be skipped and ask for confirmation.
