import { mountSapB1Lab } from './app.mjs';

const UI = {
  es: {
    guided:'Práctica guiada', select:'Selecciona', route:'La ruta aparece aquí…', undo:'Deshacer último', event:'Evento observado', cascade:'Construye la cascada…',
    what:'¿Qué es esto?', task:'Tu tarea', graded:'Se evalúa', guidedMode:'Modo guiado', guidedHelp:'Errores no cuentan. Pide pista cuando lo necesites.',
    check:'Comprobar', hint:'Pista', reset:'Reiniciar', success:'Misión resuelta', retry:'Aún no — te digo exactamente qué falló',
    exactConfig:'Configuración exacta', process:'Proceso end-to-end', symptom:'Síntoma', root:'Causa raíz', resolution:'Resolución', best:'Buenas prácticas senior',
    back:'Volver a la lista', why:'¿Por qué funciona?', pitfall:'Trampa', level:'Nivel', console:'Consola avanzada'
  },
  en: {
    guided:'Guided practice', select:'Select', route:'The path appears here…', undo:'Undo last', event:'Observed event', cascade:'Build the cascade…',
    what:'What is this?', task:'Your task', graded:'What is assessed', guidedMode:'Guided mode', guidedHelp:'Mistakes do not count. Ask for a hint when you need one.',
    check:'Check', hint:'Hint', reset:'Reset', success:'Mission solved', retry:'Not yet — here is exactly what failed',
    exactConfig:'Exact configuration', process:'End-to-end process', symptom:'Symptom', root:'Root cause', resolution:'Resolution', best:'Senior best practices',
    back:'Back to list', why:'Why does it work?', pitfall:'Pitfall', level:'Level', console:'Advanced console'
  },
  de: {
    guided:'Geführte Praxis', select:'Auswählen', route:'Der Pfad erscheint hier…', undo:'Letzten Schritt zurück', event:'Beobachtetes Ereignis', cascade:'Kaskade aufbauen…',
    what:'Was ist das?', task:'Deine Aufgabe', graded:'Bewertet wird', guidedMode:'Geführter Modus', guidedHelp:'Fehler zählen nicht. Nutze bei Bedarf einen Hinweis.',
    check:'Prüfen', hint:'Hinweis', reset:'Zurücksetzen', success:'Aufgabe gelöst', retry:'Noch nicht — hier ist genau, was fehlgeschlagen ist',
    exactConfig:'Konfiguration', process:'End-to-End-Prozess', symptom:'Symptom', root:'Ursache', resolution:'Lösung', best:'Senior-Best-Practices',
    back:'Zurück zur Liste', why:'Warum funktioniert das?', pitfall:'Stolperstein', level:'Niveau', console:'Erweiterte Konsole'
  }
};

const EXACT = {
  'Práctica guiada': ['Práctica guiada','Guided practice','Geführte Praxis'],
  '— Selecciona —': ['— Selecciona —','— Select —','— Auswählen —'],
  'La ruta aparece aquí…': ['La ruta aparece aquí…','The path appears here…','Der Pfad erscheint hier…'],
  '↶ Deshacer último': ['↶ Deshacer último','↶ Undo last','↶ Letzten Schritt zurück'],
  'Evento observado': ['Evento observado','Observed event','Beobachtetes Ereignis'],
  'Construye la cascada…': ['Construye la cascada…','Build the cascade…','Kaskade aufbauen…'],
  '¿Qué es esto?': ['¿Qué es esto?','What is this?','Was ist das?'],
  'Tu tarea': ['Tu tarea','Your task','Deine Aufgabe'],
  'Se evalúa': ['Se evalúa','What is assessed','Bewertet wird'],
  'Modo guiado': ['Modo guiado','Guided mode','Geführter Modus'],
  'Errores no cuentan. Pide pista cuando lo necesites.': ['Errores no cuentan. Pide pista cuando lo necesites.','Mistakes do not count. Ask for a hint when you need one.','Fehler zählen nicht. Nutze bei Bedarf einen Hinweis.'],
  'Comprobar': ['Comprobar','Check','Prüfen'],
  'Reiniciar': ['Reiniciar','Reset','Zurücksetzen'],
  'Configuración exacta': ['Configuración exacta','Exact configuration','Konfiguration'],
  'Proceso end-to-end': ['Proceso end-to-end','End-to-end process','End-to-End-Prozess'],
  'Síntoma': ['Síntoma','Symptom','Symptom'],
  'Causa raíz': ['Causa raíz','Root cause','Ursache'],
  'Resolución': ['Resolución','Resolution','Lösung'],
  'Buenas prácticas senior': ['Buenas prácticas senior','Senior best practices','Senior-Best-Practices'],
  'Volver a la lista': ['Volver a la lista','Back to list','Zurück zur Liste'],
  '¿Por qué funciona?': ['¿Por qué funciona?','Why does it work?','Warum funktioniert das?'],
  '⚠️ Trampa': ['⚠️ Trampa','⚠️ Pitfall','⚠️ Stolperstein'],
  'Nivel': ['Nivel','Level','Niveau']
};

