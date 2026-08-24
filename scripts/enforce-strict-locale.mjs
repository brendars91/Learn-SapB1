import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'src/app.mjs');
let source = await readFile(file, 'utf8');

const replaceOnce = (needle, replacement, label) => {
  if (!source.includes(needle)) throw new Error(`Locale patch target not found: ${label}`);
  source = source.replace(needle, replacement);
};
const replaceBlock = (start, end, replacement, label) => {
  const a = source.indexOf(start);
  const b = source.indexOf(end, a + start.length);
  if (a < 0 || b < 0) throw new Error(`Locale block not found: ${label}`);
  source = source.slice(0, a) + replacement.trimEnd() + '\n\n' + source.slice(b);
};

replaceOnce(
  "function local(value, locale) { return escapeHtml(value?.[locale] ?? value?.es ?? ''); }",
  "function local(value, locale) { return escapeHtml(value?.[locale] ?? ''); }",
  'strict local helper'
);

replaceOnce(
  '<span class="sbl-kicker">SAP BUSINESS ONE · 9 LEVELS · 72 SKILLS · NIVEL EXPERTO</span>',
  '<span class="sbl-kicker">${state.locale === \'de\' ? \'SAP BUSINESS ONE · 9 LEVEL · 72 SKILLS · EXPERTENNIVEAU\' : state.locale === \'en\' ? \'SAP BUSINESS ONE · 9 LEVELS · 72 SKILLS · EXPERT LEVEL\' : \'SAP BUSINESS ONE · 9 NIVELES · 72 SKILLS · NIVEL EXPERTO\'}</span>',
  'home kicker'
);

replaceBlock(
  'function renderMasterclass(state, skill) {',
  'function renderLearnMode(state, skill) {',
  `function renderMasterclass(state, skill) {
  const mc = MASTERCLASS[skill.id];
  if (!mc) return '';
  const L = state.locale;
  const labels = {
    es: { title:'Masterclass', config:'Configuración exacta', process:'Proceso end-to-end', symptom:'Síntoma', root:'Causa raíz', resolution:'Resolución', practices:'Buenas prácticas senior', depth:'Profundización práctica' },
    en: { title:'Masterclass', config:'Exact configuration', process:'End-to-end process', symptom:'Symptom', root:'Root cause', resolution:'Resolution', practices:'Senior best practices', depth:'Practical deep dive' },
    de: { title:'Vertiefung', config:'Konfiguration', process:'End-to-End-Prozess', symptom:'Symptom', root:'Ursache', resolution:'Lösung', practices:'Senior-Best-Practices', depth:'Praxis-Vertiefung' }
  }[L];
  const loc = v => v?.[L] ?? '';

  // Most legacy mock screens contain Spanish-only field labels. Never show them
  // under EN/DE: a missing translation must not silently become another language.
  const screen = L === 'es' ? b1Window(mc.screen, L) : '';

  if (L === 'de') {
    const verification = (skill.verifySteps || []).map(s => '<li>' + local(s, L) + '</li>').join('');
    const tips = (skill.tips?.de || []).map(x => '<li>' + escapeHtml(x) + '</li>').join('');
    return \`<section class="sbl-masterclass" aria-label="\${labels.depth}">
      <h3 class="mc-title">🎓 \${labels.title}</h3>
      <div class="mc-grid">
        <div class="mc-block"><h4>⚙️ \${labels.config}</h4><p>\${local(skill.practice, L)}</p></div>
        <div class="mc-block"><h4>🔗 \${labels.process}</h4><p>\${local(skill.verify, L)}</p></div>
      </div>
      <div class="sbl-war" data-correct="false"><h4>⚠️ \${labels.symptom}</h4><p class="war-line"><strong>\${labels.root}</strong> \${local(skill.risk, L)}</p><p class="war-line"><strong>\${labels.resolution}</strong> \${local(skill.verify, L)}</p></div>
      <div class="mc-block mc-bp"><h4>🏆 \${labels.practices}</h4><ul>\${tips || verification}</ul></div>
    </section>\`;
  }

  const cfg = (mc.cfg || []).map(c => loc(c)).filter(Boolean).map(c => '<li>' + escapeHtml(c) + '</li>').join('');
  const e2e = (mc.e2e || []).map(x => loc(x)).filter(Boolean).map(x => '<li>' + escapeHtml(x) + '</li>').join('');
  const bp = (mc.bp || []).map(x => loc(x)).filter(Boolean).map(x => '<li>' + escapeHtml(x) + '</li>').join('');
  const war = mc.war;
  const warHtml = war && loc(war.q) ? \`<div class="sbl-war" data-correct="false">
    <h4>⚠️ \${escapeHtml(loc(war.q))}</h4>
    <p class="war-line"><strong>\${labels.symptom}</strong> \${(war.sympt || []).map(x => escapeHtml(loc(x))).filter(Boolean).join(' ')}</p>
    <p class="war-line"><strong>\${labels.root}</strong> \${(war.root || []).map(x => escapeHtml(loc(x))).filter(Boolean).join(' ')}</p>
    <p class="war-line"><strong>\${labels.resolution}</strong> \${(war.fix || []).map(x => escapeHtml(loc(x))).filter(Boolean).join(' ')}</p>
  </div>\` : '';
  return \`<section class="sbl-masterclass" aria-label="\${labels.title}">
    <h3 class="mc-title">🎓 \${labels.title}</h3>
    \${screen}
    <div class="mc-grid">
      <div class="mc-block"><h4>⚙️ \${labels.config}</h4><ul>\${cfg}</ul></div>
      <div class="mc-block"><h4>🔗 \${labels.process}</h4><ol>\${e2e}</ol></div>
    </div>
    \${warHtml}
    <div class="mc-block mc-bp"><h4>🏆 \${labels.practices}</h4><ul>\${bp}</ul></div>
  </section>\`;
}`,
  'masterclass'
);

