/* ══════════════════════════════════════════════════════════════════════════
   Handbuch der Belegkette · lógica propia de la página.
   El engine no se toca: aquí solo se lee el scroll y `--sc-p`.

   Tres piezas:
   1. El folio y el libro mayor del margen. Cada capítulo que pasa contabiliza
      su asiento; al llegar al colofón la suma cuadra y ese cuadre es el final.
   2. La cadena documental: cinco documentos que se ensamblan en 3D con el
      progreso del capítulo cuatro.
   3. La ventana de SAP: markup real que recalcula el asiento al escribir, y
      propaga el efecto por la cadena.
   ══════════════════════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  const eur = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Carga los ajustes visuales específicos sin tocar el runtime de scroll.
  const chapter3Style = document.createElement('link');
  chapter3Style.rel = 'stylesheet';
  chapter3Style.href = 'chapter3-handoff.css';
  document.head.append(chapter3Style);

  const chapter4Style = document.createElement('link');
  chapter4Style.rel = 'stylesheet';
  chapter4Style.href = 'chapter4-cumulative.css';
  document.head.append(chapter4Style);

  // ── 0 · Puerta al lab con continuidad de idioma ───────────────────────────
  // La landing es trilingüe por URL (?lang=es|en|de, por defecto en). Ambos
  // enlaces al lab heredan ese idioma para que no haya salto de género.
  {
    const docLang = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
    const urlLang = new URLSearchParams(location.search).get('lang');
    const lang = ['es', 'en', 'de'].includes(urlLang) ? urlLang
      : ['es', 'en', 'de'].includes(docLang) ? docLang : 'en';
    if (lang !== 'en') document.querySelectorAll('a[href="/Learn-SapB1/lab/"]').forEach(a => {
      a.href = `/Learn-SapB1/lab/?lang=${lang}`;
    });
  }

  // ── 1 · Folio y libro mayor ──────────────────────────────────────────────

  const folio = document.querySelector('.folio');
  const kapEl = document.querySelector('[data-folio-kap]');
  const numEl = document.querySelector('[data-folio-num]');
  const ledgerEl = document.querySelector('[data-ledger]');
  const sumEl = document.querySelector('[data-ledger-sum]');
  const debitEl = document.querySelector('[data-ledger-debit]');
  const creditEl = document.querySelector('[data-ledger-credit]');
  const balanceEl = document.querySelector('[data-balance]');
  const belegItems = [...document.querySelectorAll('.belegkette__item')];
  const chapters = [...document.querySelectorAll('[data-hb-kap]')];

  const posted = new Set();
  let debit = 0, credit = 0;

  function post(chapter) {
    const spec = chapter.dataset.hbLedger;
    if (!spec || posted.has(spec)) return;
    posted.add(spec);

    const [beleg, concept, soll, haben] = spec.split('|');
    const d = soll === '—' ? 0 : Number(soll.replace(/\./g, '').replace(',', '.'));
    const c = haben === '—' ? 0 : Number(haben.replace(/\./g, '').replace(',', '.'));
    debit += d; credit += c;

    const li = document.createElement('li');
    li.innerHTML = `<b>${concept}</b><i>${d ? eur.format(d) : '·'}</i><i>${c ? eur.format(c) : '·'}</i>`;
    ledgerEl.append(li);

    const dot = belegItems.find(item => item.querySelector('.belegkette__name').textContent === beleg);
    if (dot) dot.dataset.on = '';

    sumEl.hidden = false;
    debitEl.textContent = eur.format(debit);
    creditEl.textContent = eur.format(credit);

    const balanced = debit > 0 && Math.abs(debit - credit) < 0.005;
    sumEl.toggleAttribute('data-balanced', balanced);
    if (balanced && balanceEl) {
      balanceEl.textContent = `Soll ${eur.format(debit)} gegen Haben ${eur.format(credit)}. Su libro mayor cuadra: ha seguido la cadena entera.`;
      balanceEl.setAttribute('data-balanced', '');
    }
  }

  function trackChapter() {
    const mid = innerHeight / 2;
    let current = chapters[0];
    for (const chapter of chapters) {
      const box = chapter.getBoundingClientRect();
      if (box.top <= mid && box.bottom > mid) { current = chapter; break; }
      if (box.top <= mid) current = chapter;
    }
    if (!current) return;
    if (kapEl.textContent !== current.dataset.hbKap) {
      kapEl.textContent = current.dataset.hbKap;
      numEl.textContent = current.dataset.hbNum;
    }
    folio.classList.toggle('folio--ink', current.classList.contains('hb-chapter--ink'));

    for (const chapter of chapters) {
      const box = chapter.getBoundingClientRect();
      if (box.top < mid - box.height * 0.35) post(chapter);
    }
  }

  // ── 2 · La cadena en 3D ──────────────────────────────────────────────────

  const peak = document.querySelector('.hb-peak');
  const cards = [...document.querySelectorAll('[data-beleg-card]')];
  const fenster = document.querySelector('[data-fenster]');

  function driveChain() {
    if (!peak || !cards.length) return;
    const p = clamp01(Number(getComputedStyle(peak).getPropertyValue('--sc-p')) || 0);
    const step = 1 / cards.length;
    const activeIndex = Math.min(cards.length - 1, Math.floor((p + step * 0.5) / step));

    cards.forEach((card, i) => {
      const wasCurrent = card.classList.contains('beleg--current');
      card.classList.remove('beleg--future', 'beleg--current', 'beleg--past', 'beleg--now');

      if (i < activeIndex) {
        card.classList.add('beleg--past');
        card.style.setProperty('--hb-scale', '1');
      } else if (i === activeIndex) {
        card.classList.add('beleg--current', 'beleg--now');
        card.style.setProperty('--hb-scale', reduced ? '1' : '1.07');
      } else {
        card.classList.add('beleg--future');
        card.style.setProperty('--hb-scale', '0.86');
      }

      if (i === activeIndex && !wasCurrent) {
        card.setAttribute('data-pulse', '');
        setTimeout(() => card.removeAttribute('data-pulse'), 620);
      }
    });

    const invoiceStart = (3 - 0.5) * step;
    const f = p < invoiceStart ? 0 : reduced ? 1 : clamp01((p - invoiceStart) / 0.08);
    const invoiceOpen = f > 0;
    peak.classList.toggle('hb-peak--invoice-open', invoiceOpen);
    if (fenster) {
      fenster.hidden = !invoiceOpen;
      fenster.style.setProperty('--hb-fenster', f.toFixed(3));
    }
  }

  // ── 3 · Chapter 3: process handoff ───────────────────────────────────────

  const wendeAct = document.querySelector('.hb-ch3-blueprint');
  const chapter3Steps = [...document.querySelectorAll('[data-ch3-step]')];
  const chapter3Connectors = [...document.querySelectorAll('[data-ch3-connector]')];

  function driveDrawing() {
    if (!wendeAct || !chapter3Steps.length) return;
    const p = clamp01(Number(getComputedStyle(wendeAct).getPropertyValue('--sc-p')) || 0);
    const activeIndex = Math.min(chapter3Steps.length - 1, Math.floor(p * chapter3Steps.length));

    chapter3Steps.forEach((step, i) => {
      step.classList.remove('hb-ch3-step--future', 'hb-ch3-step--current', 'hb-ch3-step--past');
      if (i < activeIndex) step.classList.add('hb-ch3-step--past');
      else if (i === activeIndex) step.classList.add('hb-ch3-step--current');
      else step.classList.add('hb-ch3-step--future');
    });

    chapter3Connectors.forEach((connector, i) => {
      connector.classList.toggle('hb-ch3-connector--on', i < activeIndex);
    });
  }

  // ── 4 · La ventana que calcula ───────────────────────────────────────────

  const qty = document.querySelector('[data-f-qty]');
  const price = document.querySelector('[data-f-price]');
  const vat = document.querySelector('[data-f-vat]');
  const outDebit = document.querySelector('[data-f-debit]');
  const outRev = document.querySelector('[data-f-rev]');
  const outVat = document.querySelector('[data-f-vatamt]');
  const hint = document.querySelector('[data-f-hint]');
  const stockLine = document.querySelector('[data-beleg-card="2"] .beleg__eff li:first-child');
  const saldoLine = document.querySelector('[data-beleg-card="3"] .beleg__eff li:last-child');
  const zahlungLine = document.querySelector('[data-beleg-card="4"] .beleg__eff li:last-child');

  function recalc() {
    if (!qty) return;
    const q = Math.max(1, Math.min(99, Number(qty.value) || 0));
    const p = Math.max(0, Math.min(999, Number(price.value) || 0));
    const rate = Number(vat.value) / 100;
    const net = q * p;
    const tax = net * rate;
    const gross = net + tax;

    outRev.textContent = eur.format(net);
    outVat.textContent = eur.format(tax);
    outDebit.textContent = eur.format(gross);

    if (stockLine) stockLine.textContent = `Bestand: −${q}`;
    if (saldoLine) saldoLine.textContent = `Saldo: +${eur.format(gross)}`;
    if (zahlungLine) zahlungLine.textContent = 'Saldo: 0,00';
    if (hint) hint.textContent = `Un cambio, tres efectos: ${q} unidades salen del almacén, el asiento mueve ${eur.format(gross)} y el saldo del socio vuelve a cero al cobrar.`;

    [2, 3, 4].forEach(i => {
      const card = cards[i];
      if (!card) return;
      card.setAttribute('data-pulse', '');
      setTimeout(() => card.removeAttribute('data-pulse'), 620);
    });
  }

  [qty, price, vat].forEach(el => el && el.addEventListener('input', recalc));

  // ── Bucle ────────────────────────────────────────────────────────────────

  let queued = false;
  function frame() {
    queued = false;
    trackChapter();
    driveChain();
    driveDrawing();
  }
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(frame));
  }

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  document.addEventListener('sc:ready', schedule);
  frame();
})();
