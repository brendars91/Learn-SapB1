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
  await page.goto(`${entrypoint}?visibility-regression=${suffix}`, { waitUntil: 'networkidle' });
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

async function measureInvoice(page, label) {
  await setProgress(page, '.hb-peak', 1.0);
  await page.waitForFunction(() => !document.querySelector('[data-fenster]').hidden && Number(getComputedStyle(document.querySelector('[data-fenster]')).opacity) >= .95);
  const invoice = await page.locator('[data-fenster]').evaluate(el => ({
    clientHeight: el.clientHeight,
    scrollHeight: el.scrollHeight,
    overflowY: getComputedStyle(el).overflowY,
    top: el.getBoundingClientRect().top,
    bottom: el.getBoundingClientRect().bottom,
    stageTop: document.querySelector('.hb-peak__stage').getBoundingClientRect().top,
    stageBottom: document.querySelector('.hb-peak__stage').getBoundingClientRect().bottom,
    hintTop: document.querySelector('.fenster__hint').getBoundingClientRect().top,
    hintBottom: document.querySelector('.fenster__hint').getBoundingClientRect().bottom,
    viewport: innerHeight
  }));
  assert.ok(invoice.scrollHeight <= invoice.clientHeight + 1, `${label}: A/R Invoice is internally cropped: ${JSON.stringify(invoice)}`);
  assert.notEqual(invoice.overflowY, 'auto', `${label}: A/R Invoice still relies on internal vertical scrolling`);
  assert.notEqual(invoice.overflowY, 'scroll', `${label}: A/R Invoice still relies on internal vertical scrolling`);
  assert.ok(invoice.hintTop >= invoice.top, `${label}: A/R Invoice ending starts above its visible window: ${JSON.stringify(invoice)}`);
  assert.ok(invoice.hintBottom <= invoice.bottom + 1, `${label}: A/R Invoice ending is not visible: ${JSON.stringify(invoice)}`);
  assert.ok(invoice.top >= 0, `${label}: A/R Invoice begins above the viewport: ${JSON.stringify(invoice)}`);
  assert.ok(invoice.bottom <= invoice.viewport, `${label}: A/R Invoice extends below the viewport: ${JSON.stringify(invoice)}`);
  return invoice;
}

// Follow the actual reading direction on the main desktop viewport.
const desktop = await makePage({ width: 1280, height: 900 }, 'desktop');
await setProgress(desktop, '.hb-ch3-blueprint', 0.80);
await desktop.waitForFunction(() => document.querySelector('[data-ch3-step="3"]')?.classList.contains('hb-ch3-step--current'));
const payment = await desktop.locator('[data-ch3-step="3"]').evaluate(el => {
  const rect = el.getBoundingClientRect();
  const stage = document.querySelector('.hb-ch3-blueprint [data-sc-stage]').getBoundingClientRect();
  const drawing = document.querySelector('.hb-ch3-blueprint .hb-zeichnung').getBoundingClientRect();
  return { top: rect.top, bottom: rect.bottom, center: rect.top + rect.height / 2, viewport: innerHeight, stageTop: stage.top, stageBottom: stage.bottom, drawingTop: drawing.top, drawingBottom: drawing.bottom };
});
assert.ok(payment.top >= 80, `Payment appears too high in the viewport: ${JSON.stringify(payment)}`);
assert.ok(payment.bottom <= payment.viewport - 130, `Payment appears too low/cut off: ${JSON.stringify(payment)}`);

const firstParagraph = desktop.locator('.hb-wende__text > p').first();
const firstOpacity = Number(await firstParagraph.evaluate(el => getComputedStyle(el).opacity));
assert.ok(firstOpacity >= .95, `First Chapter 3 paragraph should remain visible at Payment, opacity=${firstOpacity}`);

const invoiceDesktop = await measureInvoice(desktop, '1280x900');
await desktop.close();

// Reproduce the invoice on the viewports where an internal max-height is most
// likely to hide its bottom: a short desktop and a common phone viewport.
const shortDesktop = await makePage({ width: 1280, height: 720 }, 'short-desktop');
const invoiceShortDesktop = await measureInvoice(shortDesktop, '1280x720');
await shortDesktop.close();

const mobile = await makePage({ width: 390, height: 844 }, 'mobile');
const invoiceMobile = await measureInvoice(mobile, '390x844');
await mobile.close();

assert.deepEqual(errors, [], 'browser console errors');
console.log(JSON.stringify({ payment, firstOpacity, invoiceDesktop, invoiceShortDesktop, invoiceMobile, errors }, null, 2));
await browser.close();
await new Promise(resolve => server.close(resolve));
