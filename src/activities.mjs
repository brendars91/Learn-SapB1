// activities.mjs — localized practical activities with strict locale boundaries.
import { MASTERCLASS } from './masterclass.mjs';

const JOURNAL_IDS = new Set(['SYN-SK-L4-01','SYN-SK-L4-02','SYN-SK-L4-03','SYN-SK-L4-05','SYN-SK-L4-06','SYN-SK-L4-07','SYN-SK-L4-08']);
const FORENSIC_IDS = new Set(['SYN-SK-L0-04','SYN-SK-L0-07','SYN-SK-L2-01','SYN-SK-L2-02','SYN-SK-L2-04','SYN-SK-L2-05','SYN-SK-L2-06','SYN-SK-L3-08','SYN-SK-L7-05','SYN-SK-L7-08']);
const CONFIG_IDS = new Set(['SYN-SK-L1-06','SYN-SK-L1-07','SYN-SK-L1-08','SYN-SK-L3-03','SYN-SK-L3-05','SYN-SK-L3-07','SYN-SK-L4-04','SYN-SK-L5-02','SYN-SK-L5-03','SYN-SK-L5-04','SYN-SK-L5-05','SYN-SK-L5-06','SYN-SK-L6-04','SYN-SK-L6-05']);
// Reparto de formatos (D5). consequence cubría 25 de 72 skills — un tercio del
// curso — y era además el formato con los señuelos más pobres: su debilidad se
// convertía en la debilidad de todo el curso. Se movieron 7 skills a bughunt
// eligiendo aquellas cuyo aprendizaje real es auditar evidencia técnica y
// localizar la anomalía (SQL, APIs, salidas de IA), no ordenar una cascada causal.
const CONSEQUENCE_IDS = new Set(['SYN-SK-L0-05','SYN-SK-L0-06','SYN-SK-L1-05','SYN-SK-L2-08','SYN-SK-L3-06','SYN-SK-L5-08','SYN-SK-L6-01','SYN-SK-L6-02','SYN-SK-L6-06','SYN-SK-L6-08','SYN-SK-L7-04','SYN-SK-L7-06','SYN-SK-L7-07','SYN-SK-L8-01','SYN-SK-L8-02','SYN-SK-L8-04','SYN-SK-L8-06','SYN-SK-L8-08']);
const BUGHUNT_IDS = new Set(['SYN-SK-L0-08','SYN-SK-L1-01','SYN-SK-L1-02','SYN-SK-L1-03','SYN-SK-L1-04','SYN-SK-L2-03','SYN-SK-L2-07','SYN-SK-L3-01','SYN-SK-L3-02','SYN-SK-L3-04','SYN-SK-L5-01','SYN-SK-L5-07','SYN-SK-L6-03','SYN-SK-L6-07','SYN-SK-L7-01','SYN-SK-L7-02','SYN-SK-L8-03','SYN-SK-L8-07']);

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

const FEEDBACK = {
  es: { mark:'Marcar', noMark:'No marcar', marked:'Marcado', unmarked:'Sin marcar', link:'Eslabón señalado', broken:'El eslabón roto real', step:'Paso', expected:'esperaba', decoys:'Incluiste señuelos que no pertenecen a la cadena', exact:'pasos exactos', steps:'pasos', sideAmount:'lado/importe' },
  en: { mark:'Mark', noMark:'Do not mark', marked:'Marked', unmarked:'Not marked', link:'Selected link', broken:'The actual broken link', step:'Step', expected:'expected', decoys:'You included decoys that do not belong to the chain', exact:'exact steps', steps:'steps', sideAmount:'side/amount' },
  de: { mark:'Markieren', noMark:'Nicht markieren', marked:'Markiert', unmarked:'Nicht markiert', link:'Ausgewähltes Glied', broken:'Das tatsächlich gebrochene Glied', step:'Schritt', expected:'erwartet', decoys:'Du hast Köder aufgenommen, die nicht zur Kette gehören', exact:'exakte Schritte', steps:'Schritte', sideAmount:'Seite/Betrag' }
};

