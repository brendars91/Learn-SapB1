import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = '/tmp/b1lab/out';
const fragmentPath = path.join(outDir, 'sap-b1-mastery-lab.html');
const standalonePath = path.join(outDir, 'SAP-Business-One-Mastery-Lab-Standalone.html');

const [shell, styles, contentSource, domainSource, appSource] = await Promise.all([
  readFile(path.join(projectRoot, 'src/fragment.html'), 'utf8'),
  readFile(path.join(projectRoot, 'src/styles.css'), 'utf8'),
  readFile(path.join(projectRoot, 'src/content.mjs'), 'utf8'),
  readFile(path.join(projectRoot, 'src/domain.mjs'), 'utf8'),
  readFile(path.join(projectRoot, 'src/app.mjs'), 'utf8')
]);

// Los módulos de contenido se inlinean enteros (imports resueltos por orden):
// content.mjs importa ./content/*.mjs — los inlineamos todos en orden correcto.
const base = await readFile(path.join(projectRoot, 'src/content/base.mjs'), 'utf8');
const l0 = await readFile(path.join(projectRoot, 'src/content/l0.mjs'), 'utf8');
const l1 = await readFile(path.join(projectRoot, 'src/content/l1.mjs'), 'utf8');
const l2 = await readFile(path.join(projectRoot, 'src/content/l2.mjs'), 'utf8');
const l34 = await readFile(path.join(projectRoot, 'src/content/l34.mjs'), 'utf8');
const l56 = await readFile(path.join(projectRoot, 'src/content/l56.mjs'), 'utf8');
const l78 = await readFile(path.join(projectRoot, 'src/content/l78.mjs'), 'utf8');
const deep = await readFile(path.join(projectRoot, 'src/content/deep.mjs'), 'utf8');

const strip = source => source
  .replace(/^import[^;]+;\s*$/gm, '')
  .replace(/^export\s+/gm, '');

const contentBundle = [base, l0, l1, l2, l34, l56, l78, deep, contentSource].map(strip).join('\n\n');
const runtime = [contentBundle, strip(domainSource), strip(appSource)].join('\n\n');

const fragment = `${shell.trim()}\n<style>\n${styles.trim()}\n</style>\n<script>\n(() => {\n'use strict';\n${runtime}\nconst sapB1LabRoot = document.getElementById('sap-b1-mastery-lab');\nmountSapB1Lab(sapB1LabRoot);\n})();\n</script>\n`;

const standalone = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Learn-SapB1 — Learn SAP Business One Visually</title>
<style>
  :root { color-scheme: light; }
  body { margin: 0; min-height: 100vh; background: #efe7d5; color: #1f1a13; font-family: 'Iowan Old Style', 'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif; }
  .page { max-width: 1180px; margin: 0 auto; padding: clamp(.6rem, 2vw, 1.4rem); }
</style>
</head>
<body>
<div class="page">
${fragment}
</div>
</body>
</html>
`;

await writeFile(fragmentPath, fragment, 'utf8');
await writeFile(standalonePath, standalone, 'utf8');
const bytes = Buffer.byteLength(standalone);
if (bytes >= 1024 * 1024) throw new Error(`Standalone exceeds 1 MiB: ${bytes} bytes`);
process.stdout.write(`Built fragment (${Buffer.byteLength(fragment)} bytes) and standalone (${bytes} bytes)\n`);
