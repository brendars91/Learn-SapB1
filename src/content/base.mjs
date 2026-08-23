// Base del curriculum v2 — I18N, niveles, evidencia, procesos enriquecidos y DSL de skills.
export const I18N = {
  es: {
    appLabel: 'Laboratorio de dominio SAP Business One', navHome: 'Misión', navMap: 'Mapa', navCases: 'Casos', navIncidents: 'Incidentes', navSimulator: 'Cadena', navAI: 'Lab de IA', navReview: 'Repaso', navEvidence: 'Fuentes',
    language: 'Idioma', track: 'Ruta', trackFunctional: 'Funcional', trackTechnical: 'Técnica + IA', trackDual: 'Doble ruta',
    startDiagnostic: 'Iniciar diagnóstico', resume: 'Continuar', reset: 'Reiniciar progreso', export: 'Exportar', import: 'Importar',
    mastery: 'Dominio', dueReview: 'Repasos', skillsExplored: 'Competencias', recommended: 'Siguiente misión', begin: 'Comenzar',
    diagnosticTitle: 'Diagnóstico adaptativo', diagnosticIntro: 'Seis decisiones para calibrar tu punto de entrada. No concede dominio automático.',
    question: 'Pregunta', next: 'Siguiente', finish: 'Terminar', correct: 'Decisión sólida', incorrect: 'Revisa el razonamiento',
    level: 'Nivel', allLevels: 'Todos los niveles', allTracks: 'Todas las rutas', status: 'Estado', newStatus: 'Nueva', learningStatus: 'En práctica', masteredStatus: 'Dominada',
    objective: 'Objetivo', concept: 'Concepto', practice: 'Práctica', verify: 'Verificación', risk: 'Riesgo', evidence: 'Evidencia',
    learnMode: 'Entender', proveSkill: 'Demostrar dominio', mindsetLabel: 'Mentalidad', tipsLabel: 'Tips de experto', pitfallLabel: 'Trampa típica', anchorLabel: 'El ancla', pathLabel: 'Ruta en pantalla', exampleLabel: 'Ejemplo trabajado', coverTitle: 'Learn-SapB1', coverSub: 'El laboratorio para dominar SAP Business One como un consultor senior: entender los documentos, razonar las decisiones y verificar antes de actuar.',
    seniorLabel: 'Cómo razona un senior', whyOptions: 'Por qué cada opción', hintLabel: 'Pista', commitPrinciple: '¿Qué principio aplicas?',
    diagramLabel: 'Mapa visual', checklistLabel: 'Verificación paso a paso', showHint: 'Ver pista', stepDecide: 'Decide', stepCommit: 'Principio', stepReveal: 'Razonamiento',
    markPractice: 'Registrar práctica', challenge: 'Resolver reto', reveal: 'Ver explicación', choose: 'Selecciona la mejor decisión',
    caseLabTitle: 'Laboratorio de casos', incidentTitle: 'Sala de incidentes', simulatorTitle: 'Explorador de cadena', aiTitle: 'Laboratorio de IA y contexto', reviewTitle: 'Cola de recuperación', evidenceTitle: 'Registro de evidencia',
    scenario: 'Escenario', symptom: 'Síntoma', action: 'Acción', consequence: 'Consecuencia', rollback: 'Recuperación',
    processSales: 'Pedido a cobro', processPurchase: 'Solicitud a pago', processFinance: 'Control financiero', processIntegration: 'Integración segura',
    chainExplorer: 'Clic en cada documento para ver sus efectos', effectsLabel: 'Efectos', effectStock: 'Stock', effectAccounting: 'Contabilidad', effectBalance: 'Saldo socio',
    missionsLabel: 'Misiones', missionBug: 'Caza de bugs de IA', missionContract: 'Constructor de contrato', missionInjection: 'Defensa anti-inyección',
    radarLabel: 'Perfil de dominio', heatmapLabel: 'Mapa de dominio', journeyLabel: 'Tu expedición', lockedLevel: 'Gestiona primero los prerrequisitos',
    promptLabel: 'Prompt de práctica', promptScore: 'Contrato de contexto', analyze: 'Analizar prompt', privacyBlocked: 'Entrada bloqueada: contiene un patrón compatible con datos reales.',
    promptHelp: 'Usa solo el caso sintético SYN-CASE-AI-01. Incluye rol, objetivo, contexto, evidencia, incertidumbre, salida y revisión humana.',
    missing: 'Falta', privacySafe: 'Sin patrones sensibles detectados', noReviews: 'No hay repasos vencidos. Practica una competencia para crear la cola.',
    bossTitle: 'Retos finales', locked: 'Primero demuestra los prerrequisitos', answer: 'Responder', close: 'Cerrar',
    sourceOfficial: 'Fuente oficial', verifiedAt: 'Verificado', applicability: 'Aplicabilidad', openSource: 'Abrir fuente',
    syntheticNotice: 'Entorno educativo: todos los datos son ficticios y están marcados SYN.', localOnly: 'El progreso permanece en este navegador.',
    importError: 'Archivo rechazado por esquema o privacidad.', importOk: 'Progreso sintético importado.', exportOk: 'Progreso exportado.', resetConfirm: 'El progreso local se ha reiniciado.',
    noNetwork: 'Modo offline', selectSkill: 'Selecciona una competencia del mapa.', dimensionKnowledge: 'Conocimiento', dimensionApplication: 'Aplicación', dimensionVerification: 'Verificación', dimensionRisk: 'Riesgo',
    promptFieldRole: 'Rol', promptFieldGoal: 'Objetivo', promptFieldContext: 'Contexto', promptFieldEvidence: 'Evidencia', promptFieldUncertainty: 'Incertidumbre', promptFieldOutput: 'Formato de salida', promptFieldHumanGate: 'Revisión humana', promptFieldSyntheticContext: 'Caso sintético'
  },
  en: {
    appLabel: 'SAP Business One mastery lab', navHome: 'Mission', navMap: 'Map', navCases: 'Cases', navIncidents: 'Incidents', navSimulator: 'Chain', navAI: 'AI Lab', navReview: 'Review', navEvidence: 'Sources',
    language: 'Language', track: 'Path', trackFunctional: 'Functional', trackTechnical: 'Technical + AI', trackDual: 'Dual path',
    startDiagnostic: 'Start diagnostic', resume: 'Continue', reset: 'Reset progress', export: 'Export', import: 'Import',
    mastery: 'Mastery', dueReview: 'Reviews', skillsExplored: 'Skills', recommended: 'Next mission', begin: 'Begin',
    diagnosticTitle: 'Adaptive diagnostic', diagnosticIntro: 'Six decisions calibrate your entry point. It does not grant automatic mastery.',
    question: 'Question', next: 'Next', finish: 'Finish', correct: 'Sound decision', incorrect: 'Review the reasoning',
    level: 'Level', allLevels: 'All levels', allTracks: 'All paths', status: 'Status', newStatus: 'New', learningStatus: 'Practising', masteredStatus: 'Mastered',
    objective: 'Objective', concept: 'Concept', practice: 'Practice', verify: 'Verification', risk: 'Risk', evidence: 'Evidence',
    learnMode: 'Understand', proveSkill: 'Prove mastery', mindsetLabel: 'Mindset', tipsLabel: 'Expert tips', pitfallLabel: 'Common trap', anchorLabel: 'The anchor', pathLabel: 'Screen route', exampleLabel: 'Worked example', coverTitle: 'Learn-SapB1', coverSub: 'The lab to master SAP Business One as a senior consultant: understand the documents, reason the decisions, verify before acting.',
    seniorLabel: 'How a senior reasons', whyOptions: 'Why each option', hintLabel: 'Hint', commitPrinciple: 'Which principle applies?',
    diagramLabel: 'Visual map', checklistLabel: 'Step-by-step verification', showHint: 'Show hint', stepDecide: 'Decide', stepCommit: 'Principle', stepReveal: 'Reasoning',
    markPractice: 'Record practice', challenge: 'Solve challenge', reveal: 'Show explanation', choose: 'Choose the best decision',
    caseLabTitle: 'Case Lab', incidentTitle: 'Incident Room', simulatorTitle: 'Chain explorer', aiTitle: 'AI & Context Lab', reviewTitle: 'Retrieval queue', evidenceTitle: 'Evidence registry',
    scenario: 'Scenario', symptom: 'Symptom', action: 'Action', consequence: 'Consequence', rollback: 'Recovery',
    processSales: 'Order to cash', processPurchase: 'Request to pay', processFinance: 'Financial control', processIntegration: 'Safe integration',
    chainExplorer: 'Click each document to see its effects', effectsLabel: 'Effects', effectStock: 'Stock', effectAccounting: 'Accounting', effectBalance: 'Partner balance',
    missionsLabel: 'Missions', missionBug: 'AI bug hunt', missionContract: 'Contract builder', missionInjection: 'Injection defence',
    radarLabel: 'Mastery profile', heatmapLabel: 'Mastery map', journeyLabel: 'Your expedition', lockedLevel: 'Handle the prerequisites first',
    promptLabel: 'Practice prompt', promptScore: 'Context contract', analyze: 'Analyze prompt', privacyBlocked: 'Input blocked: it contains a pattern compatible with real data.',
    promptHelp: 'Use only synthetic case SYN-CASE-AI-01. Include role, goal, context, evidence, uncertainty, output, and human review.',
    missing: 'Missing', privacySafe: 'No sensitive patterns detected', noReviews: 'No reviews are due. Practise a skill to create the queue.',
    bossTitle: 'Boss battles', locked: 'Demonstrate the prerequisites first', answer: 'Answer', close: 'Close',
    sourceOfficial: 'Official source', verifiedAt: 'Verified', applicability: 'Applicability', openSource: 'Open source',
    syntheticNotice: 'Training environment: all data is fictional and marked SYN.', localOnly: 'Progress remains in this browser.',
    importError: 'File rejected by schema or privacy policy.', importOk: 'Synthetic progress imported.', exportOk: 'Progress exported.', resetConfirm: 'Local progress has been reset.',
    noNetwork: 'Offline mode', selectSkill: 'Select a skill on the map.', dimensionKnowledge: 'Knowledge', dimensionApplication: 'Application', dimensionVerification: 'Verification', dimensionRisk: 'Risk',
    promptFieldRole: 'Role', promptFieldGoal: 'Goal', promptFieldContext: 'Context', promptFieldEvidence: 'Evidence', promptFieldUncertainty: 'Uncertainty', promptFieldOutput: 'Output format', promptFieldHumanGate: 'Human review', promptFieldSyntheticContext: 'Synthetic case'
  },
  de: {
    appLabel: 'SAP Business One Kompetenzlabor', navHome: 'Mission', navMap: 'Karte', navCases: 'Fälle', navIncidents: 'Störungen', navSimulator: 'Kette', navAI: 'KI-Labor', navReview: 'Wiederholen', navEvidence: 'Quellen',
    language: 'Sprache', track: 'Lernpfad', trackFunctional: 'Funktional', trackTechnical: 'Technik + KI', trackDual: 'Doppelpfad',
    startDiagnostic: 'Diagnose starten', resume: 'Fortsetzen', reset: 'Fortschritt löschen', export: 'Exportieren', import: 'Importieren',
    mastery: 'Beherrschung', dueReview: 'Wiederholungen', skillsExplored: 'Kompetenzen', recommended: 'Nächste Mission', begin: 'Starten',
    diagnosticTitle: 'Adaptive Diagnose', diagnosticIntro: 'Sechs Entscheidungen bestimmen den Einstieg. Sie vergeben keine automatische Beherrschung.',
    question: 'Frage', next: 'Weiter', finish: 'Abschließen', correct: 'Solide Entscheidung', incorrect: 'Begründung prüfen',
    level: 'Stufe', allLevels: 'Alle Stufen', allTracks: 'Alle Pfade', status: 'Status', newStatus: 'Neu', learningStatus: 'In Übung', masteredStatus: 'Beherrscht',
    objective: 'Ziel', concept: 'Konzept', practice: 'Übung', verify: 'Prüfung', risk: 'Risiko', evidence: 'Nachweis',
    learnMode: 'Verstehen', proveSkill: 'Beherrschung nachweisen', mindsetLabel: 'Mentales Modell', tipsLabel: 'Expertentipps', pitfallLabel: 'Typische Falle', anchorLabel: 'Der Anker', pathLabel: 'Bildschirmroute', exampleLabel: 'Durchgerechnetes Beispiel', coverTitle: 'Learn-SapB1', coverSub: 'Das Labor zur Beherrschung von SAP Business One wie ein Senior-Berater: Dokumente verstehen, Entscheidungen begründen, vor dem Handeln prüfen.',
    seniorLabel: 'Wie ein Senior denkt', whyOptions: 'Warum jede Option', hintLabel: 'Hinweis', commitPrinciple: 'Welches Prinzip gilt?',
    diagramLabel: 'Visuelle Karte', checklistLabel: 'Schrittweise Prüfung', showHint: 'Hinweis zeigen', stepDecide: 'Entscheiden', stepCommit: 'Prinzip', stepReveal: 'Begründung',
    markPractice: 'Übung speichern', challenge: 'Aufgabe lösen', reveal: 'Erklärung zeigen', choose: 'Wähle die beste Entscheidung',
    caseLabTitle: 'Falllabor', incidentTitle: 'Störungsraum', simulatorTitle: 'Ketten-Explorer', aiTitle: 'KI- und Kontextlabor', reviewTitle: 'Wiederholungswarteschlange', evidenceTitle: 'Quellenregister',
    scenario: 'Szenario', symptom: 'Symptom', action: 'Aktion', consequence: 'Folge', rollback: 'Wiederherstellung',
    processSales: 'Auftrag bis Zahlung', processPurchase: 'Anforderung bis Zahlung', processFinance: 'Finanzkontrolle', processIntegration: 'Sichere Integration',
    chainExplorer: 'Klicke auf einen Beleg, um seine Wirkungen zu sehen', effectsLabel: 'Wirkungen', effectStock: 'Bestand', effectAccounting: 'Buchhaltung', effectBalance: 'Partnersaldo',
    missionsLabel: 'Missionen', missionBug: 'KI-Bug-Jagd', missionContract: 'Vertragsbaukasten', missionInjection: 'Injection-Abwehr',
    radarLabel: 'Kompetenzprofil', heatmapLabel: 'Beherrschungskarte', journeyLabel: 'Deine Expedition', lockedLevel: 'Zuerst die Voraussetzungen',
    promptLabel: 'Übungsprompt', promptScore: 'Kontextvertrag', analyze: 'Prompt prüfen', privacyBlocked: 'Eingabe blockiert: Sie enthält ein Muster, das zu realen Daten passen kann.',
    promptHelp: 'Nutze nur den synthetischen Fall SYN-CASE-AI-01. Nenne Rolle, Ziel, Kontext, Nachweise, Unsicherheit, Ausgabe und menschliche Prüfung.',
    missing: 'Fehlt', privacySafe: 'Keine sensiblen Muster erkannt', noReviews: 'Keine Wiederholung ist fällig. Übe eine Kompetenz, um die Warteschlange zu starten.',
    bossTitle: 'Boss-Aufgaben', locked: 'Zuerst die Voraussetzungen nachweisen', answer: 'Antworten', close: 'Schließen',
    sourceOfficial: 'Offizielle Quelle', verifiedAt: 'Geprüft', applicability: 'Gültigkeit', openSource: 'Quelle öffnen',
    syntheticNotice: 'Lernumgebung: Alle Daten sind fiktiv und mit SYN markiert.', localOnly: 'Der Fortschritt bleibt in diesem Browser.',
    importError: 'Datei wegen Schema oder Datenschutz abgelehnt.', importOk: 'Synthetischer Fortschritt importiert.', exportOk: 'Fortschritt exportiert.', resetConfirm: 'Lokaler Fortschritt wurde gelöscht.',
    noNetwork: 'Offline-Modus', selectSkill: 'Wähle eine Kompetenz auf der Karte.', dimensionKnowledge: 'Wissen', dimensionApplication: 'Anwendung', dimensionVerification: 'Prüfung', dimensionRisk: 'Risiko',
    promptFieldRole: 'Rolle', promptFieldGoal: 'Ziel', promptFieldContext: 'Kontext', promptFieldEvidence: 'Nachweise', promptFieldUncertainty: 'Unsicherheit', promptFieldOutput: 'Ausgabeformat', promptFieldHumanGate: 'Menschliche Prüfung', promptFieldSyntheticContext: 'Synthetischer Fall'
  }
};