const JOURNAL_BLUEPRINTS = {
  'SYN-SK-L4-01': [['customer','debit','1190,00'],['sales','credit','1000,00'],['outputVat','credit','190,00']],
  'SYN-SK-L4-02': [['expenseAsset','debit','1000,00'],['vendor','credit','1190,00'],['inputVat','debit','190,00']],
  'SYN-SK-L4-03': [['customer','debit','1190,00'],['sales','credit','1000,00'],['outputVat','credit','190,00']],
  'SYN-SK-L4-05': [['bank','debit','1190,00'],['customer','credit','1190,00']],
  'SYN-SK-L4-06': [['vendor','debit','1190,00'],['bank','credit','1190,00']],
  'SYN-SK-L4-07': [['depreciation','debit','100,00'],['accDep','credit','100,00']],
  'SYN-SK-L4-08': [['salesCc','debit','600,00'],['opsCc','debit','400,00'],['offset','credit','1000,00']]
};
const JOURNAL_TEXT = {
  es: { customer:'Cliente 430000', sales:'Ventas 800000', outputVat:'IVA repercutido 177600', expenseAsset:'Gasto/activo determinado', vendor:'Proveedor 160000', inputVat:'IVA soportado 157600', bank:'Banco 120000', depreciation:'Amortización 622000', accDep:'Amortización acumulada 490000', salesCc:'Gasto centro CC-VENTAS', opsCc:'Gasto centro CC-OPS', offset:'Contrapartida', debit:'Debe', credit:'Haber' },
  en: { customer:'Customer 430000', sales:'Sales 800000', outputVat:'Output VAT 177600', expenseAsset:'Determined expense/asset', vendor:'Vendor 160000', inputVat:'Input VAT 157600', bank:'Bank 120000', depreciation:'Depreciation 622000', accDep:'Accumulated depreciation 490000', salesCc:'Expense cost center CC-SALES', opsCc:'Expense cost center CC-OPS', offset:'Offset account', debit:'Debit', credit:'Credit' },
  de: { customer:'Kunde 430000', sales:'Umsatzerlöse 800000', outputVat:'Umsatzsteuer 177600', expenseAsset:'Ermittelter Aufwand/Vermögenswert', vendor:'Lieferant 160000', inputVat:'Vorsteuer 157600', bank:'Bank 120000', depreciation:'Abschreibung 622000', accDep:'Kumulierte Abschreibung 490000', salesCc:'Aufwand Kostenstelle CC-VERTRIEB', opsCc:'Aufwand Kostenstelle CC-OPS', offset:'Gegenkonto', debit:'Soll', credit:'Haben' }
};

