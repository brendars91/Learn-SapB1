// activities.mjs — Evaluaciones prácticas, no cuestionarios.
// Cada skill recibe el formato que mejor reproduce el trabajo real de un consultor B1.
import { MASTERCLASS } from './masterclass.mjs';

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

const JOURNALS = {
  'SYN-SK-L4-01': [['Cliente 430000','Debe','1190,00'],['Ventas 800000','Haber','1000,00'],['IVA repercutido 177600','Haber','190,00']],
  'SYN-SK-L4-02': [['Gasto/activo determinado','Debe','1000,00'],['Proveedor 160000','Haber','1190,00'],['IVA soportado 157600','Debe','190,00']],
  'SYN-SK-L4-03': [['Cliente 430000','Debe','1190,00'],['Ventas 800000','Haber','1000,00'],['IVA repercutido 177600','Haber','190,00']],
  'SYN-SK-L4-05': [['Banco 120000','Debe','1190,00'],['Cliente 430000','Haber','1190,00']],
  'SYN-SK-L4-06': [['Proveedor 160000','Debe','1190,00'],['Banco 120000','Haber','1190,00']],
  'SYN-SK-L4-07': [['Amortización 622000','Debe','100,00'],['Amortización acumulada 490000','Haber','100,00']],
  'SYN-SK-L4-08': [['Gasto centro CC-VENTAS','Debe','600,00'],['Gasto centro CC-OPS','Debe','400,00'],['Contrapartida','Haber','1000,00']]
};

function text(v, locale) { return v?.[locale] ?? v?.es ?? String(v ?? ''); }
function asArray(v) { return Array.isArray(v) ? v : v ? [v] : []; }
function shuffledDeterministic(items) { return items.map((v,i)=>({v,k:(i*7+3)%items.length})).sort((a,b)=>a.k-b.k).map(x=>x.v); }

function configSpec(skill, mc, locale) {
  const raw = text(asArray(mc.cfg)[0], locale);
  const route = raw.split(':')[0].split('>').map(x=>x.trim()).filter(Boolean);
  const decoys = ['Gestión','Informes','Parametrizaciones generales','Herramientas'];
  return { route, tokens: shuffledDeterministic([...route, ...decoys.filter(x=>!route.includes(x)).slice(0,Math.max(2,5-route.length))]) };
}
function simulatorSpec(skill, mc, locale) {
  const fields = asArray(mc.screen?.fields);
  const editable = fields.filter(f=>f[2]).slice(0,3);
  let targets = editable.length ? editable : fields.slice(0,Math.min(3,fields.length));
  if (!targets.length) targets = asArray(mc.screen?.rows).slice(0,3).map(r => [r[0], r[1] ?? r[0]]);
  return { targets: targets.map((f,i)=>({ label:f[0], expected:f[1], options:shuffledDeterministic([f[1], i===0?'— Vacío —':'Automático', i===0?'Bloqueado':'Manual']) })) };
}
function forensicSpec(skill, mc, locale) {
  const steps = asArray(mc.e2e).map((x,i)=>({ label:text(x,locale), broken:false, index:i }));
  const broken = { label:`⚠ ${text(mc.war?.root,locale)}`, broken:true, index:steps.length };
  return { evidence: shuffledDeterministic([...steps.slice(0,3),broken]), resolution:text(mc.war?.fix,locale) };
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
  return { trigger:text(mc.war?.symptom,locale), chain:[
    text(mc.war?.root,locale),
    text(asArray(mc.e2e)[Math.min(1,asArray(mc.e2e).length-1)],locale),
    text(mc.war?.fix,locale)
  ].filter(Boolean) };
}

export function getActivity(skill, locale='es') {
  const mc = MASTERCLASS[skill.id];
  const type = activityType(skill.id);
  const base = { type, label:text(LABELS[type],locale), mc };
  if (!mc) return { ...base, unavailable:true };
  if (type==='journal') return { ...base, lines:JOURNALS[skill.id] || [['Cuenta de origen','Debe','1000,00'],['Contrapartida','Haber','1000,00']] };
  if (type==='config') return { ...base, ...configSpec(skill,mc,locale) };
  if (type==='simulator') return { ...base, ...simulatorSpec(skill,mc,locale) };
  if (type==='forensic') return { ...base, ...forensicSpec(skill,mc,locale) };
  if (type==='bughunt') return { ...base, ...bughuntSpec(skill,mc,locale) };
  return { ...base, ...consequenceSpec(skill,mc,locale) };
}

export const ACTIVITY_COUNTS = Object.freeze(Array.from({length:9},(_,l)=>Array.from({length:8},(_,i)=>activityType(`SYN-SK-L${l}-${String(i+1).padStart(2,'0')}`))).flat().reduce((a,t)=>(a[t]=(a[t]||0)+1,a),{}));
