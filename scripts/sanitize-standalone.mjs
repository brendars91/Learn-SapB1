import { readFile, writeFile } from 'node:fs/promises';

const outputPath = '/workspace/SAP-Business-One-Mastery-Lab-Standalone.html';
const startMarker = '<script id="codex-visualization-floating-ui-core"';

let html = await readFile(outputPath, 'utf8');
const start = html.indexOf(startMarker);
if (start === -1) throw new Error('Expected exporter enhancement block was not found');
const bodyClose = html.lastIndexOf('</body>');
if (bodyClose <= start) throw new Error('Standalone document has no valid closing body');

html = `${html.slice(0, start).trimEnd()}\n${html.slice(bodyClose)}`
  .replace('<html lang="en"', '<html lang="es"');

if (/<script[^>]+src=/i.test(html)) throw new Error('External executable script remains after sanitization');
if (/\b(?:fetch\s*\(|XMLHttpRequest|WebSocket|EventSource)\b/.test(html)) throw new Error('Network transport remains after sanitization');

await writeFile(outputPath, html, 'utf8');
process.stdout.write(`Sanitized ${outputPath} for offline execution (${Buffer.byteLength(html)} bytes)\n`);
