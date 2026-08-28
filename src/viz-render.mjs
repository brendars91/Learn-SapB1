// ─── Renderizadores SVG de instrumentos por nivel ────────────────────────────
// Cada función recibe (record, state, viz) y devuelve SVG string.
// Paleta: tokens del ledger (--accent oxblood, --gold, --rule-strong, --ink-soft).

const INK = 'var(--ink-soft)';
const RULE = 'var(--rule-strong)';
const ACCENT = 'var(--accent)';
const GOLD = 'var(--gold)';
const W = 232, H = 192;

const val = f => Math.max(0, Math.min(100, Number(f) || 0)) / 100;
const pct = v => Math.round(v * 100);
const FIELDS = ['knowledge', 'application', 'verification', 'risk'];
const vals = record => FIELDS.map(f => val(record?.[f]));

function dimNames(viz, locale) {
  return FIELDS.map(f => {
    const d = viz.dims[f];
    return (d && (d[locale] || d.es)) || f;
  });
}
const vlabel = (viz, locale) => viz.label[locale] || viz.label.es;
const masteryOf = (record, v) => record?.mastery ? val(record.mastery) : (v[0] + v[1] + v[2] + v[3]) / 4;
const ARROW = '<defs><marker id="vizArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)"/></marker></defs>';
const svgWrap = (cls, label, body) => `<svg class="${cls}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">${ARROW}${body}</svg>`;

// ── L0 · Cadena documental: 5 eslabones iluminados por el dominio ───────────
function renderChain(record, state, viz) {
  const v = vals(record);
  const labels = dimNames(viz, state.locale);
  const mastery = masteryOf(record, v);
  const docs = viz.docs;
  const lit = Math.round(mastery * docs.length);
  const cw = 34, gap = 9;
  const totalW = docs.length * cw + (docs.length - 1) * gap;
  const x0 = (W - totalW) / 2;
  let out = '';
  docs.forEach((d, i) => {
    const x = x0 + i * (cw + gap);
    const on = i < lit;
    out += `<rect x="${x}" y="64" width="${cw}" height="62" rx="2" fill="${on ? 'rgba(139,44,44,0.14)' : 'none'}" stroke="${on ? ACCENT : RULE}" stroke-width="${on ? 1.4 : 1}"/>`;
    out += `<text x="${x + cw / 2}" y="54" text-anchor="middle" font-size="7.5" letter-spacing="0.04em" fill="${INK}">${d.kind}</text>`;
    if (on) out += `<circle cx="${x + cw / 2}" cy="80" r="2.4" fill="${GOLD}" stroke="${ACCENT}" stroke-width="0.8"/>`;
    if (i < docs.length - 1) {
      const con = i + 1 < lit;
      out += `<line x1="${x + cw + 1}" y1="95" x2="${x + cw + gap - 1}" y2="95" stroke="${con ? ACCENT : RULE}" stroke-width="1.2"/>`;
    }
  });
  const bw = 10;
  const bgap = (totalW - 4 * bw) / 3;
  v.forEach((dv, i) => {
    const x = x0 + i * (bw + bgap);
    out += `<rect x="${x}" y="${150 - dv * 40}" width="${bw}" height="${Math.max(dv * 40, 1)}" fill="rgba(139,44,44,0.28)" stroke="${ACCENT}" stroke-width="0.8"/>`;
    out += `<text x="${x + bw / 2}" y="163" text-anchor="middle" font-size="8.5" fill="${INK}">${labels[i]}</text>`;
  });
  return svgWrap('sbl-radar', vlabel(viz, state.locale), out);
}

// ── L1 · Ficha maestra: bloques de campos con nivel de llenado ──────────────
function renderRecordCard(record, state, viz) {
  const v = vals(record);
  const labels = dimNames(viz, state.locale);
  let out = `<rect x="10" y="10" width="${W - 20}" height="${H - 20}" rx="3" fill="none" stroke="${RULE}" stroke-width="1"/>`;
  out += `<line x1="10" y1="34" x2="${W - 10}" y2="34" stroke="${ACCENT}" stroke-width="2"/>`;
  out += `<text x="20" y="27" font-size="9" letter-spacing="0.1em" fill="${ACCENT}">${vlabel(viz, state.locale)}</text>`;
  v.forEach((dv, i) => {
    const y = 48 + i * 34;
    out += `<text x="20" y="${y + 10}" font-size="9.5" fill="${INK}">${labels[i]}</text>`;
    out += `<text x="${W - 20}" y="${y + 10}" text-anchor="end" font-size="9" fill="${INK}">${pct(dv)}%</text>`;
    out += `<rect x="20" y="${y + 15}" width="${W - 40}" height="9" rx="1.5" fill="none" stroke="${RULE}" stroke-width="0.8"/>`;
    if (dv > 0) {
      out += `<rect x="20" y="${y + 15}" width="${(W - 40) * dv}" height="9" rx="1.5" fill="rgba(139,44,44,0.35)" stroke="${ACCENT}" stroke-width="0.8"/>`;
      out += `<circle cx="${20 + (W - 40) * dv}" cy="${y + 19.5}" r="2.4" fill="${GOLD}"/>`;
    }
  });
  return svgWrap('sbl-radar', vlabel(viz, state.locale), out);
}

