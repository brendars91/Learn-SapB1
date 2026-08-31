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
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const types = { '.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript', '.css':'text/css' };
const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  const target = path.join(root, path.normalize(decodeURIComponent(url.pathname)).replace(/^[/\\]+/, ''));
  if (!target.startsWith(root)) { res.writeHead(403).end(); return; }
  try { const body = await readFile(target); res.writeHead(200, { 'content-type': types[path.extname(target)] || 'application/octet-stream' }).end(body); }
  catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));

const browser = await chromium.launch({ headless:true, executablePath:chromium.executablePath(), args:['--no-sandbox'] });
const entry = `http://127.0.0.1:${server.address().port}/index.html?landing-mobile-ux`;
const reports = [];

async function setPinnedProgress(page, selector, progress) {
  await page.evaluate(({ selector, progress }) => {
    const section = document.querySelector(selector);
    const rect = section.getBoundingClientRect();
    const top = rect.top + scrollY;
    const travel = Math.max(1, rect.height - innerHeight);
    scrollTo({ top: top + travel * progress, left: 0, behavior:'instant' });
  }, { selector, progress });
  await page.waitForFunction(({ selector, progress }) => {
    const actual = Number(getComputedStyle(document.querySelector(selector)).getPropertyValue('--sc-p'));
    return Math.abs(actual - progress) <= .05;
  }, { selector, progress });
}

