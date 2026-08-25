import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

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
// El entrypoint de Pages carga módulos ES: por file:// el navegador los bloquea, así que
// se sirve el repositorio por HTTP igual que GitHub Pages.
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1');
  const target = path.join(projectRoot, path.normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, ''));
  if (url.pathname === '/favicon.ico') { response.writeHead(204).end(); return; }
  if (!target.startsWith(projectRoot)) { response.writeHead(403).end(); return; }
  try {
    const body = await readFile(target);
    response.writeHead(200, { 'content-type': TYPES[path.extname(target)] || 'application/octet-stream' }).end(body);
  } catch { response.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const entrypoint = `http://127.0.0.1:${server.address().port}/index.html`;
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
// Puerta de idioma: en inglés y alemán no puede quedar ni una frase en español.
const { TERMS } = await import('../src/content/i18n-terms.mjs');
const markersFor = locale => Object.entries(TERMS)
  .filter(([spanish, entry]) => spanish.length >= 14 && typeof entry[locale] === 'string' && entry[locale] !== spanish)
  .map(([spanish]) => spanish);
const languageLeaks = {};
for (const locale of ['en', 'de']) {
  await page.locator('[data-action="locale"]').selectOption(locale);
  const seen = [];
  for (const view of views) { await page.locator(`[data-view="${view}"]`).click(); seen.push(await page.locator('main').innerText()); }
  await page.locator('[data-view="map"]').click();
  for (const id of ids.filter((_, index) => index % 8 === 0)) {
    await page.locator(`[data-action="select-skill"][data-skill="${id}"]`).first().click();
    for (const mode of ['learn','guided','prove']) {
      await page.locator(`.sbl-mode-toggle [data-mode="${mode}"]`).click();
      seen.push(await page.locator('article').innerText());
    }
  }
  const text = seen.join('\n');
  const leaks = markersFor(locale).filter(marker => text.includes(marker));
  languageLeaks[locale] = leaks.length;
  assert.deepEqual(leaks, [], `${locale}: Spanish text still rendered`);
}
await page.locator('[data-action="locale"]').selectOption('es');

for (const width of [320,375,414,768,1024,1440]) {
  await page.setViewportSize({ width, height: 900 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${width}: overflow ${overflow}`);
}
assert.deepEqual(errors, []);
console.log(JSON.stringify({ views: views.length, skills: ids.length, languageLeaks, errors }, null, 2));
await browser.close();
await new Promise(resolve => server.close(resolve));
