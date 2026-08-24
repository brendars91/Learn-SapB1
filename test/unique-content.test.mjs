import test from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS, CASES, INCIDENTS, BOSSES } from '../src/content.mjs';

// El test anti-plantilla: si dos skills comparten texto de evaluación, el régimen
// de generación por plantilla volvió y el contenido se ha degradado.
test('every skill renders a unique assessment: no template regime', () => {
  const fields = ['prompt', 'rationale'];
  const seen = new Map();
  for (const skill of SKILLS) {
    for (const f of fields) {
      const txt = skill.assessment?.[f]?.es;
      assert.ok(txt && txt.length > 10, `${skill.id}.${f}.es vacío`);
      const key = `${f}:${txt.slice(0, 60)}`;
      if (seen.has(key)) {
        assert.fail(`Duplicado ${skill.id}.${f} con ${seen.get(key)}: "${key}…"`);
      }
      seen.set(key, skill.id);
    }
  }
  const titles = SKILLS.map(s => s.title.es);
  assert.equal(new Set(titles).size, 72, 'títulos de skills duplicados');
});

test('every skill carries full senior content: mindset, tips, pitfall, diagram, steps', () => {
  for (const skill of SKILLS) {
    assert.ok(skill.mindset?.es?.length > 15, `${skill.id}.mindset`);
    assert.ok(skill.tips?.es?.length >= 2, `${skill.id}.tips`);
    assert.ok(skill.pitfall?.es?.length > 10, `${skill.id}.pitfall`);
    assert.ok(skill.diagram?.k, `${skill.id}.diagram`);
    assert.ok(skill.diagram?.n?.length >= 3, `${skill.id}.diagram.n`);
    assert.ok((skill.verifySteps || []).length >= 3, `${skill.id}.verifySteps`);
    const a = skill.assessment;
    assert.ok((a.seniorSteps || []).length >= 3, `${skill.id}.seniorSteps`);
    assert.ok((a.distractorWhy?.es || []).length === 3, `${skill.id}.distractorWhy`);
    assert.ok((a.principles || []).length === 3, `${skill.id}.principles`);
    assert.ok(a.hints?.es?.length > 5, `${skill.id}.hints`);
  }
});

test('interactive decisions carry senior reasoning and distractor analysis', () => {
  for (const entry of [...CASES, ...INCIDENTS, ...BOSSES]) {
    assert.ok((entry.seniorSteps || []).length >= 3, `${entry.id}.seniorSteps`);
    assert.ok((entry.principles || []).length === 3, `${entry.id}.principles`);
    if (entry.level < 8) assert.ok((entry.distractorWhy?.es || entry.dwhy?.es || []).length === 3, `${entry.id}.distractorWhy`);
  }
});
