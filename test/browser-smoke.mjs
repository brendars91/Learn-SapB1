import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('/home/ubuntu/.npm-global/lib/node_modules/promptfoo/node_modules/playwright-core');

const browser = await chromium.launch({ headless: true, executablePath: '/home/ubuntu/.cache/ms-playwright/chromium-1234/chrome-linux/chrome', args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 736, height: 900 } });
const consoleErrors = [];
const networkRequests = [];
page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('pageerror', error => consoleErrors.push(error.message));
page.on('request', request => { if (/^https?:/.test(request.url())) networkRequests.push(request.url()); });

await page.goto('file:///home/ubuntu/Learn-SapB1-repo/index.html');
await page.locator('#sap-b1-mastery-lab').waitFor();
assert.equal(await page.locator('[data-view="map"]').count(), 1);

await page.locator('[data-action="locale"]').selectOption('de');
assert.equal((await page.locator('[data-view="map"]').textContent()).trim(), 'Karte');

await page.locator('[data-view="cases"]').click();
await page.locator('[data-action="answer-decision"][data-correct="true"]').click();
assert.equal(await page.locator('.sbl-answer-feedback[data-correct="true"]').count(), 1);

await page.locator('[data-view="ai"]').click();
assert.ok((await page.locator('main').innerText()).includes('SQL') || (await page.locator('main').innerText()).includes('Konsole'));
assert.ok(await page.locator('[data-action="console-tab"]').count() >= 3);

await page.locator('[data-view="map"]').click();
await page.locator('[data-action="select-skill"]').first().click();
await page.locator('[data-action="practise-skill"]').click();
await page.reload();
await page.locator('[data-view="map"]').click();
assert.ok((await page.locator('body').textContent()).includes('In Übung'));

await page.setViewportSize({ width: 360, height: 900 });
await page.locator('[data-view="home"]').click();
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
assert.ok(overflow <= 1, `horizontal overflow: ${overflow}px`);
assert.deepEqual(networkRequests, []);
assert.deepEqual(consoleErrors, []);

await browser.close();
process.stdout.write('Browser smoke test passed\n');

