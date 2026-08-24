import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const sources = [
  'src/career.mjs',
  'src/masterclass.mjs',
  'src/masterclass-data-1.mjs',
  'src/masterclass-data-2.mjs',
  'src/masterclass-data-3.mjs',
  'src/masterclass-data-4.mjs',
  'src/masterclass-data-5.mjs',
  'src/masterclass-data-6.mjs'
];

test('published scenarios contain no internship or client identifiers', async () => {
  const forbidden = /konsultec|bergisch gladbach|\bbonn\b|hauptstr\. 14|industriestr\. 2/i;
  for (const file of sources) {
    const text = await readFile(file, 'utf8');
    assert.equal(forbidden.test(text), false, file);
  }
});

test('career company is explicitly synthetic', async () => {
  const text = await readFile('src/career.mjs', 'utf8');
  assert.match(text, /SYN-Nordlicht Demo/);
  assert.match(text, /empresa ficticia|fictional|fiktiven/);
});