// ── L2 · Línea de proceso: 4 estaciones, altura = valor ─────────────────────
function renderProcessLine(record, state, viz) {
  const v = vals(record);
  const labels = dimNames(viz, state.locale);
  let out = `<line x1="10" y1="96" x2="${W - 10}" y2="96" stroke="${RULE}" stroke-width="1"/>`;
  v.forEach((dv, i) => {
    const cx = 38 + i * 52;
    const h = 10 + dv * 48;
    out += `<rect x="${cx - 14}" y="${96 - h}" width="28" height="${h}" rx="2" fill="${dv > 0 ? 'rgba(139,44,44,0.16)' : 'none'}" stroke="${dv > 0 ? ACCENT : RULE}" stroke-width="1"/>`;
    out += `<circle cx="${cx}" cy="96" r="3" fill="${dv > 0 ? GOLD : RULE}"/>`;
    out += `<text x="${cx}" y="114" text-anchor="middle" font-size="8.5" fill="${INK}">${labels[i]}</text>`;
    out += `<text x="${cx}" y="126" text-anchor="middle" font-size="8" fill="${INK}">${pct(dv)}%</text>`;
  });
  return svgWrap('sbl-radar', vlabel(viz, state.locale), out);
}

// ── L3 · Cascada documental: escalones descendentes ─────────────────────────
function renderCascade(record, state, viz) {
  const v = vals(record);
  const labels = dimNames(viz, state.locale);
  let out = '';
  v.forEach((dv, i) => {
    const y = 18 + i * 30;
    const w = 40 + dv * 100;
    out += `<rect x="12" y="${y}" width="${w}" height="20" rx="2" fill="${dv > 0 ? 'rgba(139,44,44,0.14)' : 'none'}" stroke="${dv > 0 ? ACCENT : RULE}" stroke-width="1"/>`;
    out += `<text x="18" y="${y + 13.5}" font-size="8.5" fill="${INK}">${labels[i]}</text>`;
    if (dv > 0) out += `<circle cx="${w + 4}" cy="${y + 10}" r="2.2" fill="${GOLD}"/>`;
    if (i < 3) out += `<line x1="22" y1="${y + 20}" x2="22" y2="${y + 30}" stroke="${RULE}" stroke-width="0.9"/>`;
  });
  const mastery = masteryOf(record, v);
  out += `<line x1="12" y1="142" x2="${W - 12}" y2="142" stroke="${RULE}" stroke-width="0.8"/>`;
  if (mastery > 0) out += `<rect x="12" y="150" width="${(W - 24) * mastery}" height="12" rx="2" fill="rgba(139,44,44,0.2)" stroke="${ACCENT}" stroke-width="0.9"/>`;
  out += `<text x="16" y="178" font-size="8.5" fill="${INK}">Σ ${pct(mastery)}%</text>`;
  return svgWrap('sbl-radar', vlabel(viz, state.locale), out);
}

