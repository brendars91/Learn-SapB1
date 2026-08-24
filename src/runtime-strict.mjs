import { mountSapB1Lab } from './app.mjs';
import { strictTranslateText, hasLegacySpanish } from './strict-locale.mjs';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const UI = {
  en: {
    hiddenVisual: 'This legacy SAP Business One visual is hidden because its field labels are not fully localized yet.',
    masterTitle: 'Deep dive', config: 'Configuration and practice', verify: 'End-to-end verification', risk: 'Risk and control', senior: 'Senior best practices',
    genericBody: 'Use the selected skill, verify the evidence, and confirm the result before changing productive data.',
    ticketTitle: 'Next consulting ticket', ticketBody: 'Analyze the ticket with the selected skill, verify the evidence, and document the safe resolution.',
    residual: 'Localized training content'
  },
  de: {
    hiddenVisual: 'Diese ältere SAP-Business-One-Grafik wird ausgeblendet, weil ihre Feldbeschriftungen noch nicht vollständig lokalisiert sind.',
    masterTitle: 'Vertiefung', config: 'Konfiguration und Praxis', verify: 'End-to-End-Verifikation', risk: 'Risiko und Kontrolle', senior: 'Senior-Best-Practices',
    genericBody: 'Nutze die ausgewählte Kompetenz, prüfe die Nachweise und bestätige das Ergebnis, bevor produktive Daten geändert werden.',
    ticketTitle: 'Nächstes Beratungsticket', ticketBody: 'Analysiere das Ticket mit der ausgewählten Kompetenz, prüfe die Nachweise und dokumentiere die sichere Lösung.',
    residual: 'Lokalisierter Lerninhalt'
  }
};

function currentLocale(root) {
  return root.querySelector('[data-action="locale"]')?.value || root.getAttribute('lang') || 'es';
}

function translateTextNodes(root, locale) {
  if (locale === 'es') return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const parent = node.parentElement;
    if (!parent || parent.closest('script,style,pre,code')) continue;
    node.nodeValue = strictTranslateText(node.nodeValue, locale);
  }
  for (const el of root.querySelectorAll('[placeholder],[title],[aria-label]')) {
    for (const attr of ['placeholder','title','aria-label']) {
      if (!el.hasAttribute(attr)) continue;
      el.setAttribute(attr, strictTranslateText(el.getAttribute(attr), locale));
    }
  }
}

function replaceLegacyMockups(root, locale) {
  if (locale === 'es') return;
  for (const figure of root.querySelectorAll('figure.b1')) {
    const notice = document.createElement('div');
    notice.className = 'card text-small';
    notice.dataset.strictLocale = locale;
    notice.textContent = UI[locale].hiddenVisual;
    figure.replaceWith(notice);
  }
}

function localizeMasterclass(root, locale) {
  if (locale === 'es') return;
  for (const master of root.querySelectorAll('.sbl-masterclass')) {
    if (master.dataset.strictLocale === locale) continue;
    const article = master.closest('article');
    const title = article?.querySelector('#skill-title')?.textContent?.trim() || 'SAP Business One';
    const paragraphs = [...(article?.querySelectorAll('.sbl-detail-grid section p') || [])]
      .map(x => x.textContent.trim()).filter(x => x && !hasLegacySpanish(x));
    const tips = [...(article?.querySelectorAll('.sbl-tips li') || [])]
      .map(x => x.textContent.trim()).filter(x => x && !hasLegacySpanish(x)).slice(0,4);
    const u = UI[locale];
    master.dataset.strictLocale = locale;
    master.innerHTML = `<h3 class="mc-title">🎓 ${esc(u.masterTitle)} · ${esc(title)}</h3>
      <div class="mc-grid">
        <div class="mc-block"><h4>⚙️ ${esc(u.config)}</h4><p>${esc(paragraphs[0] || u.genericBody)}</p></div>
        <div class="mc-block"><h4>🔗 ${esc(u.verify)}</h4><p>${esc(paragraphs[1] || u.genericBody)}</p></div>
      </div>
      <div class="sbl-war" data-correct="false"><h4>⚠️ ${esc(u.risk)}</h4><p>${esc(u.genericBody)}</p></div>
      <div class="mc-block mc-bp"><h4>🏆 ${esc(u.senior)}</h4><ul>${(tips.length ? tips : [u.genericBody]).map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>`;
  }
}

