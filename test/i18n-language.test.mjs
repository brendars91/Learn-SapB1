import test from 'node:test';
import assert from 'node:assert/strict';
import { I18N, SKILLS, CASES, INCIDENTS, BOSSES, EVIDENCE, PROCESS_STEPS, LEVELS } from '../src/content.mjs';
import { MASTERCLASS } from '../src/masterclass.mjs';
import { CAREER } from '../src/career.mjs';
import { DEEP } from '../src/content/deep.mjs';
import { ADVANCED_QUERIES, DASHBOARD_PATTERNS, VIBE_PATTERNS } from '../src/advanced.mjs';
import { trText, trNode } from '../src/i18n.mjs';

// Detector de español independiente del catálogo. `i18n-coverage` comprueba que cada texto
// tenga una decisión de traducción; esto comprueba lo contrario: que el resultado ya no
// suene a español. Detecta lo que el catálogo no ve, como un nodo mal formado.
const SPANISH = /(?:^|\s)(el|la|los|las|del|que|para|con|una|por|como|desde|entre|sobre|cuando|donde|cada|todo|toda|más|sin|según|está|están|son|hay|pero|este|esta|esto|sus|tus|nunca|siempre|antes|después|aunque|porque)(?=[\s.,:;)»"']|$)|ción\b|ciones\b|ñ|¿|¡/i;
const STRUCTURAL = /^(id|classification|track|evidenceId|prerequisites|k|g|activeTab|correct|ok|prinOk|principleCorrect|riskWeight|level|confidence|sourceType|url|verifiedAt|unit|at|menu|practice|sql|tables|dialect|numeric|rw|ev|engines)$/;
const ROOTS = { SKILLS, CASES, INCIDENTS, BOSSES, EVIDENCE, PROCESS_STEPS, LEVELS, MASTERCLASS, CAREER, DEEP, ADVANCED_QUERIES, DASHBOARD_PATTERNS, VIBE_PATTERNS };

function spanishLeaks(locale) {
  const leaks = [];
  const check = (value, where) => {
    if (typeof value !== 'string' || value.length < 8) return;
    if (SPANISH.test(value)) leaks.push(`${where} :: ${value.slice(0, 90)}`);
  };
  const walk = (value, path, key) => {
    if (typeof value === 'string') { if (!STRUCTURAL.test(key)) check(trText(value, locale), path); return; }
    if (Array.isArray(value)) return value.forEach((item, index) => walk(item, `${path}[${index}]`, key));
    if (!value || typeof value !== 'object') return;
    const nested = Object.entries(value).some(([k, item]) => !['es', 'en', 'de'].includes(k) && item && typeof item === 'object');
    if (typeof value.es === 'string' && !nested) { check(trNode(value, locale), path); return; }
    if (Array.isArray(value.es)) {
      value.es.forEach((item, index) => {
        if (typeof item !== 'string') return walk(item, `${path}.es[${index}]`, key);
        const own = Array.isArray(value[locale]) ? value[locale][index] : undefined;
        check(typeof own === 'string' && own !== item ? own : trText(item, locale), `${path}[${index}]`);
      });
      return;
    }
    for (const childKey of Object.keys(value)) walk(value[childKey], `${path}.${childKey}`, childKey);
  };
  for (const [name, root] of Object.entries(ROOTS)) walk(root, name, name);
  Object.entries(I18N[locale]).forEach(([key, value]) => check(value, `I18N.${locale}.${key}`));
  return leaks;
}

for (const locale of ['en', 'de']) {
  test(`no content still reads as Spanish once resolved to ${locale}`, () => {
    const leaks = spanishLeaks(locale);
    assert.equal(leaks.length, 0, `${leaks.length} texts still read as Spanish in ${locale}:\n${leaks.slice(0, 20).join('\n')}`);
  });
}

test('the German UI does not fall back to English wording', () => {
  const shared = new Set(['status', 'symptom', 'warSymptom', 'coverTitle', 'mcTitle', 'navMap', 'level', 'action']);
  const copied = Object.keys(I18N.es).filter(key => I18N.de[key] === I18N.en[key] && I18N.de[key] !== I18N.es[key] && !shared.has(key));
  assert.deepEqual(copied, [], `German copies the English wording in: ${copied.join(', ')}`);
});