const DE_QUERIES = {
  'Q-AGING':['Finanzen · Kundenfälligkeit','Offene Kundenposten nach Altersklassen analysieren','Offene Beträge werden je Rechnung nach Alter gruppiert.','Gutschriften und stornierte Belege müssen korrekt berücksichtigt werden.'],
  'Q-DSO':['KPI · DSO nach Kundengruppe','Monatliche Außenstandsdauer messen','DSO verbindet offenen Saldo mit fakturiertem Umsatz.','Gruppen ohne Umsatz benötigen Schutz vor Division durch null.'],
  'Q-GRIR':['Einkauf · Wareneingang nicht fakturiert','Wareneingänge ohne Lieferantenrechnung finden','Offene Wareneingangszeilen zeigen noch nicht fakturierte Mengen.','Sehr alte offene Positionen sind ein Abstimmungssignal.'],
  'Q-MARGEN':['Verkauf · Marge je Artikel','Verkäufe unter Kosten erkennen','Umsatz und Lagerbewertung werden je Artikel verglichen.','Die Bewertungsmethode muss zur Kostenquelle passen.'],
  'Q-FALTANTES':['MRP · Nettofehlmengen','Offene Nachfrage gegen verfügbaren Bestand prüfen','Verfügbarer Bestand berücksichtigt bereits gebundene Mengen.','Liefertermine sind für die Priorisierung zusätzlich nötig.'],
  'Q-DIO':['KPI · Lagerreichweite','Gebundenes Kapital im Bestand analysieren','Bestandswert wird dem realen Verbrauch gegenübergestellt.','Verbrauchsquellen müssen vollständig definiert sein.'],
  'Q-SALDO':['Finanzen · Laufender Saldo','Geschäftspartnerbewegungen mit laufendem Saldo zeigen','Window Functions bilden den fortlaufenden Saldo deterministisch.','Interne Abstimmung und Buchsaldo sind nicht identisch.'],
  'Q-BOM':['Produktion · Mehrstufige Stückliste','Komponenten über mehrere Ebenen auflösen','Eine rekursive CTE traversiert die Stücklistenstruktur.','Rekursion muss begrenzt werden, um Zyklen sicher zu behandeln.']
};
const DE_DASH = {'D-PDL':'Interaktive GuV','D-KPI':'Web-Client-KPIs','D-COHORTE':'Kundenkohorten','D-PARETO':'ABC-Pareto','D-ALERTA':'Proaktive Warnungen'};
const DE_VIBE = {'V-CONTEXT':'1 · Kontextvertrag','V-EVIDENCE':'2 · Evidenz zuerst','V-SEED':'3 · Beispieldaten','V-OUT':'4 · Strukturierte Ausgabe','V-EVAL':'5 · Evals als Tests','V-GUARD':'6 · Injection & Grenzen'};

function replaceExactText(root, locale) {
  const idx = locale === 'es' ? 0 : locale === 'en' ? 1 : 2;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const raw = node.nodeValue;
    const trimmed = raw.trim();
    const target = EXACT[trimmed]?.[idx];
    if (!target || target === trimmed) continue;
    const leading = raw.match(/^\s*/)?.[0] || '';
    const trailing = raw.match(/\s*$/)?.[0] || '';
    node.nodeValue = leading + target + trailing;
  }
}

