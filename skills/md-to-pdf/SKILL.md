---
name: md-to-pdf
description: >
  Convert any markdown file to a polished PDF. Use this whenever the human
  asks to export, print, or save a .md file as PDF — including tailored
  resumes by job ID. Accepts a file path, a JOB-ID shorthand, or will ask
  if nothing is provided. Never runs automatically — always manually triggered.
compatibility: Requires Bash to run skills/md-to-pdf/scripts/md-to-pdf.js (Playwright).
---

Usage:
- `/resume-pdf /path/to/file.md` — convert any markdown file to PDF
- `/resume-pdf JOB-003` — shorthand to find and convert the tailored resume for that job
- `/resume-pdf` — ask the user which file to convert

---

## Step 1 — Identify the input file

**If a file path is provided**: use it directly. Confirm it exists before proceeding.

**If a JOB-ID is provided** (e.g. `JOB-003`):
- Look up the job in `workspace/jobs/JOB_PIPELINE.md` to get company and role
- Find `workspace/jobs/applications/YYYY-MM-DD_Company_Role_RESUME.md`
- If no tailored resume exists for that job, say so and stop

**If no argument is given**: ask the user which file to convert.

---

## Step 2 — Convert to PDF

> Run scripts from the skill directory: `cd workspace/skills/md-to-pdf`

Run the conversion script:

```bash
node scripts/md-to-pdf.js \
  --input "/absolute/path/to/file.md"
```

The script outputs JSON: `{ success, outputPath, message }`.

Output PDF is saved alongside the input file with the same name and `.pdf` extension, unless `--output` is specified:

```bash
node scripts/md-to-pdf.js \
  --input "/path/to/file.md" \
  --output "/path/to/output.pdf"
```

---

## Step 3 — Confirm

Report back with the output path:
```
✓ PDF saved: /path/to/file.pdf
```

If the script failed, report the error and suggest checking that the input file exists and is valid markdown.

---

## Gotchas

- **File path spaces**: Quote the path in the bash command.
- **Complex formatting**: The converter handles standard markdown (headings, lists, tables, bold, italic, code). Unusual or nested formatting may not render perfectly.
- **Output location**: By default the PDF lands next to the input file. Use `--output` to save elsewhere.