// ── L4 · Balanza contable: platillos debe/haber ─────────────────────────────
function renderBalance(record, state, viz) {
  const v = vals(record);
  const labels = dimNames(viz, state.locale);
  const mastery = masteryOf(record, v);
  const debe = (v[0] + v[2]) / 2;
  const haber = (v[1] + v[3]) / 2;
  const cx = 116;
  let out = `<rect x="${cx - 10}" y="18" width="20" height="10" rx="2" fill="none" stroke="${RULE}" stroke-width="1"/>`;
  out += `<line x1="${cx}" y1="28" x2="${cx}" y2="52" stroke="${RULE}" stroke-width="1.2"/>`;
  out += `<line x1="46" y1="52" x2="186" y2="52" stroke="${RULE}" stroke-width="1.2"/>`;
  out += `<line x1="46" y1="52" x2="46" y2="70" stroke="${RULE}" stroke-width="1"/>`;
  out += `<line x1="186" y1="52" x2="186" y2="70" stroke="${RULE}" stroke-width="1"/>`;
  out += `<path d="M 28 70 A 20 9 0 0 0 66 70" fill="${debe > 0 ? 'rgba(139,44,44,0.16)' : 'none'}" stroke="${debe > 0 ? ACCENT : RULE}" stroke-width="1.1"/>`;
  out += `<path d="M 166 70 A 20 9 0 0 0 204 70" fill="${haber > 0 ? 'rgba(139,44,44,0.16)' : 'none'}" stroke="${haber > 0 ? ACCENT : RULE}" stroke-width="1.1"/>`;
  if (debe > 0) out += `<rect x="38" y="${70 - debe * 28}" width="16" height="${debe * 28}" fill="rgba(139,44,44,0.3)" stroke="${ACCENT}" stroke-width="0.8"/>`;
  if (haber > 0) out += `<rect x="178" y="${70 - haber * 28}" width="16" height="${haber * 28}" fill="rgba(139,44,44,0.3)" stroke="${ACCENT}" stroke-width="0.8"/>`;
  out += `<line x1="${cx}" y1="52" x2="${cx}" y2="112" stroke="${RULE}" stroke-width="1.2"/>`;
  out += `<line x1="98" y1="112" x2="${cx}" y2="126" stroke="${RULE}" stroke-width="1"/>`;
  out += `<line x1="134" y1="112" x2="${cx}" y2="126" stroke="${RULE}" stroke-width="1"/>`;
  out += `<line x1="80" y1="126" x2="152" y2="126" stroke="${RULE}" stroke-width="1.4"/>`;
  out += `<text x="47" y="94" text-anchor="middle" font-size="7.5" fill="${INK}">${labels[0]} · ${labels[2]}</text>`;
  out += `<text x="185" y="94" text-anchor="middle" font-size="7.5" fill="${INK}">${labels[1]} · ${labels[3]}</text>`;
  out += `<text x="${cx}" y="148" text-anchor="middle" font-size="9" fill="${INK}">Σ ${pct(mastery)}%</text>`;
  out += `<text x="${cx}" y="162" text-anchor="middle" font-size="8" fill="${INK}">${vlabel(viz, state.locale)}</text>`;
  return svgWrap('sbl-radar', vlabel(viz, state.locale), out);
}

// ── L5 · Fases de proyecto: hitos con altura = valor ────────────────────────
function renderPhases(record, state, viz) {
  const v = vals(record);
  const labels = dimNames(viz, state.locale);
  let out = `<line x1="12" y1="96" x2="${W - 12}" y2="96" stroke="${RULE}" stroke-width="1"/>`;
  v.forEach((dv, i) => {
    const x = 20 + i * 52;
    const h = 8 + dv * 44;
    out += `<rect x="${x}" y="${96 - h}" width="34" height="${h}" rx="2" fill="${dv > 0 ? 'rgba(139,44,44,0.16)' : 'none'}" stroke="${dv > 0 ? ACCENT : RULE}" stroke-width="1"/>`;
    out += `<circle cx="${x + 17}" cy="96" r="3" fill="${dv > 0 ? GOLD : RULE}"/>`;
    out += `<text x="${x + 17}" y="114" text-anchor="middle" font-size="8.5" fill="${INK}">${labels[i]}</text>`;
    out += `<text x="${x + 17}" y="126" text-anchor="middle" font-size="8" fill="${INK}">${pct(dv)}%</text>`;
  });
  out += `<text x="12" y="156" font-size="8.5" fill="${INK}">${vlabel(viz, state.locale)}</text>`;
  return svgWrap('sbl-radar', vlabel(viz, state.locale), out);
}