function removeForeignB1Mockups(root, locale) {
  if (locale === 'es') return;
  for (const figure of root.querySelectorAll('figure.b1')) {
    const notice = document.createElement('div');
    notice.className = 'card text-small';
    notice.dataset.strictLocale = locale;
    notice.textContent = locale === 'de'
      ? 'Die SAP-B1-Mockup-Beschriftungen werden hier ausgeblendet, weil diese Legacy-Grafik noch keine vollständigen deutschen Feldtexte besitzt. Der Lerninhalt bleibt darunter vollständig auf Deutsch.'
      : 'The SAP B1 mock-up labels are hidden here because this legacy visual does not yet contain a complete English field set. The learning content below remains fully in English.';
    figure.replaceWith(notice);
  }
}

function localizeGermanMasterclass(root) {
  for (const master of root.querySelectorAll('.sbl-masterclass:not([data-strict-locale="de"])')) {
    const article = master.closest('article');
    const title = article?.querySelector('#skill-title')?.textContent?.trim() || 'SAP Business One';
    const paragraphs = [...(article?.querySelectorAll('.sbl-detail-grid section p') || [])].map(x => x.textContent.trim()).filter(Boolean);
    const tips = [...(article?.querySelectorAll('.sbl-tips li') || [])].slice(0,4).map(x => `<li>${escapeHtml(x.textContent.trim())}</li>`).join('');
    master.dataset.strictLocale = 'de';
    master.innerHTML = `<h3 class="mc-title">🎓 Vertiefung · ${escapeHtml(title)}</h3><div class="mc-grid"><div class="mc-block"><h4>⚙️ Konfiguration und Praxis</h4><p>${escapeHtml(paragraphs[3] || paragraphs[1] || '')}</p></div><div class="mc-block"><h4>🔗 End-to-End-Verifikation</h4><p>${escapeHtml(paragraphs[2] || paragraphs[0] || '')}</p></div></div><div class="sbl-war" data-correct="false"><h4>⚠️ Risiko und Kontrolle</h4><p>Arbeite evidenzbasiert, ändere keine produktiven Daten ohne Freigabe und verifiziere das Ergebnis im betroffenen Prozess.</p></div><div class="mc-block mc-bp"><h4>🏆 Senior-Best-Practices</h4><ul>${tips}</ul></div>`;
  }
}

