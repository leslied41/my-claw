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

- Query quality notes (2026-03-26 evening):
  - "full stack software engineer" Melbourne: mixed — Netbay (good match, score 6.7), Saltus Group (good match, score 6.75), but also many duplicates and weak matches (Triniti wrong stack, BGL below salary)
  - "software engineer TypeScript" Melbourne: mixed — mostly duplicates; Technology One Brisbane (contract → discard), Karbon (DevOps → discard)
  - "software engineer Python" Brisbane: mixed — Boeing Defence (defense sector), QIC (weak_match, AI specialist), Technology One Brisbane Python (weak_match, AI specialist)
  - "frontend engineer React" Sydney: weak — mostly frontend-heavy or too senior; Australia Post frontend role (discarded)
  - LinkedIn queries: weak — generic aggregation results, no specific job details
