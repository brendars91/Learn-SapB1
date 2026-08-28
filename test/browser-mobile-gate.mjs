import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = path.resolve(import.meta.dirname, '..');
const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://local');
  const file = path.join(root, path.normalize(decodeURIComponent(url.pathname)).replace(/^[/\\]+/, ''));
  try {
    res.writeHead(200, { 'content-type': file.endsWith('.css') ? 'text/css' : file.endsWith('.mjs') ? 'text/javascript' : 'text/html' });
    res.end(await readFile(file));
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const results = [];
for (const width of [320, 390]) {
  for (const locale of ['es', 'en', 'de']) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/lab/index.html`, { waitUntil: 'networkidle' });
    await page.locator('[data-action="locale"]').selectOption(locale);
    const views = [];
    for (const view of ['home', 'map']) {
      await page.locator(`[data-view="${view}"]`).click();
      const measure = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        targets: [...document.querySelectorAll('button:not(:disabled), select, input')]
          .filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.left < innerWidth && r.right > 0; })
          .map(el => Math.round(el.getBoundingClientRect().height))
      }));
      assert.equal(measure.overflow, 0, `${locale} ${width}px ${view} overflow`);
      assert.ok(measure.targets.every(height => height >= 44), `${locale} ${width}px ${view} target below 44px: ${Math.min(...measure.targets)}`);
      // Detector de texto triturado: >=25 chars propios en columna <64px y alta
      // >120px = texto colapsado letra-a-letra (regresión real detectada 28-Aug).
      const crushed = await page.evaluate(() => {
        const bad = [];
        for (const el of document.querySelectorAll('main *')) {
          const rect = el.getBoundingClientRect(); if (!rect.width || !rect.height) continue;
          const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ');
          if (own.length >= 25 && rect.width < 64 && rect.height > 120) bad.push(el.className?.toString().slice(0, 40) || el.tagName);
        }
        return bad;
      });
      assert.deepEqual(crushed, [], `${locale} ${width}px ${view}: texto triturado ${JSON.stringify(crushed)}`);
      views.push({ view, ...measure });
    }
    await page.locator('.sbl-node').first().click();
    const detailOverflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    assert.equal(detailOverflow, 0, `${locale} ${width}px detail overflow`);
    assert.deepEqual(errors, []);
    results.push({ width, locale, views: views.map(({ view, overflow }) => ({ view, overflow })), detailOverflow });
    await page.close();
  }
}
console.log(JSON.stringify(results, null, 2));
await browser.close();
await new Promise(resolve => server.close(resolve));
