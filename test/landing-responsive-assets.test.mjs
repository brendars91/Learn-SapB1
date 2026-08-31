import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const handbuch = await readFile(new URL('../handbuch.js', import.meta.url), 'utf8');
const storytelling = await readFile(new URL('../landing-storytelling.js', import.meta.url), 'utf8');

test('dynamically loaded responsive landing styles use cache-busting versions', () => {
  assert.match(handbuch, /chapter3-handoff\.css\?v=[A-Za-z0-9._-]+/, 'Chapter 3 responsive CSS needs a versioned URL');
  assert.match(handbuch, /chapter4-cumulative\.css\?v=[A-Za-z0-9._-]+/, 'Chapter 4 responsive CSS needs a versioned URL');
  assert.match(storytelling, /chapter1-case-screens\.css\?v=[A-Za-z0-9._-]+/, 'Chapter 1 responsive CSS needs a versioned URL');
});