// ── L6 · Pulso KPI: latidos ECG, amplitud = valor ───────────────────────────
function renderPulse(record, state, viz) {
  const v = vals(record);
  const labels = dimNames(viz, state.locale);
  const mid = 88;
  let out = `<line x1="10" y1="${mid}" x2="${W - 10}" y2="${mid}" stroke="${RULE}" stroke-width="0.8"/>`;
  v.forEach((dv, i) => {
    const x0 = 20 + i * 52;
    const amp = 8 + dv * 42;
    const pts = `${x0},${mid} ${x0 + 9},${mid - amp} ${x0 + 18},${mid + 5} ${x0 + 26},${mid} ${x0 + 42},${mid}`;
    out += `<polyline points="${pts}" fill="none" stroke="${dv > 0 ? ACCENT : RULE}" stroke-width="1.4" stroke-linejoin="round"/>`;
    if (dv > 0) out += `<circle cx="${x0 + 9}" cy="${mid - amp}" r="2.2" fill="${GOLD}"/>`;
    out += `<text x="${x0 + 21}" y="${mid + 30}" text-anchor="middle" font-size="8.5" fill="${INK}">${labels[i]}</text>`;
    out += `<text x="${x0 + 21}" y="${mid + 42}" text-anchor="middle" font-size="8" fill="${INK}">${pct(dv)}%</text>`;
  });
  out += `<text x="12" y="168" font-size="8.5" fill="${INK}">${vlabel(viz, state.locale)}</text>`;
  return svgWrap('sbl-radar', vlabel(viz, state.locale), out);
}

// ── L7 · Terminal del sistema: log con barras de señal ──────────────────────
function renderTerminal(record, state, viz) {
  const v = vals(record);
  const labels = dimNames(viz, state.locale);
  let out = `<rect x="10" y="12" width="${W - 20}" height="${H - 24}" rx="3" fill="var(--paper-deep)" stroke="${RULE}" stroke-width="1"/>`;
  out += `<circle cx="22" cy="23" r="2.4" fill="${RULE}"/><circle cx="31" cy="23" r="2.4" fill="${RULE}"/><circle cx="40" cy="23" r="2.4" fill="${RULE}"/>`;
  out += `<text x="${W - 20}" y="26" text-anchor="end" font-size="8" fill="${INK}">${vlabel(viz, state.locale)}</text>`;
  v.forEach((dv, i) => {
    const y = 46 + i * 32;
    out += `<text x="20" y="${y}" font-size="9.5" fill="${dv > 0 ? ACCENT : INK}">${dv > 0 ? '✓' : '·'} ${labels[i]}</text>`;
    out += `<text x="${W - 20}" y="${y}" text-anchor="end" font-size="9" fill="${INK}">${pct(dv)}%</text>`;
    out += `<rect x="20" y="${y + 5}" width="${W - 40}" height="9" rx="1.5" fill="none" stroke="${RULE}" stroke-width="0.8"/>`;
    if (dv > 0) {
      out += `<rect x="20" y="${y + 5}" width="${(W - 40) * dv}" height="9" rx="1.5" fill="rgba(139,44,44,0.4)"/>`;
      out += `<circle cx="${20 + (W - 40) * dv}" cy="${y + 9.5}" r="2.4" fill="${GOLD}"/>`;
    }
  });
  return svgWrap('sbl-radar', vlabel(viz, state.locale), out);
}

// ── L8 · Espectro del modelo: bandas ocupadas ───────────────────────────────
function renderSpectrum(record, state, viz) {
  const v = vals(record);
  const labels = dimNames(viz, state.locale);
  let out = '';
  v.forEach((dv, i) => {
    const y = 20 + i * 26;
    const w = 30 + dv * 140;
    out += `<rect x="12" y="${y}" width="${w}" height="16" rx="8" fill="${dv > 0 ? 'rgba(154,116,50,0.22)' : 'none'}" stroke="${dv > 0 ? GOLD : RULE}" stroke-width="1"/>`;
    out += `<text x="${w + 18}" y="${y + 12}" font-size="8.5" fill="${INK}">${labels[i]}</text>`;
    if (dv > 0) out += `<circle cx="${w - 4}" cy="${y + 8}" r="2.2" fill="${ACCENT}"/>`;
  });
  const mastery = masteryOf(record, v);
  out += `<line x1="12" y1="130" x2="${W - 12}" y2="130" stroke="${RULE}" stroke-width="0.8"/>`;
  if (mastery > 0) out += `<rect x="12" y="140" width="${(W - 24) * mastery}" height="10" rx="5" fill="rgba(139,44,44,0.2)" stroke="${ACCENT}" stroke-width="0.9"/>`;
  out += `<text x="12" y="168" font-size="8.5" fill="${INK}">Σ ${pct(mastery)}%</text>`;
  return svgWrap('sbl-radar', vlabel(viz, state.locale), out);
}

export const VIZ_RENDERERS = {
  chain: renderChain,
  recordCard: renderRecordCard,
  processLine: renderProcessLine,
  cascade: renderCascade,
  balance: renderBalance,
  phases: renderPhases,
  pulse: renderPulse,
  terminal: renderTerminal,
  spectrum: renderSpectrum
};
