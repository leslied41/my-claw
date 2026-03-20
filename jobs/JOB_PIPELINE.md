# Job Pipeline

Last updated: (agent updates this on every change)

## Pipeline States
`discovered → filtered → scored → materials_ready → pending_review → applied`
Exit states: `discarded` (hard filter failed), `weak_match` (score < 6.0), `skipped` (Leslie passed)

## Active Jobs

| ID | Title | Company | Salary | Location | Status | Score | Added | Updated |
|---|---|---|---|---|---|---|---|---|

## Archived Jobs (skipped / discarded / weak_match)

| ID | Title | Company | Salary | Status | Reason | Added |
|---|---|---|---|---|---|---|
