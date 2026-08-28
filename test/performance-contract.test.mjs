import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const css = await readFile(path.join(process.cwd(), 'src', 'styles.css'), 'utf8');

test('F8 transitions interpolate compositor-only properties', () => {
  const declarations = [...css.matchAll(/transition\s*:\s*([^;]+);/g)].map(match => match[1]);
  assert.ok(declarations.length > 0, 'expected explicit transitions');
  const forbidden = /\b(?:all|width|height|top|right|bottom|left|margin|padding|gap|background(?:-color)?|color|border(?:-color)?|box-shadow|filter)\b/i;
  for (const declaration of declarations) {
    if (/^none(?:\s*!important)?$/i.test(declaration.trim())) continue;
    assert.doesNotMatch(declaration, forbidden, `non-compositor transition: ${declaration}`);
    for (const segment of declaration.split(',')) assert.match(segment.trim(), /^(?:transform|opacity)\b/, `unsupported transition: ${segment}`);
  }
});

test('F8 keyframes mutate only transform and opacity', () => {
  const keyframes = [...css.matchAll(/@keyframes\s+([\w-]+)\s*\{((?:[^{}]|\{[^{}]*\})*)\}/g)];
  assert.ok(keyframes.length >= 2, 'mastery motion keyframes must remain present');
  for (const [, name, body] of keyframes) {
    const declarations = [...body.matchAll(/([\w-]+)\s*:/g)].map(match => match[1]);
    for (const property of declarations) assert.ok(['transform', 'opacity'].includes(property), `${name} animates ${property}`);
  }
});

test('F8 reduced motion globally disables transitions and animations', () => {
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\*\s*\{[^}]*transition:\s*none\s*!important;[^}]*animation:\s*none\s*!important;/);
});
