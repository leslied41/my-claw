# Job Search Queries

## Seek Queries (used with seek-fetch.js script — not Brave Search)

Pass `--query` and `--location` to the script. Rotate across runs.

### Full Stack / General
- `--query "full stack software engineer" --location "Melbourne"`
- `--query "software engineer TypeScript" --location "Melbourne"`
- `--query "software engineer Python" --location "Melbourne"`
- `--query "full stack software engineer" --location "Brisbane"`
- `--query "software engineer TypeScript" --location "Sydney"`

### Frontend-leaning
- `--query "frontend engineer React" --location "Melbourne"`
- `--query "frontend developer TypeScript" --location "Melbourne"`

### Backend / API
- `--query "backend engineer Python FastAPI" --location "Melbourne"`
- `--query "software engineer Spring Boot" --location "Melbourne"`

### AI / Data
- `--query "software engineer LLM AI" --location "Melbourne"`
- `--query "ML engineer software" --location "Melbourne"`

### Remote-friendly
- `--query "software engineer remote" --location "Australia"`
- `--query "full stack developer remote" --location "Australia"`

## LinkedIn Queries (Brave Search snippets only — no fetch)

- `site:linkedin.com/jobs "software engineer" Melbourne "React"`
- `site:linkedin.com/jobs "full stack developer" Melbourne`
- `site:linkedin.com/jobs "software engineer" Sydney "Python" "senior"`

## Notes
- Updated: 2026-03-26
- Best performing queries: 
  - "software engineer Python" Brisbane → found Rumata ML/NLP (strong match)
  - "software engineer LLM AI" Melbourne → found Australian Unity, Seeing Machines (good signals)
  - "backend engineer Python FastAPI" Melbourne → found Easygo (good match)
- Retired queries: (none this run)
- Query quality notes (2026-03-26):
  - "software engineer Python" Melbourne: mixed - AGL Python good, Easygo Data too data-focused
  - "full stack software engineer" Sydney: mixed - Canva and Talenza filtered, Lendi strong match
  - "software engineer TypeScript" Brisbane: mixed - Medbill good, Secure Code Warrior filtered
  - "ML engineer software" Sydney: weak - mostly data scientist or ML engineer focus
  - LinkedIn "software engineer" Melbourne: weak - generic results, limited specificity
  - LinkedIn "software engineer" Sydney Python: weak - generic results

