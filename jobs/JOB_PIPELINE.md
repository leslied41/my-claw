# Job Pipeline

Last updated: 2026-03-26 (afternoon sweep)

## Pipeline States
`discovered → filtered → scored → materials_ready → applied`
Exit states: `discarded` (hard filter failed), `weak_match` (score < 6.0), `skipped` (passed), `expired` (listing closed)

## Active Jobs

| ID | Title | Company | Salary | Location | Status | Score | Added | Updated |
|---|---|---|---|---|---|---|---|---|
| JOB-001 | Software Engineer | Real Time | $180k-$200k + 25% bonus | Melbourne (Hybrid) | materials_ready | 7.35 | 2026-03-20 | 2026-03-20 |
| JOB-002 | Principal Software Engineer | Commonwealth Bank | $180k-$235k | Melbourne (Hybrid) | materials_ready | 7.2 | 2026-03-20 | 2026-03-20 |
| JOB-003 | Senior Software Engineer | Aspirante Pty Ltd | negotiable | Melbourne (Hybrid) | materials_ready | 7.5 | 2026-03-21 | 2026-03-21 |
| JOB-004 | Integration Developer | Davidson | $120k-$135k | Melbourne (Hybrid) | scored | 5.9 | 2026-03-21 | 2026-03-21 |
| JOB-005 | Senior AI Engineer | Attribute Group | negotiable | Melbourne | scored | 8.0 | 2026-03-21 | 2026-03-21 |
| JOB-006 | Senior Mobile Developer | LeasePLUS Team | negotiable | Melbourne | scored | 5.5 | 2026-03-21 | 2026-03-21 |
| JOB-007 | ML/NLP Software Engineer | Rumata Technologies | $110k-$160k | Brisbane (Hybrid) | materials_ready | 7.05 | 2026-03-24 | 2026-03-24 |
| JOB-008 | Staff Software Engineer (Unloan) | Commonwealth Bank | not stated | Melbourne (Hybrid) | materials_ready | 7.0 | 2026-03-24 | 2026-03-24 |
| JOB-009 | Senior Software Engineer | Aspirante Pty Ltd | negotiable | Melbourne (Hybrid) | materials_ready | 7.35 | 2026-03-24 | 2026-03-24 |
| JOB-010 | Senior AI Enablement Engineer | Australian Unity | not stated | Melbourne (Hybrid) | materials_ready | 6.6 | 2026-03-24 | 2026-03-24 |
| JOB-011 | Software Engineer - Core | Easygo Solutions | not stated | Melbourne (Hybrid) | materials_ready | 6.4 | 2026-03-24 | 2026-03-24 |
| JOB-012 | Senior Software Engineer | MongoDB | not stated | Sydney (Hybrid) | materials_ready | 7.8 | 2026-03-25 | 2026-03-25 |
| JOB-013 | AI Engineer - Applied AI | Culture Amp | not stated | Melbourne | materials_ready | 7.75 | 2026-03-25 | 2026-03-25 |
| JOB-014 | Software Engineer - AI / AWS / DevOps | NTP Talent | $160k-$200k | Sydney (Hybrid) | materials_ready | 7.75 | 2026-03-25 | 2026-03-25 |
| JOB-019 | Software Developer | Liberty Financial | not stated | Melbourne (Hybrid) | materials_ready | 6.15 | 2026-03-26 | 2026-03-26 |
| JOB-020 | Senior Software Engineer (AI) | Talenza | $190k-$210k | Sydney | materials_ready | 6.5 | 2026-03-26 | 2026-03-26 |
| JOB-021 | Mid Level Software Engineer | Lendi Group | not stated | Sydney | materials_ready | 7.35 | 2026-03-26 | 2026-03-26 |
| JOB-022 | Senior Developer | Sharesies | not stated | Sydney (Hybrid) | materials_ready | 6.95 | 2026-03-26 | 2026-03-26 |
| JOB-023 | Senior / Staff Software Engineer (AI Systems & Platforms) | Novus | $200k-$250k+Super+ESOP | Sydney | materials_ready | 6.85 | 2026-03-26 | 2026-03-26 |
| JOB-024 | Senior Web Developer | Queensland Health | not stated | Brisbane | materials_ready | 6.9 | 2026-03-26 | 2026-03-26 |
| JOB-025 | Senior Software Developer (Full Stack) | Macquarie University | $150k-$160k+17% super | Sydney (Hybrid) | materials_ready | 6.1 | 2026-03-26 | 2026-03-26 |
| JOB-026 | Software Engineer | Netbay Internet | $115k-$125k | Melbourne (Hybrid) | materials_ready | 6.7 | 2026-03-26 | 2026-03-26 |
| JOB-027 | Senior Full Stack Developer | Saltus Group (Fintech) | not stated | Melbourne (Hybrid) | materials_ready | 6.75 | 2026-03-26 | 2026-03-26 |

