import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import { generateImportedCases, loadCaseBundles, reviewableHash, validateAndProjectBundle } from '../scripts/import-case-bundles.mjs';
import { createInitialState, renderImportedCase } from '../src/app.mjs';

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}
function sha(value) { return createHash('sha256').update(canonical(value), 'utf8').digest('hex'); }

function fixture(id = 'SYN-CASE-IMPORT-01') {
  const receipt = { execution_receipt_id: 'receipt-synthetic-1', request_ref: 'req-1', terminal_status: 'COMPLETED' };
  const base = {
    schema_version: 1, case_id: id, synthetic: true, data_class: 'SYNTHETIC',
    statement: 'Asiento totalmente sintético para distinguir cuadre de corrección contable.',
    resolution: 'La suma cuadra; no certifica cuentas, impuestos ni configuración.',
    evidence_bundle: [receipt],
    scaffold: {
      level: 'L2', objective: 'Distinguir aritmética y semántica',
      task: 'Explica qué demuestra el recibo y qué queda sin demostrar.',
      diagnostic_questions: ['¿Qué se comprobó?', '¿Qué falta validar?'],
      rubric: [{ criterion: 'alcance', expected: 'solo igualdad aritmética' }]
    },
    lifecycle: 'EXPORTED', publishable: true, attestations: [], provenance: 'OBSERVED',
    learn_sapb1_target: null, target_reason: 'Preparado para importación; aún no publicado.'
  };
  const digest = reviewableHash(base);
  const attestations = ['PRIVACY','PEDAGOGY','OWNER'].map((review_type, index) => ({
    review_type, content_sha256: digest, reviewer_ref: `private-reviewer-${index}`,
    reviewed_at: `2026-09-15T12:0${index}:00+00:00`
  }));
  const caseObject = { ...base, attestations };
  const manifest = {
    schema_version: 1, case_id: id, hash_algorithm: 'SHA-256', content_sha256: digest,
    evidence_hashes: [{ receipt_id: receipt.execution_receipt_id, sha256: sha(receipt) }],
    attestations, publishable: true
  };
  return { caseObject, manifest };
}

async function writeBundle(root, directory, pair) {
  const target = path.join(root, directory);
  await mkdir(target, { recursive: true });
  await writeFile(path.join(target, 'case.json'), JSON.stringify(pair.caseObject));
  await writeFile(path.join(target, 'manifest.json'), JSON.stringify(pair.manifest));
}

test('un bundle válido se proyecta sin receipt ni identidad de revisores', () => {
  const { caseObject, manifest } = fixture();
  const projected = validateAndProjectBundle(caseObject, manifest);
  assert.equal(projected.id, caseObject.case_id);
  assert.equal(projected.source.contentSha256, manifest.content_sha256);
  const publicBytes = JSON.stringify(projected);
  assert.doesNotMatch(publicBytes, /execution_receipt_id|private-reviewer|evidence_bundle|attestations/);
  assert.match(publicBytes, /solo igualdad aritmética/);
});

test('alterar contenido o evidencia después de aprobar aborta la importación', () => {
  const { caseObject, manifest } = fixture();
  assert.throws(() => validateAndProjectBundle({ ...caseObject, resolution: 'Contenido alterado' }, manifest), /digest mismatch/);
  const alteredEvidence = { ...caseObject, evidence_bundle: [{ ...caseObject.evidence_bundle[0], terminal_status: 'BLOCKED' }] };
  assert.throws(() => validateAndProjectBundle(alteredEvidence, manifest), /evidence digest mismatch|content digest mismatch/);
});

test('schema desconocido, campos extra y paquete no aprobado fallan cerrado', () => {
  const { caseObject, manifest } = fixture();
  assert.throws(() => validateAndProjectBundle(caseObject, { ...manifest, schema_version: 2 }), /unsupported schema/);
  assert.throws(() => validateAndProjectBundle({ ...caseObject, privateCorpus: 'no' }, manifest), /unknown or invalid fields/);
  assert.throws(() => validateAndProjectBundle({ ...caseObject, lifecycle: 'DRAFT', publishable: false }, manifest), /not approved/);
});

test('el cargador es idempotente para bytes iguales y rechaza el mismo ID con contenido distinto', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'learn-cases-'));
  const pair = fixture();
  await writeBundle(root, 'first', pair);
  await writeBundle(root, 'retry-identical', pair);
  const imported = await loadCaseBundles(root);
  assert.equal(imported.length, 1);

  const conflict = fixture();
  conflict.caseObject.resolution = 'Conflicto';
  conflict.manifest.content_sha256 = reviewableHash(conflict.caseObject);
  conflict.caseObject.attestations = conflict.caseObject.attestations.map(a => ({ ...a, content_sha256: conflict.manifest.content_sha256 }));
  conflict.manifest.attestations = conflict.caseObject.attestations;
  await writeBundle(root, 'conflict', conflict);
  await assert.rejects(() => loadCaseBundles(root), /duplicate case id with different content/);
});

test('el generador produce un módulo público consumible por el build', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'learn-cases-'));
  const output = path.join(root, 'generated.mjs');
  await writeBundle(root, 'valid', fixture());
  const cases = await generateImportedCases(root, output);
  assert.equal(cases.length, 1);
  const source = await readFile(output, 'utf8');
  assert.match(source, /export const IMPORTED_CASES/);
  assert.doesNotMatch(source, /private-reviewer|execution_receipt_id/);
});

test('la proyección válida se renderiza como actividad guiada sin otorgar dominio', () => {
  const { caseObject, manifest } = fixture();
  const projected = validateAndProjectBundle(caseObject, manifest);
  for (const locale of ['es', 'en', 'de']) {
    const html = renderImportedCase(createInitialState({ locale }), projected);
    assert.match(html, new RegExp(`data-imported-case="${caseObject.case_id}"`));
    assert.match(html, /Distinguir aritmética y semántica/);
    assert.match(html, /solo igualdad aritmética/);
    assert.doesNotMatch(html, /data-action="answer-decision"|private-reviewer|execution_receipt_id/);
  }
});