const SIMULATOR_FIELDS = {
  'SYN-SK-L7-03': {
    es: [['Motor donde el aging de 2M de filas responde en memoria','SAP HANA (columnar, in-memory)',['Microsoft SQL Server (fila, disco)','Cualquiera: el motor no influye','Solo con índice adicional']],['Función de fecha correcta en HANA','ADD_DAYS / DAYS_BETWEEN',['DATEADD / DATEDIFF','GETDATE()','TRUNC(SYSDATE)']],['Función de fecha correcta en MS SQL','DATEADD / DATEDIFF',['ADD_DAYS / DAYS_BETWEEN','CURRENT_UTCDATE','TO_DATE()']]],
    en: [['Engine where a 2M-row aging answers in memory','SAP HANA (columnar, in-memory)',['Microsoft SQL Server (row, disk)','Either one: the engine is irrelevant','Only with an extra index']],['Correct date function in HANA','ADD_DAYS / DAYS_BETWEEN',['DATEADD / DATEDIFF','GETDATE()','TRUNC(SYSDATE)']],['Correct date function in MS SQL','DATEADD / DATEDIFF',['ADD_DAYS / DAYS_BETWEEN','CURRENT_UTCDATE','TO_DATE()']]],
    de: [['Engine, in der ein Aging mit 2 Mio. Zeilen im Speicher antwortet','SAP HANA (spaltenbasiert, In-Memory)',['Microsoft SQL Server (zeilenbasiert, Platte)','Beide gleich: Engine ist irrelevant','Nur mit zusätzlichem Index']],['Richtige Datumsfunktion in HANA','ADD_DAYS / DAYS_BETWEEN',['DATEADD / DATEDIFF','GETDATE()','TRUNC(SYSDATE)']],['Richtige Datumsfunktion in MS SQL','DATEADD / DATEDIFF',['ADD_DAYS / DAYS_BETWEEN','CURRENT_UTCDATE','TO_DATE()']]]
  },
  'SYN-SK-L8-05': {
    es: [['Contrato de salida para procesar la respuesta con código','JSON Schema con campos requeridos',['Texto libre bien redactado','Markdown con encabezados','Lo que devuelva el modelo']],['Qué hacer si la salida no valida contra el schema','Rechazar y reintentar con el error',['Aceptarla y corregir a mano','Ignorar la validación','Guardarla igual y avisar después']],['Campo que nunca debe rellenar el modelo por su cuenta','El identificador del documento real',['El resumen del incidente','La categoría propuesta','El nivel de confianza']]],
    en: [['Output contract to process the answer with code','JSON Schema with required fields',['Well-written free text','Markdown with headings','Whatever the model returns']],['What to do when the output fails schema validation','Reject and retry with the error',['Accept it and fix by hand','Skip validation','Store it anyway and warn later']],['Field the model must never fill on its own','The real document identifier',['The incident summary','The proposed category','The confidence level']]],
    de: [['Ausgabevertrag, um die Antwort per Code zu verarbeiten','JSON Schema mit Pflichtfeldern',['Gut geschriebener Freitext','Markdown mit Überschriften','Was das Modell zurückgibt']],['Was tun, wenn die Ausgabe das Schema nicht erfüllt','Ablehnen und mit dem Fehler erneut anfragen',['Annehmen und manuell korrigieren','Validierung überspringen','Trotzdem speichern und später warnen']],['Feld, das das Modell nie selbst füllen darf','Die echte Belegnummer',['Die Zusammenfassung des Vorfalls','Die vorgeschlagene Kategorie','Das Konfidenzniveau']]]
  },
  'SYN-SK-L0-01': {
    es: [['Módulo donde vive el Pedido de cliente','Ventas – CRM',['Compras – CRM','Comprobantes','Finanzas']],['Base de datos de esta sesión','SBODEMOGE',['SBOCOMMON','SBODRAFT','SBOTEST']],['Ruta del asiento manual','Comprobantes → Asiento',['Ventas → Factura','Banco → Extracto','Existencias → Traspaso']]],
    en: [['Module containing the Sales Order','Sales – CRM',['Purchasing – CRM','Journal Entries','Financials']],['Database for this session','SBODEMOGE',['SBOCOMMON','SBODRAFT','SBOTEST']],['Manual journal-entry path','Financials → Journal Entry',['Sales → A/R Invoice','Banking → Bank Statement','Inventory → Inventory Transfer']]],
    de: [['Modul für den Kundenauftrag','Verkauf – CRM',['Einkauf – CRM','Journalbuchungen','Finanzwesen']],['Datenbank dieser Sitzung','SBODEMOGE',['SBOCOMMON','SBODRAFT','SBOTEST']],['Pfad zur manuellen Journalbuchung','Finanzwesen → Journalbuchung',['Verkauf → Ausgangsrechnung','Bankenabwicklung → Kontoauszug','Lagerverwaltung → Bestandsumlagerung']]]
  },
  'SYN-SK-L0-02': {
    es: [['Nº de socio de negocio (cliente)','C20000',['C20001','C29999','V10000']],['Condición de pago estándar del cliente','30 días netos',['Contado','2% 10 / 30 días','60 días netos']],['Grupo del socio','Clientes locales',['Proveedores locales','Clientes UE','Potenciales']]],
    en: [['Business partner number (customer)','C20000',['C20001','C29999','V10000']],['Default customer payment terms','Net 30 days',['Cash','2% 10 / net 30','Net 60 days']],['Business partner group','Local customers',['Local vendors','EU customers','Leads']]],
    de: [['Geschäftspartnernummer (Kunde)','C20000',['C20001','C29999','V10000']],['Standard-Zahlungsbedingung des Kunden','30 Tage netto',['Barzahlung','2 % 10 / 30 Tage','60 Tage netto']],['Geschäftspartnergruppe','Lokale Kunden',['Lokale Lieferanten','EU-Kunden','Interessenten']]]
  },
  'SYN-SK-L0-03': {
    es: [['Grupo de artículos','Hardware',['Software','Servicios','Consumibles']],['Método de gestión de stock','Valorado permanentemente',['No valorado','Solo cantidades','Planificación por demanda']],['Método de valoración','Precio medio móvil',['Coste FIFO por entrada','Precio estándar fijo','Valoración por lote']]],
    en: [['Item group','Hardware',['Software','Services','Consumables']],['Inventory management method','Perpetual inventory',['Non-valuated','Quantities only','Demand planning']],['Valuation method','Moving average price',['FIFO cost per receipt','Fixed standard price','Batch valuation']]],
    de: [['Artikelgruppe','Hardware',['Software','Dienstleistungen','Verbrauchsmaterial']],['Bestandsführung','Permanente Bestandsführung',['Nicht bewertet','Nur Mengen','Bedarfsplanung']],['Bewertungsmethode','Gleitender Durchschnittspreis',['FIFO-Kosten je Zugang','Fester Standardpreis','Chargenbewertung']]]
  }
};

