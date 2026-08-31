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
    if (!runtimeModules) throw new Error('Playwright is required. Run: npm install --no-save playwright@1.55.0', { cause: error });
    return createRequire(path.join(runtimeModules, '__learn_sapb1_resolver.cjs'))('playwright');
  }
}

const { chromium } = loadPlaywright();
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript', '.css': 'text/css' };
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

const browser = await chromium.launch({ headless: true, executablePath: chromium.executablePath(), args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
page.on('pageerror', error => errors.push(error.message));
const entrypoint = `http://127.0.0.1:${server.address().port}/index.html`;

await page.goto(`${entrypoint}?visibility-regression`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => document.documentElement.classList.contains('sc-ready') && window.ScrollCraft?.instances?.length > 0);
await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });

async function setProgress(selector, progress) {
  await page.evaluate(({ selector, progress }) => {
    const section = document.querySelector(selector);
    const rect = section.getBoundingClientRect();
    const top = rect.top + scrollY;
    const travel = Math.max(1, rect.height - innerHeight);
    scrollTo({ top: top + travel * progress, left: 0, behavior: 'instant' });
  }, { selector, progress });
  await page.waitForFunction(({ selector, progress }) => {
    const section = document.querySelector(selector);
    const actual = Number(getComputedStyle(section).getPropertyValue('--sc-p'));
    return Math.abs(actual - progress) <= 0.035;
  }, { selector, progress });
}

// Follow the actual reading direction: Chapter 3 first, then Chapter 4.
// 1 · Payment should remain inside a comfortable visible band while active.
await setProgress('.hb-ch3-blueprint', 0.80);
await page.waitForFunction(() => document.querySelector('[data-ch3-step="3"]')?.classList.contains('hb-ch3-step--current'));
const payment = await page.locator('[data-ch3-step="3"]').evaluate(el => {
  const rect = el.getBoundingClientRect();
  const stage = document.querySelector('.hb-ch3-blueprint [data-sc-stage]').getBoundingClientRect();
  const drawing = document.querySelector('.hb-ch3-blueprint .hb-zeichnung').getBoundingClientRect();
  return { top: rect.top, bottom: rect.bottom, center: rect.top + rect.height / 2, viewport: innerHeight, stageTop: stage.top, stageBottom: stage.bottom, drawingTop: drawing.top, drawingBottom: drawing.bottom };
});
assert.ok(payment.top >= 80, `Payment appears too high in the viewport: ${JSON.stringify(payment)}`);
assert.ok(payment.bottom <= payment.viewport - 130, `Payment appears too low/cut off: ${JSON.stringify(payment)}`);

// 2 · The first explanatory paragraph must persist once revealed; fast scrolling
// must not make it disappear before Payment is read.
const firstParagraph = page.locator('.hb-wende__text > p').first();
const firstOpacity = Number(await firstParagraph.evaluate(el => getComputedStyle(el).opacity));
assert.ok(firstOpacity >= .95, `First Chapter 3 paragraph should remain visible at Payment, opacity=${firstOpacity}`);

// 3 · The A/R Invoice must be complete without an internal vertical crop/scroll.
await setProgress('.hb-peak', 0.62);
await page.waitForFunction(() => !document.querySelector('[data-fenster]').hidden && Number(getComputedStyle(document.querySelector('[data-fenster]')).opacity) >= .95);
let invoice = await page.locator('[data-fenster]').evaluate(el => ({
  clientHeight: el.clientHeight,
  scrollHeight: el.scrollHeight,
  overflowY: getComputedStyle(el).overflowY,
  bottom: el.getBoundingClientRect().bottom,
  stageBottom: document.querySelector('.hb-peak__stage').getBoundingClientRect().bottom,
  hintBottom: document.querySelector('.fenster__hint').getBoundingClientRect().bottom
}));
assert.ok(invoice.scrollHeight <= invoice.clientHeight + 1, `A/R Invoice is internally cropped: ${JSON.stringify(invoice)}`);
assert.ok(invoice.hintBottom <= invoice.bottom + 1, `A/R Invoice ending is not visible: ${JSON.stringify(invoice)}`);
assert.ok(invoice.bottom <= invoice.stageBottom + 1, `A/R Invoice extends beyond the sticky stage: ${JSON.stringify(invoice)}`);

assert.deepEqual(errors, [], 'browser console errors');
console.log(JSON.stringify({ payment, firstOpacity, invoice, errors }, null, 2));
await browser.close();
await new Promise(resolve => server.close(resolve));