export function translate(locale, key) {
  return I18N[locale]?.[key] ?? I18N.es[key] ?? key;
}

const LEVEL_META = [
  ['Modelo mental', 'Mental model', 'Mentales Modell', 'functional', 'EV-LOGISTICS'],
  ['Datos maestros', 'Master data', 'Stammdaten', 'functional', 'EV-LOGISTICS'],
  ['Logística central', 'Core logistics', 'Kernlogistik', 'functional', 'EV-LOGISTICS'],
  ['Operaciones avanzadas', 'Advanced operations', 'Erweiterte Abläufe', 'functional', 'EV-LOGISTICS'],
  ['Finanzas y controlling', 'Finance and controlling', 'Finanzen und Controlling', 'functional', 'EV-ACCOUNTING'],
  ['Implementación', 'Implementation', 'Implementierung', 'functional', 'EV-IMPLEMENTATION'],
  ['Web y reporting', 'Web and reporting', 'Web und Reporting', 'dual', 'EV-IMPLEMENTATION'],
  ['Ingeniería SAP B1', 'SAP B1 engineering', 'SAP-B1-Engineering', 'technical', 'EV-SDK'],
  ['IA y vibecoding', 'AI and vibecoding', 'KI und Vibecoding', 'technical', 'EV-SERVICE-LAYER-GUIDE']
];

