#!/usr/bin/env node
/**
 * seek-fetch.js — Search Seek.com.au and extract job listings using headless Chromium.
 *
 * Usage:
 *   Search:    node seek-fetch.js --query "software engineer" --location "Melbourne"
 *   Job page:  node seek-fetch.js --url "https://www.seek.com.au/job/12345"
 *
 * Options:
 *   --query     Search keywords (required for search mode)
 *   --location  Location string, default: "Melbourne"
 *   --full      Also fetch each job's full detail page (slower, richer data)
 *   --url       Fetch a single job page by URL (skips search)
 *
 * Output: JSON array of job objects to stdout.
 * Errors: to stderr, exit code 1.
 */

const { chromium } = require('/app/node_modules/playwright-core');

const CHROMIUM_PATH = '/home/node/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome';
const SEEK_BASE = 'https://www.seek.com.au';
const LAUNCH_ARGS = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'];
const USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function buildSearchUrl(query, location) {
  const params = new URLSearchParams({
    keywords: query,
    where: location,
    daterange: '14',
    sortmode: 'ListedDate',
  });
  return `${SEEK_BASE}/jobs?${params}`;
}

function cleanJobUrl(href) {
  // Strip tracking params — keep only the job ID path
  try {
    const u = new URL(href, SEEK_BASE);
    return `${SEEK_BASE}${u.pathname}`;
  } catch {
    return href;
  }
}

async function dismissCookieBanner(page) {
  try {
    const btn = page.locator('[data-automation="cookie-accept"]');
    if (await btn.isVisible({ timeout: 2000 })) await btn.click();
  } catch (_) {}
}

async function text(locator, timeout = 2000) {
  try {
    return (await locator.textContent({ timeout }))?.trim() || null;
  } catch (_) {
    return null;
  }
}

async function scrapeSearchResults(page) {
  const jobs = [];
  const cards = page.locator('[data-automation="normalJob"], [data-automation="premiumJob"]');
  const count = await cards.count();

  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    try {
      // Title link has origin=cardTitle — use it to get the clean title and URL
      const titleLink = card.locator('a[data-automation="jobTitle"]');
      const title = await text(titleLink);
      const href = await titleLink.getAttribute('href').catch(() => null);
      const url = href ? cleanJobUrl(href) : null;

      if (!title || !url) continue;

      jobs.push({
        title,
        company:      await text(card.locator('[data-automation="jobCompany"]')),
        location:     await text(card.locator('[data-automation="jobLocation"]')),
        salary:       await text(card.locator('[data-automation="jobSalary"]')),
        workType:     await text(card.locator('[data-automation="jobSubClassification"]')),
        summary:      await text(card.locator('[data-automation="jobShortDescription"]')),
        listed:       await text(card.locator('[data-automation="jobListingDate"]')),
        url,
        source: 'seek-search',
      });
    } catch (_) {}
  }

  return jobs;
}

async function scrapeJobPage(page) {
  const get = (sel) => text(page.locator(sel).first(), 5000);
  return {
    title:       await get('[data-automation="job-detail-title"]'),
    company:     await get('[data-automation="advertiser-name"]'),
    location:    await get('[data-automation="job-detail-location"]'),
    salary:      await get('[data-automation="job-detail-salary"]'),
    workType:    await get('[data-automation="job-detail-work-type"]'),
    description: await get('[data-automation="jobAdDetails"]'),
  };
}

async function main() {
  const args = process.argv.slice(2);
  const flag = (name) => { const i = args.indexOf(name); return i !== -1 ? args[i + 1] : null; };
  const has  = (name) => args.includes(name);

  const query    = flag('--query');
  const location = flag('--location') || 'Melbourne';
  const url      = flag('--url');
  const full     = has('--full');

  if (!query && !url) {
    process.stderr.write('Usage: seek-fetch.js --query "software engineer" [--location "Melbourne"] [--full]\n');
    process.stderr.write('       seek-fetch.js --url "https://www.seek.com.au/job/12345"\n');
    process.exit(1);
  }

  const browser = await chromium.launch({
    executablePath: CHROMIUM_PATH,
    headless: true,
    args: LAUNCH_ARGS,
  });

  try {
    const page = await browser.newPage({ userAgent: USER_AGENT });
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-AU,en;q=0.9' });

    if (url) {
      // Single job page mode
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await dismissCookieBanner(page);
      const job = await scrapeJobPage(page);
      job.url = cleanJobUrl(url);
      job.source = 'seek-job-page';
      console.log(JSON.stringify([job], null, 2));
      return;
    }

    // Search mode
    await page.goto(buildSearchUrl(query, location), { waitUntil: 'networkidle', timeout: 30000 });
    await dismissCookieBanner(page);

    const jobs = await scrapeSearchResults(page);

    if (full) {
      // Enrich each job with its full detail page
      for (const job of jobs) {
        try {
          await page.goto(job.url, { waitUntil: 'networkidle', timeout: 30000 });
          const details = await scrapeJobPage(page);
          // Prefer detail page values where richer, keep search result values otherwise
          job.title       = details.title       || job.title;
          job.company     = details.company     || job.company;
          job.location    = details.location    || job.location;
          job.salary      = details.salary      || job.salary;
          job.workType    = details.workType    || job.workType;
          job.description = details.description || null;
          job.source = 'seek-job-page';
        } catch (e) {
          job.fetchError = e.message;
        }
      }
    }

    console.log(JSON.stringify(jobs, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  process.stderr.write(`seek-fetch error: ${e.message}\n`);
  process.exit(1);
});
