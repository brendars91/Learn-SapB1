import test from 'node:test';
import assert from 'node:assert/strict';
import { I18N, LEVELS, SKILLS, CASES, INCIDENTS, BOSSES, EVIDENCE, translate } from '../src/content.mjs';

const locales = ['es', 'en', 'de'];

test('curriculum contains nine levels and exactly 72 unique skills', () => {
  assert.equal(LEVELS.length, 9);
  assert.deepEqual(LEVELS.map(level => level.id), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
  assert.equal(SKILLS.length, 72);
  assert.equal(new Set(SKILLS.map(skill => skill.id)).size, 72);
  for (const level of LEVELS) assert.equal(SKILLS.filter(skill => skill.level === level.id).length, 8);
});

test('each skill has complete trilingual learning content and synthetic identity', () => {
  for (const skill of SKILLS) {
    assert.match(skill.id, /^SYN-SK-L[0-8]-\d{2}$/);
    assert.equal(skill.classification, 'synthetic');
    assert.ok(Array.isArray(skill.prerequisites));
    assert.ok(skill.evidenceId);
    for (const locale of locales) {
      for (const field of ['title', 'objective', 'concept', 'practice', 'verify', 'risk']) {
        assert.ok(skill[field]?.[locale]?.trim(), `${skill.id}.${field}.${locale}`);
      }
      assert.ok(skill.assessment?.prompt?.[locale]?.trim(), `${skill.id}.assessment.prompt.${locale}`);
      assert.equal(skill.assessment.optionsText[locale].length, 3);
      assert.ok(skill.assessment.rationale[locale]?.trim(), `${skill.id}.assessment.rationale.${locale}`);
    }
    assert.deepEqual(skill.assessment.safe, [true, true, false]);
  }
});

test('interface dictionary has no missing key in ES, EN or DE', () => {
  const keys = Object.keys(I18N.es).sort();
  assert.ok(keys.length > 40);
  for (const locale of locales) assert.deepEqual(Object.keys(I18N[locale]).sort(), keys);
  assert.equal(translate('de', 'navMap'), I18N.de.navMap);
  assert.equal(translate('xx', 'navMap'), I18N.es.navMap);
  for (const englishLabel of ['Lab AI', 'Case Lab', 'Incident Room', 'AI & Context Lab', 'Boss battles']) {
    assert.ok(!Object.values(I18N.es).includes(englishLabel), englishLabel);
  }
});

test('interactive catalog covers decisions, incidents and every boss level', () => {
  assert.ok(CASES.length >= 12);
  assert.ok(INCIDENTS.length >= 6);
  assert.equal(BOSSES.length, 9);
  assert.deepEqual(BOSSES.map(boss => boss.level), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
  for (const entry of [...CASES, ...INCIDENTS, ...BOSSES]) {
    assert.match(entry.id, /^SYN-/);
    assert.equal(entry.classification, 'synthetic');
    assert.ok(entry.options.length >= 3);
    assert.ok(Number.isInteger(entry.correct));
    for (const locale of locales) {
      assert.ok(entry.prompt[locale]);
      assert.equal(entry.options.length, entry.optionsText[locale].length);
      assert.ok(entry.rationale[locale]);
    }
  }
});

test('evidence registry contains applicability and verification metadata', () => {
  assert.ok(EVIDENCE.length >= 5);
  for (const item of EVIDENCE) {
    assert.match(item.id, /^EV-/);
    assert.equal(item.sourceType, 'official');
    assert.match(item.url, /^https:\/\//);
    assert.match(item.verifiedAt, /^2026-/);
    for (const locale of locales) assert.ok(item.applicability?.[locale], `${item.id}.applicability.${locale}`);
  }
  const evidenceIds = new Set(EVIDENCE.map(item => item.id));
  for (const skill of SKILLS) assert.ok(evidenceIds.has(skill.evidenceId), skill.evidenceId);
});
