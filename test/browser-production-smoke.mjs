import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const PRODUCTION_URL = 'https://brendars91.github.io/Learn-SapB1/lab/';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const errors = [];
const consoleErrors = [];

// Test desktop viewport
const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const desktopPage = await desktopContext.newPage();
desktopPage.on('pageerror', e => errors.push(e.message));
desktopPage.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });

console.log('Testing production at:', PRODUCTION_URL);

// 1. Landing page smoke
const response = await desktopPage.goto(PRODUCTION_URL, { waitUntil: 'networkidle', timeout: 30000 });
assert.ok(response.ok(), `production URL returned ${response.status()}`);

// 2. Verify app mounted
await desktopPage.locator('#sap-b1-mastery-lab').waitFor({ state: 'visible', timeout: 10000 });
const appVisible = await desktopPage.locator('#sap-b1-mastery-lab').boundingBox();
assert.ok(appVisible !== null, 'app root not mounted');

// 3. Navigate to Map
await desktopPage.locator('[data-view="map"]').first().click();
await desktopPage.waitForTimeout(500);
const skillCards = await desktopPage.locator('[data-action="select-skill"]').count();
assert.ok(skillCards === 72, `expected 72 skills, got ${skillCards}`);

// 4. Open a skill and verify modes
await desktopPage.locator('[data-action="select-skill"]').first().click();
await desktopPage.waitForTimeout(400);
const article = await desktopPage.locator('article[aria-labelledby="skill-title"]').boundingBox();
assert.ok(article !== null, 'skill article did not open');

// 5. Test mode switching
for (const mode of ['learn', 'guided', 'prove']) {
  await desktopPage.locator(`.sbl-mode-toggle [data-mode="${mode}"]`).click();
  await desktopPage.waitForTimeout(300);
  const content = await desktopPage.locator('article').innerText();
  assert.ok(content.length > 100, `${mode} mode has no content`);
}

// 6. Test locale switching
for (const locale of ['en', 'de', 'es']) {
  await desktopPage.locator('[data-action="locale"]').selectOption(locale);
  await desktopPage.waitForTimeout(300);
  const mainText = await desktopPage.locator('main').innerText();
  assert.ok(mainText.length > 50, `${locale} locale has no content`);
}

// 7. Test other views
const views = ['home', 'career', 'cases', 'incidents', 'simulator', 'ai', 'evidence'];
for (const view of views) {
  await desktopPage.locator(`[data-view="${view}"]`).first().click();
  await desktopPage.waitForTimeout(250);
  const content = await desktopPage.locator('main').innerText();
  assert.ok(content.length > 20, `${view} view has no content`);
}

// 8. Test mobile viewport
await desktopPage.close();
const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mobilePage = await mobileContext.newPage();
mobilePage.on('pageerror', e => errors.push(e.message));

await mobilePage.goto(PRODUCTION_URL, { waitUntil: 'networkidle', timeout: 30000 });
await mobilePage.locator('#sap-b1-mastery-lab').waitFor({ state: 'visible', timeout: 10000 });

// 9. Verify no horizontal overflow on mobile
const overflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
assert.ok(overflow <= 1, `mobile horizontal overflow: ${overflow}px`);

// 10. Verify navigation works on mobile
await mobilePage.locator('[data-view="map"]').first().click();
await mobilePage.waitForTimeout(400);
const mobileSkills = await mobilePage.locator('[data-action="select-skill"]').count();
assert.ok(mobileSkills === 72, `mobile: expected 72 skills, got ${mobileSkills}`);

// 11. Check for critical resources 404
const failedRequests = [];
mobilePage.on('response', async (response) => {
  if (!response.ok() && response.status() !== 304) {
    const url = response.url();
    if (url.includes('Learn-SapB1') && !url.includes('favicon')) {
      failedRequests.push({ url, status: response.status() });
    }
  }
});

await mobilePage.reload({ waitUntil: 'networkidle' });
await mobilePage.waitForTimeout(1000);

assert.deepEqual(failedRequests, [], `failed requests: ${JSON.stringify(failedRequests)}`);

// Filter expected console messages (e.g., analytics, third-party)
const criticalConsoleErrors = consoleErrors.filter(msg =>
  !msg.includes('favicon') &&
  !msg.includes('analytics') &&
  !msg.includes('gtag')
);

assert.deepEqual(errors, [], `page errors: ${JSON.stringify(errors)}`);
assert.deepEqual(criticalConsoleErrors, [], `console errors: ${JSON.stringify(criticalConsoleErrors)}`);

console.log(JSON.stringify({
  production: PRODUCTION_URL,
  desktop: 'pass',
  mobile: 'pass',
  views: views.length,
  locales: 3,
  skills: 72,
  pageErrors: errors.length,
  consoleErrors: criticalConsoleErrors.length
}, null, 2));

await browser.close();
