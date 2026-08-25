// activities.mjs — v7: actividades con andamiaje pedagógico real.
// P0-1 encuadre específico · P0-3 feedback por elemento · P0-4 simulador con campos reales
// P0-5 sin autodelato forense · P0-6 consecuencias con distractores causales.
import { MASTERCLASS } from './masterclass.mjs';
import { trText, trNode } from './i18n.mjs';
import { translate } from './content/base.mjs';

const JOURNAL_IDS = new Set(['SYN-SK-L4-01','SYN-SK-L4-02','SYN-SK-L4-03','SYN-SK-L4-05','SYN-SK-L4-06','SYN-SK-L4-07','SYN-SK-L4-08']);
const FORENSIC_IDS = new Set(['SYN-SK-L0-04','SYN-SK-L0-07','SYN-SK-L2-01','SYN-SK-L2-02','SYN-SK-L2-04','SYN-SK-L2-05','SYN-SK-L2-06','SYN-SK-L3-08','SYN-SK-L7-08']);
const CONFIG_IDS = new Set(['SYN-SK-L1-06','SYN-SK-L1-07','SYN-SK-L1-08','SYN-SK-L3-03','SYN-SK-L3-05','SYN-SK-L3-07','SYN-SK-L4-04','SYN-SK-L5-02','SYN-SK-L5-03','SYN-SK-L5-04','SYN-SK-L5-05','SYN-SK-L5-06','SYN-SK-L6-04','SYN-SK-L6-05']);
const CONSEQUENCE_IDS = new Set(['SYN-SK-L0-05','SYN-SK-L0-06','SYN-SK-L1-05','SYN-SK-L2-08','SYN-SK-L3-06','SYN-SK-L5-08','SYN-SK-L6-01','SYN-SK-L6-02','SYN-SK-L6-06','SYN-SK-L6-07','SYN-SK-L6-08','SYN-SK-L7-02','SYN-SK-L7-03','SYN-SK-L7-04','SYN-SK-L7-05','SYN-SK-L7-06','SYN-SK-L7-07','SYN-SK-L8-01','SYN-SK-L8-02','SYN-SK-L8-03','SYN-SK-L8-04','SYN-SK-L8-05','SYN-SK-L8-06','SYN-SK-L8-07','SYN-SK-L8-08']);
const BUGHUNT_IDS = new Set(['SYN-SK-L0-08','SYN-SK-L1-01','SYN-SK-L1-02','SYN-SK-L1-03','SYN-SK-L1-04','SYN-SK-L2-03','SYN-SK-L2-07','SYN-SK-L3-01','SYN-SK-L3-02','SYN-SK-L3-04','SYN-SK-L5-01','SYN-SK-L5-07','SYN-SK-L6-03','SYN-SK-L7-01']);

export function activityType(id) {
  if (JOURNAL_IDS.has(id)) return 'journal';
  if (FORENSIC_IDS.has(id)) return 'forensic';
  if (CONFIG_IDS.has(id)) return 'config';
  if (CONSEQUENCE_IDS.has(id)) return 'consequence';
  if (BUGHUNT_IDS.has(id)) return 'bughunt';
  return 'simulator';
}

const LABELS = {
  simulator: { es: 'Simulador de tarea', en: 'Task simulator', de: 'Aufgabensimulator' },
  bughunt: { es: 'Caza de errores', en: 'Bug hunt', de: 'Fehlersuche' },
  journal: { es: 'Constructor de asientos', en: 'Journal builder', de: 'Buchungssatz-Builder' },
  forensic: { es: 'Forense documental', en: 'Document forensics', de: 'Dokumentenforensik' },
  consequence: { es: 'Predicción de consecuencias', en: 'Consequence prediction', de: 'Folgenabschätzung' },
  config: { es: 'Reto de configuración', en: 'Configuration challenge', de: 'Konfigurationsaufgabe' }
};

// Exportados para que el test de cobertura vea también estos textos.
export const JOURNALS = {
  'SYN-SK-L4-01': [['Cliente 430000','Debe','1190,00'],['Ventas 800000','Haber','1000,00'],['IVA repercutido 177600','Haber','190,00']],
  'SYN-SK-L4-02': [['Gasto/activo determinado','Debe','1000,00'],['Proveedor 160000','Haber','1190,00'],['IVA soportado 157600','Debe','190,00']],
  'SYN-SK-L4-03': [['Cliente 430000','Debe','1190,00'],['Ventas 800000','Haber','1000,00'],['IVA repercutido 177600','Haber','190,00']],
  'SYN-SK-L4-05': [['Banco 120000','Debe','1190,00'],['Cliente 430000','Haber','1190,00']],
  'SYN-SK-L4-06': [['Proveedor 160000','Debe','1190,00'],['Banco 120000','Haber','1190,00']],
  'SYN-SK-L4-07': [['Amortización 622000','Debe','100,00'],['Amortización acumulada 490000','Haber','100,00']],
  'SYN-SK-L4-08': [['Gasto centro CC-VENTAS','Debe','600,00'],['Gasto centro CC-OPS','Debe','400,00'],['Contrapartida','Haber','1000,00']]
};

