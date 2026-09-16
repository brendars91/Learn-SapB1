import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, reduceState, serializeProgress, renderAppMarkup, mountSapB1Lab } from '../src/app.mjs';
import { validateProgressImport, evaluateSkill, SUSTAINED_CORRECT, PROGRESS_SCHEMA_VERSION } from '../src/domain.mjs';
import { getActivity } from '../src/activities.mjs';
import { SKILLS } from '../src/content.mjs';

const ID = 'SYN-SK-L4-03';
const at = day => `2026-09-${String(day).padStart(2, '0')}T08:00:00.000Z`;
const assess = (state, options) => reduceState(state, { type: 'ASSESS_SKILL', skillId: ID, safetyGatePassed: true, ...options });
const roundtrip = state => validateProgressImport(JSON.parse(JSON.stringify(serializeProgress(state, at(28)))));

/** Raíz mínima: el montaje solo necesita eventos, innerHTML y una consulta que puede no acertar. */
function fakeRoot() {
  const listeners = new Map();
  return {
    innerHTML: '', attributes: {},
    addEventListener(type, handler) { listeners.set(type, handler); },
    setAttribute(name, value) { this.attributes[name] = value; },
    querySelector() { return null; },
    fire(type, control) { listeners.get(type)?.({ target: { ...control, dataset: control.dataset || {}, closest: () => control } }); }
  };
}

/** Sustituye localStorage durante la prueba y lo restituye pase lo que pase. */
function withLocalStorage(stub, run) {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { value: stub, configurable: true, writable: true });
  try { return run(); } finally {
    if (original) Object.defineProperty(globalThis, 'localStorage', original);
    else delete globalThis.localStorage;
  }
}

const toastOf = html => (html.match(/<div class="sbl-toast"[^>]*>([^<]*)<\/div>/) || [, ''])[1];

/** Lleva una competencia hasta la acreditación por la vía normal: tres aciertos sostenidos. */
function earnMastery() {
  let state = reduceState(createInitialState(), { type: 'PRACTISE_SKILL', skillId: ID, now: at(1) });
  for (let attempt = 0; attempt < SUSTAINED_CORRECT; attempt += 1) {
    state = assess(state, { correct: true, principleCorrect: true, now: at(2 + attempt) });
  }
  return state;
}

test('el bonus de principio entra en la evidencia antes de derivar: el progreso exportado se vuelve a importar', () => {
  const state = assess(reduceState(createInitialState(), { type: 'PRACTISE_SKILL', skillId: ID, now: at(1) }),
    { correct: true, principleCorrect: true, now: at(2) });
  const record = state.progress[ID];
  assert.equal(record.mastery, evaluateSkill(record).score, 'la puntuación guardada debe derivar de las dimensiones guardadas');
  const imported = roundtrip(state);
  assert.equal(imported.valid, true, `importación rechazada: ${imported.reason}`);
});

test('un fallo de la puerta de seguridad suspende la aptitud sin borrar el logro', () => {
  const mastered = earnMastery();
  assert.equal(mastered.progress[ID].mastered, true);
  assert.equal(mastered.progress[ID].everMastered, true);
  const unsafe = assess(mastered, { correct: true, safetyGatePassed: false, now: at(9) });
  assert.equal(unsafe.progress[ID].mastered, false, 'la aptitud actual queda suspendida');
  assert.equal(unsafe.progress[ID].everMastered, true, 'el logro histórico no se borra');
  const imported = roundtrip(unsafe);
  assert.equal(imported.valid, true, `el estado suspendido debe ser importable: ${imported.reason}`);
  const recovered = assess(unsafe, { correct: true, safetyGatePassed: true, now: at(10) });
  assert.equal(recovered.progress[ID].mastered, true, 'superar de nuevo la puerta restituye la aptitud');
});

test('un fallo ordinario reinicia la racha pero no revoca la acreditación', () => {
  const missed = assess(earnMastery(), { correct: false, now: at(9) });
  assert.equal(missed.progress[ID].streak, 0);
  assert.equal(missed.progress[ID].mastered, true);
  assert.equal(roundtrip(missed).valid, true);
});