replaceBlock(
  'function renderActivityBody(state, activity) {',
  'function renderProveMode(state, skill) {',
  `function renderActivityBody(state, activity) {
  const A = state.activityAnswers || {};
  const L = state.locale;
  const ui = {
    es:{select:'Selecciona',route:'La ruta aparece aquí…',undo:'Deshacer último',event:'Evento observado',cascade:'Construye la cascada…',account:'Cuenta',side:'Debe / Haber',amount:'Importe',balanced:'Cuadrado',difference:'Diferencia'},
    en:{select:'Select',route:'The path appears here…',undo:'Undo last',event:'Observed event',cascade:'Build the cascade…',account:'Account',side:'Debit / Credit',amount:'Amount',balanced:'Balanced',difference:'Difference'},
    de:{select:'Auswählen',route:'Der Pfad erscheint hier…',undo:'Letzten Schritt zurück',event:'Beobachtetes Ereignis',cascade:'Kaskade aufbauen…',account:'Konto',side:'Soll / Haben',amount:'Betrag',balanced:'Ausgeglichen',difference:'Differenz'}
  }[L];
  if (activity.type === 'simulator') return \`<div class="act-form">\${activity.targets.map((f,i)=>\`<label><strong>\${escapeHtml(f.label)}</strong><select class="form-select" data-activity-input="sim-\${i}"><option value="">— \${ui.select} —</option>\${f.options.map(v=>\`<option value="\${escapeHtml(v)}"\${A[\`sim-\${i}\`]===v?' selected':''}>\${escapeHtml(v)}</option>\`).join('')}</select></label>\`).join('')}</div>\`;
  if (activity.type === 'bughunt') return \`<div class="act-evidence">\${activity.clues.map((c,i)=>\`<button type="button" class="act-clue\${A[\`clue-\${i}\`]?' is-marked':''}" data-action="activity-toggle" data-key="clue-\${i}"><span>\${A[\`clue-\${i}\`]?'⚑':'○'}</span>\${escapeHtml(c.label)}</button>\`).join('')}</div>\`;
  if (activity.type === 'forensic') return \`<div class="act-chain">\${activity.evidence.map((e,i)=>\`<button type="button" class="act-link\${A.broken===String(i)?' is-marked':''}" data-action="activity-answer" data-key="broken" data-value="\${i}"><span>\${i+1}</span>\${escapeHtml(e.label)}</button>\`).join('<b>→</b>')}</div>\`;
  if (activity.type === 'config') {
    const sequence = state.activitySequence || [];
    return \`<div class="act-route-built">\${sequence.length?sequence.map(x=>\`<span>\${escapeHtml(x)}</span>\`).join('<b>›</b>'):\`<em>\${ui.route}</em>\`}</div><div class="act-token-bank">\${activity.tokens.map(x=>\`<button type="button" class="btn" data-action="activity-sequence" data-value="\${escapeHtml(x)}"\${sequence.includes(x)?' disabled':''}>\${escapeHtml(x)}</button>\`).join('')}</div><button type="button" class="btn btn-small" data-action="activity-undo">↶ \${ui.undo}</button>\`;
  }
  if (activity.type === 'consequence') {
    const sequence = state.activitySequence || [];
    const tokens = activity.tokens || [...activity.chain].reverse();
    return \`<div class="act-trigger"><strong>\${ui.event}</strong><p>\${escapeHtml(activity.trigger)}</p></div><div class="act-route-built">\${sequence.length?sequence.map((x,i)=>\`<span><small>\${i+1}</small>\${escapeHtml(x)}</span>\`).join('<b>→</b>'):\`<em>\${ui.cascade}</em>\`}</div><div class="act-token-bank">\${tokens.map(x=>\`<button type="button" class="btn" data-action="activity-sequence" data-value="\${escapeHtml(x)}"\${sequence.includes(x)?' disabled':''}>\${escapeHtml(x)}</button>\`).join('')}</div><button type="button" class="btn btn-small" data-action="activity-undo">↶ \${ui.undo}</button>\`;
  }
  if (activity.type === 'journal') {
    const amount = v => Number(String(v||'0').replace(/\\./g,'').replace(',','.')) || 0;
    const debitLabel = L==='de'?'Soll':L==='en'?'Debit':'Debe';
    const creditLabel = L==='de'?'Haben':L==='en'?'Credit':'Haber';
    const debit = activity.lines.reduce((sum,_,i)=>sum+(A[\`side-\${i}\`]===debitLabel?amount(A[\`amount-\${i}\`]):0),0);
    const credit = activity.lines.reduce((sum,_,i)=>sum+(A[\`side-\${i}\`]===creditLabel?amount(A[\`amount-\${i}\`]):0),0);
    const balanced = debit>0 && Math.abs(debit-credit)<.005;
    return \`<div class="act-journal"><div class="act-jhead"><span>\${ui.account}</span><span>\${ui.side}</span><span>\${ui.amount}</span></div>\${activity.lines.map((line,i)=>\`<div class="act-jline"><strong>\${escapeHtml(line[0])}</strong><select class="form-select" data-activity-input="side-\${i}"><option value="">—</option><option\${A[\`side-\${i}\`]===debitLabel?' selected':''}>\${debitLabel}</option><option\${A[\`side-\${i}\`]===creditLabel?' selected':''}>\${creditLabel}</option></select><input class="form-control" inputmode="decimal" data-activity-input="amount-\${i}" value="\${escapeHtml(A[\`amount-\${i}\`]||'')}" placeholder="0,00"></div>\`).join('')}<div class="act-balance\${balanced?' is-balanced':''}">Σ \${debitLabel} <output>\${debit.toFixed(2).replace('.',',')}</output> · Σ \${creditLabel} <output>\${credit.toFixed(2).replace('.',',')}</output> · \${balanced?'✓ '+ui.balanced:'⚠ '+ui.difference+' '+Math.abs(debit-credit).toFixed(2).replace('.',',')}</div></div>\`;
  }
  return '';
}`,
  'activity body'
);

