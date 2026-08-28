import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import vm from 'node:vm';

// Paths resueltos desde la raíz del repo (cwd de npm test).
const req = createRequire(process.cwd() + '/package.json');
const { TERMS } = req('./src/content/i18n-terms.mjs');
const { SKILLS } = req('./src/content.mjs');

// Detectores de los 7 defectos de la auditoría i18n DOM del 2026-08-27.
// Se ejecutan contra el bundle construido con el mismo harness VM del render test:
// sin navegador, pero ejerciendo dispatch reales (locale → check → locale).

async function bootApp() {
  const html = await readFile('dist/sap-b1-mastery-lab.html', 'utf8');
  const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1];
  const listeners = new Map();
  const storage = new Map();
  const root = {
    innerHTML: '', attributes: {},
    addEventListener(type, handler) { listeners.set(type, handler); },
    setAttribute(name, value) { this.attributes[name] = value; },
    querySelector() { return null; }
  };
  const context = vm.createContext({
    document: { getElementById: () => root },
    localStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: key => storage.delete(key)
    },
    URL, Blob, FileReader: class {}, structuredClone, console
  });
  new vm.Script(script).runInContext(context);
  const fire = (type, control) => listeners.get(type)({ target: { ...control, dataset: control.dataset || {}, closest: () => control } });
  return { root, fire };
}

