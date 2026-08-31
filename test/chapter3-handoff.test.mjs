import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('Chapter 3 presents the four document steps in order with English-only handoff states', () => {
  const chapter = html.match(/<section class="hb-chapter hb-chapter--paper hb-ch3-blueprint"[\s\S]*?<\/section>/)?.[0];
  assert.ok(chapter, 'Chapter 3 should exist');

  const expected = ['Sales Order', 'Delivery', 'Invoice', 'Payment'];
  const actual = [...chapter.matchAll(/data-ch3-step="\d+"[\s\S]*?<text[^>]*>([^<]+)<\/text>/g)].map(match => match[1].trim());
  assert.deepEqual(actual, expected, 'Chapter 3 steps should be explicit and ordered');

  assert.equal((chapter.match(/data-ch3-connector=/g) || []).length, 3, 'each completed step should hand off to the next');
  assert.equal((chapter.match(/>Processed</g) || []).length, 4, 'all completion stamps should use the English label Processed');
  assert.doesNotMatch(chapter, /Completado|Procesado|Abgeschlossen|Erledigt|Fertig/i, 'Chapter 3 should not introduce non-English state labels');
  assert.doesNotMatch(chapter, /M60 150 H840/, 'the old line that visually strikes through all documents must be removed');
});