replaceBlock(
  'function renderProveMode(state, skill) {',
  'function asArrayHints(v) {',
  `function renderProveMode(state, skill) {
  const activity = getActivity(skill, state.locale);
  const feedback = state.activityFeedback;
  const guided = state.skillMode === 'guided';
  const hints = state.activityHints || 0;
  const skillHints = asArrayHints(skill.assessment?.hints);
  const L = state.locale;
  const ui = {
    es:{unavailable:'Actividad en preparación.',what:'¿Qué es esto?',task:'Tu tarea',graded:'Se evalúa',guided:'Modo guiado',guidedHelp:'Errores no cuentan. Pide pista cuando lo necesites.',correctWord:'correcto',guidedBadge:'guiado',success:'Misión resuelta',retry:'Aún no — te digo exactamente qué falló',check:'Comprobar',hint:'Pista',reset:'Reiniciar'},
    en:{unavailable:'Activity in preparation.',what:'What is this?',task:'Your task',graded:'What is assessed',guided:'Guided mode',guidedHelp:'Mistakes do not count. Ask for a hint when you need one.',correctWord:'correct',guidedBadge:'guided',success:'Mission solved',retry:'Not yet — here is exactly what failed',check:'Check',hint:'Hint',reset:'Reset'},
    de:{unavailable:'Aktivität in Vorbereitung.',what:'Was ist das?',task:'Deine Aufgabe',graded:'Bewertet wird',guided:'Geführter Modus',guidedHelp:'Fehler zählen nicht. Nutze bei Bedarf einen Hinweis.',correctWord:'richtig',guidedBadge:'geführt',success:'Aufgabe gelöst',retry:'Noch nicht — hier ist genau, was fehlgeschlagen ist',check:'Prüfen',hint:'Hinweis',reset:'Zurücksetzen'}
  }[L];
  if (activity.unavailable) return \`<p>\${ui.unavailable}</p>\`;
  const briefHtml = activity.brief ? \`<div class="act-brief"><div><strong>\${ui.what}</strong><span>\${escapeHtml(activity.brief.what)}</span></div><div><strong>\${ui.task}</strong><span>\${escapeHtml(activity.brief.task)}</span></div><div><strong>\${ui.graded}</strong><span>\${escapeHtml(activity.brief.graded)}</span></div></div>\` : '';
  const guidedHtml = guided ? \`<div class="act-guided"><strong>\${ui.guided}</strong><span>\${ui.guidedHelp}</span>\${hints>0?\`<ol class="act-hints">\${skillHints.slice(0,hints).map(h=>\`<li>\${escapeHtml(localizeHint(h,L))}</li>\`).join('')}</ol>\`:''}</div>\` : '';
  const detailsHtml = feedback?.details?.length ? \`<ul class="act-details">\${feedback.details.map(d=>\`<li class="\${d.ok?'ok':'ko'}">\${d.ok?'✓':'✗'} \${escapeHtml(d.item)}\${d.ok?'':\` — <em>\${ui.correctWord}: \${escapeHtml(String(d.expected)).slice(0,60)}</em>\`}</li>\`).join('')}</ul>\` : '';
  return \`<section class="sbl-activity" data-activity-type="\${activity.type}">
    <header class="act-head"><span class="act-icon">\${{simulator:'⌨',bughunt:'⌖',journal:'⚖',forensic:'⌕',consequence:'⟿',config:'⚙'}[activity.type]}</span><div><span class="viz-badge">\${escapeHtml(activity.label)}\${guided?' · '+ui.guidedBadge:''}</span><h3>\${local(skill.title,L)}</h3></div></header>
    \${briefHtml}\${guidedHtml}
    \${L==='es' && activity.mc?.screen && ['simulator','bughunt','journal','forensic'].includes(activity.type)?\`<div class="act-screen">\${b1Window(activity.mc.screen,L)}</div>\`:''}
    \${renderActivityBody(state,activity)}
    \${feedback?\`<div class="act-feedback \${feedback.correct?'is-correct':'is-wrong'}"><strong>\${feedback.correct?'✓ '+ui.success:'↻ '+ui.retry}</strong><p>\${escapeHtml(feedback.message)}</p>\${detailsHtml}</div>\`:''}
    <div class="sbl-actions"><button type="button" class="btn btn-primary" data-action="check-activity">\${ui.check}</button>\${guided&&skillHints.length&&hints<skillHints.length?\`<button type="button" class="btn" data-action="activity-hint">💡 \${ui.hint} (\${hints}/\${skillHints.length})</button>\`:''}<button type="button" class="btn" data-action="reset-activity">\${ui.reset}</button></div>
  </section>\`;
}`,
  'prove mode'
);