function strictText(v, locale) {
  if (v == null) return '';
  if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return v.map(x => strictText(x, locale)).filter(Boolean).join(' · ');
  if (typeof v === 'object') {
    if (Object.hasOwn(v, locale)) return strictText(v[locale], locale);
    return strictText(v.text ?? v.label ?? v.value ?? '', locale);
  }
  return '';
}
function asArray(v) { return Array.isArray(v) ? v : v ? [v] : []; }
function shuffledDeterministic(items) { return items.map((v,i)=>({v,k:(i*7+3)%Math.max(items.length,1)})).sort((a,b)=>a.k-b.k).map(x=>x.v); }
function skillIndex(id) { const m=/L(\d+)-(\d+)/.exec(id); return m ? Number(m[1])*8+Number(m[2]) : 0; }

export function activityBrief(skill, locale = 'es') {
  const type = activityType(skill.id);
  const verb = {
    simulator: { es:'Opera la ventana como el consultor: elige el valor correcto de cada campo.', en:'Operate the task like the consultant: choose the correct value for each field.', de:'Bearbeite die Aufgabe wie ein Berater: wähle für jedes Feld den richtigen Wert.' },
    bughunt: { es:'Audita la evidencia del incidente: marca SOLO lo que está mal.', en:'Audit the incident evidence: mark ONLY what is wrong.', de:'Prüfe die Evidenz: markiere NUR das Falsche.' },
    journal: { es:'Registra el evento en contabilidad: lado correcto e importe exacto.', en:'Post the event: correct side and exact amount.', de:'Buche das Ereignis: richtige Seite und exakter Betrag.' },
    forensic: { es:'Reconstruye la cadena documental y señala el punto exacto donde se rompió.', en:'Reconstruct the document chain and identify the exact break.', de:'Rekonstruiere die Belegkette und bestimme die genaue Bruchstelle.' },
    consequence: { es:'Ordena la cascada real. Hay señuelos que no pertenecen a la cadena.', en:'Order the real cascade. Decoys do not belong to the chain.', de:'Ordne die echte Kaskade. Köder gehören nicht zur Kette.' },
    config: { es:'Monta la secuencia correcta de configuración. Sobran opciones.', en:'Build the correct configuration sequence. Some options are decoys.', de:'Baue die richtige Konfigurationsfolge. Einige Optionen sind Köder.' }
  }[type];
  const graded = {
    simulator:{es:'Se evalúa: interpretar el documento, no memorizarlo.',en:'Graded on: interpreting the document, not memorizing it.',de:'Bewertet wird: den Beleg verstehen, nicht auswendig lernen.'},
    bughunt:{es:'Se evalúa: distinguir señal de ruido.',en:'Graded on: separating signal from noise.',de:'Bewertet wird: Signal und Rauschen unterscheiden.'},
    journal:{es:'Se evalúa: naturaleza de cuenta + cuadre Debe=Haber.',en:'Graded on: account nature + Debit=Credit balance.',de:'Bewertet wird: Kontonatur + Soll=Haben-Ausgleich.'},
    forensic:{es:'Se evalúa: seguir la lógica del proceso.',en:'Graded on: following process logic.',de:'Bewertet wird: die Prozesslogik verfolgen.'},
    consequence:{es:'Se evalúa: causalidad real.',en:'Graded on: real causality.',de:'Bewertet wird: echte Kausalität.'},
    config:{es:'Se evalúa: memoria procedural de la secuencia.',en:'Graded on: procedural memory of the sequence.',de:'Bewertet wird: prozedurales Wissen über die Reihenfolge.'}
  }[type];
  return { what: strictText(skill.objective, locale), task: verb[locale], graded: graded[locale] };
}

