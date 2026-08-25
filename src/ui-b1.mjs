// ui-b1.mjs — Renderizador de mockups fieles de ventanas SAP Business One.
// Replica la identidad visual real del cliente B1: chrome gris, barra de título azul clásica,
// campos amarillos para entrada, blancos para sistema, tabs de carpeta, grid con totales.
// Especificación por pantalla (spec): título, tabs, campos de cabecera, columnas, filas, totales.
// El texto de la ventana pasa por el catálogo: un cliente B1 alemán muestra su chrome en alemán.
import { translate } from './content/base.mjs';
import { trText, trNode } from './i18n.mjs';

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const cell = (value, locale) => esc(trText(value, locale));

// Toolbar estándar B1: Añadir, Buscar, Navegar, Cancelar — los cuatro iconos de siempre.
function b1Toolbar(locale) {
  const t = key => translate(locale, key);
  const btn = (glyph, title) => `<span class="b1-tbtn" title="${esc(title)}">${glyph}</span>`;
  return `<div class="b1-toolbar">${btn('💾+', t('b1Add'))}${btn('🔍', t('b1Find'))}${btn('⏮', t('b1First'))}${btn('◀', t('b1Prev'))}${btn('▶', t('b1Next'))}${btn('⏭', t('b1Last'))}${btn('✖', t('b1Cancel'))}<span class="b1-toolbar-sep"></span><span class="b1-tbtn" title="${esc(t('b1Print'))}">🖨</span></div>`;
}

function b1Menubar(locale) {
  const keys = ['b1File', 'b1Edit', 'b1View', 'b1Data', 'b1GoTo', 'b1Tools', 'b1Help'];
  return keys.map(key => `<span>${esc(translate(locale, key))}</span>`).join('');
}

function b1Tabs(tabs, active, locale) {
  if (!tabs?.length) return '';
  return `<div class="b1-tabs">${tabs.map((tab, i) => `<span class="b1-tab${i === active ? ' is-active' : ''}">${cell(tab, locale)}</span>`).join('')}</div>`;
}

// Campos de cabecera: [etiqueta, valor, tipo] tipo: 'in' amarillo editable · 'sys' blanco sistema · 'lock' gris bloqueado
function b1Header(fields, locale) {
  if (!fields?.length) return '';
  return `<div class="b1-header">${fields.map(([label, value, kind]) =>
    `<label class="b1-field"><span class="b1-flabel">${cell(label, locale)}</span><span class="b1-fvalue b1-${kind || 'in'}">${cell(value, locale)}</span></label>`).join('')}</div>`;
}

function b1Grid(cols, rows, numeric, locale) {
  if (!cols?.length) return '';
  return `<div class="b1-grid" role="table"><div class="b1-grid-head" role="row">${cols.map((c, i) => `<span class="b1-h${numeric?.includes(i) ? ' is-num' : ''}" role="columnheader">${cell(c, locale)}</span>`).join('')}</div>` +
    (rows || []).map(r => `<div class="b1-grid-row" role="row">${r.map((c, i) => `<span class="b1-c${numeric?.includes(i) ? ' is-num' : ''}" role="cell">${cell(c, locale)}</span>`).join('')}</div>`).join('') + `</div>`;
}

function b1Totals(totals, locale) {
  if (!totals?.length) return '';
  return `<div class="b1-totals">${totals.map(([label, value]) =>
    `<div class="b1-total-row"><span>${cell(label, locale)}</span><span class="b1-total-val">${cell(value, locale)}</span></div>`).join('')}</div>`;
}

// Ventana completa SAP B1. spec = { title, menu, tabs, activeTab, header, cols, rows, numeric, totals, status, note }
export function b1Window(spec, locale) {
  if (!spec) return '';
  const title = esc(trNode(spec.title, locale));
  return `<figure class="b1" role="img" aria-label="${title} — ${esc(translate(locale, 'b1WindowLabel'))}">
<div class="b1-titlebar"><span class="b1-ticon">🪟</span><span class="b1-ttext">${title}</span><span class="b1-tctrl"><span>_</span><span>▢</span><span>✕</span></span></div>
<div class="b1-menubar">${(spec.menu !== false) ? b1Menubar(locale) : ''}</div>
${b1Toolbar(locale)}
<div class="b1-body">
${b1Tabs(spec.tabs, spec.activeTab ?? 0, locale)}
${b1Header(spec.header, locale)}
${b1Grid(spec.cols, spec.rows, spec.numeric, locale)}
${b1Totals(spec.totals, locale)}
${spec.status ? `<div class="b1-status">${spec.status.map(item => cell(item, locale)).join(' · ')}</div>` : ''}
</div>
${spec.note ? `<figcaption>${esc(trNode(spec.note, locale))}</figcaption>` : ''}
</figure>`;
}
