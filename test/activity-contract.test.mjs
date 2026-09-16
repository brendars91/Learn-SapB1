import test from 'node:test';
import assert from 'node:assert/strict';
import { validateActivityDetailed, parseAmountCents, getActivity, journalSideTexts, translateSequenceValue } from '../src/activities.mjs';
import { SKILLS } from '../src/content.mjs';

const journalSkill = SKILLS.find(skill => skill.id === 'SYN-SK-L4-05');

test('un tipo de actividad desconocido no puede aprobarse por omisión', () => {
  const result = validateActivityDetailed({ type: 'quiz', locale: 'es' }, {}, []);
  assert.equal(result.correct, false);
  assert.match(result.details[0].item, /no soportado/);
});

test('una actividad sin material que corregir no puede aprobarse por omisión', () => {
  for (const activity of [
    { type: 'simulator', locale: 'es', targets: [] },
    { type: 'bughunt', locale: 'es', clues: [] },
    { type: 'forensic', locale: 'es', evidence: [] },
    { type: 'journal', locale: 'es', lines: [] },
    { type: 'config', locale: 'es', route: [] }
  ]) assert.equal(validateActivityDetailed(activity, {}, []).correct, false, activity.type);
});

test('el importe se corrige por valor, no por formato de la localización', () => {
  const activity = getActivity(journalSkill, 'es');
  const sides = journalSideTexts('es');
  const answersWith = amounts => Object.fromEntries(activity.lines.flatMap((line, index) => [
    [`side-${index}`, line[1]],
    [`amount-${index}`, amounts[index]]
  ]));
  assert.equal(activity.lines.every(line => line[2] === '1190,00'), true, 'fixture esperado: 1190,00 en ambas líneas');
  for (const written of ['1190,00', '1.190,00', '1190.00', '1,190.00', '1 190,00']) {
    const result = validateActivityDetailed(activity, answersWith([written, written]), []);
    assert.equal(result.correct, true, `"${written}" es el mismo importe y debe aceptarse`);
  }
  assert.equal(validateActivityDetailed(activity, answersWith(['1191,00', '1190,00']), []).correct, false);
  assert.ok(sides.debit);
});

test('un importe ambiguo o ilegible se rechaza en lugar de adivinarse', () => {
  for (const written of ['1.19.0', '11,90,00', 'mil ciento noventa', '', '1190,005']) {
    assert.equal(parseAmountCents(written), null, `"${written}" no debe interpretarse`);
  }
});

test('parseAmountCents fija la convención de millares y decimales', () => {
  assert.equal(parseAmountCents('1000,00'), 100000);
  assert.equal(parseAmountCents('1.000,00'), 100000);
  assert.equal(parseAmountCents('1,000.00'), 100000);
  assert.equal(parseAmountCents('1000.00'), 100000);
  assert.equal(parseAmountCents('1,000'), 100000, 'un separador con tres cifras detrás es de millares');
  assert.equal(parseAmountCents('1.000'), 100000);
  assert.equal(parseAmountCents('10,5'), 1050, 'un separador con menos de tres cifras detrás es decimal');
  assert.equal(parseAmountCents('190,00'), 19000);
  assert.equal(parseAmountCents('-190,00'), -19000);
  assert.equal(parseAmountCents('12345678,90'), 1234567890);
});

test('el panel de cuadre y el corrector leen el importe igual', async () => {
  const { createInitialState, renderAppMarkup } = await import('../src/app.mjs');
  // Asiento asimétrico a propósito: con un lector de importes distinto por panel, las tres
  // líneas se escalan de forma distinta y el cuadre se rompe aunque el corrector apruebe.
  const skill = SKILLS.find(entry => entry.id === 'SYN-SK-L4-01');
  const activity = getActivity(skill, 'es');
  assert.deepEqual(activity.lines.map(line => line[2]), ['1190,00', '1000,00', '190,00']);
  const written = ['1190.00', '1,000.00', '190.00'];
  const answers = Object.fromEntries(activity.lines.flatMap((line, index) => [
    [`side-${index}`, line[1]],
    [`amount-${index}`, written[index]]
  ]));
  assert.equal(validateActivityDetailed(activity, answers, []).correct, true, 'el corrector acepta las tres convenciones');
  const html = renderAppMarkup({ ...createInitialState({ diagnosticCompleted: true, view: 'map', selectedSkillId: skill.id }), skillMode: 'prove', activityAnswers: answers });
  assert.equal(html.includes('Cuadrado'), true, 'el panel no puede decir «descuadrado» sobre un asiento que se califica como correcto');
  assert.equal(html.includes('Diferencia'), false);
});

test('un locale desconocido no rompe la corrección', () => {
  const result = validateActivityDetailed({ type: 'quiz', locale: 'fr' }, {}, []);
  assert.equal(result.correct, false);
  assert.ok(result.details[0].item);
});

