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
const entrypoint = `http://127.0.0.1:${server.address().port}/index.html`;
const errors = [];

async function makePage(viewport, suffix) {
  const page = await browser.newPage({ viewport });
  page.on('console', message => { if (message.type() === 'error') errors.push(`${suffix}: ${message.text()}`); });
  page.on('pageerror', error => errors.push(`${suffix}: ${error.message}`));
  await page.goto(`${entrypoint}?visual-integrity=${suffix}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.documentElement.classList.contains('sc-ready') && window.ScrollCraft?.instances?.length > 0);
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  return page;
}

async function setProgress(page, selector, progress) {
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

const shortDesktop = await makePage({ width: 1280, height: 720 }, 'short-desktop');

await setProgress(shortDesktop, '.hb-ch3-blueprint', 0.10);
const firstParagraphEarlyOpacity = await shortDesktop.locator('.hb-ch3-blueprint .hb-wende__text > p:first-child').evaluate(el => Number(getComputedStyle(el).opacity));
assert.ok(firstParagraphEarlyOpacity <= .15, `Chapter 3 first paragraph should still reveal in sequence, not be forced visible from the start: ${firstParagraphEarlyOpacity}`);

await setProgress(shortDesktop, '.hb-ch3-blueprint', 0.40);
await shortDesktop.waitForFunction(() => Number(getComputedStyle(document.querySelector('.hb-ch3-blueprint .hb-wende__text > p:first-child')).opacity) >= .95);

await setProgress(shortDesktop, '.hb-ch3-blueprint', 0.80);
await shortDesktop.waitForFunction(() => document.querySelector('[data-ch3-step="3"]')?.classList.contains('hb-ch3-step--current'));
const chapter3 = await shortDesktop.evaluate(() => {
  const stage = document.querySelector('.hb-ch3-blueprint [data-sc-stage]').getBoundingClientRect();
  const rule = document.querySelector('.hb-ch3-blueprint .consultant-rule').getBoundingClientRect();
  const paragraphs = [...document.querySelectorAll('.hb-ch3-blueprint .hb-wende__text > p')].map(el => ({ opacity: Number(getComputedStyle(el).opacity), top: el.getBoundingClientRect().top, bottom: el.getBoundingClientRect().bottom }));
  return { stage: { top: stage.top, bottom: stage.bottom }, rule: { top: rule.top, bottom: rule.bottom }, paragraphs, viewport: innerHeight };
});
assert.ok(chapter3.rule.top >= 0 && chapter3.rule.bottom <= chapter3.viewport, `Chapter 3 consultant rule must remain visible: ${JSON.stringify(chapter3)}`);
assert.ok(chapter3.paragraphs.every(p => p.opacity >= .95), `Both Chapter 3 paragraphs must remain readable at Payment: ${JSON.stringify(chapter3.paragraphs)}`);

await setProgress(shortDesktop, '.hb-peak', 0.62);
await shortDesktop.waitForFunction(() => !document.querySelector('[data-fenster]').hidden && Number(getComputedStyle(document.querySelector('[data-fenster]')).opacity) >= .95);
await shortDesktop.waitForFunction(() => {
  const reached = [...document.querySelectorAll('[data-beleg-card]')].slice(0, 4);
  return reached.every(el => {
    const style = getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) >= .9;
  });
});
const chapter4 = await shortDesktop.evaluate(() => {
  const chain = document.querySelector('.hb-peak .kette').getBoundingClientRect();
  const invoice = document.querySelector('[data-fenster]').getBoundingClientRect();
  const proof = document.querySelector('.fenster__proof').getBoundingClientRect();
  const rule = document.querySelector('.hb-peak .consultant-rule--ink')?.getBoundingClientRect();
  const cards = [...document.querySelectorAll('[data-beleg-card]')].map((el, i) => {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return { i, display: style.display, visibility: style.visibility, opacity: Number(style.opacity), width: rect.width, height: rect.height };
  });
  return {
    chain: { top: chain.top, bottom: chain.bottom, left: chain.left, right: chain.right },
    invoice: { top: invoice.top, bottom: invoice.bottom, left: invoice.left, right: invoice.right },
    proof: { top: proof.top, bottom: proof.bottom, left: proof.left, right: proof.right },
    rule: rule ? { top: rule.top, bottom: rule.bottom } : null,
    cards,
    viewport: innerHeight
  };
});

// Preserve the original editorial composition: the document chain remains a
// full-width row above the live invoice rather than being squeezed into a new
// side column on short desktop screens.
assert.ok(chapter4.invoice.top >= chapter4.chain.bottom - 2, `Chapter 4 chain and invoice should stay vertically composed, not split into columns: ${JSON.stringify(chapter4)}`);

// Quotation through Invoice are already reached at this point. They must all
// remain materially present; no breakpoint may remove or collapse them.
for (const card of chapter4.cards.slice(0, 4)) {
  assert.notEqual(card.display, 'none', `Processed/current card ${card.i} was removed from layout`);
  assert.notEqual(card.visibility, 'hidden', `Processed/current card ${card.i} was hidden`);
  assert.ok(card.opacity >= .9, `Processed/current card ${card.i} became visually faint: ${JSON.stringify(card)}`);
  assert.ok(card.width >= 118, `Processed/current card ${card.i} was over-compressed: ${JSON.stringify(card)}`);
}

assert.ok(chapter4.proof.top >= 0 && chapter4.proof.bottom <= chapter4.viewport, `LIVE DOCUMENT / EDIT A VALUE must remain visible: ${JSON.stringify(chapter4.proof)}`);
assert.ok(chapter4.invoice.bottom <= chapter4.viewport, `Complete invoice must remain inside viewport: ${JSON.stringify(chapter4.invoice)}`);
assert.ok(chapter4.rule && chapter4.rule.top >= 0 && chapter4.rule.bottom <= chapter4.viewport, `Chapter 4 consultant rule must not disappear: ${JSON.stringify(chapter4.rule)}`);

await shortDesktop.close();
assert.deepEqual(errors, [], 'browser console errors');
console.log(JSON.stringify({ firstParagraphEarlyOpacity, chapter3, chapter4, errors }, null, 2));
await browser.close();
await new Promise(resolve => server.close(resolve));
