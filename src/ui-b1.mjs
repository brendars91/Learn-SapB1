// ui-b1.mjs — Renderizador de mockups fieles de ventanas SAP Business One.
// Replica la identidad visual real del cliente B1: chrome gris, barra de título azul clásica,
// campos amarillos para entrada, blancos para sistema, tabs de carpeta, grid con totales.
// Especificación por pantalla (spec): título, tabs, campos de cabecera, columnas, filas, totales.

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pick = (v, locale) => v?.[locale] ?? v?.en ?? v?.es ?? '';

// Toolbar estándar B1: Añadir, Buscar, Navegar, Cancelar — los cuatro iconos de siempre.
function b1Toolbar() {
  const btn = (glyph, title) => `<span class="b1-tbtn" title="${esc(title)}">${glyph}</span>`;
  return `<div class="b1-toolbar">${btn('💾+', 'Añadir (Ctrl+A)')}${btn('🔍', 'Buscar (Ctrl+F)')}${btn('⏮', 'Primer registro')}${btn('◀', 'Anterior')}${btn('▶', 'Siguiente')}${btn('⏭', 'Último registro')}${btn('✖', 'Cancelar (Ctrl+C)')}<span class="b1-toolbar-sep"></span><span class="b1-tbtn" title="Imprimir">🖨</span></div>`;
}

function b1Tabs(tabs, active) {
  if (!tabs?.length) return '';
  return `<div class="b1-tabs">${tabs.map((tab, i) => `<span class="b1-tab${i === active ? ' is-active' : ''}">${esc(tab)}</span>`).join('')}</div>`;
}

// Campos de cabecera: [etiqueta, valor, tipo] tipo: 'in' amarillo editable · 'sys' blanco sistema · 'lock' gris bloqueado
function b1Header(fields) {
  if (!fields?.length) return '';
  return `<div class="b1-header">${fields.map(([label, value, kind]) =>
    `<label class="b1-field"><span class="b1-flabel">${esc(label)}</span><span class="b1-fvalue b1-${kind || 'in'}">${esc(value)}</span></label>`).join('')}</div>`;
}

function b1Grid(cols, rows, numeric) {
  if (!cols?.length) return '';
  return `<div class="b1-grid" role="table"><div class="b1-grid-head" role="row">${cols.map((c, i) => `<span class="b1-h${numeric?.includes(i) ? ' is-num' : ''}" role="columnheader">${esc(c)}</span>`).join('')}</div>` +
    (rows || []).map(r => `<div class="b1-grid-row" role="row">${r.map((c, i) => `<span class="b1-c${numeric?.includes(i) ? ' is-num' : ''}" role="cell">${esc(c)}</span>`).join('')}</div>`).join('') + `</div>`;
}

function b1Totals(totals) {
  if (!totals?.length) return '';
  return `<div class="b1-totals">${totals.map(([label, value]) =>
    `<div class="b1-total-row"><span>${esc(label)}</span><span class="b1-total-val">${esc(value)}</span></div>`).join('')}</div>`;
}

// Ventana completa SAP B1. spec = { title, menu, tabs, activeTab, header, cols, rows, numeric, totals, status, note }
export function b1Window(spec, locale) {
  if (!spec) return '';
  return `<figure class="b1" role="img" aria-label="${esc(pick(spec.title, locale))} — ventana SAP Business One">
<div class="b1-titlebar"><span class="b1-ticon">🪟</span><span class="b1-ttext">${esc(pick(spec.title, locale))}</span><span class="b1-tctrl"><span>_</span><span>▢</span><span>✕</span></span></div>
<div class="b1-menubar">${(spec.menu !== false) ? '<span>Archivo</span><span>Editar</span><span>Ver</span><span>Datos</span><span>Ir a</span><span>Herramientas</span><span>Ayuda</span>' : ''}</div>
${b1Toolbar()}
<div class="b1-body">
${b1Tabs(spec.tabs, spec.activeTab ?? 0)}
${b1Header(spec.header)}
${b1Grid(spec.cols, spec.rows, spec.numeric)}
${b1Totals(spec.totals)}
${spec.status ? `<div class="b1-status">${spec.status.map(esc).join(' · ')}</div>` : ''}
</div>
${spec.note ? `<figcaption>${esc(pick(spec.note, locale))}</figcaption>` : ''}
</figure>`;
}