test('una respuesta con campos ajenos al contrato de la actividad no aprueba', () => {
  const activity = getActivity(journalSkill, 'es');
  const answers = Object.fromEntries(activity.lines.flatMap((line, index) => [
    [`side-${index}`, line[1]],
    [`amount-${index}`, line[2]]
  ]));
  assert.equal(validateActivityDetailed(activity, answers, []).correct, true, 'control positivo: la respuesta exacta aprueba');
  assert.equal(validateActivityDetailed(activity, { ...answers, [`amount-${activity.lines.length}`]: '0,00' }, []).correct, false,
    'una línea que el asiento no tiene no puede acompañar a una respuesta aprobada');
  assert.equal(validateActivityDetailed(activity, { ...answers, broken: '0' }, []).correct, false,
    'una respuesta de otro formato no pertenece a este contrato');
  assert.equal(validateActivityDetailed(activity, answers, ['paso suelto']).correct, false,
    'un asiento no se contesta con una secuencia de pasos');
});

test('un simulador con selecciones de más no aprueba', () => {
  const skill = SKILLS.find(entry => getActivity(entry, 'es').type === 'simulator');
  const activity = getActivity(skill, 'es');
  const answers = Object.fromEntries(activity.targets.map((target, index) => [`sim-${index}`, target.expected]));
  assert.equal(validateActivityDetailed(activity, answers, []).correct, true, 'control positivo');
  assert.equal(validateActivityDetailed(activity, { ...answers, [`sim-${activity.targets.length}`]: 'x' }, []).correct, false);
});

test('los pasos sobrantes no aprueban aunque la actividad no traiga banco de fichas', () => {
  // El cierre del contrato no puede depender de un campo de presentación: una actividad de
  // ruta sin señuelos se corrige con la misma regla que otra que sí los tenga.
  const activity = { type: 'config', locale: 'es', route: ['Gestión', 'Inicialización del sistema'] };
  assert.equal(validateActivityDetailed(activity, {}, [...activity.route]).correct, true, 'control positivo');
  assert.equal(validateActivityDetailed(activity, {}, [...activity.route, 'Paso de más']).correct, false,
    'una ruta más larga que la de referencia no es la misma ruta');
  assert.equal(validateActivityDetailed(activity, {}, [activity.route[0]]).correct, false, 'una ruta incompleta tampoco aprueba');
});

test('un importe que ya no cabe entero se rechaza en lugar de perder dígitos', () => {
  assert.equal(parseAmountCents('9007199254740993,99'), null);
  assert.equal(parseAmountCents('11111111111111111111,99'), null);
  assert.equal(parseAmountCents('90071992547409,91'), 9007199254740991);
});


// ─── Regresión conductual: cambiar de idioma con secuencia correcta no cambia el veredicto ───
// Reproduce el defecto real: 18 skills con cardinalidades desincronizadas entre idiomas
// hacían que una respuesta CORRECTA en ES se corrigiera como incorrecta tras cambiar a EN/DE
// (mapeo posicional sobre listas de distinta longitud). El fix mapea por ROL: los pasos de
// la ruta/cadena se traducen por índice exacto; los señuelos se conservan (siguen siendo
// respuestas equivocadas). L1-08 además tenía la ruta ES incompleta (3 de 4 pasos): corregida
// contra deep.mjs, que autoró la ruta de 4 pasos.
import { createInitialState, reduceState } from '../src/app.mjs';


test('responder la secuencia correcta en ES y cambiar de idioma conserva el veredicto en 32 skills', () => {
  const sequenceSkills = SKILLS.filter(s => {
    const act = getActivity(s, 'es');
    return ['config', 'consequence'].includes(act.type);
  });
  assert.ok(sequenceSkills.length >= 30, `esperabamos >=30 skills de secuencia, hay ${sequenceSkills.length}`);
  for (const skill of sequenceSkills) {
    const es = getActivity(skill, 'es');
    const target = es.route || es.chain || [];
    let state = reduceState(createInitialState({ selectedSkillId: skill.id }), { type: 'SELECT_SKILL', skillId: skill.id });
    for (const token of target) state = reduceState(state, { type: 'ACTIVITY_SEQUENCE', value: token });
    assert.equal(validateActivityDetailed(es, state.activityAnswers, state.activitySequence).correct, true,
      `la ruta autorada de ${skill.id} no pasa en ES: revisar contenido antes de culpar al mapeo`);
    for (const locale of ['en', 'de']) {
      const act = getActivity(skill, locale);
      const switched = reduceState(state, { type: 'SET_LOCALE', locale });
      assert.equal(validateActivityDetailed(act, switched.activityAnswers, switched.activitySequence).correct, true,
        `respuesta correcta perdida al cambiar a ${locale} en ${skill.id}`);
    }
  }
});