function localizedJournal(id, locale) {
  const tx = JOURNAL_TEXT[locale];
  const rows = JOURNAL_BLUEPRINTS[id] || [['offset','debit','1000,00'],['bank','credit','1000,00']];
  return rows.map(([account, side, amount]) => [tx[account], tx[side], amount]);
}

// Rutas de menú explícitas por skill. No se derivan partiendo una cadena de prosa:
// una ruta de un solo paso se acierta por eliminación, no por saberla (D2 del
// PLAN-PRODUCCION-v8).
//
// Procedencia de los nombres de menú: árbol del cliente Desktop observado en un
// sistema real con localización alemana (2 pasadas de navegación de solo lectura,
// 2026-08-04) más los nombres de módulo de los cursos oficiales de SAP. `Reports >
// Query Generator` aparece literalmente en el curso oficial "Implementing SAP
// Business One", lección "Creating Queries".
//
// Los nombres de menú dependen de versión y localización: son los del cliente
// Desktop 10.0. La app lo declara en su registro de fuentes.
const CONFIG_ROUTES = {
  'SYN-SK-L1-06': {
    es: ['Administración','Definir','Finanzas','Códigos de impuestos'],
    en: ['Administration','Setup','Financials','Tax Codes'],
    de: ['Administration','Definition','Finanzwesen','Steuerkennzeichen']
  },
  'SYN-SK-L1-07': {
    es: ['Administración','Definir','Socios de negocio','Condiciones de pago'],
    en: ['Administration','Setup','Business Partners','Payment Terms'],
    de: ['Administration','Definition','Geschäftspartner','Zahlungsbedingungen']
  },
  'SYN-SK-L1-08': {
    es: ['Administración','Autorizaciones','Autorizaciones generales'],
    en: ['Administration','System Initialization','Authorizations','General Authorizations'],
    de: ['Administration','Systeminitialisierung','Berechtigungen','Allgemeine Berechtigungen']
  },
  'SYN-SK-L3-03': {
    es: ['Inventario','Gestión de ubicaciones','Definir ubicaciones'],
    en: ['Inventory','Bin Location Management','Bin Location Master Data'],
    de: ['Lagerverwaltung','Lagerplätze','Lagerplatz-Stammdaten']
  },
  'SYN-SK-L3-05': {
    es: ['Producción','Lista de materiales','Definir lista de materiales'],
    en: ['Production','Bill of Materials','Define Bill of Materials'],
    de: ['Produktion','Stückliste','Stückliste definieren']
  },
  'SYN-SK-L3-07': {
    es: ['Planificación de necesidades','Asistente de planificación','Escenario de planificación'],
    en: ['MRP','MRP Wizard','Planning Scenario'],
    de: ['Materialbedarfsplanung','Dispositionsassistent','Planungsszenario']
  },
  'SYN-SK-L4-04': {
    es: ['Administración','Inicialización del sistema','Períodos contables'],
    en: ['Administration','System Initialization','Posting Periods'],
    de: ['Administration','Systeminitialisierung','Buchungsperioden']
  },
  'SYN-SK-L5-02': {
    es: ['Administración','Inicialización del sistema','Detalles de la empresa','Inicialización básica'],
    en: ['Administration','System Initialization','Company Details','Basic Initialization'],
    de: ['Administration','Systeminitialisierung','Firmendetails','Basisinitialisierung']
  },
  'SYN-SK-L5-03': {
    es: ['Administración','Inicialización del sistema','Detalles de la empresa','Inicializaciones contables'],
    en: ['Administration','System Initialization','Company Details','Accounting Data'],
    de: ['Administration','Systeminitialisierung','Firmendetails','Buchhaltungsdaten']
  },
  'SYN-SK-L5-04': {
    es: ['Administración','Inicialización del sistema','Autorizaciones','Grupos de usuarios'],
    en: ['Administration','Setup','General','User Groups'],
    de: ['Administration','Definition','Allgemein','Benutzergruppen']
  },
  'SYN-SK-L5-05': {
    es: ['Administración','Inicialización del sistema','Autorizaciones','Propiedad de datos'],
    en: ['Administration','System Initialization','Authorizations','Data Ownership'],
    de: ['Administration','Systeminitialisierung','Berechtigungen','Datenbesitz']
  },
  'SYN-SK-L5-06': {
    es: ['Administración','Inicialización del sistema','Numeración de documentos'],
    en: ['Administration','System Initialization','Document Numbering'],
    de: ['Administration','Systeminitialisierung','Belegnummerierung']
  },
  'SYN-SK-L6-04': {
    es: ['Herramientas','Herramientas de personalización','Campos definidos por el usuario'],
    en: ['Tools','Customization Tools','User-Defined Fields'],
    de: ['Extras','Customizing Tools','Benutzerdefinierte Felder']
  },
  'SYN-SK-L6-05': {
    es: ['Administración','Alertas','Gestión de alertas'],
    en: ['Administration','Alerts Management','Alerts Management'],
    de: ['Administration','Alarmfunktionen','Alarmverwaltung']
  }
};

