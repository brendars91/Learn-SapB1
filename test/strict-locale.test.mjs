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

test('dynamic validation feedback is translated end to end', () => {
  assert.equal(strictTranslateText('Paso 2: esperaba "Entrega"', 'en'), 'Step 2: expected "Delivery"');
  assert.equal(strictTranslateText('Paso 2: esperaba "Entrega"', 'de'), 'Schritt 2: erwartet "Lieferung"');
  assert.equal(strictTranslateText('correcto: Debe 100,00', 'en'), 'correct: Debit 100,00');
  assert.equal(strictTranslateText('correcto: Debe 100,00', 'de'), 'richtig: Soll 100,00');
  assert.equal(strictTranslateText('Ruta: Ventas > Pedido de cliente > Entrega > Factura', 'en'), 'Path: Sales > Sales Order > Delivery > Invoice');
  assert.equal(strictTranslateText('Ruta: Ventas > Pedido de cliente > Entrega > Factura', 'de'), 'Pfad: Verkauf > Kundenauftrag > Lieferung > Rechnung');
});

test('strict locale values never fall back to another language', () => {
  assert.equal(strictLocaleText({ es: 'Hola', en: 'Hello', de: 'Hallo' }, 'en'), 'Hello');
  assert.equal(strictLocaleText({ es: 'Hola', en: 'Hello', de: 'Hallo' }, 'de'), 'Hallo');
  assert.equal(strictLocaleText({ es: 'Hola' }, 'en'), '');
  assert.equal(strictLocaleText({ es: 'Hola' }, 'de'), '');
  assert.equal(strictLocaleText('Ventas', 'en'), '');
  assert.equal(strictLocaleText('Ventas', 'de'), '');
  assert.equal(strictLocaleText('Ventas', 'es'), 'Ventas');
});

test('Spanish residue detector catches full sentences, UI labels and accounting terms', () => {
  const spanish = [
    'Pedido de cliente',
    'Selecciona una opción para continuar',
    'La factura genera el asiento automáticamente',
    'Paso 2: esperaba Entrega',
    'Debe 100,00 / Haber 100,00',
    'Volver a la lista',
    'Añadir documento',
    'Fecha contable',
    'Cantidad abierta',
    'Buenas prácticas senior'
  ];
  for (const text of spanish) assert.equal(hasLegacySpanish(text), true, text);
  for (const text of ['Kundenauftrag', 'Sales order', 'Debit 100.00 / Credit 100.00', 'Lieferung buchen']) {
    assert.equal(hasLegacySpanish(text), false, text);
  }
});
