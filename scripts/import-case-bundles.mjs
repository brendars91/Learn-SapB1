import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CASES_DIR = path.join(ROOT, 'cases');
const OUTPUT = path.join(ROOT, 'src', 'generated-cases.mjs');
const CASE_KEYS = new Set(['schema_version','case_id','synthetic','data_class','statement','resolution','evidence_bundle','scaffold','lifecycle','publishable','attestations','provenance','learn_sapb1_target','target_reason']);
const MANIFEST_KEYS = new Set(['schema_version','case_id','hash_algorithm','content_sha256','evidence_hashes','attestations','publishable']);
const SCAFFOLD_KEYS = new Set(['level','objective','task','diagnostic_questions','rubric']);
const REVIEW_TYPES = new Set(['PRIVACY','PEDAGOGY','OWNER']);
const SHA = /^[a-f0-9]{64}$/;
const CASE_ID = /^SYN-CASE-[A-Z0-9-]+$/;

export class BundleImportError extends Error {}

function object(value) { return value && typeof value === 'object' && !Array.isArray(value); }
function exactKeys(value, allowed, label) {
  if (!object(value) || Object.keys(value).some(key => !allowed.has(key))) throw new BundleImportError(`${label}: unknown or invalid fields`);
}
function nonEmpty(value) { return typeof value === 'string' && value.trim().length > 0; }
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (object(value)) return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}
export function reviewableHash(caseObject) {
  const reviewable = Object.fromEntries(Object.entries(caseObject).filter(([key]) => key !== 'attestations'));
  return createHash('sha256').update(canonical(reviewable), 'utf8').digest('hex');
}

function validateAttestations(caseObject, manifest) {
  if (!Array.isArray(caseObject.attestations) || caseObject.attestations.length !== 3) throw new BundleImportError('case: three attestations required');
  const types = new Set();
  for (const item of caseObject.attestations) {
    exactKeys(item, new Set(['review_type','content_sha256','reviewer_ref','reviewed_at']), 'attestation');
    if (!REVIEW_TYPES.has(item.review_type) || !SHA.test(item.content_sha256) || !nonEmpty(item.reviewer_ref) || Number.isNaN(Date.parse(item.reviewed_at))) throw new BundleImportError('attestation: invalid');
    types.add(item.review_type);
  }
  if (types.size !== 3 || [...REVIEW_TYPES].some(type => !types.has(type))) throw new BundleImportError('attestation: review set incomplete');
  if (canonical(manifest.attestations) !== canonical(caseObject.attestations)) throw new BundleImportError('manifest: attestations mismatch');
}