- Query quality notes (2026-03-26 late-night):
  - "full stack software engineer" Melbourne: mixed — Netbay (good match, score 6.7), Saltus Group (good match, score 6.75), but also many duplicates and weak matches (Triniti wrong stack, BGL below salary)
  - "software engineer TypeScript" Melbourne: mixed — mostly duplicates; Technology One Brisbane (contract → discard), Karbon (DevOps → discard)
  - "software engineer Python" Brisbane: mixed — Boeing Defence (defense sector), QIC (weak_match, AI specialist), Technology One Brisbane Python (weak_match, AI specialist)
  - "frontend engineer React" Sydney: weak — mostly frontend-heavy or too senior; Australia Post frontend role (discarded)
  - LinkedIn queries: weak — generic aggregation results, no specific job details
  - "software engineer LLM AI" Melbourne: weak — mostly AI specialist/research roles (Slade Group deep learning/HPC, McMillan Shakespeare Azure AI automation, Natural Selection contract); all weak_match or contract
  - "full stack software engineer" Brisbane: weak — mostly .NET/C++/data engineer roles; Clicks IT (C# senior → discard), Younity (C# primary → discard), Round Table (C++ real-time → discard)
  - "software engineer TypeScript" Sydney: mostly duplicates (Talenza, Novus already in pipeline); Lendi Group is duplicate of JOB-021
  - "backend engineer Python FastAPI" Melbourne: weak — Python/AI specialist roles dominate; nothing full-stack software engineering matched
  - LinkedIn "software engineer" Melbourne: weak — generic LinkedIn job board pages, no specific listings
  - LinkedIn "software engineer" Sydney Python: weak — generic LinkedIn job board aggregation pages

- Query quality notes (2026-03-26 morning):
  - "software engineer Python" Sydney: mixed — mostly data engineer or senior roles; ABB (embedded IoT → weak_match), Talenza AI (duplicate), Novus (duplicate)
  - "software engineer" Brisbane: mixed — .NET/C# heavy; Younity (discarded), Clicks IT (discard), Round Table (C++ real-time), VALE Partners (.NET), Careview (.NET)
  - "software engineer Spring Boot" Melbourne: weak — mostly Java-heavy, no specific match
  - "full stack developer" Melbourne: mixed — Affirm (salary below threshold $90k-$100k), Netbay (duplicate of JOB-026), Viva Energy (8-10yr .NET required)
  - "software engineer JavaScript" Melbourne: mixed — mostly duplicates; Netbay (duplicate), Ocean Software (defence, frontend-heavy), EA (C++ rendering)
  - "full stack developer" Brisbane: mixed — .NET/C# heavy; Sitecore (discarded), UpperGround (discarded), Careview (discarded), Auto & General (platform engineer)
  - LinkedIn queries: weak — generic aggregation pages, no specific listings
  - Good find: Medbill (JOB-049) — TypeScript/Node.js/AWS/React stack match, score 8.15

- Query quality notes (2026-03-26 evening):
  - "full stack software engineer" Sydney: mixed — Secure Code Warrior mid-level (good, score 8.45), Secure Code Warrior senior (close but senior), Prospa (.NET required), Synechron (good, score 7.35), u&u (good, score 7.45), UpperGround (good, score 7.35)
  - "full stack software engineer" Brisbane: weak — mostly duplicates; Kala Data GPU Platform (score 6.3, infrastructure domain different)
  - "full stack software engineer" Melbourne: weak — Data Engineer/Cloud Infra/Mainframe (all infrastructure/data focus)
  - "full stack developer remote" Australia: weak — mostly IT support, DevOps, data engineer roles
  - LinkedIn queries: weak — generic aggregation pages, no specific listings
  - Strong finds: Secure Code Warrior mid-level (score 8.45), u&u fintech (score 7.45), Synechron (score 7.35)

- Query quality notes (2026-03-27 evening):
  - "full stack software engineer" Melbourne: weak — mostly contract, Angular, DevOps, infrastructure roles; Geoscape Australia (Sydney - good, score 6.2), ASIC (contract → discard), Wymac (.NET/Blazor → discard)
  - "full stack software engineer" Sydney: mixed — mostly duplicates and senior/staff roles; TheDriveGroup (good match, score 6.2, Golang gap), Geoscape (Sydney, duplicate), many Google/ELMO/OFX too senior
  - "software engineer" Brisbane: weak — mostly .NET/Java/contract roles, senior/principal roles, HPC, data engineers
  - "software engineer Python" Melbourne: weak — mostly senior/principal/AI specialist roles; AustralianSuper (AI lead, too senior), Technology One (AI specialist → discard)
  - LinkedIn queries: weak — generic aggregation pages only, no specific job listings
  - Good finds: TheDriveGroup (JOB-058, score 6.2), Geoscape Australia (JOB-059, score 6.2 — geospatial domain adjacent to IMOS)

- Query quality notes (2026-03-27 morning):
  - "software engineer Python" Melbourne: weak — mostly analytics engineer, .NET, contract roles; Halcyon Knights (contract), Calleo (.NET), INTERWORKS (data engineer), Coforge (data engineer/Power BI)
  - "full stack software engineer" Brisbane: weak — mostly .NET, data engineer, HPC/Principal roles
  - "software engineer TypeScript" Sydney: mixed — mostly duplicates; new: FinXL (contract, AI-first), Ticketek (ML Engineer lead), TheDriveGroup (good but senior $150k-$190k)
  - "full stack software engineer" Melbourne: weak — mostly contract, Angular, AWS developer, Azure developer roles
  - LinkedIn queries: weak — generic LinkedIn job board aggregation pages, no specific listings
  - Good find: The Argyle Network/Archa (JOB-057) — Python backend, fintech scale-up, score 6.9
