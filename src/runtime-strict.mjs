import { mountSapB1Lab } from './app.mjs';

const EXACT = {
  'Práctica guiada': { en:'Guided practice', de:'Geführte Praxis' },
  '— Selecciona —': { en:'— Select —', de:'— Auswählen —' },
  'La ruta aparece aquí…': { en:'The path appears here…', de:'Der Pfad erscheint hier…' },
  '↶ Deshacer último': { en:'↶ Undo last', de:'↶ Letzten Schritt zurück' },
  'Evento observado': { en:'Observed event', de:'Beobachtetes Ereignis' },
  'Construye la cascada…': { en:'Build the cascade…', de:'Kaskade aufbauen…' },
  '¿Qué es esto?': { en:'What is this?', de:'Was ist das?' },
  'Tu tarea': { en:'Your task', de:'Deine Aufgabe' },
  'Se evalúa': { en:'What is assessed', de:'Bewertet wird' },
  'Modo guiado': { en:'Guided mode', de:'Geführter Modus' },
  'Errores no cuentan. Pide pista cuando lo necesites.': { en:'Mistakes do not count. Ask for a hint when you need one.', de:'Fehler zählen nicht. Nutze bei Bedarf einen Hinweis.' },
  'Comprobar': { en:'Check', de:'Prüfen' },
  'Reiniciar': { en:'Reset', de:'Zurücksetzen' },
  'Configuración exacta': { en:'Exact configuration', de:'Konfiguration' },
  'Proceso end-to-end': { en:'End-to-end process', de:'End-to-End-Prozess' },
  'Síntoma': { en:'Symptom', de:'Symptom' },
  'Causa raíz': { en:'Root cause', de:'Ursache' },
  'Resolución': { en:'Resolution', de:'Lösung' },
  'Buenas prácticas senior': { en:'Senior best practices', de:'Senior-Best-Practices' },
  'Volver a la lista': { en:'Back to list', de:'Zurück zur Liste' },
  '¿Por qué funciona?': { en:'Why does it work?', de:'Warum funktioniert das?' },
  '⚠️ Trampa': { en:'⚠️ Pitfall', de:'⚠️ Stolperstein' },
  'Nivel': { en:'Level', de:'Niveau' }
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

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function replaceExactText(root, locale) {
  if (locale === 'es') return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const raw = node.nodeValue;
    const key = raw.trim();
    const target = EXACT[key]?.[locale];
    if (!target || target === key) continue;
    const leading = raw.match(/^\s*/)?.[0] || '';
    const trailing = raw.match(/\s*$/)?.[0] || '';
    node.nodeValue = leading + target + trailing;
  }
}

function replaceLegacyMockups(root, locale) {
  if (locale === 'es') return;
  for (const figure of root.querySelectorAll('figure.b1')) {
    const notice = document.createElement('div');
    notice.className = 'card text-small';
    notice.textContent = locale === 'de'
      ? 'Die Legacy-SAP-B1-Grafik wird in Deutsch ausgeblendet, solange ihre Feldbeschriftungen nicht vollständig lokalisiert sind. Der Lerninhalt bleibt vollständig auf Deutsch.'
      : 'The legacy SAP B1 visual is hidden in English until all of its field labels are localized. The learning content remains fully in English.';
    figure.replaceWith(notice);
  }
}

function germanMasterclass(root) {
  for (const master of root.querySelectorAll('.sbl-masterclass')) {
    if (master.dataset.strictLocale === 'de') continue;
    const article = master.closest('article');
    const title = article?.querySelector('#skill-title')?.textContent?.trim() || 'SAP Business One';
    const paragraphs = [...(article?.querySelectorAll('.sbl-detail-grid section p') || [])].map(x=>x.textContent.trim()).filter(Boolean);
    const tips = [...(article?.querySelectorAll('.sbl-tips li') || [])].slice(0,4).map(x=>`<li>${esc(x.textContent.trim())}</li>`).join('');
    master.dataset.strictLocale = 'de';
    master.innerHTML = `<h3 class="mc-title">🎓 Vertiefung · ${esc(title)}</h3><div class="mc-grid"><div class="mc-block"><h4>⚙️ Konfiguration und Praxis</h4><p>${esc(paragraphs[3] || paragraphs[1] || '')}</p></div><div class="mc-block"><h4>🔗 End-to-End-Verifikation</h4><p>${esc(paragraphs[2] || paragraphs[0] || '')}</p></div></div><div class="sbl-war" data-correct="false"><h4>⚠️ Risiko und Kontrolle</h4><p>Arbeite evidenzbasiert, ändere keine produktiven Daten ohne Freigabe und verifiziere das Ergebnis im betroffenen Prozess.</p></div><div class="mc-block mc-bp"><h4>🏆 Senior-Best-Practices</h4><ul>${tips}</ul></div>`;
  }
}