// Los señuelos salen de rutas reales de OTRAS skills del mismo nivel: obligan a
// distinguir por conocimiento, no por reconocer dos literales fijos (D3).
function configDecoys(skillId, route, locale) {
  const level = /L(\d)/.exec(skillId)?.[1];
  const pool = [];
  for (const [id, routes] of Object.entries(CONFIG_ROUTES)) {
    if (id === skillId) continue;
    const sameLevel = /L(\d)/.exec(id)?.[1] === level;
    for (const step of routes[locale] || []) {
      if (route.includes(step)) continue;
      pool.push({ step, sameLevel });
    }
  }
  const near = [...new Set(pool.filter(x => x.sameLevel).map(x => x.step))];
  const far = [...new Set(pool.filter(x => !x.sameLevel).map(x => x.step))];
  const ordered = [...near, ...far];
  const offset = skillIndex(skillId) % Math.max(ordered.length, 1);
  const picked = [];
  for (let i = 0; picked.length < 2 && i < ordered.length; i += 1) {
    const candidate = ordered[(offset + i) % ordered.length];
    if (!picked.includes(candidate)) picked.push(candidate);
  }
  return picked;
}

function configSpec(skill, mc, locale) {
  const explicit = CONFIG_ROUTES[skill.id]?.[locale];
  let route = explicit ? [...explicit] : [];
  if (!route.length) {
    const raw = strictText(asArray(mc?.cfg)[0], locale);
    route = raw.split(':')[0].split('>').map(x=>x.trim()).filter(Boolean);
  }
  const decoys = configDecoys(skill.id, route, locale);
  return { route, tokens: shuffledDeterministic([...route, ...decoys]) };
}

