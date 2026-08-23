import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateMastery,
  recommendNext,
  scanSensitiveInput,
  lintPrompt,
  validateProgressImport
} from '../src/domain.mjs';

test('mastery requires knowledge/application 80 and verification/risk 90', () => {
  assert.equal(calculateMastery({ knowledge: 80, application: 80, verification: 90, risk: 90 }).mastered, true);
  assert.equal(calculateMastery({ knowledge: 100, application: 100, verification: 89, risk: 100 }).mastered, false);
  assert.equal(calculateMastery({ knowledge: 100, application: 100, verification: 100, risk: 89 }).mastered, false);
});

test('mastery score cannot hide a failed safety gate', () => {
  const result = calculateMastery({ knowledge: 100, application: 100, verification: 100, risk: 100 }, false);
  assert.equal(result.mastered, false);
  assert.equal(result.reason, 'safety-gate');
});

test('recommendation prioritizes an overdue high-risk prerequisite', () => {
  const skills = [
    { id: 'SYN-SK-A', level: 1, riskWeight: 1, prerequisites: [] },
    { id: 'SYN-SK-B', level: 2, riskWeight: 3, prerequisites: ['SYN-SK-A'] }
  ];
  const progress = {
    'SYN-SK-A': { mastery: 40, nextReview: '2026-08-20T00:00:00.000Z' },
    'SYN-SK-B': { mastery: 10, nextReview: '2026-09-20T00:00:00.000Z' }
  };
  assert.equal(recommendNext(skills, progress, new Date('2026-08-22T00:00:00.000Z')).id, 'SYN-SK-A');
});

test('recommendation honors diagnostic entry level and selected learning path', () => {
  const skills = [
    { id: 'SYN-SK-L0-01', level: 0, track: 'functional', riskWeight: 1, prerequisites: [] },
    { id: 'SYN-SK-L6-01', level: 6, track: 'dual', riskWeight: 2, prerequisites: [] },
    { id: 'SYN-SK-L7-01', level: 7, track: 'technical', riskWeight: 3, prerequisites: [] },
    { id: 'SYN-SK-L8-01', level: 8, track: 'technical', riskWeight: 3, prerequisites: [] }
  ];
  const now = new Date('2026-08-22T00:00:00.000Z');
  assert.equal(recommendNext(skills, {}, now, { track: 'functional', recommendedLevel: 8 }).id, 'SYN-SK-L6-01');
  assert.equal(recommendNext(skills, {}, now, { track: 'technical', recommendedLevel: 7 }).id, 'SYN-SK-L7-01');
  assert.equal(recommendNext(skills, {}, now, { track: 'dual', recommendedLevel: 8 }).id, 'SYN-SK-L8-01');
});

test('privacy scanner accepts synthetic reserved-domain context', () => {
  const result = scanSensitiveInput('Use SYN-BP-C001 with learner@example.test and https://api.example.test.');
  assert.equal(result.safe, true);
  assert.deepEqual(result.reasons, []);
});

test('privacy scanner rejects real-domain email, IBAN shape, IP and non-test URL', () => {
  const samples = [
    'person@example.invalid',
    'DE00123456789012345678',
    'Connect to 10.20.30.40',
    'https://internal.example.invalid/b1s/v2/'
  ];
  for (const sample of samples) assert.equal(scanSensitiveInput(sample).safe, false, sample);
});

test('prompt linter scores the seven-part context contract', () => {
  const prompt = [
    'ROLE: SAP Business One learning coach.',
    'GOAL: Explain the next safe diagnostic action.',
    'CONTEXT: Only SYN-BP-C001 and synthetic case evidence.',
    'EVIDENCE: Cite the supplied evidence id.',
    'UNCERTAINTY: State what cannot be verified.',
    'OUTPUT: Return JSON with claim, evidenceId and nextAction.',
    'HUMAN GATE: Stop before any productive change.'
  ].join('\n');
  const result = lintPrompt(prompt);
  assert.equal(result.score, 100);
  assert.deepEqual(result.missing, []);
});