test('la aptitud suspendida es visible en el mapa, no silenciosa', () => {
  const unsafe = assess(earnMastery(), { correct: true, safetyGatePassed: false, now: at(9) });
  const html = renderAppMarkup({ ...unsafe, view: 'map', skillDetailOpen: false });
  assert.match(html, /sbl-node is-suspended/);
  assert.match(html, /Suspendida/);
});

test('el export declara el esquema vigente y el roundtrip aguanta cada acción', () => {
  let state = reduceState(createInitialState(), { type: 'PRACTISE_SKILL', skillId: ID, now: at(1) });
  assert.equal(serializeProgress(state, at(28)).schemaVersion, PROGRESS_SCHEMA_VERSION);
  for (const step of [
    { correct: true, principleCorrect: false, now: at(2) },
    { correct: true, principleCorrect: true, now: at(3) },
    { correct: false, principleCorrect: false, now: at(4) },
    { correct: true, principleCorrect: true, safetyGatePassed: false, now: at(5) },
    { correct: true, principleCorrect: true, now: at(6) }
  ]) {
    state = assess(state, step);
    const imported = roundtrip(state);
    assert.equal(imported.valid, true, `paso ${step.now} rechazado: ${imported.reason}`);
  }
});

test('los ajustes anidados sobreviven a la importación del contrato exportado', () => {
  const source = createInitialState({ recommendedLevel: 5, selectedSkillId: 'SYN-SK-L3-02', diagnosticScore: 4, track: 'technical', locale: 'de' });
  const payload = serializeProgress(source, at(28));
  const imported = reduceState(createInitialState(), { type: 'IMPORT_STATE', value: payload });
  assert.equal(imported.recommendedLevel, 5);
  assert.equal(imported.selectedSkillId, 'SYN-SK-L3-02');
  assert.equal(imported.diagnosticScore, 4);
  assert.equal(imported.track, 'technical');
  assert.equal(imported.locale, 'de');
});

test('el importador rechaza una racha mayor que los aciertos acumulados', () => {
  const payload = serializeProgress(earnMastery(), at(28));
  payload.progress[ID].correctAttempts = payload.progress[ID].streak - 1;
  assert.equal(validateProgressImport(payload).reason, 'progress-attempts');
});

test('la migración v1 neutraliza una acreditación falsificada y no inventa intentos', () => {
  const legacy = {
    schemaVersion: 1, classification: 'synthetic-progress', locale: 'es', track: 'dual',
    progress: { [ID]: {
      knowledge: 10, application: 10, verification: 10, risk: 10, mastery: 100,
      mastered: true, explored: true, streak: 0,
      lastPractised: at(1), nextReview: at(2)
    } }
  };
  const result = validateProgressImport(legacy);
  assert.equal(result.valid, true, result.reason);
  assert.equal(result.migratedFrom, 1);
  const record = result.value.progress[ID];
  assert.equal(record.mastery, 10, 'la puntuación se recalcula desde la evidencia, no se cree la declarada');
  assert.equal(record.mastered, false, 'una acreditación sin evidencia no sobrevive a la migración');
  assert.equal(record.everMastered, false, 'sin dimensiones que la sostengan, la declaración tampoco vale como historia');
  assert.equal(record.legacy, true, 'sin intentos guardados, el registro queda marcado como legado');
  assert.equal(record.correctAttempts, 0, 'no se inventan aciertos que nadie registró');
});

test('la migración v1 conserva las mismas rechazos estructurales', () => {
  const base = { schemaVersion: 1, classification: 'synthetic-progress', locale: 'es', track: 'dual' };
  const invalid = [
    { ...base, progress: { 'REAL-SKILL-01': { mastery: 10 } } },
    { ...base, progress: { [ID]: { mastery: 10 } } },
    { ...base, progress: { [ID]: { knowledge: 10, application: 10, verification: 10, risk: 10, mastery: 10, mastered: false, explored: true, streak: 0, person: 'Name', lastPractised: at(1), nextReview: at(2) } } },
    { ...base, progress: {}, extra: 1 }
  ];
  for (const payload of invalid) assert.equal(validateProgressImport(payload).valid, false, JSON.stringify(payload));
});

