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
await page.goto(`${entrypoint}?chapter3-browser-gate`, { waitUntil: 'networkidle' });
await page.locator('.hb-ch3-blueprint').waitFor();
await page.waitForFunction(() => document.documentElement.classList.contains('sc-ready') && window.ScrollCraft?.instances?.length > 0);
await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });

async function setProgress(progress) {
  await page.evaluate(p => {
    const chapter = document.querySelector('.hb-ch3-blueprint');
    const rect = chapter.getBoundingClientRect();
    const top = rect.top + scrollY;
    const travel = Math.max(1, rect.height - innerHeight);
    scrollTo({ top: top + travel * p, left: 0, behavior: 'instant' });
  }, progress);
  await page.waitForFunction(p => {
    const chapter = document.querySelector('.hb-ch3-blueprint');
    const actual = Number(getComputedStyle(chapter).getPropertyValue('--sc-p'));
    return Math.abs(actual - p) <= 0.035;
  }, progress);
}

async function waitForSettledState(activeIndex) {
  await page.waitForFunction(index => {
    const steps = [...document.querySelectorAll('[data-ch3-step]')];
    const connectors = [...document.querySelectorAll('[data-ch3-connector]')];
    const stepStatesOk = steps.every((step, i) => {
      const opacity = Number(getComputedStyle(step).opacity);
      if (i < index) return step.classList.contains('hb-ch3-step--past') && opacity >= 0.9;
      if (i === index) return step.classList.contains('hb-ch3-step--current') && opacity >= 0.9;
      return step.classList.contains('hb-ch3-step--future') && opacity <= 0.08;
    });
    const connectorStatesOk = connectors.every((connector, i) => {
      const opacity = Number(getComputedStyle(connector).opacity);
      return i < index
        ? connector.classList.contains('hb-ch3-connector--on') && opacity >= 0.9
        : !connector.classList.contains('hb-ch3-connector--on') && opacity <= 0.08;
    });
    return stepStatesOk && connectorStatesOk;
  }, activeIndex);
}

async function state() {
  return page.evaluate(() => ({
    steps: [...document.querySelectorAll('[data-ch3-step]')].map(step => ({
      classes: [...step.classList],
      opacity: Number(getComputedStyle(step).opacity)
    })),
    connectors: [...document.querySelectorAll('[data-ch3-connector]')].map(connector => ({
      classes: [...connector.classList],
      opacity: Number(getComputedStyle(connector).opacity)
    }))
  }));
}

await setProgress(0.12);
await waitForSettledState(0);
let s = await state();
assert.ok(s.steps[0].classes.includes('hb-ch3-step--current'), 'Sales Order should be current first');
assert.ok(s.steps.slice(1).every(step => step.classes.includes('hb-ch3-step--future') && step.opacity <= 0.08), 'future documents should stay hidden before their turn');
assert.ok(s.connectors.every(connector => connector.opacity <= 0.08), 'handoff connectors should be hidden before completion');

await setProgress(0.40);
await waitForSettledState(1);
s = await state();
assert.ok(s.steps[0].classes.includes('hb-ch3-step--past'), 'Sales Order should remain as a completed step');
assert.ok(s.steps[1].classes.includes('hb-ch3-step--current'), 'Delivery should become current second');
assert.ok(s.connectors[0].classes.includes('hb-ch3-connector--on') && s.connectors[0].opacity >= 0.9, 'Sales Order should hand off visibly to Delivery');
assert.ok(s.steps[2].opacity <= 0.08 && s.steps[3].opacity <= 0.08, 'Invoice and Payment should still be hidden');

await setProgress(0.68);
await waitForSettledState(2);
s = await state();
assert.ok(s.steps[2].classes.includes('hb-ch3-step--current'), 'Invoice should become current third');
assert.ok(s.steps[0].opacity >= 0.9 && s.steps[1].opacity >= 0.9, 'completed steps should remain visible');
assert.ok(s.connectors[0].opacity >= 0.9 && s.connectors[1].opacity >= 0.9, 'completed handoffs should remain visible');

await setProgress(0.92);
await waitForSettledState(3);
s = await state();
assert.ok(s.steps[3].classes.includes('hb-ch3-step--current'), 'Payment should be the final current step');
assert.ok(s.steps.slice(0, 3).every(step => step.classes.includes('hb-ch3-step--past') && step.opacity >= 0.9), 'all previous documents should remain completed and visible');
assert.ok(s.connectors.every(connector => connector.classes.includes('hb-ch3-connector--on') && connector.opacity >= 0.9), 'the complete handoff path should remain visible');

assert.deepEqual(errors, [], 'Chapter 3 browser console errors');
console.log(JSON.stringify({ chapter3: 'sequential-processed-handoff', errors }, null, 2));
await browser.close();
await new Promise(resolve => server.close(resolve));