const decode = html => html
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
// Detector de español independiente del catálogo (mismo criterio que i18n-language.test.mjs):
// artículos, sufijos -ción, ñ y signos ¿¡. El feedback congelado mezcla diccionarios UI,
// diccionario FEEDBACK de activities.mjs y contenido truncado a 60 caracteres — un regex
// de idioma lo caza todo; una lista de marcadores TERMS no.
const READS_SPANISH = /(?:^|\s)(el|la|los|las|del|que|para|con|una|por|como|desde|entre|sobre|cuando|donde|cada|todo|toda|más|sin|según|está|están|son|hay|pero|este|esta|esto|sus|tus|nunca|siempre|antes|después|aunque|porque)(?=[\s.,:;)»"']|$)|ción\b|ciones\b|ñ|¿|¡/i;

// D4 — typo alemán
test('D4: German case text uses teilgeliefert, not teiligeliefert', async () => {
  const html = await readFile('dist/sap-b1-mastery-lab.html', 'utf8');
  assert.equal(html.includes('teiligeliefert'), false, 'typo teiligeliefert still present');
  assert.equal(html.includes('teilgeliefert'), true, 'corrected teilgeliefert missing');
});

// D2 — doble escape: el HTML de CADA render (cada skill × modo) se inspecciona en el momento,
// porque cada dispatch reemplaza root.innerHTML por completo.
test('D2: no double-escaped entities rendered in any locale', async () => {
  const { root, fire } = await bootApp();
  for (const locale of ['es', 'en', 'de']) {
    fire('change', { dataset: { action: 'locale' }, value: locale });
    for (const mode of ['learn', 'guided']) {
      for (const skill of SKILLS.filter((_, index) => index % 4 === 0)) {
        fire('click', { dataset: { action: 'select-skill', skill: skill.id }, disabled: false });
        fire('click', { dataset: { action: 'set-skill-mode', mode }, disabled: false });
        // Doble escape en HTML crudo: el segundo escape convierte '&#39;' en '&amp;#39;'.
        // Un '&' literal bien escapado ("drag&amp;drop") NO coincide con estos patrones.
        const entities = root.innerHTML.match(/&amp;#39;|&amp;quot;|&amp;lt;|&amp;gt;|&amp;amp;/g) || [];
        assert.equal(entities.length, 0, `${locale}/${skill.id}/${mode}: ${entities.length} visible entities (double escape)`);
      }
    }
  }
});

// D3 — etiquetas de war story duplicadas
test('D3: war story texts do not start with their own label', async () => {
  const { root, fire } = await bootApp();
  const LABELS = { es: ['Síntoma', 'Causa raíz', 'Resolución'], en: ['Symptom', 'Root cause', 'Resolution'], de: ['Symptom', 'Ursache', 'Lösung'] };
  for (const locale of ['es', 'en', 'de']) {
    fire('change', { dataset: { action: 'locale' }, value: locale });
    for (const skill of SKILLS.filter((_, index) => index % 4 === 0)) {
      fire('click', { dataset: { action: 'select-skill', skill: skill.id }, disabled: false });
      fire('click', { dataset: { action: 'set-skill-mode', mode: 'learn' }, disabled: false });
      const text = decode(root.innerHTML).replace(/<[^>]+>/g, ' ');
      for (const label of LABELS[locale]) {
        const doubled = new RegExp(`${label}\\s+${label}`);
        assert.equal(doubled.test(text), false, `${locale}/${skill.id}: duplicated label "${label}"`);
      }
    }
  }
});

// D1 — feedback congelado: check en ES → cambiar a EN/DE → el feedback no puede leerse en español
test('D1: activity feedback re-renders in the active locale after switching language', async () => {
  const { root, fire } = await bootApp();
  // 1. check vacío en español sobre una actividad de secuencia (L8-01)
  fire('change', { dataset: { action: 'locale' }, value: 'es' });
  fire('click', { dataset: { action: 'select-skill', skill: 'SYN-SK-L8-01' }, disabled: false });
  fire('click', { dataset: { action: 'set-skill-mode', mode: 'guided' }, disabled: false });
  fire('click', { dataset: { action: 'check-activity' }, disabled: false });
  assert.ok(root.innerHTML.includes('act-feedback'), 'feedback block missing after check');
  // 2. cambiar a EN: el bloque de feedback completo debe leerse en inglés
  fire('change', { dataset: { action: 'locale' }, value: 'en' });
  const textEn = decode(root.innerHTML).replace(/<[^>]+>/g, ' ');
  const at = textEn.indexOf('Not yet');
  assert.ok(at >= 0, 'EN: feedback anchor "Not yet" missing after locale switch');
  const feedbackChunk = textEn.slice(at, at + 700);
  assert.equal(READS_SPANISH.test(feedbackChunk), false, `EN: feedback still reads as Spanish: ${feedbackChunk.slice(0, 160)}`);
  // 3. cambiar a DE
  fire('change', { dataset: { action: 'locale' }, value: 'de' });
  const textDe = decode(root.innerHTML).replace(/<[^>]+>/g, ' ');
  const idx = textDe.indexOf('Noch nicht');
  assert.ok(idx >= 0, 'DE: feedback anchor "Noch nicht" missing after locale switch');
  const feedbackChunkDe = textDe.slice(idx, idx + 700);
  assert.equal(READS_SPANISH.test(feedbackChunkDe), false, `DE: feedback still reads as Spanish: ${feedbackChunkDe.slice(0, 160)}`);
});

// D5 — comillas angulares en valores EN del catálogo
test('D5: English catalog values use English quotes, not guillemets', () => {
  const offenders = Object.entries(TERMS)
    .filter(([, entry]) => typeof entry.en === 'string' && (entry.en.includes('«') || entry.en.includes('»')))
    .map(([spanish]) => spanish.slice(0, 60));
  assert.deepEqual(offenders, [], `EN values with guillemets: ${offenders.join(' | ')}`);
});

// D6 — celda OINV (facturas) resuelta en EN/DE
test('D6: OINV (facturas) mockup cell is translated in en/de', async () => {
  const { root, fire } = await bootApp();
  for (const locale of ['en', 'de']) {
    fire('change', { dataset: { action: 'locale' }, value: locale });
    fire('click', { dataset: { action: 'select-skill', skill: 'SYN-SK-L6-03' }, disabled: false });
    fire('click', { dataset: { action: 'set-skill-mode', mode: 'learn' }, disabled: false });
    const text = decode(root.innerHTML);
    assert.equal(text.includes('OINV (facturas)'), false, `${locale}: OINV (facturas) still in Spanish`);
    assert.ok(text.includes('OINV (invoices)') || text.includes('OINV (Rechnungen)'), `${locale}: translated OINV cell missing`);
  }
});

// D7 — el simulador ya no pega etiqueta y valor (clase CSS presente)
test('D7: simulator effect rows have separating CSS', async () => {
  const html = await readFile('dist/sap-b1-mastery-lab.html', 'utf8');
  assert.ok(/\.sbl-effect\s*\{[^}]*display\s*:\s*(flex|grid)/.test(html), 'no .sbl-effect layout rule in bundle CSS');
});