test('la marca legacy exime de justificar la historia, nunca de merecer la aptitud actual', () => {
  const forged = {
    schemaVersion: PROGRESS_SCHEMA_VERSION, classification: 'synthetic-progress', locale: 'es', track: 'dual',
    progress: { [ID]: {
      knowledge: 100, application: 100, verification: 100, risk: 100, mastery: 100,
      mastered: true, everMastered: true, legacy: true, explored: true, streak: 0, correctAttempts: 0, safetyGatePassed: true,
      lastPractised: at(1), nextReview: at(2)
    } }
  };
  assert.equal(validateProgressImport(forged).valid, false, 'legacy no puede regalar aptitud sin intentos registrados');
  const honest = { ...forged.progress[ID], mastered: false };
  assert.equal(evaluateSkill(honest).mastered, false);
  assert.equal(validateProgressImport({ ...forged, progress: { [ID]: honest } }).valid, true, 'el mismo registro sin reclamar aptitud sí es válido');
});

test('un registro heredado tiene que volver a ganarse la aptitud, sin perder la historia', () => {
  const legacy = {
    schemaVersion: 1, classification: 'synthetic-progress', locale: 'es', track: 'dual',
    progress: { [ID]: {
      knowledge: 100, application: 100, verification: 100, risk: 100, mastery: 100,
      mastered: true, explored: true, streak: 0, lastPractised: at(1), nextReview: at(2)
    } }
  };
  const migrated = validateProgressImport(legacy).value.progress[ID];
  assert.equal(migrated.everMastered, true);
  assert.equal(migrated.legacy, true);
  assert.equal(migrated.mastered, false, 'sin intentos guardados no se puede sostener la aptitud');
  let state = reduceState(createInitialState(), { type: 'IMPORT_STATE', value: validateProgressImport(legacy).value });
  for (let attempt = 0; attempt < SUSTAINED_CORRECT; attempt += 1) state = assess(state, { correct: true, now: at(3 + attempt) });
  assert.equal(state.progress[ID].mastered, true, 'tres aciertos sostenidos la restituyen');
});

test('suspender la aptitud no hace bajar los marcadores agregados sin explicación', () => {
  const home = state => renderAppMarkup({ ...state, view: 'home', diagnosticCompleted: true });
  const mastered = earnMastery();
  assert.match(home(mastered), /1\/72/, 'una competencia acreditada cuenta en portada');
  const unsafe = assess(mastered, { correct: true, safetyGatePassed: false, now: at(9) });
  assert.equal(unsafe.progress[ID].mastered, false);
  assert.match(home(unsafe), /1\/72/, 'el trabajo hecho sigue contando tras suspender la aptitud');
  assert.match(renderAppMarkup({ ...unsafe, view: 'map', skillDetailOpen: false }), /is-suspended/, 'la suspensión se ve donde es accionable');
});

test('un fichero inválido no sustituye el progreso vigente ni se confirma como importado', () => {
  const current = earnMastery();
  const invalid = [
    { schemaVersion: PROGRESS_SCHEMA_VERSION, classification: 'synthetic-progress', locale: 'es', track: 'dual', progress: { 'REAL-SKILL-01': { mastery: 100 } } },
    { schemaVersion: 99, classification: 'synthetic-progress', locale: 'es', track: 'dual', progress: {} },
    { schemaVersion: PROGRESS_SCHEMA_VERSION, classification: 'real-progress', locale: 'es', track: 'dual', progress: {} },
    { schemaVersion: PROGRESS_SCHEMA_VERSION, classification: 'synthetic-progress', locale: 'es', track: 'dual', progress: {}, exfiltrated: 'x' },
    'not-an-object'
  ];
  for (const value of invalid) {
    const after = reduceState(current, { type: 'IMPORT_STATE', value });
    assert.equal(after.toast, 'import-error', `no puede confirmarse como importado: ${JSON.stringify(value)}`);
    assert.deepEqual(after.progress, current.progress, `el progreso vigente se conserva: ${JSON.stringify(value)}`);
  }
});