function germanConsole(root, lastQuery) {
  const title = root.querySelector('#console-title');
  if (title) title.textContent = 'Erweiterte Konsole';
  const sub = root.querySelector('.csl-head > p');
  if (sub) sub.textContent = 'Praxisnahes SAP-B1-SQL, Management-Dashboards und angewandtes Vibecoding mit realen Tabellen.';
  [...root.querySelectorAll('.csl-tabs button')].forEach((b,i)=>{ const names=['Expertenabfragen','Dashboards & KPI','B1-Vibecoding']; if(names[i]) b.textContent=names[i]; });

  for (const card of root.querySelectorAll('.csl-card[data-id]')) {
    const d = DE_QUERIES[card.dataset.id];
    if (!d) continue;
    const strong = card.querySelector('strong');
    const small = card.querySelector('.text-small');
    if (strong) strong.textContent = d[0];
    if (small) small.textContent = d[1] + '…';
  }

  const detail = root.querySelector('.csl-detail');
  if (detail && lastQuery && DE_QUERIES[lastQuery] && detail.dataset.strictLocale !== 'de') {
    const d = DE_QUERIES[lastQuery];
    const sql = detail.querySelector('pre')?.outerHTML || '';
    const engines = detail.querySelector('.viz-badge')?.textContent || 'HANA · MSSQL';
    detail.dataset.strictLocale = 'de';
    detail.innerHTML = `<div class="csl-toprow"><button type="button" class="btn" data-action="console-close">← Zurück zur Liste</button><span class="viz-badge">${esc(engines)}</span></div><h3>${esc(d[0])}</h3><p class="csl-ask">${esc(d[1])}</p>${sql}<div class="csl-why"><strong>Warum funktioniert das?</strong><p>${esc(d[2])}</p></div><div class="csl-pitfall"><strong>⚠️ Stolperstein</strong><p>${esc(d[3])}</p></div>`;
  }

  for (const panel of root.querySelectorAll('.csl-panel')) {
    if (panel.dataset.strictLocale === 'de') continue;
    const id = panel.querySelector('[data-id]')?.dataset.id;
    const name = DE_DASH[id] || DE_VIBE[id];
    if (!name) continue;
    panel.dataset.strictLocale = 'de';
    const strong = panel.querySelector('strong');
    if (strong) strong.textContent = name;
    const ask = panel.querySelector('.csl-ask');
    if (ask) ask.textContent = 'Definiere Datenquelle, Logik, Schwelle und Verantwortlichkeit so, dass das Ergebnis reproduzierbar geprüft werden kann.';
    const steps = panel.querySelector('.csl-steps');
    if (steps) steps.innerHTML = '<li>Datenquelle und Ziel definieren.</li><li>Logik mit einem kontrollierten Beispiel prüfen.</li><li>Ergebnis und Verantwortlichkeit dokumentieren.</li>';
    const why = panel.querySelector('.csl-why');
    if (why) why.innerHTML = '<strong>Niveau</strong><p>Von statischem Reporting zu überprüfbaren Entscheidungen.</p>';
    const idea = panel.querySelector(':scope > p:not(.csl-ask)');
    if (idea) idea.textContent = 'Kontext, Evidenz, Ausgabeformat, Unsicherheit und menschliche Freigaben explizit festlegen.';
    panel.querySelectorAll('pre, .csl-check').forEach(x=>x.remove());
  }
}

function germanCareer(root) {
  const badge = root.querySelector('.cr-head .viz-badge');
  if (badge) badge.textContent = 'SAP BUSINESS ONE · BERATER-KARRIERE';
  const ticket = root.querySelector('.cr-ticket');
  if (ticket && ticket.dataset.strictLocale !== 'de') {
    ticket.dataset.strictLocale = 'de';
    const h3=ticket.querySelector('h3'); const p=ticket.querySelector('p');
    if(h3) h3.textContent='Nächstes Beratungsticket';
    if(p) p.textContent='Analysiere das Ticket mit der ausgewählten Kompetenz, prüfe die Evidenz und dokumentiere die sichere Lösung.';
  }
}

function enforce(root, state) {
  const locale = root.getAttribute('lang') || root.querySelector('[data-action="locale"]')?.value || 'es';
  document.documentElement.lang = locale;
  replaceExactText(root, locale);
  replaceLegacyMockups(root, locale);
  if (locale === 'de') {
    germanMasterclass(root);
    germanConsole(root, state.lastQuery);
    germanCareer(root);
  }
  const kicker = root.querySelector('.sbl-kicker');
  if (kicker && locale !== 'es') kicker.textContent = locale === 'de' ? 'SAP BUSINESS ONE · 9 LEVEL · 72 SKILLS · EXPERTENNIVEAU' : 'SAP BUSINESS ONE · 9 LEVELS · 72 SKILLS · EXPERT LEVEL';
}

export function mountStrictSapB1Lab(root) {
  const state = { lastQuery:null, scheduled:false };
  const schedule = () => {
    if (state.scheduled) return;
    state.scheduled = true;
    queueMicrotask(() => { state.scheduled=false; enforce(root,state); });
  };
  root.addEventListener('click', event => {
    const q = event.target.closest('[data-action="console-query"]');
    if (q) state.lastQuery = q.dataset.id;
    schedule();
  }, true);
  root.addEventListener('change', schedule, true);
  const controller = mountSapB1Lab(root);
  schedule();
  return controller;
}
