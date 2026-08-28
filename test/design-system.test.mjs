import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { createRequire } from 'node:module';

// ─── Design-system contract (N1) ─────────────────────────────
// Regla 1: toda clase emitida por el render debe existir en styles.css
//          (o estar en la whitelist documentada de abajo).
// Regla 2: styles.css solo puede usar la escala tipográfica y de espaciado bloqueada.
// Regla 3: un solo sistema de radios, documentado.
// Nace del bug real: HTML emitía .sbl-heat-cell pero CSS solo definía .sbl-heatcell
// (segunda clase de bug "CSS nunca aplicado" tras .sbl-effect del PR #38).

const req = createRequire(process.cwd() + '/package.json');
// Todos los CSS del bundle: styles, ui-b1 (masterclass .b1-/.mc-), activities, console (.csl-)
const css = (await Promise.all(['src/styles.css', 'src/ui-b1.css', 'src/activities.css', 'src/console.css']
  .map(f => readFile(f, 'utf8')))).join('\n');

// --- helpers ---------------------------------------------------
function extractCssClasses(cssText) {
  const classes = new Set();
  // selectores de reglas (ignora @font-face y keyframes)
  for (const m of cssText.matchAll(/(?:^|})\s*([^{}@]+)\{/g)) {
    for (const cls of m[1].matchAll(/\.([a-zA-Z0-9_-]+)/g)) classes.add(cls[1]);
  }
  return classes;
}

function htmlClasses(html) {
  const classes = new Set();
  for (const m of html.matchAll(/class="([^"]*)"/g)) {
    for (const c of m[1].split(/\s+/)) if (c) classes.add(c);
  }
  return classes;
}

// Boot del app compilado en VM (mismo patrón que i18n-dom-defects.test.mjs)
async function bootRender() {
  const html = await readFile('dist/sap-b1-mastery-lab.html', 'utf8');
  const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n');
  const storage = new Map();
  const sandbox = {
    console, setTimeout, clearTimeout,
    document: null, window: undefined, localStorage: {
      getItem: k => storage.get(k) ?? null,
      setItem: (k, v) => storage.set(k, v),
      removeItem: k => storage.delete(k)
    },
    navigator: { language: 'es' },
    location: { href: 'about:blank' }
  };
  sandbox.window = sandbox;
  const context = vm.createContext(sandbox);
  vm.runInContext(script, context, { timeout: 10000 });
  // El bundle expone la app en window.app o similar — inspeccionar
  return context;
}

// Whitelist: clases emitidas por el render que aún NO tienen CSS.
// DEUDA DOCUMENTADA — cada fase del PLAN-UX-LEDGER-V2 las estila y las ELIMINA
// de esta lista. Cuando quede vacía, el instrumento bloquea clases huérfanas nuevas.
// Actualizada: F0 2026-08-28.
const WHITELIST = new Set([
  // F0 (fix en esta fase): sbl-heat-cell/num/lab + sbl-heat-0..4 → estilan aquí
  // F2: estados de cards — eliminado de whitelist al completar F2
  // F1: escritorio (chips repaso, racha, recomendada)
  'sbl-desk', 'sbl-desk-row', 'sbl-desk-why', 'sbl-review-chip', 'sbl-streak-seal',
  // layout heredado sin estilo (deuda pre-plan, se estila en F2/F5/F6/F7)
  'sbl-mode-toggle', 'sbl-learn', 'sbl-masterclass', 'csl-lvlfill', 'mc-title', 'mc-grid', 'mc-block',
  'sbl-war', 'war-line', 'mc-bp', 'sbl-detail-grid__full', 'sbl-checklist', 'sbl-step-n',
  'sbl-radar-row', 'sbl-process-stage', 'sbl-process-mark', 'sbl-checks', 'sbl-file',
  // utilitarias del chrome estático
  'text-small', 'text-muted', 'card', 'btn', 'btn-primary', 'btn-ghost',
  'form-label', 'form-select', 'form-control', 'sep', 'crumb', 'table-sm',
]);