test('el aviso de almacenamiento sustituye a la confirmación cuando el guardado falla', () => {
  const written = [];
  const working = { getItem: () => null, setItem: (key, value) => written.push([key, value]), removeItem: () => {} };
  const quotaFull = {
    getItem: () => null,
    setItem: () => { const error = new Error('exceeded the quota'); error.name = 'QuotaExceededError'; throw error; },
    removeItem: () => {}
  };
  withLocalStorage(working, () => {
    const root = fakeRoot();
    const app = mountSapB1Lab(root);
    app.dispatch({ type: 'PRACTISE_SKILL', skillId: ID, now: at(1) });
    assert.equal(app.getState().toast, 'practice-recorded', 'con almacenamiento sano se confirma como siempre');
    assert.match(written.at(-1)[1], /synthetic-progress/);
  });
  withLocalStorage(quotaFull, () => {
    const root = fakeRoot();
    const app = mountSapB1Lab(root);
    app.dispatch({ type: 'PRACTISE_SKILL', skillId: ID, now: at(1) });
    const state = app.getState();
    assert.equal(state.progress[ID].explored, true, 'la sesión en curso conserva su progreso: salida segura, no excepción');
    assert.equal(state.toast, 'storage-error', 'una cuota agotada se anuncia');
    assert.equal(toastOf(root.innerHTML).includes('Registrar práctica'), false, 'no se confirma un guardado que no ha ocurrido');
    assert.ok(toastOf(root.innerHTML).length > 0, 'el aviso es visible, no silencioso');
  });
});

test('volver a pulsar comprobar sobre la misma respuesta no es un intento nuevo', () => {
  // La racha sostenida mide recuperación repetida, no insistencia sobre el mismo acierto ya
  // corregido: si un segundo clic contase, tres pulsaciones acreditarían una competencia.
  const skill = SKILLS.find(entry => getActivity(entry, 'es').type === 'bughunt');
  const errorIndex = getActivity(skill, 'es').clues.findIndex(clue => clue.error);
  const working = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  withLocalStorage(working, () => {
    const root = fakeRoot();
    const app = mountSapB1Lab(root);
    root.fire('click', { dataset: { action: 'select-skill', skill: skill.id } });
    root.fire('click', { dataset: { action: 'set-skill-mode', mode: 'prove' } });
    root.fire('click', { dataset: { action: 'activity-toggle', key: `clue-${errorIndex}` } });
    root.fire('click', { dataset: { action: 'check-activity' } });
    const first = app.getState().progress[skill.id];
    assert.equal(first.streak, 1, 'el primer acierto sí cuenta');
    assert.equal(first.correctAttempts, 1);
    root.fire('click', { dataset: { action: 'check-activity' } });
    const second = app.getState().progress[skill.id];
    assert.equal(second.streak, 1, 'comprobar dos veces la misma respuesta no suma racha');
    assert.equal(second.correctAttempts, 1, 'ni aciertos acumulados');
    assert.equal(second.mastered, false, 'ni acredita la competencia a base de clics');
  });
});

test('registrar lectura o práctica no revalida una puerta de seguridad fallada', () => {
  const unsafe = assess(earnMastery(), { correct: true, safetyGatePassed: false, now: at(9) });
  assert.equal(unsafe.progress[ID].mastered, false);
  const practised = reduceState(unsafe, { type: 'PRACTISE_SKILL', skillId: ID, now: at(10) });
  assert.equal(practised.progress[ID].safetyGatePassed, false, 'registrar práctica no borra el fallo de seguridad');
  assert.equal(practised.progress[ID].mastered, false, 'ni restituye por sí solo la aptitud');
  assert.equal(practised.progress[ID].everMastered, true, 'ni borra el logro histórico');
  assert.equal(roundtrip(practised).valid, true, 'el estado resultante sigue siendo importable');
  assert.equal(assess(practised, { correct: true, safetyGatePassed: true, now: at(11) }).progress[ID].mastered, true,
    'solo una evaluación que vuelve a pasar la puerta restituye la aptitud');
});