function simulatorSpec(skill, mc, locale) {
  const custom = SIMULATOR_FIELDS[skill.id]?.[locale];
  if (custom) return { targets: custom.map(([label, expected, decoys]) => ({ label, expected, options: shuffledDeterministic([expected, ...decoys]) })) };
  const labels = { es:['Objetivo','Práctica','Verificación'], en:['Objective','Practice','Verification'], de:['Ziel','Praxis','Verifikation'] }[locale];
  const expected = [strictText(skill.objective,locale), strictText(skill.practice,locale), strictText(skill.verify,locale)];
  const decoys = { es:['No comprobar','Cambiar producción','Adivinar'], en:['Do not verify','Change production','Guess'], de:['Nicht prüfen','Produktion ändern','Raten'] }[locale];
  return { targets: expected.map((value,i)=>({ label:labels[i], expected:value, options:shuffledDeterministic([value,decoys[i]]) })) };
}

function forensicSpec(skill, mc, locale) {
  let steps = asArray(mc?.e2e).map((x,i)=>({ label:strictText(x,locale), broken:false, index:i })).filter(x=>x.label);
  let brokenLabel = strictText(mc?.war?.root, locale);
  let resolution = strictText(mc?.war?.fix, locale);
  if (!brokenLabel) {
    steps = [strictText(skill.objective,locale), strictText(skill.practice,locale), strictText(skill.verify,locale)].filter(Boolean).map((label,index)=>({label,broken:false,index}));
    brokenLabel = strictText(skill.risk,locale);
    resolution = strictText(skill.verify,locale);
  }
  const broken = { label:brokenLabel, broken:true, index:steps.length };
  return { evidence:shuffledDeterministic([...steps.slice(0,3),broken]), resolution };
}

function bughuntSpec(skill, mc, locale) {
  const root = strictText(mc?.war?.root,locale) || strictText(skill.risk,locale);
  const safe1 = strictText(asArray(mc?.bp)[0],locale) || strictText(skill.verify,locale);
  const safe2 = strictText(asArray(mc?.e2e)[0],locale) || strictText(skill.practice,locale);
  const safe3 = strictText(asArray(mc?.cfg)[0],locale) || strictText(skill.objective,locale);
  return { clues:shuffledDeterministic([{label:root,error:true},{label:safe1,error:false},{label:safe2,error:false},{label:safe3,error:false}].filter(x=>x.label)), resolution:strictText(mc?.war?.fix,locale)||strictText(skill.verify,locale) };
}

function consequenceSpec(skill, mc, locale) {
  const trigger = strictText(mc?.war?.sympt,locale) || strictText(skill.risk,locale);
  const root = strictText(mc?.war?.root,locale) || strictText(skill.risk,locale);
  const mid = strictText(asArray(mc?.e2e)[1],locale) || strictText(skill.practice,locale);
  const fix = strictText(mc?.war?.fix,locale) || strictText(skill.verify,locale);
  const chain = [root,mid,fix].filter(Boolean);
  // Señuelos propios de cada skill (D4). El pool global de tres frases hacía que
  // tras tres actividades el alumno reconociera el señuelo sin razonar.
  //
  // No se inventa contenido: se reutiliza material real de la propia skill que NO
  // pertenece a la cascada causal — una buena práctica o un paso de configuración
  // son afirmaciones verdaderas del dominio, pero no son consecuencias del fallo.
  // Eso es exactamente la discriminación que la actividad debe entrenar.
  const candidates = [
    strictText(asArray(mc?.bp)[0],locale),
    strictText(asArray(mc?.cfg)[0],locale),
    strictText(asArray(mc?.bp)[1],locale),
    strictText(skill.objective,locale)
  ].filter(Boolean).filter(text => !chain.includes(text));
  const decoys = [];
  const offset = skillIndex(skill.id) % Math.max(candidates.length, 1);
  for (let i = 0; decoys.length < 2 && i < candidates.length; i += 1) {
    const candidate = candidates[(offset + i) % candidates.length];
    if (!decoys.includes(candidate)) decoys.push(candidate);
  }
  return { trigger, chain, tokens:shuffledDeterministic([...chain,...decoys]) };
}

