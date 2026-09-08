import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

// XSS payloads to test
const XSS_PAYLOADS = [
  '<script>alert(1)</script>',
  '<img src=x onerror=alert(1)>',
  '"><svg onload=alert(1)>',
  'javascript:alert(1)',
  '<iframe src="javascript:alert(1)">',
  '"><iframe src=x onerror=alert(1)>',
  '<body onload=alert(1)>',
  '<input onfocus=alert(1) autofocus>',
  '\'><script>alert(String.fromCharCode(88,83,83))</script>',
];

// JSON import fuzzing payloads
const IMPORT_PAYLOADS = [
  { schemaVersion: 999 }, // unknown schema
  { schemaVersion: '1' }, // wrong type
  { schemaVersion: 1, classification: 'real-data' }, // non-synthetic
  { schemaVersion: 1, classification: 'synthetic-progress', progress: { 'SK-01': { mastered: true } } }, // impossible mastery
  { schemaVersion: 1, classification: 'synthetic-progress', progress: { 'SK-01': { knowledge: 150 } } }, // out of range
  { schemaVersion: 1, classification: 'synthetic-progress', locale: '<script>alert(1)</script>' }, // XSS in field
  { schemaVersion: 1, classification: 'synthetic-progress', settings: { diagnosticScore: 'high' } }, // wrong type
  { __proto__: { polluted: true } }, // prototype pollution
  { schemaVersion: 1, classification: 'synthetic-progress', nested: { a: { b: { c: { d: { e: 'deep' } } } } } }, // nested structure
];

test('DOM XSS: escapeHtml function exists and is used', async () => {
  const appSource = await readFile(path.join(root, 'src/app.mjs'), 'utf-8');

  // Verify escapeHtml function is defined
  assert.ok(appSource.includes('escapeHtml'), 'escapeHtml function not found');
  assert.ok(appSource.includes('function escapeHtml') || appSource.includes('const escapeHtml'), 'escapeHtml not defined');

  // Verify it's actually called (heuristic)
  const escapeHtmlCalls = (appSource.match(/escapeHtml\(/g) || []).length;
  assert.ok(escapeHtmlCalls >= 5, `escapeHtml called only ${escapeHtmlCalls} times, expected more usage`);
});

test('Import fuzzing: validateProgressImport exists and has basic validation', async () => {
  const { validateProgressImport } = await import(path.join(root, 'src/domain.mjs'));

  // Verify function exists
  assert.ok(typeof validateProgressImport === 'function', 'validateProgressImport not a function');

  // Test a few critical rejections
  const criticalTests = [
    { input: { schemaVersion: 999 }, name: 'unknown schema' },
    { input: { schemaVersion: 1, classification: 'real-data' }, name: 'non-synthetic data' },
    { input: null, name: 'null input' },
    { input: undefined, name: 'undefined input' },
  ];

  for (const { input, name } of criticalTests) {
    const result = validateProgressImport(input);
    assert.ok(!result.valid || result.valid === false, `${name} not rejected (result: ${JSON.stringify(result)})`);
  }
});

test('Security: source code doesn\'t contain obvious vulnerabilities', async () => {
  const appSource = await readFile(path.join(root, 'src/app.mjs'), 'utf-8');
  const domainSource = await readFile(path.join(root, 'src/domain.mjs'), 'utf-8');

  // Check for dangerous eval usage
  assert.ok(!appSource.includes('eval('), 'app.mjs contains eval()');
  assert.ok(!domainSource.includes('eval('), 'domain.mjs contains eval()');

  // Check for innerHTML without escaping (basic heuristic)
  const innerHTMLUsage = appSource.match(/innerHTML\s*=/g) || [];
  assert.ok(innerHTMLUsage.length < 5, `excessive innerHTML usage: ${innerHTMLUsage.length} occurrences`);

  // Check that dangerous patterns are avoided
  assert.ok(!appSource.includes('dangerouslySetInnerHTML'), 'dangerouslySetInnerHTML found');
  assert.ok(!appSource.includes('document.write('), 'document.write() found');
});

test('URL construction: external links use safe patterns', async () => {
  const appSource = await readFile(path.join(root, 'src/app.mjs'), 'utf-8');

  // Check for target="_blank" without rel="noopener"
  const blankLinks = appSource.matchAll(/target=["']_blank["']/g);
  for (const match of blankLinks) {
    const context = appSource.slice(Math.max(0, match.index - 100), match.index + 100);
    // Should have noopener/noreferrer nearby
    const isSafe = context.includes('noopener') || context.includes('noreferrer');
    assert.ok(isSafe, `target=_blank without rel=noopener at position ${match.index}`);
  }
});

test('localStorage: access is wrapped in try-catch', async () => {
  const appSource = await readFile(path.join(root, 'src/app.mjs'), 'utf-8');

  // Find localStorage.setItem/getItem calls
  const storageOps = appSource.matchAll(/localStorage\.(get|set)Item/g);
  for (const match of storageOps) {
    const context = appSource.slice(Math.max(0, match.index - 200), match.index + 200);
    const hasTryCatch = context.includes('try') || context.includes('catch');
    assert.ok(hasTryCatch, `localStorage operation without try-catch at position ${match.index}`);
  }
});
