import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

function loadPlaywright() {
  const localRequire = createRequire(import.meta.url);
  try { return localRequire('playwright'); }
  catch (error) {
    const runtimeModules = process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES;
    if (!runtimeModules) throw new Error('Playwright is required. Run: npm install --no-save playwright@1.55.0', { cause: error });
    return createRequire(path.join(runtimeModules, '__learn_sapb1_resolver.cjs'))('playwright');
  }
}

const { chromium } = loadPlaywright();

const browser = await chromium.launch({ headless: true, executablePath: chromium.executablePath(), args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push(e.message));
const entrypoint = pathToFileURL(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../index.html')).href;
await page.goto(`${entrypoint}?local-browser-gate`);
await page.locator('#sap-b1-mastery-lab').waitFor();
const views = ['home','career','map','cases','incidents','simulator','ai','evidence'];
for (const view of views) { await page.locator(`[data-view="${view}"]`).click(); assert.ok((await page.locator('main').innerText()).trim().length > 20, view); }
await page.locator('[data-view="map"]').click();
const ids = await page.locator('[data-action="select-skill"]').evaluateAll(ns => [...new Set(ns.map(n => n.dataset.skill))]);
assert.equal(ids.length, 72);
for (const id of ids) {
  await page.locator(`[data-action="select-skill"][data-skill="${id}"]`).first().click();
  const article = page.locator('article');
  for (const mode of ['learn','guided','prove']) {
    await article.locator(`.sbl-mode-toggle [data-mode="${mode}"]`).click();
    assert.equal((await article.innerText()).includes('[object Object]'), false, `${id}/${mode}`);
  }
  const guided = await article.innerText();
  assert.ok(guided.includes('¿QUÉ ES ESTO?') || guided.includes('WHAT IS THIS?') || guided.includes('WAS IST DAS?'), `${id}: brief`);
  assert.ok(await article.locator('[data-activity-type]').count() === 1, `${id}: activity`);
}
for (const width of [320,375,414,768,1024,1440]) {
  await page.setViewportSize({ width, height: 900 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${width}: overflow ${overflow}`);
}
assert.deepEqual(errors, []);
console.log(JSON.stringify({ views: views.length, skills: ids.length, errors }, null, 2));
await browser.close();