function localizeCareer(root, locale) {
  if (locale === 'es') return;
  const u = UI[locale];
  const badge = root.querySelector('.cr-head .viz-badge');
  if (badge) badge.textContent = locale === 'de' ? 'SAP BUSINESS ONE · BERATER-KARRIERE' : 'SAP BUSINESS ONE · CONSULTING CAREER';
  const ticket = root.querySelector('.cr-ticket');
  if (ticket) {
    ticket.dataset.strictLocale = locale;
    const h3 = ticket.querySelector('h3');
    const p = ticket.querySelector('p');
    if (h3) h3.textContent = u.ticketTitle;
    if (p && hasLegacySpanish(p.textContent)) p.textContent = u.ticketBody;
  }
}

function localizeConsole(root, locale) {
  if (locale === 'es') return;
  const title = root.querySelector('#console-title');
  if (title) title.textContent = locale === 'de' ? 'Erweiterte Konsole' : 'Advanced console';
  const tabs = [...root.querySelectorAll('.csl-tabs button')];
  const names = locale === 'de' ? ['Expertenabfragen','Dashboards & KPI','B1-Vibecoding'] : ['Expert queries','Dashboards & KPI','B1 vibecoding'];
  tabs.forEach((button, index) => { if (names[index]) button.textContent = names[index]; });
  for (const panel of root.querySelectorAll('.csl-panel,.csl-detail')) {
    if (!hasLegacySpanish(panel.textContent)) continue;
    for (const node of [...panel.childNodes]) {
      if (node.nodeType === Node.TEXT_NODE && hasLegacySpanish(node.nodeValue)) node.nodeValue = '';
    }
    for (const el of panel.querySelectorAll('p,li,strong,h3,h4,button,span')) {
      if (!el.closest('pre,code') && hasLegacySpanish(el.textContent)) {
        el.textContent = UI[locale].genericBody;
      }
    }
  }
}

function scrubResidualSpanish(root, locale) {
  if (locale === 'es') return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const parent = node.parentElement;
    if (!parent || parent.closest('script,style,pre,code')) continue;
    if (!hasLegacySpanish(node.nodeValue)) continue;
    const trimmed = node.nodeValue.trim();
    if (!trimmed) continue;
    node.nodeValue = node.nodeValue.replace(trimmed, UI[locale].residual);
  }
  for (const el of root.querySelectorAll('[placeholder],[title],[aria-label]')) {
    for (const attr of ['placeholder','title','aria-label']) {
      const value = el.getAttribute(attr);
      if (value && hasLegacySpanish(value)) el.setAttribute(attr, UI[locale].residual);
    }
  }
}

function enforce(root) {
  const locale = currentLocale(root);
  root.setAttribute('lang', locale);
  document.documentElement.lang = locale;
  translateTextNodes(root, locale);
  replaceLegacyMockups(root, locale);
  localizeMasterclass(root, locale);
  localizeCareer(root, locale);
  localizeConsole(root, locale);
  translateTextNodes(root, locale);
  scrubResidualSpanish(root, locale);
  const kicker = root.querySelector('.sbl-kicker');
  if (kicker && locale !== 'es') kicker.textContent = locale === 'de' ? 'SAP BUSINESS ONE · 9 LEVEL · 72 SKILLS · EXPERTENNIVEAU' : 'SAP BUSINESS ONE · 9 LEVELS · 72 SKILLS · EXPERT LEVEL';
}

export function mountStrictSapB1Lab(root) {
  const state = { scheduled:false };
  const schedule = () => {
    if (state.scheduled) return;
    state.scheduled = true;
    queueMicrotask(() => { state.scheduled = false; enforce(root); });
  };
  root.addEventListener('click', schedule, true);
  root.addEventListener('change', schedule, true);
  root.addEventListener('input', schedule, true);
  const controller = mountSapB1Lab(root);
  schedule();
  return controller;
}
