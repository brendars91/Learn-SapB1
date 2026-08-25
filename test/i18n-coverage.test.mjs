import test from 'node:test';
import assert from 'node:assert/strict';
import { I18N, SKILLS, CASES, INCIDENTS, BOSSES, EVIDENCE, PROCESS_STEPS, LEVELS } from '../src/content.mjs';
import { MASTERCLASS } from '../src/masterclass.mjs';
import { CAREER } from '../src/career.mjs';
import { DEEP } from '../src/content/deep.mjs';
import { ADVANCED_QUERIES, DASHBOARD_PATTERNS, VIBE_PATTERNS } from '../src/advanced.mjs';
import { TERMS, INVARIANT } from '../src/content/i18n-terms.mjs';
import { isInvariant } from '../src/i18n.mjs';

const LOCALES = ['en', 'de'];

// Claves que nunca son prosa: identificadores, SQL, banderas de configuración.
const STRUCTURAL = /^(id|classification|track|evidenceId|prerequisites|k|g|activeTab|correct|ok|prinOk|principleCorrect|riskWeight|level|confidence|sourceType|url|verifiedAt|unit|at|menu|practice|sql|tables|dialect|numeric|rw|ev|engines|template)$/;
// Celdas que solo llevan cifras, códigos SYN/SAP o símbolos: iguales en los tres idiomas.
const DATA_ONLY = /^[\s\d.,:;%+\-–—()\/€$#*✔✖×xX·]*$/;
const CODE_LIKE = /^(SYN-|EV-|OINV|JDT1|OITW|ITT1|OIVL|IVL1|PDN1|RDR1|SBO|C\d{5}|V\d{5}|A\d{5}|P-SYN|10\.0|FP )/;
const isTranslatable = value => Boolean(value)
  && !DATA_ONLY.test(value)
  && !CODE_LIKE.test(value)
  && /[a-zA-ZáéíóúüñÁÉÍÓÚÑäöüß]/.test(value);

// Términos que coinciden legítimamente entre idiomas: nombre del producto,
// verbos idénticos en español e inglés y anglicismos ya adoptados en los tres.
const SHARED_UI_TERMS = new Set(['coverTitle', 'stepDecide', 'effectStock', 'navMap', 'status', 'scenario', 'symptom', 'level', 'action', 'mcTitle']);

const ROOTS = { SKILLS, CASES, INCIDENTS, BOSSES, EVIDENCE, PROCESS_STEPS, LEVELS, MASTERCLASS, CAREER, DEEP, ADVANCED_QUERIES, DASHBOARD_PATTERNS, VIBE_PATTERNS };

function collectGaps(locale) {
  const gaps = [];
  const isNode = value => value && typeof value === 'object' && !Array.isArray(value) && typeof value.es === 'string';
  const isListNode = value => value && typeof value === 'object' && !Array.isArray(value) && Array.isArray(value.es);
  const report = (spanish, where) => {
    if (typeof spanish !== 'string' || !isTranslatable(spanish) || isInvariant(spanish)) return;
    // A translation may legitimately read the same as the Spanish; what must exist is the decision.
    const translated = TERMS[spanish] && TERMS[spanish][locale];
    if (typeof translated !== 'string' || !translated.trim()) gaps.push(`${where}: ${spanish.slice(0, 60)}`);
  };
  const walk = (value, path, key) => {
    if (typeof value === 'string') {
      if (!STRUCTURAL.test(key)) report(value, path);
      return;
    }
    if (Array.isArray(value)) return value.forEach((item, index) => walk(item, `${path}[${index}]`, key));
    if (!value || typeof value !== 'object') return;
    if (isNode(value)) {
      const own = value[locale];
      if (typeof own !== 'string' || !own.trim()) report(value.es, path);
      return;
    }
    if (isListNode(value)) {
      const own = Array.isArray(value[locale]) ? value[locale] : [];
      value.es.forEach((item, index) => {
        if (typeof item !== 'string') return walk(item, `${path}.es[${index}]`, key);
        const translated = own[index];
        if (typeof translated !== 'string' || !translated.trim()) report(item, `${path}[${index}]`);
      });
      return;
    }
    for (const childKey of Object.keys(value)) walk(value[childKey], `${path}.${childKey}`, childKey);
  };
  for (const [name, root] of Object.entries(ROOTS)) walk(root, name, name);
  return gaps;
}

for (const locale of LOCALES) {
  test(`every content string resolves to ${locale}`, () => {
    const gaps = collectGaps(locale);
    assert.equal(gaps.length, 0, `${gaps.length} strings without ${locale}:\n${gaps.slice(0, 25).join('\n')}`);
  });
}

test('the UI dictionary covers the same keys in the three languages', () => {
  const spanishKeys = Object.keys(I18N.es);
  for (const locale of LOCALES) {
    const missing = spanishKeys.filter(key => typeof I18N[locale][key] !== 'string' || !I18N[locale][key].trim());
    assert.equal(missing.length, 0, `${locale} lacks UI keys: ${missing.join(', ')}`);
    const untranslated = spanishKeys.filter(key => I18N[locale][key] === I18N.es[key] && isTranslatable(I18N.es[key]) && !SHARED_UI_TERMS.has(key));
    assert.equal(untranslated.length, 0, `${locale} copies Spanish verbatim in: ${untranslated.join(', ')}`);
  }
});

test('no text is both translated and declared invariant', () => {
  const both = [...INVARIANT].filter(term => TERMS[term]);
  assert.equal(both.length, 0, `declared invariant yet translated: ${both.slice(0, 5).join(' | ')}`);
});

test('the catalog never leaves a language empty', () => {
  const broken = Object.entries(TERMS).filter(([spanish, entry]) =>
    LOCALES.some(locale => entry[locale] !== undefined && (typeof entry[locale] !== 'string' || !entry[locale].trim())) || !spanish);
  assert.equal(broken.length, 0, `catalog entries with an empty language: ${broken.slice(0, 5).map(([k]) => k).join(' | ')}`);
});