export function getActivity(skill, locale='es') {
  const mc = MASTERCLASS[skill.id];
  const type = activityType(skill.id);
  const base = { type, locale, label:LABELS[type][locale], mc, brief:activityBrief(skill,locale) };
  if (!mc) return { ...base, unavailable:true };
  if (type==='journal') return { ...base, lines:localizedJournal(skill.id,locale) };
  if (type==='config') return { ...base, ...configSpec(skill,mc,locale) };
  if (type==='simulator') return { ...base, ...simulatorSpec(skill,mc,locale) };
  if (type==='forensic') return { ...base, ...forensicSpec(skill,mc,locale) };
  if (type==='bughunt') return { ...base, ...bughuntSpec(skill,mc,locale) };
  return { ...base, ...consequenceSpec(skill,mc,locale) };
}

export function validateActivityDetailed(activity, answers, sequence) {
  const A = answers || {};
  const seq = sequence || [];
  const details = [];
  const f = FEEDBACK[activity.locale || 'es'];
  let correct = true;
  if (activity.type === 'simulator') {
    activity.targets.forEach((field,i)=>{ const ok=A['sim-'+i]===field.expected; if(!ok) correct=false; details.push({item:field.label,ok,expected:field.expected,got:A['sim-'+i]||'—'}); });
  } else if (activity.type === 'bughunt') {
    activity.clues.forEach((clue,i)=>{ const selected=Boolean(A['clue-'+i]); const ok=selected===Boolean(clue.error); if(!ok) correct=false; details.push({item:clue.label.slice(0,70),ok,expected:clue.error?f.mark:f.noMark,got:selected?f.marked:f.unmarked}); });
  } else if (activity.type === 'forensic') {
    const chosen=Number(A.broken); const ok=activity.evidence[chosen]?.broken===true; if(!ok) correct=false; details.push({item:f.link,ok,expected:f.broken,got:activity.evidence[chosen]?.label?.slice(0,70)||'—'});
  } else if (activity.type === 'config' || activity.type === 'consequence') {
    const ref=activity.route||activity.chain;
    ref.forEach((step,i)=>{ const ok=seq[i]===step; if(!ok) correct=false; details.push({item:`${f.step} ${i+1}: ${f.expected} "${String(step).slice(0,40)}"`,ok,expected:step,got:seq[i]||'—'}); });
    if(activity.tokens&&seq.length>ref.length){ correct=false; details.push({item:f.decoys,ok:false,expected:`${ref.length} ${f.exact}`,got:`${seq.length} ${f.steps}`}); }
  } else if (activity.type === 'journal') {
    activity.lines.forEach((line,i)=>{ const sideOk=A['side-'+i]===line[1]; const amountOk=String(A['amount-'+i]||'').replace(/\s/g,'')===line[2]; if(!sideOk||!amountOk) correct=false; details.push({item:`${line[0]} — ${f.sideAmount}`,ok:sideOk&&amountOk,expected:`${line[1]} ${line[2]}`,got:`${A['side-'+i]||'—'} ${A['amount-'+i]||'—'}`}); });
  }
  return { correct, details };
}

export const ACTIVITY_COUNTS = Object.freeze(Array.from({length:9},(_,l)=>Array.from({length:8},(_,i)=>activityType(`SYN-SK-L${l}-${String(i+1).padStart(2,'0')}`))).flat().reduce((a,t)=>(a[t]=(a[t]||0)+1,a),{}));