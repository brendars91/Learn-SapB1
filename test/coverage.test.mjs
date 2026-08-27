// coverage.test.mjs — Fase 1 del PLAN-PRODUCCION-v8: la red de seguridad.
//
// Estos contratos existen porque la suite anterior estaba verde con un tercio del
// curso sin ficha MASTERCLASS y con nueve actividades resolubles por eliminacion.
// Un test que no puede fallar no protege nada.
//
// Los umbrales de este archivo son contrato. Si un cambio los hace fallar, se repara
// el contenido, no se baja el umbral.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { SKILLS } from '../src/content.mjs';
import { DEEP } from '../src/content/deep.mjs';
import { activityType, getActivity } from '../src/activities.mjs';

const LOCALES = ['es', 'en', 'de'];

// D1 — Toda skill necesita su ficha MASTERCLASS (ancla, ruta, ejemplo trabajado).
test('every skill has a MASTERCLASS deep card', () => {
  const missing = SKILLS.filter(skill => !DEEP[skill.id]).map(skill => skill.id);
  assert.deepEqual(missing, [], missing.length + ' skills sin ficha DEEP: ' + missing.join(', '));
});

test('every deep card carries anchor, path and worked example', () => {
  for (const skill of SKILLS) {
    const card = DEEP[skill.id];
    if (!card) continue;
    const glyph = card[0], anchorEs = card[1], anchorEn = card[2], path = card[3], example = card[4];
    assert.ok(glyph && glyph.trim(), skill.id + ': glifo vacio');
    assert.ok(anchorEs && anchorEs.trim().length > 20, skill.id + ': ancla ES demasiado corta');
    assert.ok(anchorEn && anchorEn.trim().length > 20, skill.id + ': ancla EN demasiado corta');
    assert.ok(path && path.trim(), skill.id + ': ruta vacia');
    assert.ok(example && example.q && example.q.trim(), skill.id + ': ejemplo sin pregunta');
    assert.ok(Array.isArray(example && example.show) && example.show.length >= 1, skill.id + ': ejemplo sin datos');
    assert.ok(example && example.a && example.a.trim(), skill.id + ': ejemplo sin respuesta razonada');
  }
});

test('no deep card is duplicated across skills', () => {
  const seen = new Map();
  for (const entry of Object.entries(DEEP)) {
    const id = entry[0], card = entry[1];
    const key = String(card[1]).slice(0, 70);
    assert.ok(!seen.has(key), id + ' duplica el ancla de ' + seen.get(key));
    seen.set(key, id);
  }
});

// D2 — Una ruta de un solo paso se acierta por eliminacion, no por saberla.
test('every config activity requires a real multi-step menu path', () => {
  const tooShort = [];
  for (const skill of SKILLS) {
    if (activityType(skill.id) !== 'config') continue;
    const route = getActivity(skill, 'es').route;
    if (route.length < 3) tooShort.push(skill.id + '(' + route.length + ')');
  }
  assert.deepEqual(tooShort, [], 'rutas de menos de 3 pasos: ' + tooShort.join(', '));
});

// D3 — Senuelos identicos en las 14 skills dejan de discriminar tras la primera.
test('config decoys are not a fixed pair reused by every skill', () => {
  const usage = new Map();
  let configCount = 0;
  for (const skill of SKILLS) {
    if (activityType(skill.id) !== 'config') continue;
    configCount += 1;
    const activity = getActivity(skill, 'es');
    for (const token of activity.tokens.filter(t => !activity.route.includes(t))) {
      usage.set(token, (usage.get(token) || 0) + 1);
    }
  }
  const overused = [...usage.entries()].filter(e => e[1] > Math.ceil(configCount / 2));
  assert.deepEqual(overused, [], 'senuelos reutilizados en mas de la mitad de las skills: ' + JSON.stringify(overused));
});

// D4 — Un pool global de 3 senuelos para 25 skills reinstala el meta-patron.
test('consequence decoys are varied enough to stay unpredictable', () => {
  const usage = new Map();
  let total = 0;
  for (const skill of SKILLS) {
    if (activityType(skill.id) !== 'consequence') continue;
    total += 1;
    const activity = getActivity(skill, 'es');
    for (const token of activity.tokens.filter(t => !activity.chain.includes(t))) {
      usage.set(token, (usage.get(token) || 0) + 1);
    }
  }
  assert.ok(usage.size >= Math.ceil(total / 2), 'solo ' + usage.size + ' senuelos distintos para ' + total + ' actividades consequence');
});

