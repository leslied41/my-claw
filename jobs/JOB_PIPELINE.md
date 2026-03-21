# Job Pipeline

Last updated: 2026-03-21

## Pipeline States
`discovered → filtered → scored → materials_ready → pending_review → applied`
Exit states: `discarded` (hard filter failed), `weak_match` (score < 6.0), `skipped` (Leslie passed)

## Active Jobs

| ID | Title | Company | Salary | Location | Status | Score | Added | Updated |
|---|---|---|---|---|---|---|---|---|
| JOB-001 | Software Engineer | Real Time | $180k-$200k + 25% bonus | Melbourne (Hybrid) | materials_ready | 7.35 | 2026-03-20 | 2026-03-20 |
| JOB-002 | Principal Software Engineer | Commonwealth Bank | $180k-$235k | Melbourne (Hybrid) | materials_ready | 7.2 | 2026-03-20 | 2026-03-20 |
| JOB-003 | Senior Software Engineer | Aspirante Pty Ltd | negotiable | Melbourne (Hybrid) | materials_ready | 7.5 | 2026-03-21 | 2026-03-21 |
| JOB-004 | Integration Developer | Davidson | $120k-$135k | Melbourne (Hybrid) | scored | 5.9 | 2026-03-21 | 2026-03-21 |
| JOB-005 | Senior AI Engineer | Attribute Group | negotiable | Melbourne | scored | 8.0 | 2026-03-21 | 2026-03-21 |
| JOB-006 | Senior Mobile Developer | LeasePLUS Team | negotiable | Melbourne | scored | 5.5 | 2026-03-21 | 2026-03-21 |

## Archived Jobs (skipped / discarded / weak_match)

| ID | Title | Company | Salary | Status | Reason | Added |
|---|---|---|---|---|---|---|
| JOB-001-DISCARD | DevOps Engineer | Interface Recruitment | $800-1000/day | discarded | Contract only | 2026-03-20 |
| JOB-002-DISCARD | Senior Java Engineer | PRA | $1000 pd | discarded | Contract only | 2026-03-20 |
| JOB-003-DISCARD | Software Engineer | Australia Post | competitive | weak_match | Score 5.7 < 6.0 | 2026-03-20 |
| JOB-004-DISCARD | Head of Engineering | Adaps IT | $200k-$240k | weak_match | Score 4.35 < 6.0 (too senior) | 2026-03-21 |
| JOB-005-DISCARD | Senior Software Engineer | Uniti Group | - | weak_match | PHP required, no match | 2026-03-21 |