test('cambiar de idioma a mitad de evaluación conserva el progreso y su roundtrip', () => {
  const state = assess(reduceState(createInitialState({ selectedSkillId: ID }), { type: 'PRACTISE_SKILL', skillId: ID, now: at(1) }),
    { correct: true, principleCorrect: true, now: at(2) });
  const before = state.progress[ID];
  const de = reduceState(state, { type: 'SET_LOCALE', locale: 'de' });
  assert.deepEqual(de.progress[ID], before, 'el registro de progreso no depende del idioma de la interfaz');
  const imported = roundtrip(de);
  assert.equal(imported.valid, true, `roundtrip rechazado tras cambiar de idioma: ${imported.reason}`);
  assert.equal(reduceState(createInitialState(), { type: 'IMPORT_STATE', value: imported.value }).locale, 'de');
});

test('la migración v1 no lava tipos: un booleano falsificado se rechaza', () => {
  const base = {
    knowledge: 90, application: 95, verification: 100, risk: 95, mastery: 95,
    explored: true, streak: 3, lastPractised: at(1), nextReview: at(2)
  };
  for (const record of [
    { ...base, mastered: 'yes' },
    { ...base, mastered: true, explored: 'true' },
    { ...base, mastered: true, safetyGatePassed: 'no' }
  ]) {
    const result = validateProgressImport({ schemaVersion: 1, classification: 'synthetic-progress', locale: 'es', track: 'dual', progress: { [ID]: record } });
    assert.equal(result.valid, false, JSON.stringify(record));
    assert.equal(result.reason, 'progress-type');
  }
});


test('la portada explica qué mide el agregado de dominio en los tres idiomas', () => {
  for (const locale of ['es', 'en', 'de']) {
    const practised = reduceState(createInitialState(), { type: 'PRACTISE_SKILL', skillId: 'SYN-SK-L4-03', now: '2026-08-22T00:00:00.000Z' });
    const state = reduceState(practised, { type: 'SET_LOCALE', locale });
    const html = renderAppMarkup(state);
    assert.match(html, /sbl-scope-note/, `nota de alcance ausente en ${locale}`);
    assert.ok(html.includes('certificación') || html.includes('certification') || html.includes('Zertifizierung'),
      `el aviso de no certificación no aparece en ${locale}`);
  }
});

test('la nota de alcance solo aparece con diagnóstico completado, no en la primera visita', () => {
  const firstVisit = renderAppMarkup(createInitialState());
  assert.doesNotMatch(firstVisit, /sbl-scope-note/, 'la nota debe esperar a que exista progreso que interpretar');
});