test('la ruta ES de L1-08 tiene los cuatro pasos autorados en deep.mjs', () => {
  const skill = SKILLS.find(s => s.id === 'SYN-SK-L1-08');
  const es = getActivity(skill, 'es');
  assert.equal(es.route.length, 4, `ruta ES incompleta: ${JSON.stringify(es.route)}`);
  assert.ok(es.route.includes('Inicialización del sistema'), 'falta el paso de inicialización que EN/DE sí tienen');
});

test('un señuelo no traducido se conserva: sigue siendo respuesta equivocada, no falso positivo', () => {
  const skill = SKILLS.find(s => s.id === 'SYN-SK-L8-08');
  const es = getActivity(skill, 'es');
  const de = getActivity(skill, 'de');
  // Señuelo válido en ES (pertenece a tokens pero no a la cadena correcta)
  const decoy = es.tokens.find(token => !(es.chain || []).includes(token));
  assert.ok(decoy, 'la actividad debe tener al menos un señuelo');
  let state = reduceState(createInitialState({ selectedSkillId: skill.id }), { type: 'SELECT_SKILL', skillId: skill.id });
  state = reduceState(state, { type: 'ACTIVITY_SEQUENCE', value: decoy });
  const switched = reduceState(state, { type: 'SET_LOCALE', locale: 'de' });
  const verdict = validateActivityDetailed(de, switched.activityAnswers, switched.activitySequence);
  assert.equal(verdict.correct, false, 'un señuelo no puede volverse correcto al cambiar de idioma');
});

// ─── Invariante estructural que el mapeo por ROL necesita (P12) ──────────────
// El fix conductual traduce respuestas por ROL (expected / índice en la ruta o cadena),
// no por posición en listas que pueden tener cardinalidad distinta por idioma. Lo que
// sí es estructuralmente obligatorio: la RUTA/CADENA correcta existe en los tres idiomas
// con la misma longitud — si un idioma pierde un paso, la actividad no es evaluable en
// ese idioma. La cardinalidad de señuelos es libre; el veredicto no depende de ella.
test('la ruta o cadena correcta existe completa en los tres idiomas para toda actividad de secuencia', () => {
  for (const skill of SKILLS) {
    const acts = ['es', 'en', 'de'].map(locale => getActivity(skill, locale));
    if (!['config', 'consequence'].includes(acts[0].type)) continue;
    const lengths = acts.map(a => (a.route || a.chain || []).length);
    assert.ok(lengths.every(n => n > 0), `ruta vacía en ${skill.id}`);
    assert.equal(Math.max(...lengths), Math.min(...lengths),
      `ruta/cadena con longitud distinta entre idiomas en ${skill.id}: ${JSON.stringify(lengths)} — la actividad no es evaluable en el idioma corto`);
  }
});

test('las opciones del simulador contienen siempre la respuesta esperada en cada idioma', () => {
  for (const skill of SKILLS) {
    for (const locale of ['es', 'en', 'de']) {
      const act = getActivity(skill, locale);
      if (act.type !== 'simulator') continue;
      act.targets.forEach((target, i) => {
        assert.ok((target.options || []).includes(target.expected),
          `${skill.id} sim-${i} (${locale}): la opción correcta no está entre las ofrecidas`);
      });
    }
  }
});

// ─── Anexo B / W03: cambio de idioma con la actividad a medias ────────────────
// El plan deja abiertas tres pruebas concretas: actividad a medias con PISTA USADA,
// con FEEDBACK DE ERROR visible, y con RESPUESTA CORRECTA ya corregida. Ninguna
// debe perder estado ni invertir su veredicto al cambiar de idioma.

test('cambiar de idioma con actividad a medias conserva secuencia y pistas usadas', () => {
  for (const skill of SKILLS) {
    const es = getActivity(skill, 'es');
    if (!['config', 'consequence'].includes(es.type)) continue;
    let state = createInitialState({ selectedSkillId: skill.id });
    state = reduceState(state, { type: 'SELECT_SKILL', skillId: skill.id });
    state = reduceState(state, { type: 'SET_SKILL_MODE', mode: 'prove' });
    const chain = es.route || es.chain || [];
    state = reduceState(state, { type: 'ACTIVITY_SEQUENCE', value: chain[0] });
    state = reduceState(state, { type: 'ACTIVITY_HINT' });
    const hintsBefore = state.activityHints;
    for (const locale of ['en', 'de']) {
      const act = getActivity(skill, locale);
      const switched = reduceState(state, { type: 'SET_LOCALE', locale });
      assert.equal(switched.activityHints, hintsBefore, `pistas perdidas en ${skill.id} → ${locale}`);
      assert.equal(switched.activitySequence.length, 1);
      assert.equal((act.route || act.chain || [])[0], switched.activitySequence[0],
        `el paso correcto dado no se tradujo a su equivalente en ${locale} (${skill.id})`);
    }
  }
});

