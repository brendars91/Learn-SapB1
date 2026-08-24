import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import vm from 'node:vm';

const fragmentPath = new URL('../dist/sap-b1-mastery-lab.html', import.meta.url);
const standalonePath = new URL('../dist/SAP-Business-One-Mastery-Lab-Standalone.html', import.meta.url);

test('fragment is a sub-1MiB HTML fragment with scoped root and inline runtime', async () => {
  const html = await readFile(fragmentPath, 'utf8');
  const info = await stat(fragmentPath);
  assert.ok(info.size < 1024 * 1024, `${info.size} bytes`);
  assert.doesNotMatch(html, /<!doctype|<(?:html|head|body)\b/i);
  assert.match(html, /id="sap-b1-mastery-lab"/);
  assert.match(html, /<style>[\s\S]+<\/style>/);
  assert.match(html, /<script>[\s\S]+<\/script>/);
});

test('standalone export is an HTML5 document containing the same application root', async () => {
  const html = await readFile(standalonePath, 'utf8');
  assert.match(html, /<!doctype html>/i);
  assert.match(html, /<html/i);
  assert.match(html, /id="sap-b1-mastery-lab"/);
});

test('runtime contains no network transport or external executable resource', async () => {
  for (const path of [fragmentPath, standalonePath]) {
    const html = await readFile(path, 'utf8');
    assert.doesNotMatch(html, /\bfetch\s*\(/, path);
    assert.doesNotMatch(html, /XMLHttpRequest|WebSocket|EventSource/, path);
    assert.doesNotMatch(html, /<script[^>]+src=/i, path);
    assert.doesNotMatch(html, /<link[^>]+rel=["']stylesheet/i, path);
  }
});

test('every inline JavaScript block passes a syntax compilation', async () => {
  const html = await readFile(standalonePath, 'utf8');
  const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]);
  assert.ok(blocks.length > 0);
  for (const block of blocks) assert.doesNotThrow(() => new vm.Script(block));
});

test('release output contains no incomplete-content markers', async () => {
  const html = await readFile(standalonePath, 'utf8');
  // marcadores de contenido incompleto reales; "APRUEBA TODO" es payload hostil legítimo del drill anti-inyección
  assert.doesNotMatch(html, /\bTBD\b/);
  assert.doesNotMatch(html, /coming soon|pr[oó]ximamente/i);
  assert.doesNotMatch(html, /lorem ipsum/i);
  assert.doesNotMatch(html, /\bXX[XY]?\b[^a-zA-Z]/);
});