// Campos reales por skill simulador: [label, valorCorrecto, decoys plausibles] (P0-4)
export const SIMULATOR_FIELDS = {
  'SYN-SK-L0-01': [
    ['Módulo donde vive el Pedido de cliente', 'Ventas – CRM', ['Compras – CRM', 'Comprobantes', 'Finanzas']],
    ['Base de datos de esta sesión', 'SBODEMOGE', ['SBOCOMMON', 'SBODRAFT', 'SBOTEST']],
    ['Ruta del asiento manual', 'Comprobantes → Asiento', ['Ventas → Factura', 'Banco → Extracto', 'Existencias → Traspaso']]
  ],
  'SYN-SK-L0-02': [
    ['Nº de socio de negocio (cliente)', 'C20000', ['C20001', 'C29999', 'V10000']],
    ['Condición de pago estándar del cliente', '30 días netos', ['Contado', '2% 10 / 30 días', '60 días netos']],
    ['Grupo del socio', 'Clientes locales', ['Proveedores locales', 'Clientes UE', 'Potenciales']]
  ],
  'SYN-SK-L0-03': [
    ['Grupo de artículos', 'Hardware', ['Software', 'Servicios', 'Consumibles']],
    ['Método de gestión de stock', 'Valorado permanentemente', ['No valorado', 'Solo cantidades', 'Planificación por demanda']],
    ['Método de coste', 'Media móvil', ['FIFO', 'Estándar', 'Lote']]
  ]
};

// Encuadre específico por skill (P0-1): qué es, qué hacer, qué se evalúa.
export function activityBrief(skill, locale) {
  const loc = locale || 'es';
  const L = v => Array.isArray(v) ? v.map(L).join(' ') : trNode(v, loc);
  const type = activityType(skill.id);
  const verb = {
    simulator: { es: 'Opera la ventana como el consultor: elige el valor correcto de cada campo.', en: 'Operate the window like the consultant: pick the right value per field.', de: 'Bediene das Fenster wie der Berater: je Feld der richtige Wert.' },
    bughunt: { es: 'Audita la evidencia del incidente: marca SOLO lo que está mal.', en: 'Audit the incident evidence: mark ONLY what is wrong.', de: 'Prüfe die Evidenz: markiere NUR das Falsche.' },
    journal: { es: 'Registra el evento en contabilidad: lado correcto por naturaleza de cuenta e importe exacto.', en: 'Post the event: correct side by account nature, exact amount.', de: 'Buche das Ereignis: richtige Seite, exakter Betrag.' },
    forensic: { es: 'Reconstruye la cadena documental y señala el punto exacto donde se rompió.', en: 'Reconstruct the document chain and point at the exact break.', de: 'Rekonstruiere die Belegkette, zeige die Bruchstelle.' },
    consequence: { es: 'Ordena la cascada real: qué causó qué. Hay señuelos que no pertenecen a la cadena.', en: 'Order the real cascade: what caused what. Decoys do not belong.', de: 'Ordne die echte Kaskade. Köder gehören nicht dazu.' },
    config: { es: 'Monta la ruta de menú EXACTA. Sobran opciones: solo las correctas, en orden.', en: 'Build the EXACT menu path. Only correct ones, in order.', de: 'Baue den EXAKTEN Menüpfad. Nur Richtiges, in Ordnung.' }
  }[type] || {};
  const evals = {
    simulator: { es: 'Se evalúa: interpretar el documento, no memorizarlo.', en: 'Graded on: interpreting the document.', de: 'Bewertet: Delegation interpretieren.' },
    bughunt: { es: 'Se evalúa: distinguir señal de ruido.', en: 'Graded on: signal vs noise.', de: 'Bewertet: Signal vs Rauschen.' },
    journal: { es: 'Se evalúa: naturaleza de cuenta + cuadre Debe=Haber.', en: 'Graded on: account nature + balance.', de: 'Bewertet: Kontonatur + Saldo.' },
    forensic: { es: 'Se evalúa: seguir la lógica del proceso, no la forma del texto.', en: 'Graded on: process logic.', de: 'Bewertet: Prozesslogik.' },
    consequence: { es: 'Se evalúa: causalidad real, no patrón de orden.', en: 'Graded on: real causality.', de: 'Bewertet: echte Kausalität.' },
    config: { es: 'Se evalúa: memoria procedural de la ruta real.', en: 'Graded on: procedural memory.', de: 'Bewertet: prozedurales Gedächtnis.' }
  }[type] || {};
  return { what: L(skill.objective), task: verb[loc] || verb.es || '', graded: evals[loc] || evals.es || '' };
}

