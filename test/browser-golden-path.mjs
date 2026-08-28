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
const last = new Date(Date.now() - 864e5).toISOString();
const next = new Date(Date.now() + 864e5).toISOString();
await page.addInitScript(({ last, next }) => localStorage.setItem('sap-b1-mastery-lab.v1', JSON.stringify({
  schemaVersion: 1, classification: 'synthetic-progress', locale: 'es', track: 'dual',
  progress: { 'SYN-SK-L0-08': { knowledge: 100, application: 100, verification: 100, risk: 100, mastery: 100, mastered: false, explored: true, streak: 2, correctAttempts: 2, safetyGatePassed: true, lastPractised: last, nextReview: next } },
  settings: { diagnosticCompleted: true, diagnosticScore: 0, recommendedLevel: 0, selectedSkillId: 'SYN-SK-L0-08' }
})), { last, next });
await page.goto(`http://127.0.0.1:${server.address().port}/lab/index.html`, { waitUntil: 'networkidle' });

// 1. El escritorio del día despierta con racha viva y sin repasos vencidos
const desk = await page.locator('.sbl-desk').innerText();
assert.match(desk, /RACHA · \d+D/);
assert.doesNotMatch(desk, /Repasos de hoy: [1-9]/);
// 2. La espina muestra el nivel con progreso
assert.equal(await page.locator('.sbl-spine-node.is-progress').count(), 1);
// 3. Un clic abre el capítulo exacto
await page.locator('.sbl-spine-node').nth(0).click();
assert.equal(await page.locator('.sbl-level-group').count(), 1);
// 4. La ficha ya no se monta sin petición; la card abre la ficha
assert.equal(await page.locator('article[aria-labelledby="skill-title"]').count(), 0);
await page.locator('[data-skill="SYN-SK-L0-08"]').first().click();
assert.ok((await page.locator('article[aria-labelledby="skill-title"]').boundingBox()) !== null);
// 5. Demostrar dominio → tercera recuperación verificada → entrada iluminada
await page.locator('.sbl-mode-toggle [data-mode="prove"]').click();
await page.locator('.act-clue').nth(3).click();
await page.locator('[data-action="check-activity"]').click();
const dialog = page.locator('.sbl-mastery-moment');
await dialog.waitFor();
assert.match(await dialog.innerText(), /Dominada|beherrscht|mastered/i);
await page.locator('[data-action="clear-mastery-moment"]').click();
// 6. El ledger reclamó su entrada: card dominada, porcentaje vivo, cero deudas
const card = await page.locator('[data-skill="SYN-SK-L0-08"]').first().getAttribute('class');
assert.match(card, /is-mastered/);
assert.equal(await page.locator('.sbl-level-progress span').first().evaluate(el => el.style.width), '13%');
assert.equal(await page.locator('.sbl-review-banner').count(), 0);
// 7. El escritorio refleja el nuevo estado tras volver
await page.locator('[data-view="home"]').click();
assert.match(await page.locator('.sbl-desk').innerText(), /RACHA · \d+D/);
assert.deepEqual(errors, []);
console.log(JSON.stringify({ goldenPath: 'completo', dialog: true, card: 'is-mastered', errors: [] }, null, 2));
await browser.close();
await new Promise(resolve => server.close(resolve));