export const LEVELS = LEVEL_META.map((meta, id) => ({
  id, title: { es: meta[0], en: meta[1], de: meta[2] }, track: meta[3], evidenceId: meta[4]
}));

const RISK_BY_LEVEL = [1, 2, 2, 2, 3, 3, 2, 3, 3];

// Constructor DSL de skill. Cada spec se autoriza a mano: t=título, o=objetivo, c=concepto,
// m=mentalidad, p=práctica, v=verificación, vs=checklist visual, r=riesgo, tips=expert tips,
// pf=trampa junior, d=diagrama {k:arquetipo, cap:título, n:[nodos]}, a=assessment,
// an=ancla mnemotécnica {g:glifo, es/en:analogía}, pa=ruta en pantalla [módulo›pantalla›acción],
// ex=ejemplo trabajado {q:pregunta, rows:[[debe,haber,importe]...] opcional, show:[líneas con cifras], a:respuesta}.
export function sk(level, index, spec) {
  const id = `SYN-SK-L${level}-${String(index + 1).padStart(2, '0')}`;
  return {
    id, classification: 'synthetic', level, track: LEVELS[level].track, title: spec.t,
    objective: spec.o, concept: spec.c, mindset: spec.m, practice: spec.p,
    verify: spec.v, verifySteps: spec.vs, risk: spec.r,
    tips: spec.tips, pitfall: spec.pf, diagram: spec.d,
    anchor: spec.an, path: spec.pa, example: spec.ex,
    assessment: {
      prompt: spec.a.prompt ?? spec.a.p, optionsText: spec.a.opts, correct: spec.a.correct ?? 0,
      safe: [true, true, false], rationale: spec.a.why,
      why: spec.a.why, principles: spec.a.prin, principleCorrect: spec.a.prinOk ?? 0,
      seniorSteps: spec.a.senior, distractorWhy: spec.a.dwhy, hints: spec.a.hints
    },
    riskWeight: spec.rw ?? RISK_BY_LEVEL[level],
    prerequisites: index === 0 && level > 0
      ? [`SYN-SK-L${level - 1}-08`]
      : index > 0 ? [`SYN-SK-L${level}-${String(index).padStart(2, '0')}`] : [],
    evidenceId: spec.ev ?? LEVELS[level].evidenceId
  };
}

