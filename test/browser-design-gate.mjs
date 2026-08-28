import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const req = createRequire(import.meta.url);
const { chromium } = req('playwright');
const ROOT = process.cwd();
const TYPES = { '.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.css':'text/css','.json':'application/json' };
const server = createServer(async (rq, rs) => {
  const u = new URL(rq.url, 'http://127.0.0.1');
  const file = path.join(ROOT, path.normalize(decodeURIComponent(u.pathname)).replace(/^[/\\]+/,''));
  if (!file.startsWith(ROOT)) return rs.writeHead(403).end();
  try { rs.writeHead(200, {'content-type': TYPES[path.extname(file)] || 'application/octet-stream'}).end(await readFile(file)); }
  catch { rs.writeHead(404).end(); }
});
await new Promise(r => server.listen(0,'127.0.0.1',r));
const ENTRYPOINT = `http://127.0.0.1:${server.address().port}/lab/index.html`;
const browser = await chromium.launch({ headless:true, args:['--no-sandbox'] });
const errors=[];

// ─── T1.4 computed-contract ────────────────────────────────────
const page = await browser.newPage({ viewport:{width:1440,height:900} });
page.on('console', m => { if(m.type()==='error') errors.push(m.text()); });
page.on('pageerror', e => errors.push(e.message));
await page.goto(ENTRYPOINT, {waitUntil:'networkidle'});
await page.locator('#sap-b1-mastery-lab').waitFor();
const heat = await page.locator('.sbl-heat-cell').first().evaluate(el => {
  const s=getComputedStyle(el), n=getComputedStyle(el.querySelector('.sbl-heat-num'));
  return {display:s.display,border:s.borderTopWidth,bg:s.backgroundColor,gap:s.gap,numDisplay:n.display,text:el.innerText};
});
assert.equal(heat.display,'grid','T1.4 heat-cell must be grid');
assert.notEqual(heat.border,'0px','T1.4 heat-cell needs boundary');
assert.notEqual(heat.bg,'rgba(0, 0, 0, 0)','T1.4 heat-cell needs surface');
assert.notEqual(heat.gap,'normal','T1.4 number and label must be separated');
assert.ok(/^0\n/.test(heat.text),'T1.4 number and label occupy separate rows');

// ─── T1.6 touch floor + T1.7 overflow at five widths ──────────
const responsive=[];
for (const width of [320,390,768,1024,1440]) {
  await page.setViewportSize({width,height:900});
  await page.reload({waitUntil:'networkidle'});
  const r=await page.evaluate(() => {
    const root=document.documentElement;
    const primary=[...document.querySelectorAll('.btn-primary')].filter(e=>e.offsetParent!==null).map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}));
    return {overflow:root.scrollWidth-root.clientWidth, primary};
  });
  responsive.push({width,...r});
  // F7 flipa overflow a enforcement; F0 lo registra para encontrar el responsable.
  if (r.overflow>1) {
    r.offenders=await page.evaluate(()=>[...document.querySelectorAll('body *')]
      .filter(e=>{const b=e.getBoundingClientRect();return b.right>document.documentElement.clientWidth+1||b.left<-1;})
      .slice(0,10).map(e=>({tag:e.tagName,cls:e.className,right:Math.round(e.getBoundingClientRect().right),left:Math.round(e.getBoundingClientRect().left)})));
  }
  for(const b of r.primary) assert.ok(b.h>=24&&b.w>=24,`T1.6 touch floor @${width}: ${b.w}x${b.h}`);
}

// ─── T1.8 visible focus ────────────────────────────────────────
await page.setViewportSize({width:1440,height:900}); await page.reload({waitUntil:'networkidle'});
await page.keyboard.press('Tab');
const focus=await page.evaluate(()=>{const e=document.activeElement,s=getComputedStyle(e);return {tag:e.tagName,outline:s.outlineStyle,shadow:s.boxShadow};});
assert.ok(focus.outline!=='none'||focus.shadow!=='none',`T1.8 no visible focus on ${focus.tag}`);

// ─── T1.9 reduced motion ───────────────────────────────────────
await page.emulateMedia({reducedMotion:'reduce'}); await page.reload({waitUntil:'networkidle'});
const motion=await page.locator('.sbl-heat-cell').first().evaluate(el=>getComputedStyle(el).transitionDuration);
// F5 flips this from report to enforcement. For now report exact value.
const findings={heat,responsive,focus,reducedMotion:motion,errors};
console.log(JSON.stringify(findings,null,2));
assert.deepEqual(errors,[],'browser console errors');

await browser.close(); await new Promise(r=>server.close(r));