// ─── T1.1 class-coverage: cero clases huérfanas ───────────────
test('T1.1 class-coverage: every rendered class exists in styles.css or whitelist', async () => {
  // Render de las vistas clave con progreso variado
  const { renderAppMarkup, createInitialState, reduceState } = req('./src/app.mjs');
  const states = [];
  // estado vacío
  states.push(createInitialState());
  // estado con progreso mixto: explorada, mastered, vencida de repaso
  const withProgress = reduceState(createInitialState(), { type: 'IMPORT_STATE', value: {
    locale: 'es', view: 'home',
    progress: {
      'SYN-SK-L0-01': { knowledge: 80, application: 80, verification: 90, risk: 90, mastery: 85, mastered: true, explored: true, streak: 3, correctAttempts: 3, lastPractised: '2026-08-20T10:00:00.000Z', nextReview: '2026-08-21T10:00:00.000Z' },
      'SYN-SK-L0-02': { knowledge: 60, application: 50, verification: 40, risk: 50, mastery: 50, mastered: false, explored: true, streak: 0, lastPractised: '2026-02-20T10:00:00.000Z', nextReview: '2026-02-21T10:00:00.00Z'.replace('00Z','00.000Z') }
    }
  } });
  states.push(withProgress);
  for (const locale of ['en', 'de']) states.push(reduceState(states[0], { type: 'SET_LOCALE', locale }));

  const cssClasses = extractCssClasses(css);
  const orphans = [];
  for (const state of states) {
    for (const view of ['home', 'career', 'map', 'cases', 'evidence', 'simulator']) {
      const s = { ...state, view };
      const html = renderAppMarkup(s);
      for (const cls of htmlClasses(html)) {
        if (!cssClasses.has(cls) && !WHITELIST.has(cls)) orphans.push(`${view}/${state.locale}: .${cls}`);
      }
    }
  }
  assert.deepEqual(orphans.sort(), [], `clases huérfanas:\n${[...new Set(orphans)].join('\n')}`);
});

// ─── T1.2 token-discipline (modo ratchet) ─────────────────────
// Congela la deuda tipográfica/espaciado existente como TECHO: cada fase la reduce,
// jamás la aumenta. Violaciones nuevas = rojo inmediato.
const TOKEN_BASELINE = 70; // conteo audito F0 2026-08-28 (styles+ui-b1+activities+console)
test('T1.2 token-discipline: font-size/spacing debt frozen (ratchet, never grows)', async () => {
  const violations = [];
  for (const m of css.matchAll(/font-size:\s*([^;]+);?/g)) {
    const value = m[1].trim();
    if (/var\(--step/.test(value) || value === '100%' || value === '1em') continue;
    violations.push(`font-size: ${value}`);
  }
  for (const prop of ['padding', 'margin']) {
    for (const m of css.matchAll(new RegExp(`${prop}:\\s*([^;{}]+)`, 'g'))) {
      const v = m[1].trim();
      if (v === '0' || v === 'auto') continue;
      if (/^var\(--s/.test(v) || /^calc\([^)]*--s/.test(v)) continue;
      if (v.split(/\s+/).every(part => /^var\(--s/.test(part) || part === '0')) continue;
      violations.push(`${prop}: ${v}`);
    }
  }
  assert.ok(violations.length <= TOKEN_BASELINE,
    `deuda tipográfica creció: ${violations.length} > ${TOKEN_BASELINE} (baseline F0).\nNuevas:\n${violations.join('\n')}`);
});

// ─── T1.3 single-radius (modo ratchet) ────────────────────────
const RADIUS_BASELINE = 3; // '2px','4px','4px 4px 0 0' auditados F0
test('T1.3 single-radius: radius debt frozen (ratchet, never grows)', async () => {
  const radii = new Set();
  for (const m of css.matchAll(/border-radius:\s*([^;}\n]+)/g)) radii.add(m[1].trim());
  const allowed = v => v === '0' || /^var\(--r/.test(v) || v.split(/\s+/).every(p => p === '0' || /^var\(--r/.test(p) || p === '50%');
  const bad = [...radii].filter(v => !allowed(v));
  assert.ok(bad.length <= RADIUS_BASELINE,
    `deuda de radios creció: ${bad.length} > ${RADIUS_BASELINE}: ${bad.join(' | ')}`);
});
