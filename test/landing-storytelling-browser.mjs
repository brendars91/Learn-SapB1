import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function loadPlaywright() {
  const localRequire = createRequire(import.meta.url);
  try { return localRequire('playwright'); }
  catch (error) {
    const runtimeModules = process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES;
    if (!runtimeModules) throw new Error('Playwright is required', { cause: error });
    return createRequire(path.join(runtimeModules, '__learn_sapb1_resolver.cjs'))('playwright');
  }
}

const { chromium } = loadPlaywright();
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = { '.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css' };
const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1');
  const target = path.join(projectRoot, path.normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, ''));
  if (url.pathname === '/favicon.ico') { response.writeHead(204).end(); return; }
  if (!target.startsWith(projectRoot)) { response.writeHead(403).end(); return; }
  try { const body = await readFile(target); response.writeHead(200, { 'content-type': TYPES[path.extname(target)] || 'application/octet-stream' }).end(body); }
  catch { response.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));

const browser = await chromium.launch({ headless:true, executablePath:chromium.executablePath(), args:['--no-sandbox'] });
const page = await browser.newPage({ viewport:{ width:1280, height:900 } });
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push(e.message));
const entry = `http://127.0.0.1:${server.address().port}/index.html?storytelling-gate`;
await page.goto(entry, { waitUntil:'networkidle' });
await page.waitForFunction(() => document.documentElement.classList.contains('sc-ready'));
await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });

async function scrollTo(selector, ratio = 0.5) {
  await page.evaluate(({ selector, ratio }) => {
    const el = document.querySelector(selector);
    const top = el.getBoundingClientRect().top + scrollY;
    scrollTo({ top: Math.max(0, top - innerHeight * ratio), behavior:'instant' });
  }, { selector, ratio });
  await page.waitForTimeout(80);
}
async function setPinnedProgress(selector, progress) {
  await page.evaluate(({ selector, progress }) => {
    const el = document.querySelector(selector);
    const rect = el.getBoundingClientRect();
    const top = rect.top + scrollY;
    const travel = Math.max(1, rect.height - innerHeight);
    scrollTo({ top: top + travel * progress, behavior:'instant' });
  }, { selector, progress });
  await page.waitForFunction(({ selector, progress }) => Math.abs(Number(getComputedStyle(document.querySelector(selector)).getPropertyValue('--sc-p')) - progress) < .05, { selector, progress });
  await page.waitForTimeout(90);
}

// 1 · causal folio
await setPinnedProgress('.hb-ch3-blueprint', .42);
assert.equal((await page.locator('[data-folio-effect="stock"] i').textContent()).trim(), '−12');
assert.equal(await page.locator('[data-folio-effect="stock"]').getAttribute('data-active'), '');

// 2 · experiential cold open
await scrollTo('.hb-ch1-incident', .05);
await page.evaluate(() => scrollBy(0, document.querySelector('.hb-ch1-incident').getBoundingClientRect().height * .75));
await page.waitForTimeout(120);
assert.equal((await page.locator('[data-ch1-screen-count]').textContent()).trim(), '11');
assert.equal(await page.locator('.hb-ch1-reveal').getAttribute('data-on'), '');
assert.equal(await page.locator('.hb-ch1-screens span[data-open]').count(), 11);

// 3 · Chapter 2 causal annotations
const chapter2NoteTexts = (await page.locator('.hb-ch2-cost .hb-causal-note').allInnerTexts()).map(text => text.replace(/\s+/g, ' ').trim());
assert.deepEqual(chapter2NoteTexts, ['Draft → no posting', 'A/R Invoice → ledger']);

// 4 · Chapter 3 transient impact trace
await setPinnedProgress('.hb-ch3-blueprint', .42);
await page.waitForFunction(() => document.querySelector('[data-ch3-impact="1"]')?.hasAttribute('data-on'));
assert.ok((await page.locator('[data-ch3-impact="1"]').textContent()).includes('Stock −12'));

// 5 · Chapter 4 live proof and propagation
await setPinnedProgress('.hb-peak', .72);
await page.waitForFunction(() => !document.querySelector('[data-fenster]').hidden);
assert.ok((await page.locator('[data-fenster-proof]').innerText()).includes('LIVE DOCUMENT'));
await page.locator('[data-f-qty]').fill('15');
await page.waitForFunction(() => document.querySelector('[data-beleg-card="2"] .beleg__eff li:first-child')?.textContent === 'Stock: −15');
assert.ok((await page.locator('[data-f-hint]').textContent()).startsWith('One change, three effects:'));
assert.equal((await page.locator('[data-folio-effect="stock"] i').textContent()).trim(), '−15');
assert.equal((await page.locator('[data-folio-effect="balance"] i').textContent()).trim(), '0.00');

// 6 · semantic pause / cut
assert.equal((await page.locator('.hb-atem__line').textContent()).trim(), 'Now follow one transaction.');
assert.equal((await page.locator('.hb-atem__eyebrow').textContent()).trim(), 'Enough theory. Follow the transaction.');

// 7 · continuous competency route
assert.equal(await page.locator('[data-competency-route] .hb-route-levels article').count(), 9);
assert.deepEqual(await page.locator('[data-competency-route] .hb-route-phase h3').allTextContents(), ['UNDERSTAND','OPERATE','EXTEND']);

// 8 · outcomes + contextual CTA
assert.equal(await page.locator('.hb-outcomes li').count(), 3);
assert.ok((await page.locator('.hb-final-cta').innerText()).includes('Ready to work the case?'));

// 9 · mobile semantic folio
await page.setViewportSize({ width:390, height:844 });
await scrollTo('.hb-ch2-cost', .35);
await page.waitForFunction(() => document.querySelector('[data-folio-mobile-current]')?.textContent.includes('The Cost'));
assert.notEqual(await page.locator('[data-folio-mobile-current]').evaluate(el => getComputedStyle(el).display), 'none');
assert.ok((await page.locator('[data-folio-mobile-current]').innerText()).includes('The Cost'));

// 10 · consultant rules + responsive safety
assert.ok(await page.locator('.consultant-rule').count() >= 4);
for (const width of [320,390,768,1280]) {
  await page.setViewportSize({ width, height:844 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${width}: horizontal overflow ${overflow}`);
}

assert.deepEqual(errors, []);
console.log(JSON.stringify({ storytellingSteps:10, errors }, null, 2));
await browser.close();
await new Promise(resolve => server.close(resolve));