replaceOnce(
  "function localizeHint(h, locale) { return h?.[locale] ?? h?.es ?? String(h ?? ''); }",
  "function localizeHint(h, locale) { return h?.[locale] ?? (typeof h === 'string' ? h : ''); }",
  'hint fallback'
);
replaceOnce(
  ">Práctica guiada</button>",
  ">${state.locale === 'de' ? 'Geführte Praxis' : state.locale === 'en' ? 'Guided practice' : 'Práctica guiada'}</button>",
  'guided practice tab'
);

replaceBlock(
  'function renderConsole(state) {',
  'function renderCareer(state) {',
  `function renderConsole(state) {
  const tab = state.consoleTab || 'queries';
  const L = state.locale;
  const open = state.consoleOpen;
  const ui = {
    es:{title:'Consola avanzada',sub:'SQL real de SAP B1, dashboards de gestión y vibecoding aplicado. Todo con tablas reales: OINV, JDT1, OITW, ITT1…',queries:'Consultas expertas',dash:'Dashboards & KPI',vibe:'Vibecoding B1',back:'Volver a la lista',why:'¿Por qué funciona?',pitfall:'Trampa',level:'Nivel'},
    en:{title:'Advanced console',sub:'Real SAP B1 SQL, management dashboards and applied vibecoding with real tables: OINV, JDT1, OITW, ITT1…',queries:'Expert queries',dash:'Dashboards & KPI',vibe:'B1 vibecoding',back:'Back to list',why:'Why does it work?',pitfall:'Pitfall',level:'Level'},
    de:{title:'Erweiterte Konsole',sub:'Praxisnahes SAP-B1-SQL, Management-Dashboards und angewandtes Vibecoding mit realen Tabellen: OINV, JDT1, OITW, ITT1…',queries:'Expertenabfragen',dash:'Dashboards & KPI',vibe:'B1-Vibecoding',back:'Zurück zur Liste',why:'Warum funktioniert das?',pitfall:'Stolperstein',level:'Niveau'}
  }[L];
  const deQuery = {
    'Q-AGING':['Finanzen · Kundenfälligkeit','Offene Kundenposten nach Altersklassen analysieren','Offene Beträge werden je Rechnung nach Alter gruppiert.','Gutschriften und stornierte Belege müssen korrekt berücksichtigt werden.'],
    'Q-DSO':['KPI · DSO nach Kundengruppe','Monatliche Außenstandsdauer messen','DSO verbindet offenen Saldo mit fakturiertem Umsatz.','Gruppen ohne Umsatz benötigen Schutz vor Division durch null.'],
    'Q-GRIR':['Einkauf · Wareneingang nicht fakturiert','Wareneingänge ohne Lieferantenrechnung finden','Offene Wareneingangszeilen zeigen noch nicht fakturierte Mengen.','Sehr alte offene Positionen sind ein Abstimmungssignal.'],
    'Q-MARGEN':['Verkauf · Marge je Artikel','Verkäufe unter Kosten erkennen','Umsatz und Lagerbewertung werden je Artikel verglichen.','Die Bewertungsmethode muss zur Kostenquelle passen.'],
    'Q-FALTANTES':['MRP · Nettofehlmengen','Offene Nachfrage gegen verfügbaren Bestand prüfen','Verfügbarer Bestand berücksichtigt bereits gebundene Mengen.','Liefertermine sind für die Priorisierung zusätzlich nötig.'],
    'Q-DIO':['KPI · Lagerreichweite','Gebundenes Kapital im Bestand analysieren','Bestandswert wird dem realen Verbrauch gegenübergestellt.','Verbrauchsquellen müssen vollständig definiert sein.'],
    'Q-SALDO':['Finanzen · Laufender Saldo','Geschäftspartnerbewegungen mit laufendem Saldo zeigen','Window Functions bilden den fortlaufenden Saldo deterministisch.','Interne Abstimmung und Buchsaldo sind nicht identisch.'],
    'Q-BOM':['Produktion · Mehrstufige Stückliste','Komponenten über mehrere Ebenen auflösen','Eine rekursive CTE traversiert die Stücklistenstruktur.','Rekursion muss begrenzt werden, um Zyklen sicher zu behandeln.']
  };
  const loc = (v, fallback='') => v?.[L] ?? fallback;
  const tabBtn=(id,label)=>\`<button type="button" class="btn\${tab===id?' btn-primary':''}" data-action="console-tab" data-tab="\${id}">\${escapeHtml(label)}</button>\`;
  let body='';
  if(tab==='queries'){
    const sel=ADVANCED_QUERIES.find(q=>q.id===state.consoleQuery);
    if(sel){
      const d=L==='de'?(deQuery[sel.id]||['SAP B1','Analyse','Technische Abfrage','Ergebnis fachlich prüfen']):null;
      body=\`<article class="card sbl-stack csl-detail"><div class="csl-toprow"><button type="button" class="btn" data-action="console-close">← \${ui.back}</button><span class="viz-badge">\${sel.engines.join(' · ')}</span></div><h3>\${escapeHtml(d?d[0]:loc(sel.domain))}</h3><p class="csl-ask">\${escapeHtml(d?d[1]:loc(sel.ask))}</p><pre class="csl-sql"><code>\${escapeHtml(sel.sql)}</code></pre><div class="csl-why"><strong>\${ui.why}</strong><p>\${escapeHtml(d?d[2]:loc(sel.why))}</p></div><div class="csl-pitfall"><strong>⚠️ \${ui.pitfall}</strong><p>\${escapeHtml(d?d[3]:loc(sel.pitfall))}</p></div></article>\`;
    }else{
      body=\`<div class="csl-grid">\${ADVANCED_QUERIES.map(q=>{const d=L==='de'?deQuery[q.id]:null;return \`<button type="button" class="card csl-card" data-action="console-query" data-id="\${q.id}"><span class="viz-badge">\${q.engines.join(' · ')}</span><strong>\${escapeHtml(d?d[0]:loc(q.domain))}</strong><span class="text-small">\${escapeHtml((d?d[1]:loc(q.ask)).slice(0,90))}…</span></button>\`;}).join('')}</div>\`;
    }
  } else if(tab==='dashboards'){
    const deNames=['Interaktive GuV','Web-Client-KPIs','Kundenkohorten','ABC-Pareto','Proaktive Warnungen'];
    body=DASHBOARD_PATTERNS.map((d,i)=>\`<article class="card sbl-stack csl-panel"><button type="button" class="csl-toggle" data-action="console-toggle" data-id="\${d.id}"><strong>\${escapeHtml(L==='de'?deNames[i]:loc(d.name))}</strong><span>\${open===d.id?'−':'+'}</span></button>\${open===d.id?\`<p class="csl-ask">\${escapeHtml(L==='de'?'Kennzahlen mit klarer Datenquelle, Schwelle und Verantwortlichkeit aufbauen.':loc(d.build))}</p><div class="csl-why"><strong>\${ui.level}</strong><p>\${escapeHtml(L==='de'?'Management-Reporting wird von einer statischen Ansicht zu einer überprüfbaren Entscheidungshilfe.':loc(d.level))}</p></div>\`:''}</article>\`).join('');
  } else {
    const deNames=['1 · Kontextvertrag','2 · Evidenz zuerst','3 · Beispieldaten','4 · Strukturierte Ausgabe','5 · Evals als Tests','6 · Injection & Grenzen'];
    body=VIBE_PATTERNS.map((v,i)=>\`<article class="card sbl-stack csl-panel"><button type="button" class="csl-toggle" data-action="console-toggle" data-id="\${v.id}"><strong>\${escapeHtml(L==='de'?deNames[i]:loc(v.name))}</strong><span>\${open===v.id?'−':'+'}</span></button>\${open===v.id?\`<p>\${escapeHtml(L==='de'?'Definiere Kontext, Evidenz, Ausgabeformat, Unsicherheit und menschliche Freigaben explizit, bevor Code oder Automatisierung erzeugt wird.':loc(v.idea))}</p>\`:''}</article>\`).join('');
  }
  return \`<section class="sbl-console" aria-labelledby="console-title"><header class="csl-head"><h2 id="console-title">\${ui.title}</h2><p class="text-small">\${ui.sub}</p><div class="csl-tabs">\${tabBtn('queries',ui.queries)}\${tabBtn('dashboards',ui.dash)}\${tabBtn('vibe',ui.vibe)}</div></header>\${body}</section>\`;
}`,
  'advanced console'
);

