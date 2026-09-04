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
  try {
    const body = await readFile(target);
    res.writeHead(200, { 'content-type': types[path.extname(target)] || 'application/octet-stream' }).end(body);
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));

const browser = await chromium.launch({ headless:true, executablePath:chromium.executablePath(), args:['--no-sandbox'] });
const entry = `http://127.0.0.1:${server.address().port}/index.html?mobile-visual-polish`;
const reports = [];

async function setProgress(page, selector, progress) {
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
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

for (const viewport of [
  { width:390, height:844, label:'phone-390' },
  { width:768, height:1024, label:'wide-mobile-768' },
  { width:820, height:1180, label:'wide-mobile-820' },
]) {
  const context = await browser.newContext({
    viewport:{ width:viewport.width, height:viewport.height },
    screen:{ width:viewport.width, height:viewport.height },
    deviceScaleFactor:2,
    isMobile:true,
    hasTouch:true,
  });
  const page = await context.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(entry, { waitUntil:'networkidle' });
  await page.waitForFunction(() => document.documentElement.classList.contains('sc-ready'));
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });

  const responsiveStyles = await page.evaluate(() => [...document.styleSheets]
    .map(sheet => sheet.href)
    .filter(Boolean)
    .filter(href => /chapter1-case-screens|chapter3-handoff|chapter4-cumulative/.test(href)));
  for (const name of ['chapter1-case-screens.css', 'chapter3-handoff.css', 'chapter4-cumulative.css']) {
    const href = responsiveStyles.find(item => item.includes(name));
    assert.ok(href, `${viewport.label}: ${name} was not loaded`);
    assert.match(href, /[?&]v=/, `${viewport.label}: ${name} needs a versioned URL so phones do not reuse stale responsive CSS: ${href}`);
  }

  const shell = await page.evaluate(() => ({
    innerWidth,
    overflow: document.documentElement.scrollWidth - innerWidth,
    folio: (() => {
      const r = document.querySelector('.folio').getBoundingClientRect();
      return { top:r.top, bottom:r.bottom, left:r.left, right:r.right, width:r.width, height:r.height };
    })(),
  }));
  assert.ok(shell.overflow <= 1, `${viewport.label}: horizontal overflow ${JSON.stringify(shell)}`);
  assert.ok(shell.folio.top > viewport.height * .82, `${viewport.label}: mobile folio should be a bottom bar ${JSON.stringify(shell.folio)}`);

  await page.evaluate(() => {
    const chapter = document.querySelector('.hb-ch1-incident');
    scrollTo({ top: chapter.offsetTop + chapter.offsetHeight * .72, behavior:'instant' });
  });
  await page.waitForFunction(() => document.querySelectorAll('[data-ch1-case-screen][data-open]').length === 5);
  const ch1 = await page.locator('[data-ch1-case-screen][data-open]').last().evaluate(el => {
    const r = el.getBoundingClientRect();
    const sizes = [...el.querySelectorAll('header, dt, dd, small, .hb-case-screen__note')]
      .map(node => parseFloat(getComputedStyle(node).fontSize));
    return { left:r.left, right:r.right, width:r.width, minTextPx:Math.min(...sizes) };
  });
  assert.ok(ch1.left >= 0 && ch1.right <= viewport.width, `${viewport.label}: Chapter 1 case screen clipped ${JSON.stringify(ch1)}`);
  assert.ok(ch1.minTextPx >= 10.5, `${viewport.label}: Chapter 1 contains sub-10.5px UI text ${JSON.stringify(ch1)}`);

  await setProgress(page, '.hb-ch3-blueprint', .80);
  await page.waitForFunction(() => document.querySelector('[data-ch3-mobile-step="3"]')?.classList.contains('hb-ch3-mobile-step--current'));
  const ch3 = await page.evaluate(() => {
    const headingEl = document.querySelector('.hb-ch3-blueprint .hb-kaphead__h2');
    const heading = document.querySelector('.hb-ch3-blueprint .hb-kaphead').getBoundingClientRect();
    const desktop = document.querySelector('.hb-ch3-blueprint .hb-zeichnung');
    const mobile = document.querySelector('[data-ch3-mobile-path]');
    const mobileRect = mobile?.getBoundingClientRect();
    const payment = document.querySelector('[data-ch3-mobile-step="3"]')?.getBoundingClientRect();
    const folio = document.querySelector('.folio').getBoundingClientRect();
    return {
      desktopDisplay:getComputedStyle(desktop).display,
      mobileDisplay:mobile ? getComputedStyle(mobile).display : null,
      headingOpacity:Number(getComputedStyle(headingEl).opacity),
      headingBottom:heading.bottom,
      mobileTop:mobileRect?.top ?? null,
      mobileBottom:mobileRect?.bottom ?? null,
      paymentTop:payment?.top ?? null,
      paymentBottom:payment?.bottom ?? null,
      folioTop:folio.top,
    };
  });
  assert.equal(ch3.desktopDisplay, 'none', `${viewport.label}: Chapter 3 desktop SVG is still visible ${JSON.stringify(ch3)}`);
  assert.ok(ch3.mobileDisplay && ch3.mobileDisplay !== 'none', `${viewport.label}: Chapter 3 mobile path missing ${JSON.stringify(ch3)}`);
  assert.ok(ch3.headingOpacity >= .85, `${viewport.label}: Chapter 3 heading becomes too faint ${JSON.stringify(ch3)}`);
  assert.ok(ch3.mobileTop - ch3.headingBottom <= viewport.height * .14, `${viewport.label}: Chapter 3 wastes too much vertical space before the path ${JSON.stringify(ch3)}`);
  assert.ok(ch3.paymentTop >= 0 && ch3.paymentBottom <= ch3.folioTop - 8, `${viewport.label}: Payment is clipped/covered ${JSON.stringify(ch3)}`);

  await setProgress(page, '.hb-peak', 1.0);
  await page.waitForFunction(() => !document.querySelector('[data-fenster]').hidden);
  const ch4 = await page.evaluate(() => {
    const invoice = document.querySelector('[data-fenster]').getBoundingClientRect();
    const chain = document.querySelector('.hb-peak .kette');
    const folio = document.querySelector('.folio').getBoundingClientRect();
    const inputs = [...document.querySelectorAll('.hb-peak .fenster input, .hb-peak .fenster select')];
    return {
      invoice:{ left:invoice.left, right:invoice.right, top:invoice.top, bottom:invoice.bottom },
      folioTop:folio.top,
      overflowY:getComputedStyle(chain).overflowY,
      touch:inputs.map(el => el.getBoundingClientRect().height),
    };
  });
  assert.ok(ch4.invoice.left >= 0 && ch4.invoice.right <= viewport.width, `${viewport.label}: invoice horizontally clipped ${JSON.stringify(ch4)}`);
  assert.ok(ch4.invoice.bottom <= ch4.folioTop - 4, `${viewport.label}: invoice covered by bottom folio ${JSON.stringify(ch4)}`);
  assert.notEqual(ch4.overflowY, 'auto', `${viewport.label}: nested scroll returned in Chapter 4`);
  assert.ok(ch4.touch.every(h => h >= 44), `${viewport.label}: Chapter 4 touch target below 44px ${JSON.stringify(ch4.touch)}`);

  await page.locator('.hb-ch5-lab').scrollIntoViewIfNeeded();
  const ch5 = await page.evaluate(() => {
    const route = document.querySelector('.hb-route-levels');
    const first = route.querySelector('article');
    const r = route.getBoundingClientRect();
    return {
      columns:getComputedStyle(route).gridTemplateColumns.split(' ').filter(Boolean).length,
      left:r.left,
      right:r.right,
      firstWidth:first.getBoundingClientRect().width,
      fontPx:parseFloat(getComputedStyle(first.querySelector('span')).fontSize),
    };
  });
  assert.equal(ch5.columns, 1, `${viewport.label}: Chapter 5 is still compressed into multiple columns ${JSON.stringify(ch5)}`);
  assert.ok(ch5.left >= 0 && ch5.right <= viewport.width, `${viewport.label}: Chapter 5 route clipped ${JSON.stringify(ch5)}`);
  assert.ok(ch5.fontPx >= 11, `${viewport.label}: Chapter 5 route text too small ${JSON.stringify(ch5)}`);

  assert.deepEqual(errors, [], `${viewport.label}: browser errors`);
  reports.push({ viewport:viewport.label, responsiveStyles, shell, ch1, ch3, ch4, ch5 });
  await context.close();
}

console.log(JSON.stringify({ mobileVisualPolish:reports }, null, 2));
await browser.close();
await new Promise(resolve => server.close(resolve));