// D5 — Un formato que cubre un tercio del curso propaga su debilidad a todo.
test('no single activity format dominates the curriculum', () => {
  const counts = {};
  for (const skill of SKILLS) counts[activityType(skill.id)] = (counts[activityType(skill.id)] || 0) + 1;
  const limit = Math.ceil(SKILLS.length * 0.25);
  const dominant = Object.entries(counts).filter(e => e[1] > limit);
  assert.deepEqual(dominant, [], 'formatos por encima del 25% (' + limit + ' skills): ' + JSON.stringify(dominant));
});

// Blindaje de lo ya reparado en el v7: ningun test impedia su regreso.
test('forensic activities never reveal the broken link in the label', () => {
  for (const skill of SKILLS) {
    for (const locale of LOCALES) {
      const activity = getActivity(skill, locale);
      if (activity.type !== 'forensic') continue;
      for (const item of activity.evidence) {
        assert.doesNotMatch(String(item.label), /\u26a0/u, skill.id + '/' + locale + ': la etiqueta delata el eslabon roto');
      }
    }
  }
});

test('consequence tokens are never the chain in reverse order', () => {
  for (const skill of SKILLS) {
    for (const locale of LOCALES) {
      const activity = getActivity(skill, locale);
      if (activity.type !== 'consequence') continue;
      const reversed = [...activity.chain].reverse();
      assert.notDeepEqual(activity.tokens, reversed, skill.id + '/' + locale + ': los tokens son la cadena invertida');
    }
  }
});

test('simulator options are business values, never generic placeholders', () => {
  const generic = /Sin valor|Autom\u00e1tico|Bloqueado|No value|Automatic|Blocked|Kein Wert|Automatisch|Gesperrt/i;
  for (const skill of SKILLS) {
    for (const locale of LOCALES) {
      const activity = getActivity(skill, locale);
      if (activity.type !== 'simulator') continue;
      for (const target of activity.targets) {
        for (const option of target.options) {
          assert.doesNotMatch(String(option), generic, skill.id + '/' + locale + ': opcion generica "' + option + '"');
        }
      }
    }
  }
});

// D6 — Un modulo que nadie importa es una trampa: quien lo edite pierde el trabajo.
test('src contains no orphan module that nobody imports', async () => {
  const srcRoot = new URL('../src/', import.meta.url);
  const modules = [];
  async function walk(dir, prefix) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) await walk(new URL(entry.name + '/', dir), prefix + entry.name + '/');
      else if (entry.name.endsWith('.mjs')) modules.push(prefix + entry.name);
    }
  }
  await walk(srcRoot, '');

  const sources = [];
  for (const file of modules) sources.push(await readFile(new URL(file, srcRoot), 'utf8'));
  for (const entry of ['../index.html', '../lab/index.html']) {
    try { sources.push(await readFile(new URL(entry, import.meta.url), 'utf8')); } catch (e) { /* opcional */ }
  }
  const haystack = sources.join('\n');

  const orphans = modules.filter(file => {
    const name = file.split('/').pop();
    if (name === 'app.mjs') return false;
    const stem = name.replace(/\.mjs$/, '');
    return !new RegExp('[\'"`][^\'"`]*' + stem + '(?:\\.mjs)?[\'"`]').test(haystack);
  });
  assert.deepEqual(orphans, [], 'modulos huerfanos en src/: ' + orphans.join(', '));
});

// D7 — Un README con un numero de tests falso desacredita todo lo demas.
test('README does not hard-code a stale test count', async () => {
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const claims = [...readme.matchAll(/(\d+)\s*\/\s*(\d+)\s*PASS/gi)];
  for (const match of claims) {
    assert.equal(match[1], match[2], 'claim inconsistente: ' + match[0]);
    assert.ok(Number(match[2]) >= 59, 'el README declara ' + match[0] + ' y la suite ya ejecuta al menos 59 tests');
  }
});