## Archived Jobs (skipped / discarded / weak_match)

| ID | Title | Company | Salary | Status | Reason | Added |
|---|---|---|---|---|---|---|
| JOB-001-DISCARD | DevOps Engineer | Interface Recruitment | $800-1000/day | discarded | Contract only | 2026-03-20 |
| JOB-002-DISCARD | Senior Java Engineer | PRA | $1000 pd | discarded | Contract only | 2026-03-20 |
| JOB-003-DISCARD | Software Engineer | Australia Post | competitive | weak_match | Score 5.7 < 6.0 | 2026-03-20 |
| JOB-004-DISCARD | Head of Engineering | Adaps IT | $200k-$240k | weak_match | Score 4.35 < 6.0 (too senior) | 2026-03-21 |
| JOB-005-DISCARD | Senior Software Engineer | Uniti Group | - | weak_match | PHP required, no match | 2026-03-21 |
| JOB-006-DISCARD | Senior/Lead React Native Engineer | The Onset | $180k-$190k | discovered | Partial data - URL fetch failed | 2026-03-24 |
| JOB-007-DISCARD | Software Engineer - Defence | Cosync | $90-$130/hr | discarded | Contract/Casual only | 2026-03-24 |
| JOB-008-DISCARD | Technology Lead | Domain Group | $150k-$200k | weak_match | Score 5.2 < 6.0 | 2026-03-24 |
| JOB-009-DISCARD | Solutions Engineer | Australian Catholic University | $116k-$130k | weak_match | Score 5.5 < 6.0 | 2026-03-24 |
| JOB-015-DISCARD | Senior Frontend Engineer | Abby Health | - | weak_match | Frontend-heavy, score ~5.0 | 2026-03-26 |
| JOB-016-DISCARD | Principal Frontend Engineer | Canva | - | weak_match | Too senior, frontend-focused | 2026-03-26 |
| JOB-017-DISCARD | Mid - Senior Developer (C++) | Round Table Recruitment | $100k-$130k | weak_match | C++ required, no match | 2026-03-26 |
| JOB-018-DISCARD | Senior Data Engineer | Easygo Group Holdings | + Bonus | weak_match | Score 5.8 < 6.0 (data engineer focus) | 2026-03-26 |
| JOB-022-DISCARD | AWS Developer | Clicks IT Recruitment | $120-$150/hr | discarded | Contract only | 2026-03-26 |
| JOB-023-DISCARD | Developer | Technology One | competitive | discarded | Contract only | 2026-03-26 |
| JOB-024-DISCARD | Senior .Net Developer | Hydrogen Group | $150k-$170k | discarded | Contract only | 2026-03-26 |
| JOB-025-DISCARD | Lead Applications Developer | 1Logic | $140k+ | discarded | Not target city (Mackay) | 2026-03-26 |
| JOB-026-DISCARD | Senior Full Stack Developer | Triniti | $130k-$160k+ | discarded | weak_match | Score 3.1 < 6.0 — .NET/Angular required, no stack match | 2026-03-26 |
| JOB-027-DISCARD | Senior Software Engineer (FinOps) | Fat Zebra | not stated | discarded | weak_match | Score 5.9 < 6.0 — Ruby/Rails required, no match | 2026-03-26 |
| JOB-028-DISCARD | Developer | BGL Corporate Solutions | from $95k | discarded | Salary below $115k threshold | 2026-03-26 |
| JOB-029-DISCARD | Developer | Technology One | competitive | discarded | Contract only | 2026-03-26 |
| JOB-030-DISCARD | Software Engineer | AJQ Consulting | not stated | discarded | Contract only | 2026-03-26 |
| JOB-031-DISCARD | Senior DevOps Engineer | Karbon | not stated | discarded | weak_match | DevOps-focused, not software engineering | 2026-03-26 |
| JOB-032-DISCARD | Software Engineer | Australia Post | competitive | discarded | weak_match | Frontend-heavy (React/AEM), score ~4.5 | 2026-03-26 |
| JOB-033-DISCARD | AI Solutions Developer | QIC | not stated | discarded | weak_match | Score ~4.0 — ML/AI specialist focus, enterprise governance heavy | 2026-03-26 |
| JOB-034-DISCARD | Senior Python Developer - Data & AI | Technology One | not stated | discarded | weak_match | Score ~4.5 — AI/LLM specialist, agentic systems deep expertise required | 2026-03-26 |