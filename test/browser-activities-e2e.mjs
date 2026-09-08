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

// Get all skill IDs
await page.locator('[data-view="map"]').first().click();
await page.waitForTimeout(300);
const skillIds = await page.locator('[data-action="select-skill"]').evaluateAll(
  nodes => [...new Set(nodes.map(n => n.dataset.skill))]
);

assert.equal(skillIds.length, 72, 'expected 72 unique skills');

const activityTypes = { simulator: 0, bughunt: 0, journal: 0, forensic: 0, consequence: 0, config: 0 };
const tested = [];

for (const skillId of skillIds) {
  // Open skill
  await page.locator(`[data-action="select-skill"][data-skill="${skillId}"]`).first().click();
  await page.waitForTimeout(250);

  // Go to prove mode
  await page.locator('.sbl-mode-toggle [data-mode="prove"]').click();
  await page.waitForTimeout(250);

  // Get activity type
  const activityType = await page.locator('[data-activity-type]').getAttribute('data-activity-type');
  assert.ok(activityType, `${skillId}: no activity type`);
  activityTypes[activityType] = (activityTypes[activityType] || 0) + 1;

  // Verify activity has interactive elements
  const hasInteraction = await page.evaluate(() => {
    const activity = document.querySelector('[data-activity-type]');
    if (!activity) return false;

    // Check for interactive elements
    const buttons = activity.querySelectorAll('button:not([disabled])');
    const inputs = activity.querySelectorAll('input, select, textarea');
    const clickable = activity.querySelectorAll('[data-action], [data-index]');

    return buttons.length > 0 || inputs.length > 0 || clickable.length > 0;
  });

  assert.ok(hasInteraction, `${skillId}: no interactive elements in ${activityType} activity`);

  // Verify check button exists
  const checkButton = await page.locator('[data-action="check-activity"]').count();
  assert.ok(checkButton > 0, `${skillId}: no check button`);

  // Test interaction: click check button to trigger feedback
  await page.locator('[data-action="check-activity"]').click();
  await page.waitForTimeout(300);

  // Verify feedback appeared (correct or incorrect)
  const feedback = await page.evaluate(() => {
    const article = document.querySelector('article');
    return article?.textContent || '';
  });

  const hasFeedback = feedback.includes('Correcto') || feedback.includes('Incorrecto') ||
                      feedback.includes('Correct') || feedback.includes('Incorrect') ||
                      feedback.includes('Richtig') || feedback.includes('Falsch') ||
                      feedback.includes('✓') || feedback.includes('✗');

  assert.ok(hasFeedback, `${skillId}: no feedback after check`);

  tested.push({ skillId, activityType, hasInteraction, hasFeedback });

  // Return to map for next skill
  await page.locator('[data-view="map"]').first().click();
  await page.waitForTimeout(200);
}

// Verify all 6 activity types are represented
const representedTypes = Object.keys(activityTypes).filter(t => activityTypes[t] > 0);
assert.ok(representedTypes.length === 6, `only ${representedTypes.length}/6 activity types found: ${JSON.stringify(activityTypes)}`);

assert.deepEqual(errors, []);
console.log(JSON.stringify({
  skills: tested.length,
  activityTypes,
  errors: errors.length
}, null, 2));

await browser.close();
await new Promise(resolve => server.close(resolve));