for (const viewport of [
  { width:320, height:844, label:'320x844' },
  { width:390, height:844, label:'390x844' },
  { width:430, height:932, label:'430x932' },
]) {
  const page = await browser.newPage({ viewport:{ width:viewport.width, height:viewport.height } });
  const errors = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(entry, { waitUntil:'networkidle' });
  await page.waitForFunction(() => document.documentElement.classList.contains('sc-ready'));
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });

  const baseOverflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  assert.ok(baseOverflow <= 1, `${viewport.label}: landing has horizontal overflow ${baseOverflow}`);

  // Chapter 1: case screens must remain genuinely readable on a phone.
  await page.evaluate(() => {
    const chapter = document.querySelector('.hb-ch1-incident');
    scrollTo({ top: chapter.offsetTop + chapter.offsetHeight * .72, behavior:'instant' });
  });
  await page.waitForFunction(() => document.querySelectorAll('[data-ch1-case-screen][data-open]').length === 5);
  const ch1 = await page.locator('[data-ch1-case-screen][data-open]').last().evaluate(el => {
    const rect = el.getBoundingClientRect();
    const header = el.querySelector('header span');
    const dd = el.querySelector('dd');
    const note = el.querySelector('small');
    return {
      left:rect.left, right:rect.right, width:rect.width,
      headerPx:parseFloat(getComputedStyle(header).fontSize),
      valuePx:parseFloat(getComputedStyle(dd).fontSize),
      notePx:parseFloat(getComputedStyle(note).fontSize),
    };
  });
  assert.ok(ch1.left >= 0 && ch1.right <= viewport.width, `${viewport.label}: Chapter 1 case screen leaves viewport ${JSON.stringify(ch1)}`);
  assert.ok(ch1.headerPx >= 10.5 && ch1.valuePx >= 10.5 && ch1.notePx >= 10.5, `${viewport.label}: Chapter 1 text too small ${JSON.stringify(ch1)}`);

  // Chapter 3: phones get a vertical process path, not a desktop SVG shrunk down.
  await setPinnedProgress(page, '.hb-ch3-blueprint', .80);
  // ScrollCraft publishes --sc-p before the landing enhancement's double-RAF
  // frame applies the semantic classes. Wait for the actual UI state, not just
  // the progress variable, so this gate measures what the user sees.
  await page.waitForFunction(() => document.querySelector('[data-ch3-mobile-step="3"]')?.classList.contains('hb-ch3-mobile-step--current'));
  const ch3 = await page.evaluate(() => {
    const mobile = document.querySelector('[data-ch3-mobile-path]');
    const desktop = document.querySelector('.hb-ch3-blueprint .hb-zeichnung');
    const payment = document.querySelector('[data-ch3-mobile-step="3"]');
    const mobileStyle = mobile ? getComputedStyle(mobile) : null;
    const desktopStyle = desktop ? getComputedStyle(desktop) : null;
    const paymentRect = payment?.getBoundingClientRect();
    return {
      mobileDisplay:mobileStyle?.display ?? null,
      desktopDisplay:desktopStyle?.display ?? null,
      paymentCurrent:payment?.classList.contains('hb-ch3-mobile-step--current') ?? false,
      paymentTop:paymentRect?.top ?? null,
      paymentBottom:paymentRect?.bottom ?? null,
      viewport:innerHeight,
    };
  });
  assert.notEqual(ch3.mobileDisplay, null, `${viewport.label}: Chapter 3 mobile path is missing`);
  assert.notEqual(ch3.mobileDisplay, 'none', `${viewport.label}: Chapter 3 mobile path should be visible`);
  assert.equal(ch3.desktopDisplay, 'none', `${viewport.label}: desktop Chapter 3 SVG should not be the phone composition`);
  assert.ok(ch3.paymentCurrent, `${viewport.label}: Payment should become current in mobile path`);
  assert.ok(ch3.paymentTop >= 0 && ch3.paymentBottom <= ch3.viewport - 54, `${viewport.label}: Payment should remain in usable viewport ${JSON.stringify(ch3)}`);

  // Chapter 4: no nested vertical scroll; live controls stay touchable.
  await setPinnedProgress(page, '.hb-peak', .62);
  await page.waitForFunction(() => !document.querySelector('[data-fenster]').hidden);
  const ch4 = await page.evaluate(() => {
    const chain = document.querySelector('.hb-peak .kette');
    const inputs = [...document.querySelectorAll('.hb-peak .fenster input, .hb-peak .fenster select')];
    const table = document.querySelector('.hb-peak .fenster__buchung');
    const chainStyle = getComputedStyle(chain);
    return {
      overflowY:chainStyle.overflowY,
      scrollHeight:chain.scrollHeight,
      clientHeight:chain.clientHeight,
      inputHeights:inputs.map(el => el.getBoundingClientRect().height),
      tablePx:parseFloat(getComputedStyle(table).fontSize),
    };
  });
  assert.notEqual(ch4.overflowY, 'auto', `${viewport.label}: Chapter 4 must not use nested vertical scrolling`);
  assert.notEqual(ch4.overflowY, 'scroll', `${viewport.label}: Chapter 4 must not use nested vertical scrolling`);
  assert.ok(ch4.scrollHeight <= ch4.clientHeight + 1, `${viewport.label}: Chapter 4 chain is internally clipped ${JSON.stringify(ch4)}`);
  assert.ok(ch4.inputHeights.every(height => height >= 44), `${viewport.label}: invoice touch target below 44px ${JSON.stringify(ch4.inputHeights)}`);
  assert.ok(ch4.tablePx >= 10.5, `${viewport.label}: invoice posting table text too small: ${ch4.tablePx}px`);

  // Chapter 5: route becomes a readable vertical progression on phones.
  await page.locator('.hb-ch5-lab').scrollIntoViewIfNeeded();
  const ch5 = await page.evaluate(() => {
    const route = document.querySelector('.hb-route-levels');
    const first = route?.querySelector('article');
    return {
      columns:getComputedStyle(route).gridTemplateColumns.split(' ').filter(Boolean).length,
      firstWidth:first?.getBoundingClientRect().width ?? 0,
      fontPx:first ? parseFloat(getComputedStyle(first.querySelector('span')).fontSize) : 0,
    };
  });
  assert.equal(ch5.columns, 1, `${viewport.label}: Chapter 5 route should be one-column on phones ${JSON.stringify(ch5)}`);
  assert.ok(ch5.firstWidth >= viewport.width * .68, `${viewport.label}: Chapter 5 level row too compressed ${JSON.stringify(ch5)}`);
  assert.ok(ch5.fontPx >= 11, `${viewport.label}: Chapter 5 level text too small ${JSON.stringify(ch5)}`);

  const folioLabHeight = await page.locator('.folio__lab').evaluate(el => el.getBoundingClientRect().height);
  assert.ok(folioLabHeight >= 44, `${viewport.label}: mobile lab CTA touch target is ${folioLabHeight}px`);
  assert.deepEqual(errors, [], `${viewport.label}: browser console errors`);

  reports.push({ viewport:viewport.label, ch1, ch3, ch4, ch5, folioLabHeight, baseOverflow });
  await page.close();
}

console.log(JSON.stringify({ mobileLandingViewports:reports, errors:[] }, null, 2));
await browser.close();
await new Promise(resolve => server.close(resolve));
