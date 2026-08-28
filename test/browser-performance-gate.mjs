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
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.goto(`http://127.0.0.1:${server.address().port}/lab/index.html`, { waitUntil: 'networkidle' });
await page.evaluate(() => {
  window.__perf = { longtasks: [], shifts: [] };
  try { new PerformanceObserver(list => window.__perf.longtasks.push(...list.getEntries().map(e => ({ start: e.startTime, duration: e.duration })))).observe({ type: 'longtask', buffered: false }); } catch {}
  try { new PerformanceObserver(list => window.__perf.shifts.push(...list.getEntries().filter(e => !e.hadRecentInput).map(e => e.value))).observe({ type: 'layout-shift', buffered: false }); } catch {}
});
const actions = [
  () => page.locator('[data-view="map"]').click(),
  () => page.locator('.sbl-node').nth(17).click(),
  () => page.locator('.sbl-mode-toggle [data-mode="prove"]').click(),
  () => page.locator('[data-view="home"]').click(),
  () => page.locator('.sbl-spine-node').nth(8).click()
];
const timings = [];
for (const [index, action] of actions.entries()) {
  await page.evaluate(index => performance.mark(`action-${index}`), index);
  const start = performance.now();
  await action();
  await page.evaluate(() => new Promise(requestAnimationFrame));
  timings.push(performance.now() - start);
}
await page.waitForTimeout(250);
const metrics = await page.evaluate(() => ({
  longtasks: window.__perf.longtasks,
  marks: performance.getEntriesByType('mark').filter(e => e.name.startsWith('action-')).map(e => ({ name: e.name, start: e.startTime })),
  cls: window.__perf.shifts.reduce((sum, value) => sum + value, 0),
  heap: performance.memory?.usedJSHeapSize ?? null,
  resources: performance.getEntriesByType('resource').length
}));
assert.ok(metrics.longtasks.every(entry => entry.duration < 50), `long task: ${Math.max(0, ...metrics.longtasks.map(entry => entry.duration))}ms`);
assert.ok(Math.max(...timings) < 250, `slow interaction: ${Math.max(...timings)}ms`);
assert.ok(metrics.cls < 0.01, `unexpected CLS: ${metrics.cls}`);
assert.deepEqual(errors, []);
console.log(JSON.stringify({ timings: timings.map(value => Math.round(value)), maxInteraction: Math.round(Math.max(...timings)), longtasks: metrics.longtasks, cls: metrics.cls, heap: metrics.heap, resources: metrics.resources, errors }, null, 2));
await browser.close();
await new Promise(resolve => server.close(resolve));