export const EVIDENCE = [
  { id: 'EV-LOGISTICS', sourceType: 'official', title: 'Managing Logistics in SAP Business One', url: 'https://learning.sap.com/courses/managing-logistics-in-sap-business-one', verifiedAt: '2026-08-23', applicability: { es: 'SAP Business One; ruta de aprendizaje oficial de logística', en: 'SAP Business One; official logistics learning path', de: 'SAP Business One; offizieller Logistik-Lernpfad' }, confidence: 'high' },
  { id: 'EV-ACCOUNTING', sourceType: 'official', title: 'Handling Accounting in SAP Business One', url: 'https://learning.sap.com/courses/handling-accounting-in-sap-business-one', verifiedAt: '2026-08-23', applicability: { es: 'SAP Business One; ruta de aprendizaje oficial de contabilidad', en: 'SAP Business One; official accounting learning path', de: 'SAP Business One; offizieller Lernpfad Rechnungswesen' }, confidence: 'high' },
  { id: 'EV-IMPLEMENTATION', sourceType: 'official', title: 'Implementing SAP Business One', url: 'https://learning.sap.com/courses/implementing-sap-business-one', verifiedAt: '2026-08-23', applicability: { es: 'SAP Business One; implementación y personalización', en: 'SAP Business One; implementation and customization', de: 'SAP Business One; Implementierung und Anpassung' }, confidence: 'high' },
  { id: 'EV-SDK', sourceType: 'official', title: 'SAP Business One SDK Help', url: 'https://help.sap.com/doc/089315d8d0f8475a9fc84fb919b501a3/10.0/en-US/SDKHelp/index.html', verifiedAt: '2026-08-23', applicability: { es: 'SAP Business One 10.0; tablas, DI API y UI API', en: 'SAP Business One 10.0; database tables, DI API, and UI API', de: 'SAP Business One 10.0; Datenbanktabellen, DI API und UI API' }, confidence: 'high' },
  { id: 'EV-SERVICE-LAYER', sourceType: 'official', title: 'Service Layer API Reference', url: 'https://help.sap.com/doc/056f69366b5345a386bb8149f1700c19/10.0/en-US/Service%20Layer%20API%20Reference.html', verifiedAt: '2026-08-23', applicability: { es: 'SAP Business One 10.0; OData v4 como protocolo principal desde FP 2405', en: 'SAP Business One 10.0; OData v4 as primary protocol from FP 2405', de: 'SAP Business One 10.0; OData v4 als primäres Protokoll ab FP 2405' }, confidence: 'high' },
  { id: 'EV-SERVICE-LAYER-GUIDE', sourceType: 'official', title: 'Working with SAP Business One Service Layer 1.28', url: 'https://help.sap.com/doc/fc2f5477516c404c8bf9ad1315a17238/10.0/en-US/Working_with_SAP_Business_One_Service_Layer.pdf', verifiedAt: '2026-08-23', applicability: { es: 'SAP Business One 10.0; guía oficial versión 1.28 (2026-01-07); CRUD, lotes, UDO, capa semántica', en: 'SAP Business One 10.0; official guide version 1.28 (2026-01-07); CRUD, batches, UDOs, semantic layer', de: 'SAP Business One 10.0; offizielle Leitfaden-Version 1.28 (07.01.2026); CRUD, Chargen, UDO, semantische Schicht' }, confidence: 'high' },
  { id: 'EV-CRYSTAL', sourceType: 'official', title: 'How to Work with SAP Crystal Reports in SAP Business One', url: 'https://help.sap.com/doc/eb06711f528a49edb523234fe48192d8/10.0/en-US/How_to_Work_with_SAP_Crystal_Reports_in_SAP_Business_One.pdf', verifiedAt: '2026-08-23', applicability: { es: 'SAP Business One 10.0; integración y flujos de informes Crystal', en: 'SAP Business One 10.0; Crystal Reports integration and report workflows', de: 'SAP Business One 10.0; Crystal-Reports-Integration und Berichtsabläufe' }, confidence: 'high' }
];

