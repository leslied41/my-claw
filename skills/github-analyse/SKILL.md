---
name: github-analyse
description: >
  Analyse a GitHub repository and write a structured project summary to
  PROJECTS.md. Works even when there is no README — uses GitHub API metadata,
  file tree, manifest files, entry points, and test files to infer what the
  project does, its tech stack, and what skills it demonstrates. If the repo
  already exists in PROJECTS.md, the entry is overwritten (not duplicated).
  Use this skill when asked to analyse a GitHub repo, add a project to the
  profile, or update an existing project entry.
compatibility: Requires WebFetch for GitHub API calls.
---

Usage: `/github-analyse https://github.com/owner/repo`

---

## Step 1 — Parse the repo identifier

Accept either a full URL (`https://github.com/owner/repo`) or shorthand (`owner/repo`).
Extract `owner` and `repo` from the input.

---

## Step 2 — Fetch repo metadata (3 parallel WebFetch calls)

All GitHub API calls go to `https://api.github.com`. No auth required for public repos.

```
GET https://api.github.com/repos/{owner}/{repo}
GET https://api.github.com/repos/{owner}/{repo}/languages
GET https://api.github.com/repos/{owner}/{repo}/topics
  (header: Accept: application/vnd.github.mercy-preview+json)
```

From the metadata response, extract:
- `description` — owner-written summary (high signal if present)
- `topics` — owner-assigned tags (tech, domain, purpose)
- `default_branch` — needed for tree fetch
- `language` — primary language
- `created_at`, `pushed_at` — age and recency
- `stargazers_count`, `forks_count` — community validation proxy

---

## Step 3 — Fetch the full file tree

Use the recursive git tree API — returns every file path in one call:

```
GET https://api.github.com/repos/{owner}/{repo}/git/trees/{default_branch}?recursive=1
```

From the tree, build two things:

**Language distribution** — count file extensions:
`.ts`/`.tsx` → TypeScript, `.py` → Python, `.go` → Go, `.java` → Java, `.rs` → Rust, etc.

**Structural signals** — note presence of:
| Pattern | Infers |
|---|---|
| `src/components/`, `*.tsx`, `*.jsx` | React frontend |
| `pages/`, `app/` (Next.js style) | Next.js |
| `models/`, `migrations/`, `views/` | Django / Rails / ORM-backed app |
| `cmd/`, `internal/`, `pkg/` | Go project structure |
| `api/`, `routes/`, `handlers/` | API / backend service |
| `scripts/`, `bin/` | CLI tooling |
| `notebooks/`, `*.ipynb` | Data science / ML |
| `train.py`, `model.py`, `predict.py` | ML project |
| `.github/workflows/` | CI/CD configured |
| `docker-compose.yml`, `Dockerfile` | Containerised |
| `terraform/`, `*.tf` | Infrastructure as code |
| `test/`, `tests/`, `__tests__/`, `*.test.*`, `*.spec.*` | Has tests |

---

## Step 4 — Fetch key files

From the tree, identify and fetch the following files using:
```
GET https://api.github.com/repos/{owner}/{repo}/contents/{path}
```
Response is base64-encoded — decode the `content` field.

