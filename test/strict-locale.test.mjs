import test from 'node:test';
import assert from 'node:assert/strict';
import { strictTranslateText, strictLocaleText, hasLegacySpanish } from '../src/strict-locale.mjs';

test('activity UI has explicit EN/DE translations', () => {
  assert.equal(strictTranslateText('Cuenta', 'en'), 'Account');
  assert.equal(strictTranslateText('Cuenta', 'de'), 'Konto');
  assert.equal(strictTranslateText('· guiado', 'en'), '· guided');
  assert.equal(strictTranslateText('· guiado', 'de'), '· geführt');
  assert.equal(strictTranslateText('Decisión correcta: la evidencia, el control y el resultado son coherentes.', 'en'), 'Correct decision: the evidence, control, and result are consistent.');
  assert.equal(strictTranslateText('Revisa los elementos marcados y vuelve a intentarlo.', 'de'), 'Prüfe die markierten Elemente und versuche es erneut.');
});

test('dynamic validation feedback is localized', () => {
  assert.equal(strictTranslateText('Paso 2: esperaba "Entrega"', 'en'), 'Step 2: expected "Entrega"');
  assert.equal(strictTranslateText('Paso 2: esperaba "Entrega"', 'de'), 'Schritt 2: erwartet "Entrega"');
  assert.equal(strictTranslateText('correcto: Debe 100,00', 'en'), 'correct: Debe 100,00');
  assert.equal(strictTranslateText('correcto: Debe 100,00', 'de'), 'richtig: Debe 100,00');
});

test('strict locale values never fall back to Spanish for EN/DE', () => {
  assert.equal(strictLocaleText({ es: 'Hola', en: 'Hello' }, 'en'), 'Hello');
  assert.equal(strictLocaleText({ es: 'Hola' }, 'en'), '');
  assert.equal(strictLocaleText({ es: 'Hola' }, 'de'), '');
  assert.equal(strictLocaleText('Ventas', 'en'), '');
  assert.equal(strictLocaleText('Ventas', 'de'), '');
  assert.equal(strictLocaleText('Ventas', 'es'), 'Ventas');
});

test('Spanish residue detector catches legacy UI/content fragments', () => {
  assert.equal(hasLegacySpanish('Pedido de cliente'), true);
  assert.equal(hasLegacySpanish('Kundenauftrag'), false);
  assert.equal(hasLegacySpanish('Sales order'), false);
});
