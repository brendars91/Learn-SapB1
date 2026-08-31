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
await page.evaluate(() => {
  const chapter = document.querySelector('.hb-ch1-incident');
  scrollTo(0, chapter.offsetTop + chapter.offsetHeight * .72);
});
await page.waitForTimeout(180);

const openScreens = page.locator('.hb-ch1-screens span[data-open]');
assert.ok(await openScreens.count() >= 6, 'cold open should show a visible stack of opened screens');
const visual = await openScreens.last().evaluate(el => {
  const style = getComputedStyle(el);
  const before = getComputedStyle(el, '::before');
  const after = getComputedStyle(el, '::after');
  return {
    backgroundImage: style.backgroundImage,
    beforeContent: before.content,
    afterBackgroundImage: after.backgroundImage,
    overflow: style.overflow,
  };
});
assert.notEqual(visual.backgroundImage, 'none', 'opened screens must not be blank white rectangles');
assert.match(visual.beforeContent, /SAP|Invoice|Order|Delivery|Payment|Relationship|Partner/i, 'mini-window needs a recognisable screen label');
assert.notEqual(visual.afterBackgroundImage, 'none', 'mini-window needs visible internal UI structure');
assert.equal(visual.overflow, 'hidden');

console.log(JSON.stringify({ chapter1:'screen-stack-has-visible-ui', visual }, null, 2));
await browser.close();
await new Promise(resolve => server.close(resolve));