**Priority order (fetch what exists, skip what doesn't):**

1. **README.md** (or README.rst, README) — if present, read it
2. **Manifest / dependency files** — highest tech stack signal:
   - `package.json` → extract `name`, `description`, `dependencies`, `devDependencies`, `scripts`
   - `requirements.txt` / `pyproject.toml` / `setup.py` / `Pipfile`
   - `go.mod` → extract module name and dependencies
   - `Cargo.toml`, `pom.xml`, `build.gradle`, `composer.json`, `Gemfile`
3. **Infrastructure files:**
   - `docker-compose.yml` → reveals services, databases, external dependencies
   - `Dockerfile` → base image reveals runtime and OS
   - `.github/workflows/*.yml` (fetch one) → build/deploy/test pipeline
4. **Entry point files** (pick whichever exists):
   - `main.py`, `app.py`, `server.py`, `index.js`, `main.go`, `src/main.ts`, `src/index.ts`
   - Read the first 60 lines — imports and top-level structure reveal purpose
5. **One test file** (pick any from `test/` or `tests/`) — test names are the most human-readable description of intended behaviour

Cap: fetch at most **8 files total**. Prioritise manifest files over source files.

---

## Step 5 — Analyse

With all signals gathered, synthesise the following:

**What the project does** — combine: description field, topics, README (if any), package.json description, entry point imports, test names. Write 3–5 sentences. Go beyond "what it is" to capture *how* it works: architecture pattern, key design decisions, notable technical choices. Example of good depth: "E-commerce backend using microservices architecture across 7 services (customer, order, payment, product, notification, config-server, gateway). Services communicate via Kafka for async events and REST via an API Gateway. Uses polyglot persistence — PostgreSQL for transactional services, MongoDB for flexible document storage. Distributed tracing via Zipkin." If genuinely unclear, say "unclear — likely a learning exercise based on tech stack alone".

**Tech stack** — from manifest dependencies and file tree patterns. List frameworks and tools specifically, not just languages (e.g. "Spring Boot, Spring Cloud Config, Eureka, Kafka, PostgreSQL, MongoDB, Docker" not just "Java").

**Architecture notes** — for non-trivial projects, capture the structural decisions worth highlighting:
- Number of services/modules and their responsibilities (for microservices)
- Data layer choices (which DB for what, why)
- Communication patterns (REST, event-driven, GraphQL)
- Infrastructure components (message queues, caches, tracing, gateways)
- Omit this field for simple single-service or learning projects

**Skills demonstrated** — be specific enough that a job description can be matched against this. Not "Microservices architecture" but "Designed 7-service microservices system with service discovery (Eureka), centralised config (Spring Cloud Config), and API gateway". Not "Docker" but "Docker Compose orchestration of 10+ services including databases, message broker, and tracing". Think: would a hiring manager reading this JD requirement be able to match it to this bullet?

**Project type** — classify as one of:
- `professional` — work project (infer from org ownership, description, or if told by user)
- `side` — personal project with real purpose (built something real, not a tutorial)
- `learning` — clearly a tutorial, practice, or course exercise (e.g. "learn-X", "todo-app", copied patterns, minimal commits, follows a course structure)
- `unknown` — can't tell; leave for Leslie to label

**Skill level signal** — note any quality indicators:
- Tests present, CI/CD configured, Docker, semantic versioning, typed code, linting configs

---

## Step 6 — Write to PROJECTS.md

File location: `workspace/PROJECTS.md`

**Upsert logic**: search for an existing entry with `## repo-name` header. If found, replace the entire entry. If not found, append to the end.

Write the entry in this format:

```markdown
## {repo-name}
- **URL:** https://github.com/{owner}/{repo}
- **Type:** {professional | side | learning | unknown}
- **Languages:** {language distribution, e.g. TypeScript 65%, Python 25%, Shell 10%}
- **Stack:** {comma-separated frameworks and tools — specific, not just languages}
- **What it does:** {3–5 sentences covering what it is, how it works, key design decisions}
- **Architecture notes:** {structural decisions — services, data layer, communication patterns; omit for simple projects}
- **Skills demonstrated:** {specific, JD-matchable list — not "microservices" but "7-service microservices system with Eureka discovery and API gateway"}
- **Quality signals:** {e.g. "has tests, CI/CD configured, Dockerised" or "none — learning project"}
- **Analysed:** {today's date}
```

---

## Step 7 — Confirm and prompt for type

Report back:
```
✓ Added/updated: {repo-name} in PROJECTS.md

Type assigned: {type}
Stack: {stack}

If the type is wrong, say: "set {repo-name} to professional/side/learning"
```

If the type was `unknown`, explicitly ask Leslie to label it.

---

## Gotchas

- **Private repos**: GitHub API returns 404 for private repos without auth. Tell the user and stop.
- **Very large trees**: If the tree response is truncated (`truncated: true`), work with what's available — it's enough for analysis.
- **Monorepos**: If the tree has multiple `package.json` files at different paths, it's a monorepo — note this and list the sub-packages found.
- **Forked repos**: Check `fork: true` in metadata — note it's a fork, which means it may not demonstrate original work. Still analyse the actual content.
- **Empty repos**: If tree is empty or has < 3 files, note "empty or skeleton repo" and skip detailed analysis.
- **base64 decoding**: GitHub API returns file content as base64 with newlines. Decode the `content` field properly — strip newlines before decoding.
