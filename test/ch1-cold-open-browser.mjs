import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css' };
const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  const target = path.join(root, path.normalize(url.pathname).replace(/^[/\\]+/, ''));
  try {
    const body = await readFile(target);
    res.writeHead(200, { 'content-type': types[path.extname(target)] || 'application/octet-stream' }).end(body);
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));

const browser = await chromium.launch({ headless:true, args:['--no-sandbox'] });
const page = await browser.newPage({ viewport:{ width:1280, height:900 } });
// The reduced-motion path intentionally resolves the cold open immediately to
// its final narrative state. That lets this gate validate the real production
// runtime without racing scroll-driven updates or CSS transitions in CI.
await page.emulateMedia({ reducedMotion:'reduce' });
await page.goto(`http://127.0.0.1:${server.address().port}/index.html`, { waitUntil:'networkidle' });
await page.waitForFunction(() => document.documentElement.classList.contains('sc-ready'));

const screens = page.locator('[data-ch1-case-screen]');
assert.equal(await screens.count(), 5, 'cold open should use five meaningful case screens rather than eleven empty rectangles');

const labels = await screens.evaluateAll(nodes => nodes.map(node => node.textContent.replace(/\s+/g, ' ').trim()));
assert.ok(labels.some(text => /Business Partner/i.test(text) && /C20000/i.test(text)), 'case should start from Business Partner C20000');
assert.ok(labels.some(text => /Relationship Map/i.test(text) && /Sales Order/i.test(text) && /Delivery/i.test(text) && /A\/R Invoice/i.test(text)), 'relationship map should communicate the document trail');
assert.ok(labels.some(text => /Sales Order/i.test(text) && /C20000/i.test(text)), 'Sales Order should stay tied to C20000');
assert.ok(labels.some(text => /Delivery/i.test(text) && /Sales Order/i.test(text)), 'Delivery should visibly reference its base Sales Order');
assert.ok(labels.some(text => /A\/R Invoice/i.test(text) && /1001-2026/i.test(text) && /C20000/i.test(text)), 'target invoice should be visibly identifiable');

await page.waitForFunction(() => {
  const cards = [...document.querySelectorAll('[data-ch1-case-screen]')];
  const count = document.querySelector('[data-ch1-screen-count]')?.textContent?.trim();
  const more = document.querySelector('[data-ch1-more]');
  return cards.length === 5 && cards.every(card => card.hasAttribute('data-open')) &&
    count === '11' && more && !more.hidden && more.textContent.trim() === '+6 more';
});

const geometry = await screens.evaluateAll(nodes => nodes.map(node => {
  const rect = node.getBoundingClientRect();
  const style = getComputedStyle(node);
  return { width: rect.width, height: rect.height, opacity: Number(style.opacity), visibility: style.visibility };
}));
assert.ok(geometry.every(item => item.width >= 230 && item.height >= 120 && item.opacity >= .95 && item.visibility !== 'hidden'), `case screens must remain readable: ${JSON.stringify(geometry)}`);

const more = page.locator('[data-ch1-more]');
assert.equal(await more.count(), 1, 'cold open should have one overflow counter');
assert.equal((await more.textContent()).trim(), '+6 more', 'eleven open screens should be summarized without rendering eleven cards');

console.log(JSON.stringify({ chapter1:'contextual-case-screens', labels, geometry, overflow: await more.textContent() }, null, 2));
await browser.close();
await new Promise(resolve => server.close(resolve));
