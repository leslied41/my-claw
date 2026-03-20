# Job Pipeline

Last updated: 2026-03-20

## Pipeline States
`discovered → filtered → scored → materials_ready → pending_review → applied`
Exit states: `discarded` (hard filter failed), `weak_match` (score < 6.0), `skipped` (Leslie passed)

## Active Jobs

| ID | Title | Company | Salary | Location | Status | Score | Added | Updated |
|---|---|---|---|---|---|---|---|---|
| JOB-001 | Software Engineer | Real Time | $180k-$200k + 25% bonus | Melbourne (Hybrid) | materials_ready | 7.35 | 2026-03-20 | 2026-03-20 |
| JOB-002 | Principal Software Engineer | Commonwealth Bank | $180k-$235k | Melbourne (Hybrid) | materials_ready | 7.2 | 2026-03-20 | 2026-03-20 |

## Archived Jobs (skipped / discarded / weak_match)

| ID | Title | Company | Salary | Status | Reason | Added |
|---|---|---|---|---|---|---|
| JOB-001-DISCARD | DevOps Engineer | Interface Recruitment | $800-1000/day | discarded | Contract only | 2026-03-20 |
| JOB-002-DISCARD | Senior Java Engineer | PRA | $1000 pd | discarded | Contract only | 2026-03-20 |
| JOB-003-DISCARD | Software Engineer | Australia Post | competitive | weak_match | Score 5.7 < 6.0 | 2026-03-20 |
