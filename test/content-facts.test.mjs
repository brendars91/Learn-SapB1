// content-facts.test.mjs — Fase 2 del PLAN-PRODUCCION-v8.
//
// Fija los hechos que SI se verificaron contra fuente primaria oficial, con la
// cita literal en el propio test. Existe porque un plan anterior ordeno borrar
// la afirmacion FP 2405 por considerarla no soportada: era correcta y su
// eliminacion habria destruido contenido valido.
//
// Regla: para cambiar un hecho de este archivo hay que abrir la fuente citada.

import test from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS, EVIDENCE } from '../src/content.mjs';

// Verificado 2026-08-27 en Service Layer API Reference (help.sap.com,
// doc 056f69366b5345a386bb8149f1700c19). Cita literal:
// "As of SAP Business One FP 2405, OData Version 3 is deprecated and OData
//  Version 4 is the primary protocol supported in Service Layer."
test('the FP 2405 OData claim keeps its verbatim source quote', () => {
  const item = EVIDENCE.find(entry => entry.id === 'EV-SERVICE-LAYER');
  assert.ok(item, 'falta la ficha EV-SERVICE-LAYER');
  assert.match(item.url, /help\.sap\.com/, 'la fuente debe ser documentacion oficial de producto');
  assert.ok(item.quote, 'el claim FP 2405 exige cita literal registrada');
  assert.match(item.quote, /FP 2405/, 'la cita debe contener la version citada');
  assert.match(item.quote, /OData Version 3 is deprecated/, 'la cita debe sostener la deprecacion de v3');
  assert.match(item.quote, /OData Version 4 is the primary protocol/, 'la cita debe sostener v4 como principal');
});

// Verificado 2026-08-27 en Working with SAP Business One Service Layer 1.28
// (2026-01-07), seccion 3.9.4 Change Sets. Cita literal:
// "A change set is an atomic unit of works. It means that any failed sub request
//  in a change set will cause the whole change set to be rolled back."
// Y en 3.9.3: "The service processes the requests within a batch request
// sequentially." Por tanto el lote NO es la unidad atomica; el change set si.
test('batch atomicity is attributed to the change set, never to the whole batch', () => {
  const skill = SKILLS.find(entry => entry.id === 'SYN-SK-L7-07');
  assert.ok(skill, 'falta la skill de sesiones y lotes');
  assert.match(skill.title.es, /lotes/i, 'SYN-SK-L7-07 deberia ser la skill de sesiones y lotes');
  const concept = skill.concept.es;
  assert.match(concept, /change set/i, 'el concepto debe nombrar el change set como unidad atomica');
  assert.doesNotMatch(
    concept,
    /los lotes \(\$batch\) agrupan operaciones at[oó]micas/i,
    'el lote completo no tiene atomicidad documentada: la tiene el change set'
  );
});

// El registro de evidencia es la promesa de trazabilidad de la aplicacion.
test('every evidence entry points at an official SAP domain', () => {
  for (const item of EVIDENCE) {
    assert.equal(item.sourceType, 'official', item.id + ': solo se admiten fuentes oficiales');
    assert.match(item.url, /^https:\/\/(help|learning)\.sap\.com\//, item.id + ': URL no oficial ' + item.url);
    assert.match(item.verifiedAt, /^\d{4}-\d{2}-\d{2}$/, item.id + ': fecha de verificacion ausente o mal formada');
  }
});

// D9: los numeros de cuenta son ejemplos, no valores de SAP. Si se muestran sin
// su advertencia, la aplicacion ensena un plan contable como si fuera estandar.
test('the account disclaimer exists in the three locales and names its dependencies', async () => {
  const { I18N } = await import('../src/content.mjs');
  for (const locale of ['es', 'en', 'de']) {
    const notice = I18N[locale].accountNotice;
    assert.ok(notice && notice.trim().length > 40, locale + ': aviso de cuentas ausente o demasiado corto');
  }
  assert.match(I18N.es.accountNotice, /sint[eé]tic/i, 'ES: el aviso debe declarar que son ejemplos sinteticos');
  assert.match(I18N.es.accountNotice, /localizaci[oó]n/i, 'ES: el aviso debe declarar la dependencia de localizacion');
  assert.match(I18N.en.accountNotice, /synthetic/i, 'EN: el aviso debe declarar que son ejemplos sinteticos');
  assert.match(I18N.en.accountNotice, /localization/i, 'EN: el aviso debe declarar la dependencia de localizacion');
  assert.match(I18N.de.accountNotice, /synthetische/i, 'DE: el aviso debe declarar que son ejemplos sinteticos');
  assert.match(I18N.de.accountNotice, /Lokalisierung/i, 'DE: el aviso debe declarar la dependencia de localizacion');
});