function escapeHtml(value='') {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function localizeGermanConsole(root, lastQuery) {
  const title = root.querySelector('#console-title');
  if (title) title.textContent = 'Erweiterte Konsole';
  const head = root.querySelector('.csl-head');
  const sub = head?.querySelector('p');
  if (sub) sub.textContent = 'Praxisnahes SAP-B1-SQL, Management-Dashboards und angewandtes Vibecoding mit realen Tabellen.';
  const tabs = [...(root.querySelectorAll('.csl-tabs button') || [])];
  const tabNames = ['Expertenabfragen','Dashboards & KPI','B1-Vibecoding'];
  tabs.forEach((b,i)=>{ if(tabNames[i]) b.textContent=tabNames[i]; });

  for (const card of root.querySelectorAll('.csl-card[data-id]')) {
    const d = DE_QUERIES[card.dataset.id];
    if (!d) continue;
    const strong = card.querySelector('strong');
    const small = card.querySelector('.text-small');
    if (strong) strong.textContent = d[0];
    if (small) small.textContent = d[1] + '…';
  }
  const detail = root.querySelector('.csl-detail');
  if (detail && lastQuery && DE_QUERIES[lastQuery]) {
    const d = DE_QUERIES[lastQuery];
    const sql = detail.querySelector('pre')?.outerHTML || '';
    const engines = detail.querySelector('.viz-badge')?.textContent || 'HANA · MSSQL';
    detail.innerHTML = `<div class="csl-toprow"><button type="button" class="btn" data-action="console-close">← Zurück zur Liste</button><span class="viz-badge">${escapeHtml(engines)}</span></div><h3>${escapeHtml(d[0])}</h3><p class="csl-ask">${escapeHtml(d[1])}</p>${sql}<div class="csl-why"><strong>Warum funktioniert das?</strong><p>${escapeHtml(d[2])}</p></div><div class="csl-pitfall"><strong>⚠️ Stolperstein</strong><p>${escapeHtml(d[3])}</p></div>`;
  }
  for (const panel of root.querySelectorAll('.csl-panel')) {
    const id = panel.querySelector('[data-id]')?.dataset.id;
    const name = DE_DASH[id] || DE_VIBE[id];
    if (name) panel.querySelector('strong').textContent = name;
    const ask = panel.querySelector('.csl-ask');
    if (ask) ask.textContent = 'Definiere Datenquelle, Logik, Schwelle und Verantwortlichkeit so, dass das Ergebnis reproduzierbar geprüft werden kann.';
    const steps = panel.querySelector('.csl-steps');
    if (steps) steps.innerHTML = '<li>Datenquelle und Ziel definieren.</li><li>Logik mit einem kontrollierten Beispiel prüfen.</li><li>Ergebnis und Verantwortlichkeit dokumentieren.</li>';
    const why = panel.querySelector('.csl-why');
    if (why) why.innerHTML = '<strong>Niveau</strong><p>Von statischem Reporting zu überprüfbaren Entscheidungen.</p>';
    const idea = panel.querySelector(':scope > p:not(.csl-ask)');
    if (idea) idea.textContent = 'Kontext, Evidenz, Ausgabeformat, Unsicherheit und menschliche Freigaben explizit festlegen.';
    panel.querySelectorAll('pre, .csl-check').forEach(x => x.remove());
  }
}

function localizeGermanCareer(root) {
  const badge = root.querySelector('.cr-head .viz-badge');
  if (badge) badge.textContent = 'SAP BUSINESS ONE · BERATER-KARRIERE';
  const ticket = root.querySelector('.cr-ticket');
  if (ticket) {
    const h3 = ticket.querySelector('h3');
    const p = ticket.querySelector('p');
    if (h3) h3.textContent = 'Nächstes Beratungsticket';
    if (p) p.textContent = 'Analysiere das Ticket mit der ausgewählten Kompetenz, prüfe die Evidenz und dokumentiere die sichere Lösung.';
  }
}

function enforce(root, state) {
  const locale = root.getAttribute('lang') || root.querySelector('[data-action="locale"]')?.value || state.locale || 'es';
  document.documentElement.lang = locale;
  replaceExactText(root, locale);
  removeForeignB1Mockups(root, locale);
  if (locale === 'de') {
    localizeGermanMasterclass(root);
    localizeGermanConsole(root, state.lastQuery);
    localizeGermanCareer(root);
  }
  if (locale !== 'es') {
    const kicker = root.querySelector('.sbl-kicker');
    if (kicker) kicker.textContent = locale === 'de' ? 'SAP BUSINESS ONE · 9 LEVEL · 72 SKILLS · EXPERTENNIVEAU' : 'SAP BUSINESS ONE · 9 LEVELS · 72 SKILLS · EXPERT LEVEL';
  }
}

export function mountStrictSapB1Lab(root) {
  const runtime = { locale:'es', lastQuery:null, scheduled:false };
  const schedule = () => {
    if (runtime.scheduled) return;
    runtime.scheduled = true;
    queueMicrotask(() => {
      runtime.scheduled = false;
      runtime.locale = root.getAttribute('lang') || root.querySelector('[data-action="locale"]')?.value || runtime.locale;
      enforce(root, runtime);
    });
  };
  root.addEventListener('click', event => {
    const q = event.target.closest('[data-action="console-query"]');
    if (q) runtime.lastQuery = q.dataset.id;
    schedule();
  }, true);
  root.addEventListener('change', schedule, true);
  const observer = new MutationObserver(schedule);
  observer.observe(root, { childList:true, subtree:true, attributes:true, attributeFilter:['lang'] });
  const controller = mountSapB1Lab(root);
  schedule();
  return controller;
}