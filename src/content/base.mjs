// Base del curriculum v2 — I18N, niveles, evidencia, procesos enriquecidos y DSL de skills.
export const I18N = {
  es: {
    appLabel: 'Laboratorio de dominio SAP Business One', navHome: 'Inicio', navCareer: 'Carrera', navMap: 'Mapa', navCases: 'Casos', navIncidents: 'Incidentes', navSimulator: 'Cadena', navAI: 'Consola avanzada', navEvidence: 'Fuentes',
    language: 'Idioma', track: 'Ruta', trackFunctional: 'Funcional', trackTechnical: 'Técnica + IA', trackDual: 'Doble ruta',
    startDiagnostic: 'Iniciar diagnóstico', resume: 'Continuar', reset: 'Reiniciar progreso', export: 'Exportar progreso', import: 'Importar progreso',
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
    promptFieldRole: 'Rol', promptFieldGoal: 'Objetivo', promptFieldContext: 'Contexto', promptFieldEvidence: 'Evidencia', promptFieldUncertainty: 'Incertidumbre', promptFieldOutput: 'Formato de salida', promptFieldHumanGate: 'Revisión humana', promptFieldSyntheticContext: 'Caso sintético',
    mcTitle: 'Masterclass', mcConfig: 'Configuración exacta', mcE2E: 'Proceso end-to-end', mcBestPractices: 'Buenas prácticas senior',
    warSymptom: 'Síntoma', warRootCause: 'Causa raíz', warResolution: 'Resolución',
    actSelect: '— Selecciona —', actRouteHere: 'La ruta aparece aquí…', actUndo: 'Deshacer último', actEventSeen: 'Evento observado', actBuildCascade: 'Construye la cascada…',
    actAccount: 'Cuenta', actSide: 'Debe / Haber', actAmount: 'Importe', actDebit: 'Debe', actCredit: 'Haber', actBalanced: 'Cuadrado', actDifference: 'Diferencia',
    actUnavailable: 'Actividad en preparación.', actWhatIsThis: '¿Qué es esto?', actYourTask: 'Tu tarea', actGraded: 'Se evalúa',
    actGuidedMode: 'Modo guiado', actGuidedHelp: 'Errores no cuentan. Pide pista cuando lo necesites.', actGuidedTag: 'guiado',
    actCorrectAnswer: 'correcto', actSolved: 'Misión resuelta', actNotYet: 'Aún no — te digo exactamente qué falló',
    actCheck: 'Comprobar', actHint: 'Pista', actReset: 'Reiniciar', actWrongPrompt: 'Revisa los elementos marcados y vuelve a intentarlo.',
    actRightPrompt: 'Decisión correcta: la evidencia, el control y el resultado son coherentes.', guidedPractice: 'Práctica guiada',
    cslWhy: '¿Por qué funciona?', cslTrap: 'Trampa', cslLevel: 'Nivel', cslBack: 'Volver a la lista',
    cslQueries: 'Consultas expertas', cslDashboards: 'Dashboards y KPI', cslVibecoding: 'Vibecoding B1',
    cslSubtitle: 'SQL real de SAP B1, dashboards de gestión y vibecoding aplicado. Todo con tablas reales: OINV, JDT1, OITW, ITT1…',
    crCurrentRole: 'Cargo actual', crNextTicket: 'SIGUIENTE TICKET', crWorkTicket: 'Atender este ticket', crTicketLog: 'Registro de tickets',
    crResolved: 'resuelto', crNoTickets: 'Aún no hay tickets resueltos.', crNextRole: 'siguiente', crAt: 'a las',
    b1Add: 'Añadir (Ctrl+A)', b1Find: 'Buscar (Ctrl+F)', b1First: 'Primer registro', b1Prev: 'Anterior', b1Next: 'Siguiente', b1Last: 'Último registro',
    b1Cancel: 'Cancelar (Ctrl+C)', b1Print: 'Imprimir', b1File: 'Archivo', b1Edit: 'Editar', b1View: 'Ver', b1Data: 'Datos', b1GoTo: 'Ir a', b1Tools: 'Herramientas', b1Help: 'Ayuda',
    b1WindowLabel: 'ventana SAP Business One', techTrackLabel: 'Ruta técnica + IA',
    fbMark: 'Marcar', fbDontMark: 'No marcar', fbMarked: 'Marcado', fbUnmarked: 'Sin marcar',
    fbLinkFlagged: 'Eslabón señalado', fbRealBrokenLink: 'El eslabón roto real', fbStep: 'Paso', fbExpected: 'esperaba',
    fbDecoys: 'Incluiste señuelos que no pertenecen a la cadena', fbExactSteps: 'pasos exactos', fbSteps: 'pasos', fbSideAmount: 'lado/importe',
    kicker: 'SAP BUSINESS ONE · 9 NIVELES · 72 COMPETENCIAS · NIVEL EXPERTO'
  },
  en: {
    appLabel: 'SAP Business One mastery lab', navHome: 'Home', navCareer: 'Career', navMap: 'Map', navCases: 'Cases', navIncidents: 'Incidents', navSimulator: 'Chain', navAI: 'Advanced console', navEvidence: 'Sources',
    language: 'Language', track: 'Path', trackFunctional: 'Functional', trackTechnical: 'Technical + AI', trackDual: 'Dual path',
    startDiagnostic: 'Start diagnostic', resume: 'Continue', reset: 'Reset progress', export: 'Export progress', import: 'Import progress',
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
    promptFieldRole: 'Role', promptFieldGoal: 'Goal', promptFieldContext: 'Context', promptFieldEvidence: 'Evidence', promptFieldUncertainty: 'Uncertainty', promptFieldOutput: 'Output format', promptFieldHumanGate: 'Human review', promptFieldSyntheticContext: 'Synthetic case',
    mcTitle: 'Masterclass', mcConfig: 'Exact configuration', mcE2E: 'End-to-end process', mcBestPractices: 'Senior best practices',
    warSymptom: 'Symptom', warRootCause: 'Root cause', warResolution: 'Resolution',
    actSelect: '— Select —', actRouteHere: 'The route appears here…', actUndo: 'Undo last', actEventSeen: 'Observed event', actBuildCascade: 'Build the cascade…',
    actAccount: 'Account', actSide: 'Debit / Credit', actAmount: 'Amount', actDebit: 'Debit', actCredit: 'Credit', actBalanced: 'Balanced', actDifference: 'Difference',
    actUnavailable: 'Activity in preparation.', actWhatIsThis: 'What is this?', actYourTask: 'Your task', actGraded: 'Graded on',
    actGuidedMode: 'Guided mode', actGuidedHelp: 'Mistakes do not count. Ask for a hint whenever you need one.', actGuidedTag: 'guided',
    actCorrectAnswer: 'correct', actSolved: 'Mission solved', actNotYet: 'Not yet — here is exactly what failed',
    actCheck: 'Check', actHint: 'Hint', actReset: 'Restart', actWrongPrompt: 'Review the marked items and try again.',
    actRightPrompt: 'Sound decision: evidence, control and outcome are coherent.', guidedPractice: 'Guided practice',
    cslWhy: 'Why does it work?', cslTrap: 'Trap', cslLevel: 'Level', cslBack: 'Back to list',
    cslQueries: 'Expert queries', cslDashboards: 'Dashboards and KPIs', cslVibecoding: 'B1 vibecoding',
    cslSubtitle: 'Real SAP B1 SQL, management dashboards and applied vibecoding. All on real tables: OINV, JDT1, OITW, ITT1…',
    crCurrentRole: 'Current role', crNextTicket: 'NEXT TICKET', crWorkTicket: 'Work this ticket', crTicketLog: 'Ticket log',
    crResolved: 'resolved', crNoTickets: 'No tickets resolved yet.', crNextRole: 'next', crAt: 'at',
    b1Add: 'Add (Ctrl+A)', b1Find: 'Find (Ctrl+F)', b1First: 'First record', b1Prev: 'Previous', b1Next: 'Next', b1Last: 'Last record',
    b1Cancel: 'Cancel (Ctrl+C)', b1Print: 'Print', b1File: 'File', b1Edit: 'Edit', b1View: 'View', b1Data: 'Data', b1GoTo: 'Go to', b1Tools: 'Tools', b1Help: 'Help',
    b1WindowLabel: 'SAP Business One window', techTrackLabel: 'Technical + AI track',
    fbMark: 'Flag', fbDontMark: 'Do not flag', fbMarked: 'Flagged', fbUnmarked: 'Not flagged',
    fbLinkFlagged: 'Link flagged', fbRealBrokenLink: 'The actual broken link', fbStep: 'Step', fbExpected: 'expected',
    fbDecoys: 'You included decoys that do not belong to the chain', fbExactSteps: 'exact steps', fbSteps: 'steps', fbSideAmount: 'side/amount',
    kicker: 'SAP BUSINESS ONE · 9 LEVELS · 72 SKILLS · EXPERT LEVEL'
  },
  de: {
    appLabel: 'SAP Business One Kompetenzlabor', navHome: 'Start', navCareer: 'Karriere', navMap: 'Karte', navCases: 'Fälle', navIncidents: 'Störungen', navSimulator: 'Kette', navAI: 'Erweiterte Konsole', navEvidence: 'Quellen',
    language: 'Sprache', track: 'Lernpfad', trackFunctional: 'Funktional', trackTechnical: 'Technik + KI', trackDual: 'Doppelpfad',
    startDiagnostic: 'Diagnose starten', resume: 'Fortsetzen', reset: 'Fortschritt löschen', export: 'Fortschritt exportieren', import: 'Fortschritt importieren',
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
    promptFieldRole: 'Rolle', promptFieldGoal: 'Ziel', promptFieldContext: 'Kontext', promptFieldEvidence: 'Nachweise', promptFieldUncertainty: 'Unsicherheit', promptFieldOutput: 'Ausgabeformat', promptFieldHumanGate: 'Menschliche Prüfung', promptFieldSyntheticContext: 'Synthetischer Fall',
    mcTitle: 'Masterclass', mcConfig: 'Exakte Konfiguration', mcE2E: 'End-to-End-Prozess', mcBestPractices: 'Senior-Praxisregeln',
    warSymptom: 'Symptom', warRootCause: 'Ursache', warResolution: 'Lösung',
    actSelect: '— Auswählen —', actRouteHere: 'Der Pfad erscheint hier…', actUndo: 'Letzten zurücknehmen', actEventSeen: 'Beobachtetes Ereignis', actBuildCascade: 'Baue die Kaskade…',
    actAccount: 'Konto', actSide: 'Soll / Haben', actAmount: 'Betrag', actDebit: 'Soll', actCredit: 'Haben', actBalanced: 'Ausgeglichen', actDifference: 'Differenz',
    actUnavailable: 'Übung in Vorbereitung.', actWhatIsThis: 'Was ist das?', actYourTask: 'Deine Aufgabe', actGraded: 'Bewertet wird',
    actGuidedMode: 'Geführter Modus', actGuidedHelp: 'Fehler zählen nicht. Frag nach einem Hinweis, wenn du einen brauchst.', actGuidedTag: 'geführt',
    actCorrectAnswer: 'richtig', actSolved: 'Mission gelöst', actNotYet: 'Noch nicht — hier steht genau, was schiefging',
    actCheck: 'Prüfen', actHint: 'Hinweis', actReset: 'Neu starten', actWrongPrompt: 'Sieh dir die markierten Punkte an und versuch es erneut.',
    actRightPrompt: 'Solide Entscheidung: Nachweis, Kontrolle und Ergebnis passen zusammen.', guidedPractice: 'Geführte Übung',
    cslWhy: 'Warum funktioniert das?', cslTrap: 'Falle', cslLevel: 'Niveau', cslBack: 'Zurück zur Liste',
    cslQueries: 'Expertenabfragen', cslDashboards: 'Dashboards und KPI', cslVibecoding: 'B1-Vibecoding',
    cslSubtitle: 'Echtes SAP-B1-SQL, Management-Dashboards und angewandtes Vibecoding. Alles mit echten Tabellen: OINV, JDT1, OITW, ITT1…',
    crCurrentRole: 'Aktuelle Rolle', crNextTicket: 'NÄCHSTES TICKET', crWorkTicket: 'Ticket bearbeiten', crTicketLog: 'Ticket-Verlauf',
    crResolved: 'gelöst', crNoTickets: 'Noch keine Tickets gelöst.', crNextRole: 'nächste', crAt: 'bei',
    b1Add: 'Hinzufügen (Strg+A)', b1Find: 'Suchen (Strg+F)', b1First: 'Erster Datensatz', b1Prev: 'Vorheriger', b1Next: 'Nächster', b1Last: 'Letzter Datensatz',
    b1Cancel: 'Abbrechen (Strg+C)', b1Print: 'Drucken', b1File: 'Datei', b1Edit: 'Bearbeiten', b1View: 'Ansicht', b1Data: 'Daten', b1GoTo: 'Gehe zu', b1Tools: 'Werkzeuge', b1Help: 'Hilfe',
    b1WindowLabel: 'SAP-Business-One-Fenster', techTrackLabel: 'Technik- und KI-Pfad',
    fbMark: 'Markieren', fbDontMark: 'Nicht markieren', fbMarked: 'Markiert', fbUnmarked: 'Nicht markiert',
    fbLinkFlagged: 'Markiertes Glied', fbRealBrokenLink: 'Das tatsächlich gebrochene Glied', fbStep: 'Schritt', fbExpected: 'erwartet',
    fbDecoys: 'Du hast Köder aufgenommen, die nicht zur Kette gehören', fbExactSteps: 'exakte Schritte', fbSteps: 'Schritte', fbSideAmount: 'Seite/Betrag',
    kicker: 'SAP BUSINESS ONE · 9 STUFEN · 72 KOMPETENZEN · EXPERTENNIVEAU'
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
  const localizedList = value => Array.isArray(value)
    ? Object.fromEntries(['es', 'en', 'de'].map(locale => {
        const wrongReasons = value.map(entry => entry?.[locale]).filter(Boolean);
        const optionCount = spec.a.opts?.[locale]?.length ?? wrongReasons.length;
        let wrongIndex = 0;
        return [locale, Array.from({ length: optionCount }, (_, optionIndex) => optionIndex === (spec.a.correct ?? 0)
          ? spec.a.why?.[locale]
          : wrongReasons[wrongIndex++]).filter(Boolean)];
      }))
    : value;
  const localizedText = value => value && Object.fromEntries(['es', 'en', 'de'].map(locale => [
    locale,
    Array.isArray(value[locale]) ? value[locale].join(' ') : value[locale]
  ]));
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
      seniorSteps: spec.a.senior, distractorWhy: localizedList(spec.a.dwhy), hints: localizedText(spec.a.hints)
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
  { id: 'EV-CRYSTAL', sourceType: 'official', title: 'How to Work with SAP Crystal Reports in SAP Business One — Document Version 1.9 (2026-08-12)', url: 'https://help.sap.com/doc/eb06711f528a49edb523234fe48192d8/10.0/en-US/How_to_Work_with_SAP_Crystal_Reports_in_SAP_Business_One.pdf', verifiedAt: '2026-08-24', applicability: { es: 'SAP Business One 10.0; guía oficial v1.9 para integración y flujos de informes Crystal', en: 'SAP Business One 10.0; official v1.9 guide for Crystal Reports integration and workflows', de: 'SAP Business One 10.0; offizieller Leitfaden v1.9 für Crystal-Reports-Integration und Abläufe' }, confidence: 'high' }
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
    { id: 'SYN-PROC-S-3', labels: { es: 'Entrega', en: 'Delivery', de: 'Lieferung' }, checks: { es: ['Almacén', 'Stock disponible'], en: ['Warehouse', 'Available stock'], de: ['Lager', 'Verfügbarer Bestand'] }, effects: { stock: { es: 'Salida (-)', en: 'Out (-)', de: 'Abgang (-)' }, accounting: { es: 'Coste de ventas, si aplica inventario permanente', en: 'Cost of goods sold under perpetual inventory', de: 'Wareneinsatz bei permanenter Bestandsführung' }, balance: { es: 'Sin efecto en saldo de cliente', en: 'No customer-balance effect', de: 'Keine Auswirkung auf Debitorensaldo' } } },
    { id: 'SYN-PROC-S-4', labels: { es: 'Factura', en: 'Invoice', de: 'Rechnung' }, checks: { es: ['Base-destino', 'Impuestos'], en: ['Base-target link', 'Taxes'], de: ['Basis-Ziel-Bezug', 'Steuern'] }, effects: { stock: { es: 'Ninguno adicional', en: 'None additional', de: 'Kein weiterer' }, accounting: { es: 'Cliente + ingresos + IVA', en: 'Receivables + revenue + VAT', de: 'Debitor + Erlös + USt' }, balance: { es: 'Aumenta saldo del cliente', en: 'Raises customer balance', de: 'Erhöht Debitorsaldo' } } },
    { id: 'SYN-PROC-S-5', labels: { es: 'Cobro', en: 'Incoming payment', de: 'Eingangszahlung' }, checks: { es: ['Cuenta bancaria', 'Medio de pago'], en: ['Bank account', 'Payment means'], de: ['Bankkonto', 'Zahlungsart'] }, effects: { stock: { es: 'Ninguno', en: 'None', de: 'Keiner' }, accounting: { es: 'Banco + contra cliente', en: 'Bank + against customer', de: 'Bank + gegen Debitor' }, balance: { es: 'Reduce saldo; cierra la factura si se aplica por completo', en: 'Reduces balance; closes the invoice when fully applied', de: 'Reduziert Saldo; schließt die Rechnung bei vollständiger Zuordnung' } } }
  ],
  purchase: [
    { id: 'SYN-PROC-P-1', labels: { es: 'Solicitud', en: 'Purchase request', de: 'Bestellanforderung' }, checks: { es: ['Autorizador', 'Necesidad real'], en: ['Approver', 'Real need'], de: ['Prüfer', 'Echter Bedarf'] }, effects: { stock: { es: 'Ninguno', en: 'None', de: 'Keiner' }, accounting: { es: 'Sin asiento', en: 'No journal entry', de: 'Keine Buchung' }, balance: { es: 'Sin efecto', en: 'No effect', de: 'Kein Effekt' } } },
    { id: 'SYN-PROC-P-2', labels: { es: 'Pedido', en: 'Purchase order', de: 'Bestellung' }, checks: { es: ['Proveedor', 'Precios y condiciones'], en: ['Supplier', 'Prices and terms'], de: ['Lieferant', 'Preise und Konditionen'] }, effects: { stock: { es: 'Pedido entrante', en: 'Ordered inbound', de: 'Bestellt' }, accounting: { es: 'Sin asiento', en: 'No journal entry', de: 'Keine Buchung' }, balance: { es: 'Sin efecto', en: 'No effect', de: 'Kein Effekt' } } },
    { id: 'SYN-PROC-P-3', labels: { es: 'Entrada de mercancía', en: 'Goods receipt PO', de: 'Wareneingang' }, checks: { es: ['Cantidades', 'Almacén'], en: ['Quantities', 'Warehouse'], de: ['Mengen', 'Lager'] }, effects: { stock: { es: 'Entrada (+)', en: 'In (+)', de: 'Zugang (+)' }, accounting: { es: 'Stock + cuenta puente, si aplica inventario permanente', en: 'Inventory + clearing account under perpetual inventory', de: 'Bestand + Verrechnungskonto bei permanenter Bestandsführung' }, balance: { es: 'Sin saldo de proveedor hasta factura', en: 'No supplier balance until invoice', de: 'Kein Kreditorsaldo bis zur Rechnung' } } },
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