// ─── Matriz F2: roundtrip export/import tras CADA transición soportada ───────
// El plan exige que serializar→validar→importar conserve el significado tras cada
// acción, no solo al final. Este test recorre el ciclo de vida completo del lab
// (diagnóstico con sus preguntas y avances, pista, skill, práctica, evaluaciones
// incluida puerta de seguridad fallada, idioma, actividad, casos/incidentes/jefes,
// proceso, consola, búsquedas y filtros) y exige roundtrip válido TRAS CADA PASO.
test('la matriz de transiciones del laboratorio aguanta el roundtrip en cada paso', () => {
  const T = iso => iso;
  const matrix = state => {
    const check = validateProgressImport(JSON.parse(JSON.stringify(serializeProgress(state, T('2026-09-15T10:00:00.000Z')))));
    assert.equal(check.valid, true, `roundtrip rechazado: ${check.reason}`);
  };
  const assessStep = (state, step) => reduceState(state, { type: 'ASSESS_SKILL', skillId: step.skillId ?? 'SYN-SK-L0-01', correct: step.correct, principleCorrect: step.principleCorrect ?? false, safetyGatePassed: step.safetyGatePassed ?? true, now: step.now });
  let state = createInitialState();
  const step = action => { state = reduceState(state, action); matrix(state); };

  for (let i = 0; i < 6; i++) {
    state = reduceState(state, { type: 'ANSWER_DIAGNOSTIC', correct: i < 4 });
    matrix(state);
    state = reduceState(state, { type: 'NEXT_DIAGNOSTIC' });
    matrix(state);
  }
  assert.equal(state.diagnosticCompleted, true, 'el diagnóstico debe completarse con sus 6 preguntas');
  step({ type: 'SET_TRACK', track: 'technical' });
  step({ type: 'SELECT_SKILL', skillId: 'SYN-SK-L2-03' });
  step({ type: 'SET_SKILL_MODE', mode: 'guided' });
  state = reduceState(state, { type: 'PRACTISE_SKILL', skillId: 'SYN-SK-L2-03', now: T('2026-09-15T09:00:00.000Z') });
  matrix(state);
  state = assessStep(state, { correct: true, principleCorrect: true, now: T('2026-09-15T09:05:00.000Z') });
  matrix(state);
  state = assessStep(state, { correct: true, principleCorrect: true, safetyGatePassed: false, now: T('2026-09-15T09:10:00.000Z') });
  matrix(state);
  step({ type: 'SET_LOCALE', locale: 'de' });
  step({ type: 'ACTIVITY_ANSWER', key: 'sim-0', value: 'Ziel' });
  step({ type: 'ACTIVITY_HINT' });
  step({ type: 'RESET_ACTIVITY' });
  step({ type: 'NEXT_DECISION', kind: 'case' });
  step({ type: 'NEXT_DECISION', kind: 'incident' });
  step({ type: 'NEXT_DECISION', kind: 'boss' });
  step({ type: 'SELECT_PROCESS', process: 'O2C' });
  step({ type: 'SELECT_PROCESS_STEP', index: 2 });
  step({ type: 'SET_CONSOLE_TAB', tab: 'dashboards' });
  step({ type: 'SET_SKILL_SEARCH', value: 'factura' });
  step({ type: 'SET_LEVEL_FILTER', value: '3' });
  step({ type: 'SET_TRACK_FILTER', value: 'functional' });

  const payload = serializeProgress(state, T('2026-09-15T14:00:00.000Z'));
  assert.equal(payload.settings.diagnosticCompleted, true);
  assert.equal(payload.settings.recommendedLevel, 6);
  assert.equal(payload.locale, 'de');
  assert.equal(payload.track, 'technical');
});

// ─── Salida segura con cuota agotada en TODAS las superficies que mutan ──────
// El contrato F2 exige aviso + salida segura (sesión viva en memoria, sin falso
// acuse) cuando el almacenamiento falla. Ya está probado para práctica; aquí se
// cubren importación y reset —las otras dos superficies que destruirían o
// sustituirían estado si el fallo se manejaran mal.
test('cuota agotada: importar un progreso válido no destruye la sesión ni miente', () => {
  const quotaFull = {
    getItem: () => null,
    setItem: () => { const error = new Error('exceeded the quota'); error.name = 'QuotaExceededError'; throw error; },
    removeItem: () => {}
  };
  const source = earnMastery();
  const payload = serializeProgress(source, at(28));
  withLocalStorage(quotaFull, () => {
    const root = fakeRoot();
    const app = mountSapB1Lab(root);
    const before = app.getState().progress;
    app.dispatch({ type: 'IMPORT_STATE', value: payload });
    const after = app.getState();
    // La importación EN MEMORIA sí aplica (es estado de sesión), pero el aviso debe
    // decir que no se pudo persistir: no puede sonar a import-ok cuando nada se guardó.
    assert.notEqual(after.toast, 'import-ok', 'import-ok sería un falso acuse con cuota agotada');
    assert.equal(after.toast, 'storage-error', 'el fallo de persistencia se anuncia');
    assert.ok(Object.keys(after.progress).length > 0, 'la sesión sigue viva: salida segura');
    void before;
  });
});

test('cuota agotada: resetear el progreso anuncia el fallo en lugar de fingir éxito', () => {
  const quotaFull = {
    getItem: () => null,
    setItem: () => { const error = new Error('exceeded the quota'); error.name = 'QuotaExceededError'; throw error; },
    removeItem: () => {}
  };
  withLocalStorage(quotaFull, () => {
    const root = fakeRoot();
    const app = mountSapB1Lab(root);
    app.dispatch({ type: 'PRACTISE_SKILL', skillId: ID, now: at(1) });
    app.dispatch({ type: 'RESET' });
    const after = app.getState();
    assert.equal(after.toast, 'storage-error', 'el reset también avisa cuando no puede persistir el estado limpio');
    assert.equal(after.toast, 'storage-error');
  });
});
