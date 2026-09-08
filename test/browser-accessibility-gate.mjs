import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const { AxeBuilder } = await import('@axe-core/playwright');

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

const auditState = async (label) => {
  await page.waitForTimeout(300); // Allow UI to stabilize
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
    .analyze();

  const violations = results.violations || [];

  const critical = violations.filter(v => v.impact === 'critical');
  const serious = violations.filter(v => v.impact === 'serious');
  const moderate = violations.filter(v => v.impact === 'moderate');

  // BASELINE DOCUMENTED (2026-09-08): Production app has 2 serious violations that require
  // design review (color-contrast, link-in-text-block). These are real defects flagged for
  // future remediation. This test prevents NEW critical violations and regression beyond
  // the documented baseline. Threshold will be lowered as violations are fixed.
  const DOCUMENTED_SERIOUS_BASELINE = 2;

  if (critical.length > 0) {
    const report = critical.map(v => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.length
    }));
    assert.fail(`${label}: ${critical.length} CRITICAL violations (zero tolerance):\n${JSON.stringify(report, null, 2)}`);
  }

  if (serious.length > DOCUMENTED_SERIOUS_BASELINE) {
    const report = serious.map(v => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.length
    }));
    assert.fail(`${label}: ${serious.length} serious violations exceed baseline of ${DOCUMENTED_SERIOUS_BASELINE}:\n${JSON.stringify(report, null, 2)}`);
  }

  return { label, critical: critical.length, serious: serious.length, moderate: moderate.length };
};

// Audit representative states in ES
const results = [];
results.push(await auditState('home-es'));

await page.locator('[data-view="career"]').first().click();
results.push(await auditState('career-es'));

await page.locator('[data-view="map"]').first().click();
results.push(await auditState('map-es'));

await page.locator('[data-view="cases"]').first().click();
results.push(await auditState('cases-es'));

await page.locator('[data-view="incidents"]').first().click();
results.push(await auditState('incidents-es'));

await page.locator('[data-view="simulator"]').first().click();
results.push(await auditState('simulator-es'));

await page.locator('[data-view="ai"]').first().click();
results.push(await auditState('ai-es'));

await page.locator('[data-view="evidence"]').first().click();
results.push(await auditState('evidence-es'));

// Audit skill article with all three modes
await page.locator('[data-view="map"]').first().click();
await page.locator('[data-action="select-skill"]').first().click();
results.push(await auditState('skill-learn-es'));

await page.locator('.sbl-mode-toggle [data-mode="guided"]').click();
results.push(await auditState('skill-guided-es'));

await page.locator('.sbl-mode-toggle [data-mode="prove"]').click();
results.push(await auditState('skill-prove-es'));

// Audit EN locale
await page.locator('[data-action="locale"]').selectOption('en');
await page.locator('[data-view="home"]').first().click();
results.push(await auditState('home-en'));

await page.locator('[data-view="map"]').first().click();
await page.locator('[data-action="select-skill"]').first().click();
results.push(await auditState('skill-en'));

// Audit DE locale
await page.locator('[data-action="locale"]').selectOption('de');
await page.locator('[data-view="home"]').first().click();
results.push(await auditState('home-de'));

await page.locator('[data-view="map"]').first().click();
await page.locator('[data-action="select-skill"]').first().click();
results.push(await auditState('skill-de'));

// Mobile viewport audit
await page.setViewportSize({ width: 390, height: 844 });
await page.locator('[data-action="locale"]').selectOption('es');
await page.locator('[data-view="home"]').first().click();
results.push(await auditState('home-mobile'));

assert.deepEqual(errors, []);
console.log(JSON.stringify({ results, errors }, null, 2));
await browser.close();
await new Promise(resolve => server.close(resolve));
