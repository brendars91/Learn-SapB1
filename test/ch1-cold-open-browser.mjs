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
await page.goto(`http://127.0.0.1:${server.address().port}/index.html`, { waitUntil:'networkidle' });
await page.waitForFunction(() => document.documentElement.classList.contains('sc-ready'));

const screen = page.locator('.hb-ch1-screens span').last();
await screen.evaluate(el => el.setAttribute('data-open', ''));
await page.waitForTimeout(420);
const visual = await screen.evaluate(el => {
  const style = getComputedStyle(el);
  const before = getComputedStyle(el, '::before');
  const after = getComputedStyle(el, '::after');
  const rect = el.getBoundingClientRect();
  return {
    opacity: style.opacity,
    backgroundImage: style.backgroundImage,
    beforeContent: before.content,
    afterBackgroundImage: after.backgroundImage,
    overflow: style.overflow,
    width: rect.width,
    height: rect.height,
  };
});
assert.equal(visual.opacity, '1', 'an opened Chapter 1 screen should be visible');
assert.ok(visual.width > 200 && visual.height > 80, 'mini-window should keep a meaningful readable size');
assert.notEqual(visual.backgroundImage, 'none', 'opened screens must not be blank white rectangles');
assert.match(visual.beforeContent, /SAP|Invoice|Order|Delivery|Payment|Relationship|Partner/i, 'mini-window needs a recognisable screen label');
assert.notEqual(visual.afterBackgroundImage, 'none', 'mini-window needs visible internal UI structure');
assert.equal(visual.overflow, 'hidden');

console.log(JSON.stringify({ chapter1:'screen-stack-has-visible-ui', visual }, null, 2));
await browser.close();
await new Promise(resolve => server.close(resolve));