test('el feedback de ERROR sobrevive al cambio de idioma sin volverse acierto', () => {
  for (const skill of SKILLS) {
    const es = getActivity(skill, 'es');
    if (!['config', 'consequence'].includes(es.type)) continue;
    const decoy = es.tokens.find(tok => !(es.route || es.chain).includes(tok));
    if (!decoy) continue;
    let state = createInitialState({ selectedSkillId: skill.id });
    state = reduceState(state, { type: 'SELECT_SKILL', skillId: skill.id });
    state = reduceState(state, { type: 'SET_SKILL_MODE', mode: 'prove' });
    state = reduceState(state, { type: 'ACTIVITY_SEQUENCE', value: decoy });
    const verdictEs = validateActivityDetailed(es, state.activityAnswers, state.activitySequence);
    assert.equal(verdictEs.correct, false, `el señuelo debe ser erróneo en ES (${skill.id})`);
    state = reduceState(state, { type: 'ACTIVITY_FEEDBACK', correct: verdictEs.correct, message: 'x', details: verdictEs.details });
    for (const locale of ['en', 'de']) {
      const act = getActivity(skill, locale);
      const switched = reduceState(state, { type: 'SET_LOCALE', locale });
      assert.ok(switched.activityFeedback, `feedback de error descartado en ${skill.id} → ${locale}`);
      assert.equal(switched.activityFeedback.correct, false, `un error se volvió acierto en ${skill.id} → ${locale}`);
      const revalidated = validateActivityDetailed(act, switched.activityAnswers, switched.activitySequence);
      assert.equal(revalidated.correct, false, `revalidación de señuelo como correcto en ${skill.id} → ${locale}`);
    }
  }
});

test('el feedback de ACIERTO sobrevive al cambio de idioma sin volverse error', () => {
  for (const skill of SKILLS) {
    const es = getActivity(skill, 'es');
    if (!['config', 'consequence'].includes(es.type)) continue;
    let state = createInitialState({ selectedSkillId: skill.id });
    state = reduceState(state, { type: 'SELECT_SKILL', skillId: skill.id });
    state = reduceState(state, { type: 'SET_SKILL_MODE', mode: 'prove' });
    for (const token of es.route || es.chain) state = reduceState(state, { type: 'ACTIVITY_SEQUENCE', value: token });
    const verdictEs = validateActivityDetailed(es, state.activityAnswers, state.activitySequence);
    assert.equal(verdictEs.correct, true, `la cadena autorada debe aprobar en ES (${skill.id})`);
    state = reduceState(state, { type: 'ACTIVITY_FEEDBACK', correct: true, message: 'ok', details: verdictEs.details });
    for (const locale of ['en', 'de']) {
      const act = getActivity(skill, locale);
      const switched = reduceState(state, { type: 'SET_LOCALE', locale });
      assert.ok(switched.activityFeedback, `feedback de acierto descartado en ${skill.id} → ${locale}`);
      assert.equal(switched.activityFeedback.correct, true, `un acierto se volvió error en ${skill.id} → ${locale}`);
      const revalidated = validateActivityDetailed(act, switched.activityAnswers, switched.activitySequence);
      assert.equal(revalidated.correct, true, `revalidación fallida en ${skill.id} → ${locale}`);
    }
  }
});

// F3/P12: la identidad de un paso no puede ser su texto traducido. Cuando una ruta repite un
// rótulo — y el contenido actual lo hace en al menos un idioma — resolver el paso buscando su
// texto es ambiguo: `indexOf` devuelve la primera aparición y la respuesta correcta del alumno
// se corrige como incorrecta. Este test recorre las SEIS direcciones de idioma, no solo las que
// parten del español, que es como el defecto había pasado desapercibido.
test('una secuencia correcta sigue siendo correcta al cambiar de idioma en cualquier dirección', () => {
  const locales = ['es', 'en', 'de'];
  const fallos = [];
  for (const skill of SKILLS) {
    for (const from of locales) {
      for (const to of locales) {
        if (from === to) continue;
        const origen = getActivity(skill, from);
        const destino = getActivity(skill, to);
        if (!['config', 'consequence'].includes(origen.type)) continue;
        const cadenaOrigen = origen.route || origen.chain || [];
        const traducida = cadenaOrigen.map((valor, indice) =>
          translateSequenceValue(valor, origen, destino, indice),
        );
        if (!validateActivityDetailed(destino, {}, traducida).correct) {
          fallos.push(`${skill.id} ${from}->${to}`);
        }
      }
    }
  }
  assert.deepEqual(fallos, []);
});
