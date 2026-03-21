#!/usr/bin/env node
/**
 * resume-to-pdf.js — Convert a markdown resume file to PDF using headless Chromium.
 *
 * Usage:
 *   node resume-to-pdf.js --input /path/to/resume.md
 *   node resume-to-pdf.js --input /path/to/resume.md --output /path/to/output.pdf
 *
 * Options:
 *   --input   Path to the markdown resume file (required)
 *   --output  Path for the output PDF (default: same location as input, .pdf extension)
 *
 * Output: JSON to stdout with { success, outputPath, message }
 * Errors: to stderr, exit code 1.
 */

const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
const path = require('path');

const CHROMIUM_PATH = '/home/node/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome';
const LAUNCH_ARGS = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'];

const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); return i !== -1 ? args[i + 1] : null; };

const inputPath  = flag('--input');
const outputPath = flag('--output');

if (!inputPath) {
  process.stderr.write('Usage: resume-to-pdf.js --input /path/to/resume.md [--output /path/to/output.pdf]\n');
  process.exit(1);
}

if (!fs.existsSync(inputPath)) {
  process.stderr.write(`File not found: ${inputPath}\n`);
  process.exit(1);
}

const resolvedOutput = outputPath || inputPath.replace(/\.md$/, '.pdf');

// --- Minimal markdown to HTML converter (sufficient for resume structure) ---
function mdToHtml(md) {
  const lines = md.split('\n');
  const html = [];
  let inList = false;
  let inTable = false;
  let tableHeader = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Tables
    if (line.startsWith('|')) {
      if (!inTable) { html.push('<table>'); inTable = true; tableHeader = true; }
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      // Skip separator row (---|---|---)
      if (cells.every(c => /^[-: ]+$/.test(c))) {
        tableHeader = false;
        continue;
      }
      const tag = tableHeader ? 'th' : 'td';
      html.push(`<tr>${cells.map(c => `<${tag}>${inline(c)}</${tag}>`).join('')}</tr>`);
      continue;
    } else if (inTable) {
      html.push('</table>');
      inTable = false;
    }

    // Lists
    if (/^- /.test(line)) {
      if (!inList) { html.push('<ul>'); inList = true; }
      html.push(`<li>${inline(line.slice(2))}</li>`);
      continue;
    } else if (inList) {
      html.push('</ul>');
      inList = false;
    }

    // Headings
    if (/^### /.test(line)) { html.push(`<h3>${inline(line.slice(4))}</h3>`); continue; }
    if (/^## /.test(line))  { html.push(`<h2>${inline(line.slice(3))}</h2>`); continue; }
    if (/^# /.test(line))   { html.push(`<h1>${inline(line.slice(2))}</h1>`); continue; }

    // HR
    if (/^---+$/.test(line.trim())) { html.push('<hr>'); continue; }

    // Blank line
    if (line.trim() === '') { html.push('<br>'); continue; }

    // Paragraph
    html.push(`<p>${inline(line)}</p>`);
  }

  if (inList)  html.push('</ul>');
  if (inTable) html.push('</table>');

  return html.join('\n');
}

function inline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em>$1</em>')
    .replace(/`(.+?)`/g,       '<code>$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
}

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Georgia', serif;
    font-size: 11pt;
    line-height: 1.5;
    color: #1a1a1a;
    max-width: 760px;
    margin: 0 auto;
    padding: 32px 40px;
  }
  h1 {
    font-size: 22pt;
    font-weight: bold;
    margin-bottom: 4px;
    border-bottom: 2px solid #1a1a1a;
    padding-bottom: 6px;
  }
  h2 {
    font-size: 13pt;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border-bottom: 1px solid #aaa;
    margin-top: 18px;
    margin-bottom: 8px;
    padding-bottom: 3px;
    color: #333;
  }
  h3 {
    font-size: 11pt;
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 2px;
  }
  p { margin-bottom: 4px; }
  ul {
    padding-left: 18px;
    margin-bottom: 6px;
  }
  li { margin-bottom: 2px; }
  hr {
    border: none;
    border-top: 1px solid #ddd;
    margin: 12px 0;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 8px;
    font-size: 10pt;
  }
  th, td {
    text-align: left;
    padding: 4px 8px;
    border: 1px solid #ddd;
  }
  th { background: #f5f5f5; font-weight: bold; }
  strong { font-weight: bold; }
  em { font-style: italic; }
  code {
    font-family: 'Courier New', monospace;
    font-size: 9.5pt;
    background: #f4f4f4;
    padding: 1px 4px;
    border-radius: 2px;
  }
  a { color: #1a1a1a; }
  br { display: block; margin: 4px 0; content: ''; }
`;

async function main() {
  const markdown = fs.readFileSync(inputPath, 'utf-8');
  const body = mdToHtml(markdown);
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${body}</body></html>`;

  const browser = await chromium.launch({
    executablePath: CHROMIUM_PATH,
    headless: true,
    args: LAUNCH_ARGS,
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.pdf({
      path: resolvedOutput,
      format: 'A4',
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
      printBackground: true,
    });

    const result = { success: true, outputPath: resolvedOutput, message: `PDF saved to ${resolvedOutput}` };
    console.log(JSON.stringify(result));
  } catch (e) {
    const result = { success: false, outputPath: null, message: e.message };
    console.log(JSON.stringify(result));
    process.stderr.write(`resume-to-pdf error: ${e.message}\n`);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
