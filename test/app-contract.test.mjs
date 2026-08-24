import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  createInitialState,
  reduceState,
  serializeProgress,
  renderAppMarkup,
  escapeHtml
} from '../src/app.mjs';
import { getActivity } from '../src/activities.mjs';
import { SKILLS } from '../src/content.mjs';

test('initial state starts on home dashboard in Spanish with dual track', () => {
  const state = createInitialState();
  assert.equal(state.locale, 'es');
  assert.equal(state.track, 'dual');
  assert.equal(state.view, 'home');
  assert.equal(state.diagnosticCompleted, true);
  assert.deepEqual(state.progress, {});
});

test('state reducer switches language and view without losing progress', () => {
  const initial = createInitialState({ progress: { 'SYN-SK-L0-01': { mastery: 40 } } });
  const localized = reduceState(initial, { type: 'SET_LOCALE', locale: 'de' });
  const navigated = reduceState(localized, { type: 'NAVIGATE', view: 'map' });
  assert.equal(navigated.locale, 'de');
  assert.equal(navigated.view, 'map');
  assert.equal(navigated.progress['SYN-SK-L0-01'].mastery, 40);
});

test('home dashboard localizes after a language switch', () => {
  let state = createInitialState({ locale: 'es' });
  state = reduceState(state, { type: 'SET_LOCALE', locale: 'de' });
  const html = renderAppMarkup(state);
  assert.match(html, /Fortschritt nach Niveau|SAP Business One/);
});

test('practice and challenge update dimensions but failed safety cannot master', () => {
  const initial = createInitialState();
  const practised = reduceState(initial, { type: 'PRACTISE_SKILL', skillId: 'SYN-SK-L4-03', now: '2026-08-22T00:00:00.000Z' });
  assert.equal(practised.progress['SYN-SK-L4-03'].explored, true);
  assert.ok(practised.progress['SYN-SK-L4-03'].nextReview);
  const challenged = reduceState(practised, { type: 'ASSESS_SKILL', skillId: 'SYN-SK-L4-03', correct: true, safetyGatePassed: false, now: '2026-08-22T00:00:00.000Z' });
  assert.equal(challenged.progress['SYN-SK-L4-03'].mastered, false);
});

test('one correct answer cannot master a skill and mastery requires repeated verified retrieval', () => {
  const id = 'SYN-SK-L4-03';
  let state = reduceState(createInitialState(), { type: 'PRACTISE_SKILL', skillId: id, now: '2026-08-22T00:00:00.000Z' });
  state = reduceState(state, { type: 'ASSESS_SKILL', skillId: id, correct: true, safetyGatePassed: true, now: '2026-08-22T01:00:00.000Z' });
  assert.equal(state.progress[id].mastered, false);
  assert.equal(state.progress[id].correctAttempts, 1);
  state = reduceState(state, { type: 'ASSESS_SKILL', skillId: id, correct: true, safetyGatePassed: true, now: '2026-08-23T01:00:00.000Z' });
  assert.equal(state.progress[id].mastered, false);
  state = reduceState(state, { type: 'ASSESS_SKILL', skillId: id, correct: true, safetyGatePassed: true, now: '2026-08-24T01:00:00.000Z' });
  assert.equal(state.progress[id].mastered, true);
  state = reduceState(state, { type: 'ASSESS_SKILL', skillId: id, correct: false, safetyGatePassed: true, now: '2026-08-25T01:00:00.000Z' });
  assert.equal(state.progress[id].mastered, false);
  assert.equal(state.progress[id].streak, 0);
});

test('practical assessment separates completion from the safety gate', () => {
  let state = createInitialState({ diagnosticCompleted: true, view: 'map', selectedSkillId: 'SYN-SK-L0-01', skillMode: 'prove' });
  state = reduceState(state, { type: 'SET_SKILL_MODE', mode: 'prove' });
  state = reduceState(state, { type: 'ACTIVITY_FEEDBACK', correct: true, message: 'verified' });
  state = reduceState(state, { type: 'ASSESS_SKILL', skillId: 'SYN-SK-L0-01', correct: true, safetyGatePassed: false });
  assert.equal(state.progress['SYN-SK-L0-01'].mastered, false);
  assert.match(renderAppMarkup(state), /data-activity-type=/);
});

