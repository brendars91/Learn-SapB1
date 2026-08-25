import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { TERMS } from '../src/content/i18n-terms.mjs';
import { SKILLS } from '../src/content.mjs';

// Textos españoles largos que el catálogo traduce de otro modo: si uno aparece en el HTML
// de otro idioma, es un texto que el renderizador dejó sin pasar por la traducción.
function spanishMarkers(locale) {
  return Object.entries(TERMS)
    .filter(([spanish, entry]) => spanish.length >= 14 && typeof entry[locale] === 'string' && entry[locale] !== spanish)
    .map(([spanish]) => spanish);
}

const escapeHtml = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

async function renderEverything(locale) {
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
  const seen = [];
  const capture = () => seen.push(root.innerHTML);

  fire('change', { dataset: { action: 'locale' }, value: locale });
  capture();
  for (const view of ['career', 'map', 'cases', 'incidents', 'simulator', 'ai', 'evidence', 'home']) {
    fire('click', { dataset: { action: 'nav', view }, disabled: false });
    capture();
  }
  fire('click', { dataset: { action: 'nav', view: 'map' }, disabled: false });
  // Una competencia por nivel, en los tres modos: entender, práctica guiada y demostrar.
  for (const skill of SKILLS.filter((_, index) => index % 8 === 0)) {
    fire('click', { dataset: { action: 'select-skill', skill: skill.id }, disabled: false });
    capture();
    for (const mode of ['guided', 'prove', 'learn']) {
      fire('click', { dataset: { action: 'set-skill-mode', mode }, disabled: false });
      capture();
    }
  }
  for (const step of ['sales', 'purchase', 'finance', 'integration']) {
    fire('click', { dataset: { action: 'nav', view: 'simulator' }, disabled: false });
    fire('click', { dataset: { action: 'select-process', process: step }, disabled: false });
    capture();
  }
  return seen.join('\n');
}

for (const locale of ['de', 'en']) {
  test(`the rendered app leaves no Spanish behind in ${locale}`, async () => {
    const rendered = await renderEverything(locale);
    const leaks = spanishMarkers(locale).filter(marker => rendered.includes(escapeHtml(marker)));
    assert.equal(leaks.length, 0, `${leaks.length} Spanish strings rendered in ${locale}:\n${leaks.slice(0, 15).join('\n')}`);
  });
}
