# Job Pipeline

Last updated: 2026-03-27 (evening sweep)

## Pipeline States
`discovered → filtered → scored → materials_ready → applied`
Exit states: `discarded` (hard filter failed), `weak_match` (score < 6.0), `skipped` (passed), `expired` (listing closed)

## Active Jobs

| ID | Title | Company | Salary | Location | Status | Score | Added | Updated |
|---|---|---|---|---|---|---|---|---|
| JOB-001 | Software Engineer | Real Time | $180k-$200k + 25% bonus | Melbourne (Hybrid) | materials_ready | 7.35 | 2026-03-20 | 2026-03-20 |
| JOB-002 | Principal Software Engineer | Commonwealth Bank | $180k-$235k | Melbourne (Hybrid) | materials_ready | 7.2 | 2026-03-20 | 2026-03-20 |
| JOB-003 | Senior Software Engineer | Aspirante Pty Ltd | negotiable | Melbourne (Hybrid) | materials_ready | 7.5 | 2026-03-21 | 2026-03-21 |
| JOB-004 | Integration Developer | Davidson | $120k-$135k | Melbourne (Hybrid) | materials_ready | 5.9 | 2026-03-21 | 2026-03-26 |
| JOB-005 | Senior AI Engineer | Attribute Group | negotiable | Melbourne | materials_ready | 8.0 | 2026-03-21 | 2026-03-26 |
| JOB-006 | Senior Mobile Developer | LeasePLUS Team | negotiable | Melbourne | materials_ready | 5.5 | 2026-03-21 | 2026-03-26 |
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
| JOB-049 | Software Engineer | Medbill | not stated | Brisbane (Hybrid) | materials_ready | 8.15 | 2026-03-26 | 2026-03-26 |
| JOB-050 | Software Engineer, Full Stack (Mid-Level) | Secure Code Warrior | not stated | Sydney (Remote) | materials_ready | 8.45 | 2026-03-26 | 2026-03-26 |
| JOB-051 | Senior Software Engineer, Full Stack | Secure Code Warrior | not stated | Sydney (Remote) | materials_ready | 7.15 | 2026-03-26 | 2026-03-26 |
| JOB-052 | Senior Full Stack Software Engineer | Prospa | not stated | Sydney | materials_ready | 6.25 | 2026-03-26 | 2026-03-26 |
| JOB-053 | Sr. Software Engineer (Node.js/TypeScript & AWS) | Synechron | not stated | Sydney | materials_ready | 7.35 | 2026-03-26 | 2026-03-26 |
| JOB-054 | Senior Software Engineer | u&u. Recruitment Partners | $150k-$170k | Sydney (Hybrid) | materials_ready | 7.45 | 2026-03-26 | 2026-03-26 |
| JOB-055 | Senior Software Engineer | UpperGround by Hudson | $155k | Sydney (Hybrid) | materials_ready | 7.35 | 2026-03-26 | 2026-03-26 |
| JOB-056 | Engineer – Distributed GPU Platform | Kala Data | not stated | Brisbane (Hybrid) | materials_ready | 6.3 | 2026-03-26 | 2026-03-26 |
| JOB-057 | Backend Developer | The Argyle Network | not stated | Melbourne | materials_ready | 6.9 | 2026-03-27 | 2026-03-27 |
| JOB-058 | Senior Software Engineer | TheDriveGroup | $150k-$190k+super+Equity | Sydney (Hybrid) | materials_ready | 6.2 | 2026-03-27 | 2026-03-28 |
| JOB-059 | Software Engineer | Geoscape Australia | $125k-$145k | Sydney (Hybrid) | materials_ready | 6.2 | 2026-03-27 | 2026-03-28 |

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
| JOB-035-DISCARD | Senior AI Research Engineer | Slade Group | Flexible Hybrid | discarded | weak_match | Score 4.25 — deep learning/HPC research role, neural networks/PyTorch/JAX required, no Leslie stack match | 2026-03-26 |
| JOB-036-DISCARD | AI Engineer - Intelligent Automation | McMillan Shakespeare | not stated | discarded | weak_match | Score 4.25 — Azure AI/Power Platform heavy, not software engineering focused | 2026-03-26 |
| JOB-037-DISCARD | Senior Data Scientist – Applied AI & Data Engineering | Natural Selection Group | not stated | discarded | Contract only | 12-month contract | 2026-03-26 |
| JOB-038-DISCARD | Senior Full Stack Developer | Clicks IT Recruitment | $170k-$200k | discarded | weak_match | Score 4.8 — C#/.NET senior required (7yr), Leslie is mid-level Python/TS developer | 2026-03-26 |
| JOB-039-DISCARD | Software Developer | Younity | not stated | discarded | weak_match | Score 4.65 — C#/.NET primary requirement, Leslie's Python/TS/React stack secondary | 2026-03-26 |
| JOB-040-DISCARD | Mid - Senior Developer (C++/TypeScript) | Round Table Recruitment | $100k-$130k | discarded | weak_match | Score 3.6 — C++ real-time systems required, no Leslie stack match | 2026-03-26 |
| JOB-041-DISCARD | Software Engineer | ABB | not stated | discarded | weak_match | Score ~5.0 — embedded IoT (C/C++/Python/Java), hardware integration, Bluetooth mesh required; Leslie's full-stack Python/Java/React stack doesn't cover embedded IoT domain | 2026-03-26 |
| JOB-042-DISCARD | Software Engineer | Chubb Fire and Security | not stated | discarded | weak_match | Score ~5.3 — C# primary + embedded Linux/IoT networking required; Leslie has Java/Python but no C# or embedded IoT domain | 2026-03-26 |
| JOB-043-DISCARD | Full Stack Developer | Collaborate Recruitment | not stated | discarded | weak_match | Score ~3.5 — 10+ yr, TypeScript/NestJS tech lead role reviewing AI-generated code; Leslie has 4 yr, strong TS/React but role far too senior and specific | 2026-03-26 |
| JOB-044-DISCARD | Software Developer | Girraphic | $95k-$115k | discarded | Salary below $115k threshold | 2026-03-26 |
| JOB-045-DISCARD | Analytics Engineer - Databricks | VALD | not stated | discarded | weak_match | Score ~4.4 — Databricks/PySpark/T-SQL/analytics engineering domain; Leslie's Python/SQL stack doesn't match analytics engineering specialization | 2026-03-26 |
| JOB-046-DISCARD | Senior Full Stack Developer | Clicks IT Recruitment | $170k-$200k | discarded | weak_match | Score ~4.0 — C#/.NET 7yr required (exceeds Leslie's ~4yr), Azure/Bicep; Leslie's Python/Java stack doesn't match | 2026-03-26 |
| JOB-047-DISCARD | Mid Level Developer | Round Table Recruitment | $100k-$130k | discarded | weak_match | Score ~4.5 — C++ or TypeScript real-time systems/3D environments required; Leslie's generalist stack doesn't cover real-time systems domain | 2026-03-26 |
| JOB-048-DISCARD | Senior .NET Developer | VALE Partners | $140k-$160k | discarded | weak_match | Score ~5.4 — .NET Core required; Leslie has Python/FastAPI/React/Vue but no .NET; score just below 6.0 | 2026-03-26 |
| JOB-049-DISCARD | Full Stacker Developer | Viva Energy Australia | not stated | discarded | weak_match | Score ~3.5 — 8-10+ yr, C#/.NET/Angular required; Leslie has 4 yr, Python/Java stack doesn't match | 2026-03-26 |
| JOB-050-DISCARD | Senior Software Developer - Front-End | Ocean Software Pty Ltd | not stated | discarded | weak_match | Score ~5.5 — 5-10 yr required, React/TypeScript frontend-heavy, defence sector with security clearance required | 2026-03-26 |
| JOB-051-DISCARD | Senior Software Engineer - Rendering | Electronic Arts | not stated | discarded | weak_match | Score ~3.0 — C++ required, 6-8 yr rendering/GPU experience; Leslie's Python/Java/React stack doesn't match | 2026-03-26 |
| JOB-052-DISCARD | Software Engineer, C++ | Electronic Arts | not stated | discarded | weak_match | Score ~3.0 — C++ required, 7+ yr systems programming; Leslie's full-stack Python/Java doesn't match | 2026-03-26 |
| JOB-053-DISCARD | Sitecore Software Engineer | Talenza | $140k-$150k | discarded | weak_match | Score ~4.5 — Sitecore/.NET/C# required; Leslie has Java/Python/React but no Sitecore/.NET | 2026-03-26 |
| JOB-054-DISCARD | Senior .Net Engineer | UpperGround by Hudson | $150k | discarded | weak_match | Score ~4.0 — C#/.NET/WCF/BizTalk required; Leslie's Python/Java stack doesn't match | 2026-03-26 |
| JOB-055-DISCARD | Senior Full Stack .NET Developer | Careview | $130k-$140k | discarded | weak_match | Score ~4.5 — .NET Framework 4.7/MVC 5 required; Leslie has modern .NET Core/Python, legacy not match | 2026-03-26 |
| JOB-056-DISCARD | Senior Platform Engineer | Auto & General | not stated | discarded | weak_match | Score ~4.0 — Platform Engineer (Kubernetes/Terraform/AWS infrastructure); Leslie is SWE not DevOps | 2026-03-26 |
| JOB-057-DISCARD | Data Engineer | INTERWORKS | $100k-$150k | discarded | weak_match | Data engineer focus, not software engineering | 2026-03-26 |
| JOB-058-DISCARD | Cloud Infrastructure Engineer | Peoplebank Australia | $132k | Melbourne | discarded | weak_match | DevOps/Infrastructure focused, not SWE | 2026-03-26 |
| JOB-059-DISCARD | Mainframe Software Developer | Peoplebank Australia | $132k | Melbourne | discarded | weak_match | COBOL/mainframe required, not SWE | 2026-03-26 |
| JOB-060-DISCARD | Staff Engineer, R&D Lead | Secure Code Warrior | not stated | Sydney (Remote) | discarded | weak_match | Staff-level R&D lead, too senior | 2026-03-26 |
| JOB-061-DISCARD | Senior IT Engineer, Okta | Airwallex | not stated | Melbourne | discarded | weak_match | IT Support/Okta focus, not SWE | 2026-03-26 |
| JOB-062-DISCARD | Senior Product Security Engineer | Airwallex | not stated | Melbourne | discarded | weak_match | Security focus, not software engineering | 2026-03-26 |
| JOB-063-DISCARD | Senior Data Engineer | Skilledfield | not stated | Melbourne | discarded | weak_match | Data engineer focus | 2026-03-26 |
| JOB-064-DISCARD | Senior Software Engineer (Frontend) | Experis AU | not stated | Melbourne | discarded | weak_match | Frontend-heavy role | 2026-03-26 |
| JOB-065-DISCARD | Platform / Application Support Engineer | Synechron | not stated | Melbourne | discarded | weak_match | Support Engineer focus | 2026-03-26 |
| JOB-066-DISCARD | Business Intelligence Analyst Programmer | Red Energy | not stated | - | discarded | weak_match | BI/analyst focus | 2026-03-26 |
| JOB-067-DISCARD | Lead AI Engineer | AustralianSuper | not stated | Melbourne | discarded | weak_match | AI engineer specialist | 2026-03-26 |
| JOB-068-DISCARD | Senior Azure Platform Engineer | Emmbr | not stated | Melbourne | discarded | weak_match | DevOps/infrastructure focused | 2026-03-26 |
| JOB-069-DISCARD | Technical Lead, Engineering | Profusion PAC | not stated | Melbourne | discarded | weak_match | Lead/manager role | 2026-03-26 |
| JOB-070-DISCARD | Senior DevOps Engineer | Bluefin Resources | not stated | Melbourne | discarded | weak_match | DevOps focused | 2026-03-26 |
| JOB-071-DISCARD | Lead GenAI Systems Engineer | AustralianSuper | not stated | Melbourne | discarded | weak_match | AI specialist (GenAI) | 2026-03-26 |
| JOB-072-DISCARD | AWS Developer | Clicks IT Recruitment | $120-$150/hr | Melbourne | discarded | Contract only | 2026-03-26 |
| JOB-073-DISCARD | Senior Database Engineer | Technology One | not stated | Melbourne | discarded | weak_match | Database engineer focus | 2026-03-26 |
| JOB-074-DISCARD | Senior Software Engineer | Halcyon Knights | not stated | Melbourne (Remote) | discarded | Contract only | 6-month fixed term contract | 2026-03-27 |
| JOB-075-DISCARD | Analytics Engineer | Pacific National | not stated | Melbourne | discarded | weak_match | Analytics/Data engineer focus, not software engineering | 2026-03-27 |
| JOB-076-DISCARD | Data Engineer | Coforge Technologies | $140k-$170k | Melbourne | discarded | weak_match | Power BI/Data engineer focus, not SWE | 2026-03-27 |
| JOB-077-DISCARD | Senior Angular Developer | Talent Street | competitive | Melbourne (Hybrid) | discarded | Contract only | 12-month contract | 2026-03-27 |
| JOB-078-DISCARD | Full Stack Developer (AI-First) | FinXL IT | not stated | Sydney | discarded | Contract only | Contract only | 2026-03-27 |
| JOB-079-DISCARD | Lead Developer | Engage Squared | not stated | Melbourne (Hybrid) | discarded | weak_match | Too senior (6+yr + lead experience required), client-facing consulting role | 2026-03-27 |
| JOB-080-DISCARD | Application Developer | ASIC | not stated | Melbourne (Hybrid) | discarded | hard_filter | Contract/Temp work type only | 2026-03-27 |
| JOB-081-DISCARD | Software Engineer | Wymac Gaming Solutions | not stated | Melbourne (Hybrid) | discarded | weak_match | Score ~4.1 — C#/.NET/Blazor primary requirement, Leslie's Python/TS/React stack doesn't match | 2026-03-27 |

## Notes
- Evening sweep completed 2026-03-26 — 7 new jobs scored, 17+ jobs discarded