test('different skills render distinct assessment prompts', () => {
  const mk = id => {
    let st = createInitialState({ diagnosticCompleted: true, view: 'map', selectedSkillId: id });
    st = reduceState(st, { type: 'SET_SKILL_MODE', mode: 'prove' });
    return renderAppMarkup(st);
  };
  const h1 = mk('SYN-SK-L0-01');
  const h2 = mk('SYN-SK-L0-02');
  const m = h => h.match(/<h3>([^<]+)<\/h3>/)?.[1];
  assert.ok(m(h1), 'prompt1 rendered');
  assert.notEqual(m(h1), m(h2));
});

test('serialized progress excludes prompt text and declares synthetic classification', () => {
  const state = createInitialState({ promptDraft: 'private free text', promptResult: { score: 50 } });
  const payload = serializeProgress(state, '2026-08-22T12:00:00.000Z');
  assert.equal(payload.classification, 'synthetic-progress');
  assert.equal(payload.schemaVersion, 1);
  assert.equal('promptDraft' in payload, false);
  assert.equal(JSON.stringify(payload).includes('private free text'), false);
});

test('rendered application exposes every working mode and semantic navigation', () => {
  const html = renderAppMarkup(createInitialState({ diagnosticCompleted: true }));
  assert.match(html, /<nav[^>]*aria-label=/);
  for (const view of ['home', 'map', 'cases', 'incidents', 'simulator', 'ai', 'evidence']) {
    assert.match(html, new RegExp(`data-view="${view}"`));
  }
  assert.doesNotMatch(html, /data-view="review"/);
  assert.match(html, /<button/);
  assert.match(html, /<select/);
});

test('rendering helper escapes active markup', () => {
  assert.equal(escapeHtml('<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;');
});

test('advanced console renders German labels and real SQL without internal keys', () => {
  const state = createInitialState({ locale: 'de', view: 'ai' });
  const html = renderAppMarkup(state);
  assert.match(html, /Erweiterte Konsole/);
  assert.match(html, /OINV|JDT1/);
  assert.doesNotMatch(html, /syntheticContext/);
});

test('German console and evidence views contain localized content', () => {
  const ai = renderAppMarkup(createInitialState({ locale: 'de', view: 'ai' }));
  assert.match(ai, /Expertenabfragen|Dashboards/);
  const evidence = renderAppMarkup(createInitialState({ locale: 'de', view: 'evidence' }));
  assert.match(evidence, /Logistik-Lernpfad/);
  assert.doesNotMatch(evidence, /logistics learning path/);
});

test('Pages entrypoint mounts the strict locale runtime', async () => {
  const [index, runtime, strictLocale] = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../src/runtime-strict.mjs', import.meta.url), 'utf8'),
    readFile(new URL('../src/strict-locale.mjs', import.meta.url), 'utf8')
  ]);
  assert.match(index, /mountStrictSapB1Lab/);
  assert.match(index, /runtime-strict\.mjs/);
  assert.match(runtime, /strict-locale\.mjs/);
  assert.match(runtime, /strictTranslateText/);
  assert.match(runtime, /hasLegacySpanish/);
  assert.match(strictLocale, /Guided practice/);
  assert.match(strictLocale, /Geführte Praxis/);
  assert.match(strictLocale, /Warum funktioniert das\?/);
  assert.match(strictLocale, /Stolperstein/);
});

test('practical activities provide localized English and German field content', () => {
  const skill = SKILLS.find(s => s.id === 'SYN-SK-L0-01');
  const en = getActivity(skill, 'en');
  const de = getActivity(skill, 'de');
  assert.match(en.targets[0].label, /Module|Sales Order/);
  assert.doesNotMatch(en.targets.map(x => x.label).join(' '), /Módulo|Pedido de cliente/);
  assert.match(de.targets[0].label, /Modul|Kundenauftrag/);
  assert.doesNotMatch(de.targets.map(x => x.label).join(' '), /Módulo|Pedido de cliente/);
});