// Constructor de decisión interactiva (casos, incidentes, bosses). v2 añade
// principios, razonamiento senior, por-qué-de-cada-opción y pistas socráticas.
export function decision(id, level, spec) {
  return {
    id, classification: 'synthetic', level,
    prompt: spec.q, options: spec.opts.es.map((_, index) => index), optionsText: spec.opts,
    correct: spec.ok, rationale: spec.why, evidenceId: spec.ev,
    principles: spec.prin, principleCorrect: spec.prinOk ?? 0,
    seniorSteps: spec.senior, distractorWhy: spec.dwhy, hints: spec.hints
  };
}

// Procesos v2: cada paso lleva sus chips de verificación y sus tres efectos.
export const PROCESS_STEPS = {
  sales: [
    { id: 'SYN-PROC-S-1', labels: { es: 'Oferta', en: 'Quotation', de: 'Angebot' }, checks: { es: ['Validez', 'Precios y descuentos'], en: ['Validity', 'Prices and discounts'], de: ['Gültigkeit', 'Preise und Rabatte'] }, effects: { stock: { es: 'Ninguno (no compromete)', en: 'None (no commitment)', de: 'Keiner (keine Bindung)' }, accounting: { es: 'Sin asiento', en: 'No journal entry', de: 'Keine Buchung' }, balance: { es: 'Sin efecto', en: 'No effect', de: 'Kein Effekt' } } },
    { id: 'SYN-PROC-S-2', labels: { es: 'Pedido', en: 'Sales order', de: 'Kundenauftrag' }, checks: { es: ['Fechas', 'Cantidades abiertas'], en: ['Dates', 'Open quantities'], de: ['Termine', 'Offene Mengen'] }, effects: { stock: { es: 'Comprometido (committed)', en: 'Committed', de: 'Reserviert' }, accounting: { es: 'Sin asiento', en: 'No journal entry', de: 'Keine Buchung' }, balance: { es: 'Sin efecto', en: 'No effect', de: 'Kein Effekt' } } },
    { id: 'SYN-PROC-S-3', labels: { es: 'Entrega', en: 'Delivery', de: 'Lieferung' }, checks: { es: ['Almacén', 'Stock disponible'], en: ['Warehouse', 'Available stock'], de: ['Lager', 'Verfügbarer Bestand'] }, effects: { stock: { es: 'Sale (-)', en: 'Out (-)', de: 'Abgang (-)' }, accounting: { es: 'Coste de ventas (COGS)', en: 'Cost of goods sold', de: 'Wareneinsatz' }, balance: { es: 'Sin efecto', en: 'No effect', de: 'Kein Effekt' } } },
    { id: 'SYN-PROC-S-4', labels: { es: 'Factura', en: 'Invoice', de: 'Rechnung' }, checks: { es: ['Base-destino', 'Impuestos'], en: ['Base-target link', 'Taxes'], de: ['Basis-Ziel-Bezug', 'Steuern'] }, effects: { stock: { es: 'Ninguno adicional', en: 'None additional', de: 'Kein weiterer' }, accounting: { es: 'Cliente + ingresos + IVA', en: 'Receivables + revenue + VAT', de: 'Debitor + Erlös + USt' }, balance: { es: 'Aumenta saldo del cliente', en: 'Raises customer balance', de: 'Erhöht Debitorsaldo' } } },
    { id: 'SYN-PROC-S-5', labels: { es: 'Cobro', en: 'Incoming payment', de: 'Eingangszahlung' }, checks: { es: ['Cuenta bancaria', 'Medio de pago'], en: ['Bank account', 'Payment means'], de: ['Bankkonto', 'Zahlungsart'] }, effects: { stock: { es: 'Ninguno', en: 'None', de: 'Keiner' }, accounting: { es: 'Banco + contra cliente', en: 'Bank + against customer', de: 'Bank + gegen Debitor' }, balance: { es: 'Reduce saldo; cierra la factura', en: 'Reduces balance; closes invoice', de: 'Reduziert Saldo; schließt Rechnung' } } }
  ],
  purchase: [
    { id: 'SYN-PROC-P-1', labels: { es: 'Solicitud', en: 'Purchase request', de: 'Bestellanforderung' }, checks: { es: ['Autorizador', 'Necesidad real'], en: ['Approver', 'Real need'], de: ['Prüfer', 'Echter Bedarf'] }, effects: { stock: { es: 'Ninguno', en: 'None', de: 'Keiner' }, accounting: { es: 'Sin asiento', en: 'No journal entry', de: 'Keine Buchung' }, balance: { es: 'Sin efecto', en: 'No effect', de: 'Kein Effekt' } } },
    { id: 'SYN-PROC-P-2', labels: { es: 'Pedido', en: 'Purchase order', de: 'Bestellung' }, checks: { es: ['Proveedor', 'Precios y condiciones'], en: ['Supplier', 'Prices and terms'], de: ['Lieferant', 'Preise und Konditionen'] }, effects: { stock: { es: 'Pedido entrante', en: 'Ordered inbound', de: 'Bestellt' }, accounting: { es: 'Sin asiento', en: 'No journal entry', de: 'Keine Buchung' }, balance: { es: 'Sin efecto', en: 'No effect', de: 'Kein Effekt' } } },
    { id: 'SYN-PROC-P-3', labels: { es: 'Entrada de mercancía', en: 'Goods receipt', de: 'Warenausgang' }, checks: { es: ['Cantidades', 'Almacén'], en: ['Quantities', 'Warehouse'], de: ['Mengen', 'Lager'] }, effects: { stock: { es: 'Entrada (+)', en: 'In (+)', de: 'Zugang (+)' }, accounting: { es: 'Stock + tránsito/proveedor', en: 'Inventory + GR/IR', de: 'Bestand + Wareneingang' }, balance: { es: 'Sin efecto hasta factura', en: 'No effect until invoice', de: 'Kein Effekt bis Rechnung' } } },
    { id: 'SYN-PROC-P-4', labels: { es: 'Factura de proveedor', en: 'Supplier invoice', de: 'Lieferantenrechnung' }, checks: { es: ['Conciliación con entrada', 'Impuestos'], en: ['Match with receipt', 'Taxes'], de: ['Abgleich mit Eingang', 'Steuern'] }, effects: { stock: { es: 'Ninguno adicional', en: 'None additional', de: 'Kein weiterer' }, accounting: { es: 'Proveedor + compras + IVA soportado', en: 'Payables + purchases + input VAT', de: 'Kreditor + Einkauf + VSt' }, balance: { es: 'Aumenta saldo del proveedor', en: 'Raises supplier balance', de: 'Erhöht Kreditorsaldo' } } },
    { id: 'SYN-PROC-P-5', labels: { es: 'Pago', en: 'Outgoing payment', de: 'Ausgangszahlung' }, checks: { es: ['Vencimiento', 'Descuentos'], en: ['Due date', 'Discounts'], de: ['Fälligkeit', 'Skonto'] }, effects: { stock: { es: 'Ninguno', en: 'None', de: 'Keiner' }, accounting: { es: 'Banco + contra proveedor', en: 'Bank + against supplier', de: 'Bank + gegen Kreditor' }, balance: { es: 'Reduce saldo; cierra la factura', en: 'Reduces balance; closes invoice', de: 'Reduziert Saldo; schließt Rechnung' } } }
  ],
  finance: [
    { id: 'SYN-PROC-F-1', labels: { es: 'Documento origen', en: 'Source document', de: 'Ursprungsbeleg' }, checks: { es: ['Serie y numeración', 'Periodo abierto'], en: ['Series and numbering', 'Open period'], de: ['Nummernkreis', 'Offene Periode'] }, effects: { stock: { es: 'Según documento', en: 'Depends on document', de: 'Je nach Beleg' }, accounting: { es: 'Genera asiento determinado', en: 'Generates determined entry', de: 'Erzeugt abgeleitete Buchung' }, balance: { es: 'Según socio', en: 'Depends on partner', de: 'Je nach Partner' } } },
    { id: 'SYN-PROC-F-2', labels: { es: 'Asiento generado', en: 'Journal entry', de: 'Buchung' }, checks: { es: ['Cuentas de determinación', 'Debe = Haber'], en: ['Determination accounts', 'Debit = Credit'], de: ['Kontenfindung', 'Soll = Haben' ] }, effects: { stock: { es: 'Ninguno directo', en: 'No direct effect', de: 'Kein direkter Effekt' }, accounting: { es: 'Impacto en mayor y dimensiones', en: 'Hits G/L and dimensions', de: 'Betrifft Sachkonten und Dimensionen' }, balance: { es: 'Actualiza control del socio', en: 'Updates partner control', de: 'Aktualisiert Steuerkonto' } } },
    { id: 'SYN-PROC-F-3', labels: { es: 'Conciliación', en: 'Reconciliation', de: 'Abstimmung' }, checks: { es: ['Partidas abiertas', 'Diferencias'], en: ['Open items', 'Differences'], de: ['Offene Posten', 'Differenzen'] }, effects: { stock: { es: 'Ninguno', en: 'None', de: 'Keiner' }, accounting: { es: 'Cierra partidas cruzadas', en: 'Closes matched items', de: 'Schließt ausgeglichene Posten' }, balance: { es: 'Saldo real verificable', en: 'Verifiable true balance', de: 'Prüfbarer true Saldo' } } },
    { id: 'SYN-PROC-F-4', labels: { es: 'Cierre de periodo', en: 'Period closing', de: 'Periodenabschluss' }, checks: { es: ['Partidas pendientes', 'Bloqueos'], en: ['Pending items', 'Locks'], de: ['Offene Posten', 'Sperren'] }, effects: { stock: { es: 'Ninguno', en: 'None', de: 'Keiner' }, accounting: { es: 'Congela periodo contra errores tardíos', en: 'Freezes period against late errors', de: 'Friert Periode gegen Spätfehler' }, balance: { es: 'Sin efecto', en: 'No effect', de: 'Kein Effekt' } } }
  ],
  integration: [
    { id: 'SYN-PROC-I-1', labels: { es: 'Contrato definido', en: 'Contract defined', de: 'Vertrag definiert' }, checks: { es: ['Entidades y campos', 'Versión de API'], en: ['Entities and fields', 'API version'], de: ['Entitäten und Felder', 'API-Version'] }, effects: { stock: { es: 'Ninguno', en: 'None', de: 'Keiner' }, accounting: { es: 'Ninguno', en: 'None', de: 'Keiner' }, balance: { es: 'Ninguno', en: 'None', de: 'Keiner' } } },
    { id: 'SYN-PROC-I-2', labels: { es: 'Autenticación y permisos', en: 'Auth and permissions', de: 'Auth und Berechtigungen' }, checks: { es: ['Usuario dedicado', 'Mínimo privilegio'], en: ['Dedicated user', 'Least privilege'], de: ['Dedizierter Benutzer', 'Mindestprivileg'] }, effects: { stock: { es: 'Ninguno', en: 'None', de: 'Keiner' }, accounting: { es: 'Ninguno', en: 'None', de: 'Keiner' }, balance: { es: 'Ninguno', en: 'None', de: 'Keiner' } } },
    { id: 'SYN-PROC-I-3', labels: { es: 'Llamada idempotente', en: 'Idempotent call', de: 'Idempotenter Aufruf' }, checks: { es: ['Clave de idempotencia', 'Reintentos seguros'], en: ['Idempotency key', 'Safe retries'], de: ['Idempotenzschlüssel', 'Sichere Wiederholungen'] }, effects: { stock: { es: 'Efecto único aunque reintente', en: 'Single effect despite retries', de: 'Einmalige Wirkung trotz Wiederholung' }, accounting: { es: 'Sin duplicados', en: 'No duplicates', de: 'Keine Duplikate' }, balance: { es: 'Sin duplicados', en: 'No duplicates', de: 'Keine Duplikate' } } },
    { id: 'SYN-PROC-I-4', labels: { es: 'Puerta humana', en: 'Human gate', de: 'Menschliches Gate' }, checks: { es: ['Revisión de efectos', 'Autorización registrada'], en: ['Effect review', 'Logged authorization'], de: ['Wirkungsprüfung', 'Protokollierte Freigabe'] }, effects: { stock: { es: 'Cambios con responsables', en: 'Changes with owners', de: 'Änderungen mit Verantwortlichen' }, accounting: { es: 'Solo acciones aprobadas', en: 'Only approved actions', de: 'Nur genehmigte Aktionen' }, balance: { es: 'Solo acciones aprobadas', en: 'Only approved actions', de: 'Nur genehmigte Aktionen' } } }
  ]
};
