import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

function section(className) {
  const match = html.match(new RegExp(`<section[^>]*class="[^"]*${className}[^"]*"[\\s\\S]*?<\\/section>`));
  assert.ok(match, `${className} section should exist`);
  return match[0];
}

test('landing exposes causal folio state hooks for stock, ledger and balance', () => {
  assert.match(html, /data-folio-effect="stock"/);
  assert.match(html, /data-folio-effect="ledger"/);
  assert.match(html, /data-folio-effect="balance"/);
});

test('Chapter 1 contains an experiential eleven-screen cold open', () => {
  const chapter = section('hb-ch1-incident');
  assert.match(chapter, /data-ch1-screen-count/);
  assert.match(chapter, /<span><\/span><span><\/span><span><\/span>/);
  assert.match(chapter, /The system isn(?:&rsquo;|')t broken\./);
  assert.match(chapter, /The question is wrong\./);
});

test('Chapter 2 connects document state to accounting consequence', () => {
  const chapter = section('hb-ch2-cost');
  assert.match(chapter, /Draft/);
  assert.match(chapter, /no posting/i);
  assert.match(chapter, /A\/R Invoice/);
  assert.match(chapter, /ledger/i);
});

test('Chapter 3 has transient business impact traces', () => {
  const chapter = section('hb-ch3-blueprint');
  assert.match(chapter, /Stock [−-]12/);
  assert.match(chapter, /A\/R \+856\.80/);
  assert.match(chapter, /Balance 0\.00/);
});

test('Chapter 4 explicitly invites a live edit and explains the semantic cut to ink', () => {
  const chapter = section('hb-peak');
  assert.match(chapter, /LIVE DOCUMENT/);
  assert.match(chapter, /EDIT A VALUE/);
  assert.match(html, /Enough theory\. Follow the transaction\./);
});

test('the pause is reduced to a single transaction-focused line', () => {
  const pause = section('hb-atem');
  assert.match(pause, /Now follow one transaction\./);
  assert.doesNotMatch(pause, /The chain begins here/);
});

test('Chapter 5 presents L0-L8 as a continuous competency route', () => {
  assert.match(html, /data-competency-route/);
  for (let level = 0; level <= 8; level++) assert.match(html, new RegExp(`>L${level}<`));
  assert.match(html, /UNDERSTAND/);
  assert.match(html, /OPERATE/);
  assert.match(html, /EXTEND/);
});

test('landing states outcomes and offers a contextual final laboratory CTA', () => {
  assert.match(html, /you(?:&rsquo;|')ll know how to reason through it/i);
  assert.match(html, /Trace a missing invoice/);
  assert.match(html, /Predict stock\/accounting effects/);
  assert.match(html, /Diagnose a broken document chain/);
  assert.match(html, /Ready to work the case\?/);
  assert.match(html, /Enter the laboratory/);
});

test('mobile folio has a semantic active-document label', () => {
  assert.match(html, /data-folio-mobile-current/);
});

test('consultant rules are embedded as recurring editorial heuristics', () => {
  const rules = html.match(/CONSULTANT(?:&rsquo;|')S RULE/g) || [];
  assert.ok(rules.length >= 4, 'expected at least four consultant rules');
});