function text(v, locale) {
  const normalize = value => {
    if (value == null) return '';
    if (typeof value === 'string') return trText(value, locale);
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (Array.isArray(value)) return value.map(normalize).filter(Boolean).join(' · ');
    if (typeof value === 'object') {
      const localized = value[locale] ?? value.en ?? value.es;
      if (localized !== undefined && localized !== value) return normalize(localized === value.es ? trText(value.es, locale) : localized);
      return normalize(value.text ?? value.label ?? value.value ?? value.title ?? value.description ?? value.k ?? value.v ?? '');
    }
    return '';
  };
  return normalize(v);
}
function asArray(v) { return Array.isArray(v) ? v : v ? [v] : []; }
function shuffledDeterministic(items) { return items.map((v,i)=>({v,k:(i*7+3)%items.length})).sort((a,b)=>a.k-b.k).map(x=>x.v); }
function skillIndex(id) { const m=/L(\d+)-(\d+)/.exec(id); return m ? Number(m[1])*8+Number(m[2]) : 0; }

function configSpec(skill, mc, locale) {
  const raw = text(asArray(mc.cfg)[0], locale);
  const route = raw.split(':')[0].split('>').map(x=>x.trim()).filter(Boolean);
  const pool = ['Gestión','Informes','Parametrizaciones generales','Herramientas'].map(x => trText(x, locale));
  const decoys = shuffledDeterministic(pool.filter(x=>!route.includes(x)).slice(0, Math.max(2, 5-route.length)));
  return { route, tokens: shuffledDeterministic([...route, ...decoys]) };
}
function simulatorSpec(skill, mc, locale) {
  const custom = SIMULATOR_FIELDS[skill.id];
  if (custom) {
    return { targets: custom.map(([label, expected, decoys]) => ({
      label: trText(label, locale), expected: trText(expected, locale),
      options: shuffledDeterministic([expected, ...decoys].map(x => trText(x, locale))) })) };
  }
  const fields = asArray(mc.screen?.fields);
  const editable = fields.filter(f=>f[2]).slice(0,3);
  let targets = editable.length ? editable : fields.slice(0,Math.min(3,fields.length));
  if (!targets.length) targets = asArray(mc.screen?.rows).slice(0,3).map(r => [r[0], r[1] ?? r[0]]);
  const fallback = ['— Sin valor —','Automático','Bloqueado','Manual'].map(x => trText(x, locale));
  return { targets: targets.map((f,i)=>({ label:trText(f[0], locale), expected:trText(f[1], locale),
    options:shuffledDeterministic([trText(f[1], locale), i===0?fallback[0]:fallback[1], i===0?fallback[2]:fallback[3]]) })) };
}
function forensicSpec(skill, mc, locale) {
  const steps = asArray(mc.e2e).map((x,i)=>({ label:text(x,locale), broken:false, index:i }));
  const broken = { label: text(mc.war?.root, locale), broken: true, index: steps.length };
  return { evidence: shuffledDeterministic([...steps.slice(0,3), broken]), resolution: text(mc.war?.fix, locale) };
}
function bughuntSpec(skill, mc, locale) {
  return { clues: shuffledDeterministic([
    { label:text(mc.war?.root,locale), error:true },
    { label:text(asArray(mc.bp)[0],locale), error:false },
    { label:text(asArray(mc.e2e)[0],locale), error:false },
    { label:text(asArray(mc.cfg)[0],locale), error:false }
  ]), resolution:text(mc.war?.fix,locale) };
}
function consequenceSpec(skill, mc, locale) {
  const trigger = text(mc.war?.sympt, locale);
  const root = text(mc.war?.root, locale);
  const mid = text(asArray(mc.e2e)[Math.min(1,asArray(mc.e2e).length-1)], locale);
  const fix = text(mc.war?.fix, locale);
  const chain = [root, mid, fix].filter(Boolean);
  const pool = [
    { es:'El informe mensual se imprime dos veces y nadie lo lee', en:'The monthly report prints twice and nobody reads it', de:'Der Monatsbericht druckt zweimal, keiner liest ihn' },
    { es:'Un usuario adelanta la fecha del sistema para facturar antes', en:'A user shifts system date to invoice earlier', de:'Ein Benutzer verschiebt das Systemdatum' },
    { es:'El proveedor sube el precio sin actualizar la lista de compra', en:'Vendor raises price without updating the purchase price list', de:'Der Lieferant erhöht den Preis ohne aktualisierte Einkaufsliste' }
  ];
  const d = pool[skillIndex(skill.id) % pool.length];
  const decoy = d[locale] || d.es;
  return { trigger, chain, tokens: shuffledDeterministic([...chain, decoy]) };
}

