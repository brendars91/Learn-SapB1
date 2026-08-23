import assert from 'node:assert/strict';
import { chromium } from '/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 736, height: 900 } });
const consoleErrors = [];
const networkRequests = [];
page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('pageerror', error => consoleErrors.push(error.message));
page.on('request', request => { if (/^https?:/.test(request.url())) networkRequests.push(request.url()); });

await page.goto('file:///workspace/SAP-Business-One-Mastery-Lab-Standalone.html');
await page.locator('#sap-b1-mastery-lab').waitFor();
assert.equal(await page.locator('[data-view="map"]').count(), 1);

await page.locator('[data-action="locale"]').selectOption('de');
assert.equal((await page.locator('[data-view="map"]').textContent()).trim(), 'Karte');

await page.locator('[data-view="cases"]').click();
await page.locator('[data-action="answer-decision"][data-correct="true"]').click();
assert.equal(await page.locator('.sbl-answer-feedback[data-correct="true"]').count(), 1);

await page.locator('[data-view="ai"]').click();
await page.locator('#sbl-prompt').fill([
  'ROLLE: SAP Business One Lerncoach.',
  'ZIEL: Sichere Diagnose erklären.',
  'KONTEXT: Nur SYN-CASE-AI-01.',
  'QUELLE: Nachweis-ID zitieren.',
  'UNSICHER: Nicht verifizierte Punkte nennen.',
  'AUSGABE: JSON Schema.',
  'MENSCHLICHE PRÜFUNG: Vor Änderungen stoppen.'
].join('\n'));
await page.locator('[data-action="analyze-prompt"]').click();
assert.match(await page.locator('.sbl-score-ring').textContent(), /100%/);

await page.locator('[data-view="map"]').click();
await page.locator('[data-action="select-skill"]').first().click();
await page.locator('[data-action="practise-skill"]').click();
await page.reload();
await page.locator('[data-view="map"]').click();
assert.ok((await page.locator('body').textContent()).includes('In Übung'));

await page.setViewportSize({ width: 360, height: 900 });
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
assert.ok(overflow <= 1, `horizontal overflow: ${overflow}px`);
assert.deepEqual(networkRequests, []);
assert.deepEqual(consoleErrors, []);

await browser.close();
process.stdout.write('Browser smoke test passed\n');

