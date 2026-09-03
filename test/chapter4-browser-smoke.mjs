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

const browser = await chromium.launch({ headless: true, executablePath: chromium.executablePath(), args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
page.on('pageerror', error => errors.push(error.message));

const entrypoint = `http://127.0.0.1:${server.address().port}/index.html`;

async function preparePage() {
  await page.locator('.hb-peak').waitFor();
  await page.waitForFunction(() => document.documentElement.classList.contains('sc-ready') && window.ScrollCraft?.instances?.length > 0);
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
}

await page.goto(`${entrypoint}?chapter4-browser-gate`, { waitUntil: 'networkidle' });
await preparePage();

async function setPeakProgress(progress) {
  await page.evaluate(p => {
    const peak = document.querySelector('.hb-peak');
    const rect = peak.getBoundingClientRect();
    const top = rect.top + scrollY;
    const travel = Math.max(1, rect.height - innerHeight);
    scrollTo({ top: top + travel * p, left: 0, behavior: 'instant' });
  }, progress);

  await page.waitForFunction(p => {
    const peak = document.querySelector('.hb-peak');
    const actual = Number(getComputedStyle(peak).getPropertyValue('--sc-p'));
    return Math.abs(actual - p) <= 0.03;
  }, progress);

  const activeIndex = Math.min(4, Math.floor((progress + 0.1) / 0.2));

  // ScrollCraft publishes --sc-p first; handbuch intentionally consumes that
  // value on the following frame. Wait for those semantic classes rather than
  // racing the two RAF loops.
  await page.waitForFunction(expected => {
    const cards = [...document.querySelectorAll('[data-beleg-card]')];
    return cards.every((card, index) => {
      if (index < expected) return card.classList.contains('beleg--past');
      if (index === expected) return card.classList.contains('beleg--current');
      return card.classList.contains('beleg--future');
    });
  }, activeIndex);

  // The transition is part of the UX contract too. Resolve only once the state
  // the reader actually sees has settled, without a timing magic number.
  await page.waitForFunction(expected => {
    const cards = [...document.querySelectorAll('[data-beleg-card]')];
    return cards.every((card, index) => {
      const opacity = Number(getComputedStyle(card).opacity);
      return index <= expected ? opacity >= 0.9 : opacity <= 0.08;
    });
  }, activeIndex);
}

async function chapterState() {
  return page.evaluate(() => {
    const peak = document.querySelector('.hb-peak');
    const cards = [...document.querySelectorAll('[data-beleg-card]')].map(card => {
      const style = getComputedStyle(card);
      const rect = card.getBoundingClientRect();
      return {
        opacity: Number(style.opacity),
        width: rect.width,
        height: rect.height,
        classes: [...card.classList]
      };
    });
    const windowEl = document.querySelector('[data-fenster]');
    const windowStyle = getComputedStyle(windowEl);
    const windowRect = windowEl.getBoundingClientRect();
    const stageRect = document.querySelector('.hb-peak__stage').getBoundingClientRect();
    return {
      progress: Number(getComputedStyle(peak).getPropertyValue('--sc-p')),
      cards,
      window: {
        hidden: windowEl.hidden,
        opacity: Number(windowStyle.opacity),
        background: windowStyle.backgroundColor,
        top: windowRect.top,
        bottom: windowRect.bottom,
        stageTop: stageRect.top,
        stageBottom: stageRect.bottom
      }
    };
  });
}

// Invoice is the fourth step: Quotation, Sales Order and Delivery must remain
// present while Invoice becomes the visual protagonist; Payment is still future.
await setPeakProgress(0.62);
let state = await chapterState();
assert.ok(Math.abs(state.progress - 0.62) <= 0.03, `Chapter 4 probe missed requested progress: ${state.progress}`);
for (let i = 0; i <= 3; i += 1) {
  assert.ok(state.cards[i].opacity >= 0.9, `Chapter 4 card ${i} should remain visible at Invoice step, got ${state.cards[i].opacity}; classes=${state.cards[i].classes.join(',')}`);
}
assert.ok(state.cards[4].opacity <= 0.08, `Payment should remain hidden before its turn, got ${state.cards[4].opacity}`);
assert.ok(state.cards[3].width > state.cards[2].width * 1.025, 'Invoice should visibly stand out from already-landed documents');
assert.equal(state.window.hidden, false, 'A/R Invoice window should be present when Invoice is introduced');
assert.ok(state.window.opacity >= 0.95, `A/R Invoice window should be fully readable, got opacity ${state.window.opacity}`);
const rgb = state.window.background.match(/\d+(?:\.\d+)?/g)?.slice(0, 3).map(Number) || [0, 0, 0];
assert.ok(rgb.reduce((sum, value) => sum + value, 0) / 3 >= 200, `A/R Invoice window should use a light surface, got ${state.window.background}`);

// The window must also remain inside the clipped sticky stage on a phone-sized viewport.
await page.setViewportSize({ width: 390, height: 844 });
await page.reload({ waitUntil: 'networkidle' });
await preparePage();
await setPeakProgress(0.62);
state = await chapterState();
assert.ok(Math.abs(state.progress - 0.62) <= 0.03, `Mobile Chapter 4 probe missed requested progress: ${state.progress}`);
assert.ok(state.window.top >= state.window.stageTop - 1, `A/R Invoice window starts outside stage: ${state.window.top} < ${state.window.stageTop}`);
assert.ok(state.window.bottom <= state.window.stageBottom + 1, `A/R Invoice window is clipped: ${state.window.bottom} > ${state.window.stageBottom}`);
for (let i = 0; i <= 3; i += 1) {
  assert.ok(state.cards[i].opacity >= 0.9, `Mobile Chapter 4 card ${i} should remain visible at Invoice step`);
}
assert.ok(state.cards[4].opacity <= 0.08, 'Mobile Payment should remain hidden before its turn');

assert.deepEqual(errors, [], 'Chapter 4 browser console errors');
console.log(JSON.stringify({ chapter4: 'cumulative-chain-and-readable-invoice', progress: state.progress, errors }, null, 2));
await browser.close();
await new Promise(resolve => server.close(resolve));