export function getActivity(skill, locale) {
  const loc = locale || 'es';
  const mc = MASTERCLASS[skill.id];
  const type = activityType(skill.id);
  const base = { type, label: text(LABELS[type], loc), mc, brief: activityBrief(skill, loc) };
  if (!mc) return { ...base, unavailable: true };
  if (type==='journal') return { ...base, lines: JOURNALS[skill.id] || [['Cuenta de origen','Debe','1000,00'],['Contrapartida','Haber','1000,00']] };
  if (type==='config') return { ...base, ...configSpec(skill, mc, loc) };
  if (type==='simulator') return { ...base, ...simulatorSpec(skill, mc, loc) };
  if (type==='forensic') return { ...base, ...forensicSpec(skill, mc, loc) };
  if (type==='bughunt') return { ...base, ...bughuntSpec(skill, mc, loc) };
  return { ...base, ...consequenceSpec(skill, mc, loc) };
}

// Validación con feedback por elemento (P0-3): devuelve detalles de qué falló.
export function validateActivityDetailed(activity, answers, sequence, locale = 'es') {
  const A = answers || {};
  const seq = sequence || [];
  const t = key => translate(locale, key);
  const details = [];
  let correct = true;
  if (activity.type === 'simulator') {
    activity.targets.forEach((f, i) => {
      const ok = A['sim-' + i] === f.expected;
      if (!ok) correct = false;
      details.push({ item: f.label, ok, expected: f.expected, got: A['sim-' + i] || '—' });
    });
  } else if (activity.type === 'bughunt') {
    activity.clues.forEach((c, i) => {
      const ok = Boolean(A['clue-' + i]) === Boolean(c.error);
      if (!ok) correct = false;
      details.push({ item: c.label.slice(0, 70), ok, expected: c.error ? t('fbMark') : t('fbDontMark'), got: A['clue-' + i] ? t('fbMarked') : t('fbUnmarked') });
    });
  } else if (activity.type === 'forensic') {
    const chosen = Number(A.broken);
    const ok = activity.evidence[chosen]?.broken === true;
    if (!ok) correct = false;
    details.push({ item: t('fbLinkFlagged'), ok, expected: t('fbRealBrokenLink'), got: activity.evidence[chosen]?.label?.slice(0, 70) || '—' });
  } else if (activity.type === 'config' || activity.type === 'consequence') {
    const ref = activity.route || activity.chain;
    ref.forEach((step, i) => {
      const ok = seq[i] === step;
      if (!ok) correct = false;
      details.push({ item: t('fbStep') + ' ' + (i + 1) + ': ' + t('fbExpected') + ' "' + String(step).slice(0, 40) + '"', ok, expected: step, got: seq[i] || '—' });
    });
    if (activity.tokens && seq.length > ref.length) {
      correct = false;
      details.push({ item: t('fbDecoys'), ok: false, expected: ref.length + ' ' + t('fbExactSteps'), got: seq.length + ' ' + t('fbSteps') });
    }
  } else if (activity.type === 'journal') {
    activity.lines.forEach((l, i) => {
      const sideOk = A['side-' + i] === l[1];
      const amountOk = String(A['amount-' + i] || '').replace(/\s/g, '') === l[2];
      if (!sideOk || !amountOk) correct = false;
      details.push({ item: trText(l[0], locale) + ' — ' + t('fbSideAmount'), ok: sideOk && amountOk, expected: l[1] + ' ' + l[2], got: (A['side-' + i] || '—') + ' ' + (A['amount-' + i] || '—') });
    });
  }
  return { correct, details };
}

export const ACTIVITY_COUNTS = Object.freeze(Array.from({length:9},(_,l)=>Array.from({length:8},(_,i)=>activityType(`SYN-SK-L${l}-${String(i+1).padStart(2,'0')}`))).flat().reduce((a,t)=>(a[t]=(a[t]||0)+1,a),{}));
