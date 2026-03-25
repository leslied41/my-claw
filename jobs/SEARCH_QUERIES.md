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
- Updated: 2026-03-24
- Best performing queries: 
  - "software engineer Python" Brisbane → found Rumata ML/NLP (strong match)
  - "software engineer LLM AI" Melbourne → found Australian Unity, Seeing Machines (good signals)
  - "backend engineer Python FastAPI" Melbourne → found Easygo (good match)
- Retired queries: (none this run)
- Query quality notes (2026-03-24):
  - "software engineer Python" Brisbane: good signal - Rumata ML/NLP passed threshold
  - "frontend engineer React" Melbourne: mixed - Aspirante passed, Domain partial, The Onset contract
  - "backend engineer Python FastAPI" Melbourne: good - Easygo passed, DevOps filtered out
  - "software engineer LLM AI" Melbourne: good - Australian Unity passed
  - LinkedIn "full stack developer" Melbourne: weak - no specific job details, generic results
  - LinkedIn "software engineer Sydney Python senior": weak - generic results, limited specificity
