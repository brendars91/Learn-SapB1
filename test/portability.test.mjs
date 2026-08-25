import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const files = [
  '.github/workflows/verify-build.yml',
  'package.json',
  'scripts/build.mjs',
  'test/activities.test.mjs',
  'test/browser-smoke-local.mjs',
  'test/browser-smoke.mjs',
  'test/build.test.mjs',
  'test/runtime-smoke.test.mjs',
  'test/unique-content.test.mjs'
];

test('build, CI and tests contain no machine-specific absolute paths', async () => {
  for (const file of files) {
    const source = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /(?:\/home\/ubuntu|\/tmp\/b1lab)/, file);
  }
});

test('CI builds before running release-output tests and never commits generated source', async () => {
  const workflow = await readFile(new URL('../.github/workflows/verify-build.yml', import.meta.url), 'utf8');
  assert.ok(workflow.indexOf('npm run build') < workflow.indexOf('npm test'), 'build must run before tests');
  assert.doesNotMatch(workflow, /git commit|git push|enforce-strict-locale/);
});