export function validateAndProjectBundle(caseObject, manifest) {
  exactKeys(caseObject, CASE_KEYS, 'case');
  exactKeys(manifest, MANIFEST_KEYS, 'manifest');
  exactKeys(caseObject.scaffold, SCAFFOLD_KEYS, 'scaffold');
  if (caseObject.schema_version !== 1 || manifest.schema_version !== 1) throw new BundleImportError('unsupported schema');
  if (!CASE_ID.test(caseObject.case_id) || manifest.case_id !== caseObject.case_id) throw new BundleImportError('case identity mismatch');
  if (caseObject.synthetic !== true || caseObject.data_class !== 'SYNTHETIC') throw new BundleImportError('only synthetic cases are importable');
  if (!['OWNER_APPROVED','EXPORTED'].includes(caseObject.lifecycle) || caseObject.publishable !== true || manifest.publishable !== true) throw new BundleImportError('case is not approved for import');
  if (manifest.hash_algorithm !== 'SHA-256' || !SHA.test(manifest.content_sha256)) throw new BundleImportError('manifest digest invalid');
  if (!Array.isArray(caseObject.evidence_bundle) || !caseObject.evidence_bundle.length || !Array.isArray(manifest.evidence_hashes) || manifest.evidence_hashes.length !== caseObject.evidence_bundle.length) throw new BundleImportError('evidence bundle invalid');
  const expectedEvidence = caseObject.evidence_bundle.map(receipt => ({
    receipt_id: receipt?.execution_receipt_id,
    sha256: createHash('sha256').update(canonical(receipt), 'utf8').digest('hex')
  }));
  for (const item of expectedEvidence) if (!nonEmpty(item.receipt_id) || !SHA.test(item.sha256)) throw new BundleImportError('evidence receipt invalid');
  if (canonical(expectedEvidence) !== canonical(manifest.evidence_hashes)) throw new BundleImportError('evidence digest mismatch');
  const digest = reviewableHash(caseObject);
  if (digest !== manifest.content_sha256) throw new BundleImportError('content digest mismatch');
  if (!nonEmpty(caseObject.statement) || !nonEmpty(caseObject.resolution) || !['OBSERVED','VERIFIED','INFERRED','UNKNOWN'].includes(caseObject.provenance)) throw new BundleImportError('case content invalid');
  validateAttestations(caseObject, manifest);
  const scaffold = caseObject.scaffold;
  if (!/^L[0-4]$/.test(scaffold.level) || !nonEmpty(scaffold.objective) || !nonEmpty(scaffold.task)) throw new BundleImportError('scaffold invalid');
  if (!Array.isArray(scaffold.diagnostic_questions) || !scaffold.diagnostic_questions.length || scaffold.diagnostic_questions.some(q => !nonEmpty(q))) throw new BundleImportError('diagnostic questions invalid');
  if (!Array.isArray(scaffold.rubric) || !scaffold.rubric.length) throw new BundleImportError('rubric invalid');
  for (const row of scaffold.rubric) {
    exactKeys(row, new Set(['criterion','expected']), 'rubric');
    if (!nonEmpty(row.criterion) || !nonEmpty(row.expected)) throw new BundleImportError('rubric invalid');
  }
  // Public projection: no receipt body and no reviewer identity cross this boundary.
  return {
    id: caseObject.case_id,
    imported: true,
    classification: 'synthetic',
    level: Number(scaffold.level.slice(1)),
    statement: caseObject.statement,
    objective: scaffold.objective,
    task: scaffold.task,
    questions: scaffold.diagnostic_questions,
    rubric: scaffold.rubric,
    referenceResolution: caseObject.resolution,
    source: { schemaVersion: 1, caseId: caseObject.case_id, contentSha256: digest, provenance: caseObject.provenance }
  };
}

export async function loadCaseBundles(casesDir = CASES_DIR) {
  let entries;
  try { entries = await readdir(casesDir, { withFileTypes: true }); }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  const projected = [];
  const byId = new Map();
  for (const entry of entries.filter(item => item.isDirectory()).sort((a,b) => a.name.localeCompare(b.name))) {
    const dir = path.join(casesDir, entry.name);
    const [caseObject, manifest] = await Promise.all([
      readFile(path.join(dir, 'case.json'), 'utf8').then(JSON.parse),
      readFile(path.join(dir, 'manifest.json'), 'utf8').then(JSON.parse)
    ]);
    const item = validateAndProjectBundle(caseObject, manifest);
    const prior = byId.get(item.id);
    if (prior && prior !== item.source.contentSha256) throw new BundleImportError(`duplicate case id with different content: ${item.id}`);
    if (!prior) { byId.set(item.id, item.source.contentSha256); projected.push(item); }
  }
  return projected;
}

export async function generateImportedCases(casesDir = CASES_DIR, output = OUTPUT) {
  const cases = await loadCaseBundles(casesDir);
  const source = `// Generated by scripts/import-case-bundles.mjs; do not edit.\nexport const IMPORTED_CASES = ${JSON.stringify(cases, null, 2)};\n`;
  await writeFile(output, source, 'utf8');
  return cases;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const cases = await generateImportedCases();
  process.stdout.write(`Imported ${cases.length} validated case bundle(s)\n`);
}
