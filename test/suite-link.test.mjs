import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, reduceState, renderAppMarkup, SUITE_SAPMENTOR_URL } from '../src/app.mjs';

const EXPECTED_LABEL = {
  es: 'Abrir SapMentor',
  en: 'Open SapMentor',
  de: 'SapMentor öffnen',
};

test('suite link: production SapMentor URL is a constant, never built from input', () => {
  assert.equal(SUITE_SAPMENTOR_URL, 'https://chatgptsapb1.vercel.app/');
});

for (const locale of ['es', 'en', 'de']) {
  test(`suite link renders on the cover in ${locale} with a safe external anchor`, () => {
    const state = reduceState(createInitialState(), { type: 'SET_LOCALE', locale });
    const html = renderAppMarkup(state);
    assert.ok(html.includes(`href="${SUITE_SAPMENTOR_URL}"`), `${locale}: suite href missing`);
    assert.ok(html.includes(EXPECTED_LABEL[locale]), `${locale}: suite label missing`);
    assert.ok(html.includes('target="_blank"'), `${locale}: new-tab target missing`);
    assert.ok(html.includes('rel="noopener noreferrer"'), `${locale}: opener protection missing`);
  });
}
