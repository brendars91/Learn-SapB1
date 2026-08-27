// add-terms.cjs — Añade entradas al catálogo TERMS de forma idempotente y ordenada.
// Uso: node scripts/add-terms.cjs /ruta/entradas.json
// El JSON es { "texto español exacto": { "en": "...", "de": "..." }, ... }
//
// Existe porque cada ficha DEEP nueva necesita sus traducciones en el catálogo:
// el contenido se escribe en español y `test/i18n-coverage.test.mjs` exige que
// toda cadena traducible tenga decisión explícita en EN y DE.
const fs = require('fs');
const path = require('path');

const input = process.argv[2];
if (!input) {
  console.error('uso: node scripts/add-terms.cjs <entradas.json>');
  process.exit(1);
}
const entries = JSON.parse(fs.readFileSync(input, 'utf8'));
const target = path.join(__dirname, '..', 'src', 'content', 'i18n-terms.mjs');
let source = fs.readFileSync(target, 'utf8');

const marker = 'export const TERMS = {\n';
const start = source.indexOf(marker);
if (start < 0) {
  console.error('no se encontró la apertura de TERMS');
  process.exit(1);
}

function quote(text) {
  return "'" + String(text).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

let added = 0;
let skipped = 0;
const lines = [];
for (const [es, translations] of Object.entries(entries)) {
  if (!translations || !translations.en || !translations.de) {
    console.error('FALTA en/de para: ' + es.slice(0, 60));
    process.exit(1);
  }
  // Idempotencia: si la clave ya está en el catálogo, no se duplica.
  if (source.includes('\n  ' + quote(es) + ':')) { skipped += 1; continue; }
  lines.push('  ' + quote(es) + ': { en: ' + quote(translations.en) + ', de: ' + quote(translations.de) + ' },');
  added += 1;
}

if (lines.length) {
  source = source.slice(0, start + marker.length) + lines.join('\n') + '\n' + source.slice(start + marker.length);
  fs.writeFileSync(target, source);
}
console.log('TERMS: ' + added + ' añadidas, ' + skipped + ' ya existían');