test('prompt linter requires an explicit synthetic case marker', () => {
  const result = lintPrompt('ROLE: coach. GOAL: diagnose. CONTEXT: a customer. EVIDENCE: cite. UNCERTAINTY: state gaps. OUTPUT: JSON. HUMAN REVIEW: required.');
  assert.ok(result.missing.includes('syntheticContext'));
  assert.ok(result.score < 100);
});

test('progress import rejects unknown fields and non-synthetic classification', () => {
  assert.equal(validateProgressImport({ schemaVersion: 1, classification: 'synthetic-progress', locale: 'es', track: 'functional', progress: {} }).valid, true);
  assert.equal(validateProgressImport({ schemaVersion: 1, classification: 'real-data', locale: 'es', track: 'functional', progress: {} }).valid, false);
  assert.equal(validateProgressImport({ schemaVersion: 1, classification: 'synthetic-progress', locale: 'es', track: 'functional', progress: {}, name: 'Person' }).valid, false);
});

test('progress import validates nested skill records and settings strictly', () => {
  const base = { schemaVersion: 1, classification: 'synthetic-progress', locale: 'es', track: 'dual' };
  const record = {
    knowledge: 60, application: 50, verification: 40, risk: 50, mastery: 50,
    mastered: false, explored: true, streak: 0,
    lastPractised: '2026-08-22T00:00:00.000Z', nextReview: '2026-08-23T00:00:00.000Z'
  };
  assert.equal(validateProgressImport({ ...base, progress: { 'REAL-SKILL': { mastery: 10 } } }).valid, false);
  assert.equal(validateProgressImport({ ...base, progress: { 'SYN-SK-L0-01': { ...record, person: 'Name' } } }).valid, false);
  assert.equal(validateProgressImport({ ...base, progress: {}, settings: { promptDraft: 'free text' } }).valid, false);
  assert.equal(validateProgressImport({ ...base, progress: { 'SYN-SK-L0-01': record }, settings: { diagnosticCompleted: true, diagnosticScore: 2, recommendedLevel: 1, selectedSkillId: 'SYN-SK-L0-01' } }).valid, true);
});

test('progress import derives mastery from evidence dimensions and rejects impossible claims', () => {
  const base = { schemaVersion: 1, classification: 'synthetic-progress', locale: 'es', track: 'dual' };
  const mastered = {
    knowledge: 90, application: 95, verification: 100, risk: 95, mastery: 95,
    mastered: true, explored: true, streak: 3, correctAttempts: 3, safetyGatePassed: true,
    lastPractised: '2026-08-22T00:00:00.000Z', nextReview: '2026-09-05T00:00:00.000Z'
  };
  assert.equal(validateProgressImport({ ...base, progress: { 'SYN-SK-L0-01': mastered } }).valid, true);
  for (const record of [
    { mastered: true },
    { ...mastered, mastery: 0 },
    { ...mastered, safetyGatePassed: false },
    { ...mastered, correctAttempts: 2 },
    { ...mastered, verification: 80, mastery: 90 }
  ]) assert.equal(validateProgressImport({ ...base, progress: { 'SYN-SK-L0-01': record } }).valid, false, JSON.stringify(record));
});

test('progress import rejects impossible ids, score ranges, coercible settings, and invalid timestamps', () => {
  const base = { schemaVersion: 1, classification: 'synthetic-progress', locale: 'es', track: 'dual', progress: {} };
  const invalid = [
    { ...base, progress: { 'SYN-SK-L0-99': { mastery: 10 } } },
    { ...base, progress: { 'SYN-SK-L0-01': { mastery: 999 } } },
    { ...base, progress: { 'SYN-SK-L0-01': { knowledge: -1 } } },
    { ...base, progress: { 'SYN-SK-L0-01': { streak: 1.5 } } },
    { ...base, settings: { diagnosticCompleted: 'false' } },
    { ...base, settings: { diagnosticScore: 7 } },
    { ...base, settings: { recommendedLevel: 999 } },
    { ...base, settings: { selectedSkillId: 'SYN-SK-L8-99' } },
    { ...base, exportedAt: {} },
    { ...base, exportedAt: '2026-08-22' },
    { ...base, exportedAt: 'not-a-date' }
  ];
  for (const payload of invalid) assert.equal(validateProgressImport(payload).valid, false, JSON.stringify(payload));
});
