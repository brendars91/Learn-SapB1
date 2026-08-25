import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

test('built runtime mounts and completes representative interactions without a browser dependency', async () => {
  const html = await readFile('dist/sap-b1-mastery-lab.html', 'utf8');
  const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1];
  const listeners = new Map();
  const storage = new Map();
  const root = {
    innerHTML: '',
    attributes: {},
    addEventListener(type, handler) { listeners.set(type, handler); },
    setAttribute(name, value) { this.attributes[name] = value; },
    querySelector(selector) {
      if (selector === '#sbl-prompt') return { value: [
        'ROLE: learning coach', 'GOAL: safe diagnosis', 'CONTEXT: SYN-CASE-AI-01',
        'EVIDENCE: cite evidence id', 'UNCERTAINTY: state unverified facts',
        'OUTPUT: JSON schema', 'HUMAN REVIEW: stop before change'
      ].join('\n') };
      return null;
    }
  };
  const context = vm.createContext({
    document: { getElementById: () => root },
    localStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: key => storage.delete(key)
    },
    URL,
    Blob,
    FileReader: class {},
    structuredClone,
    console
  });

  assert.doesNotThrow(() => new vm.Script(script).runInContext(context));
  assert.match(root.innerHTML, /Entorno educativo: todos los datos son ficticios/);

  const fire = (type, control) => listeners.get(type)({ target: { ...control, dataset: control.dataset || {}, closest: () => control } });
  fire('change', { dataset: { action: 'locale' }, value: 'de' });
  assert.match(root.innerHTML, /Lernumgebung: Alle Daten sind fiktiv/);

  fire('click', { dataset: { action: 'nav', view: 'cases' }, disabled: false });
  fire('click', { dataset: { action: 'answer-decision', kind: 'case', correct: 'true', rationale: 'SYN rationale' }, disabled: false });
  assert.match(root.innerHTML, /data-correct="true"/);

  fire('click', { dataset: { action: 'nav', view: 'ai' }, disabled: false });
  assert.match(root.innerHTML, /Erweiterte Konsole/);
  fire('click', { dataset: { action: 'console-query', id: 'Q-AGING' }, disabled: false });

  fire('click', { dataset: { action: 'nav', view: 'map' }, disabled: false });
  fire('click', { dataset: { action: 'select-skill', skill: 'SYN-SK-L0-01' }, disabled: false });
  fire('click', { dataset: { action: 'practise-skill', skill: 'SYN-SK-L0-01' }, disabled: false });
  const saved = [...storage.values()].at(-1);
  assert.match(saved, /synthetic-progress/);
  assert.doesNotMatch(saved, /learning coach/);
  assert.match(root.innerHTML, /In Übung/);
});