replaceOnce(
  "const loc = v => v?.[L] ?? v?.es ?? '';\n  const mastered = SKILLS.filter(s => state.progress[s.id]?.mastered).length;",
  "const loc = v => v?.[L] ?? '';\n  const mastered = SKILLS.filter(s => state.progress[s.id]?.mastered).length;",
  'career strict locale'
);
replaceOnce(
  "const nextRole = roleUp ? roleUp[L] || roleUp.es : '';",
  "const nextRole = roleUp ? roleUp[L] || '' : '';",
  'career role fallback'
);
replaceOnce(
  '<div><span class="viz-badge">SAP BUSINESS ONE · CONSULTING CAREER MODE</span>',
  '<div><span class="viz-badge">${L===\'de\'?\'SAP BUSINESS ONE · BERATER-KARRIERE\':L===\'en\'?\'SAP BUSINESS ONE · CONSULTING CAREER MODE\':\'SAP BUSINESS ONE · MODO CARRERA DE CONSULTORÍA\'}</span>',
  'career mode badge'
);

replaceOnce(
  "dispatch({ type: 'ACTIVITY_FEEDBACK', correct: passed, message: passed ? (activity.resolution || 'Decisión correcta: la evidencia, el control y el resultado son coherentes.') : 'Revisa los elementos marcados y vuelve a intentarlo.', details: result.details });",
  "dispatch({ type: 'ACTIVITY_FEEDBACK', correct: passed, message: passed ? (activity.resolution || (state.locale === 'de' ? 'Richtige Entscheidung: Evidenz, Kontrolle und Ergebnis sind konsistent.' : state.locale === 'en' ? 'Correct decision: evidence, control and outcome are consistent.' : 'Decisión correcta: la evidencia, el control y el resultado son coherentes.')) : (state.locale === 'de' ? 'Prüfe die markierten Elemente und versuche es erneut.' : state.locale === 'en' ? 'Review the marked elements and try again.' : 'Revisa los elementos marcados y vuelve a intentarlo.'), details: result.details });",
  'activity feedback messages'
);

await writeFile(file, source, 'utf8');
process.stdout.write('Applied strict locale boundary patches to src/app.mjs\n');