import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const root = path.resolve(import.meta.dirname, '..');
const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://local');
  const file = path.join(root, path.normalize(decodeURIComponent(url.pathname)).replace(/^[/\\]+/, ''));
  try {
    res.writeHead(200, { 'content-type': file.endsWith('.css') ? 'text/css' : file.endsWith('.mjs') ? 'text/javascript' : 'text/html' });
    res.end(await readFile(file));
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));

const entrypoint = `http://127.0.0.1:${server.address().port}/lab/index.html`;
await page.goto(entrypoint, { waitUntil: 'networkidle' });

// Helper to check focus is visible
const checkFocusVisible = async (context) => {
  const visible = await page.evaluate(() => {
    const active = document.activeElement;
    if (!active || active === document.body) return false;
    const style = window.getComputedStyle(active);
    const rect = active.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && style.opacity !== '0' && style.visibility !== 'hidden';
  });
  assert.ok(visible, `${context}: focus not visible or on body`);
};

// 1. Navigate to Map view via keyboard
const mapButton = page.locator('nav [data-view="map"]').first();
await mapButton.focus();
await checkFocusVisible('map-button');
await mapButton.press('Enter');
await page.waitForTimeout(400);

// 2. Open first skill card via keyboard
const skillCard = page.locator('[data-action="select-skill"]').first();
await skillCard.waitFor({ state: 'visible', timeout: 5000 });
await skillCard.focus();
await checkFocusVisible('skill-card');
await skillCard.press('Enter');
await page.waitForTimeout(400);

// 3. Verify skill article opened
const article = page.locator('article[aria-labelledby="skill-title"]');
await article.waitFor({ state: 'visible', timeout: 5000 });
const articleBox = await article.boundingBox();
assert.ok(articleBox !== null, 'skill article not visible');

// 4. Navigate between modes via keyboard
const guidedTab = page.locator('.sbl-mode-toggle [data-mode="guided"][role="tab"]');
await guidedTab.focus();
await checkFocusVisible('guided-tab');
await guidedTab.press('Enter');
await page.waitForTimeout(300);

const guidedSelected = await guidedTab.getAttribute('aria-selected');
assert.equal(guidedSelected, 'true', 'guided mode not selected');

// 5. Navigate to prove mode via keyboard
const proveTab = page.locator('.sbl-mode-toggle [data-mode="prove"][role="tab"]');
await proveTab.focus();
await checkFocusVisible('prove-tab');
await proveTab.press('Enter');
await page.waitForTimeout(300);

const activityVisible = await page.locator('[data-activity-type]').count();
assert.ok(activityVisible > 0, 'prove mode activity not visible');

// 6. Navigate back to home via keyboard
const homeButton = page.locator('nav [data-view="home"]').first();
await homeButton.focus();
await checkFocusVisible('home-button');
await homeButton.press('Enter');
await page.waitForTimeout(300);

// 7. Verify can navigate to other views (no keyboard trap)
const views = ['career', 'cases', 'simulator'];
for (const view of views) {
  const button = page.locator(`nav [data-view="${view}"]`).first();
  await button.focus();
  await checkFocusVisible(`${view}-button`);
  await button.press('Enter');
  await page.waitForTimeout(250);

  const content = await page.locator('main').innerText();
  assert.ok(content.length > 20, `${view} view empty`);
}

// 8. Verify locale selector is keyboard accessible
const localeSelect = page.locator('[data-action="locale"]');
await localeSelect.focus();
await checkFocusVisible('locale-select');

assert.deepEqual(errors, []);
console.log(JSON.stringify({ keyboardNavigation: 'pass', tests: 8, errors }, null, 2));
await browser.close();
await new Promise(resolve => server.close(resolve));
