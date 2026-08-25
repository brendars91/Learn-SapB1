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

  // El folio sigue al capítulo que ocupa el centro de la pantalla, y se
  // re-tinta cuando el capítulo bajo él es el de tinta.
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

    // Un capítulo se contabiliza cuando el lector lo ha leído de verdad:
    // su mitad ya ha pasado por el centro de la pantalla.
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
    if (!peak) return;
    const p = Number(getComputedStyle(peak).getPropertyValue('--sc-p')) || 0;

    // Los cinco documentos entran escalonados en el primer 62% del capítulo.
    cards.forEach((card, i) => {
      const from = 0.06 + i * 0.11;
      const on = reduced ? (p > from ? 1 : 0) : clamp01((p - from) / 0.16);
      card.style.setProperty('--hb-on', on.toFixed(3));
      if (on > 0.98 && !card.dataset.landed) {
        card.dataset.landed = '';
        card.setAttribute('data-pulse', '');
        setTimeout(() => card.removeAttribute('data-pulse'), 620);
      }
      if (on < 0.5) delete card.dataset.landed;
    });

    // La ventana se materializa cuando la cadena ya está en pie.
    const f = clamp01((p - 0.6) / 0.12);
    if (f > 0.01) fenster.hidden = false;
    fenster.style.setProperty('--hb-fenster', f.toFixed(3));
    if (f < 0.01 && p > 0) fenster.hidden = true;
  }

  // La lámina técnica del capítulo 3 se dibuja con el progreso del acto.
  const wende = document.querySelector('[data-sc-act="pin"] .hb-zeichnung');
  const wendeAct = wende ? wende.closest('[data-sc-act]') : null;
  const strokes = [...document.querySelectorAll('.hb-draw')];
  strokes.forEach(el => {
    const len = el.getTotalLength ? el.getTotalLength() : 1200;
    el.style.setProperty('--len', len.toFixed(1));
  });

  function driveDrawing() {
    if (!wendeAct) return;
    const p = Number(getComputedStyle(wendeAct).getPropertyValue('--sc-p')) || 0;
    const d = reduced ? 1 : clamp01((p - 0.05) / 0.5);
    wendeAct.style.setProperty('--hb-draw', d.toFixed(3));
  }

  // ── 3 · La ventana que calcula ───────────────────────────────────────────

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

    // El mismo hecho recorre la cadena: stock, asiento y saldo a la vez.
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
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(frame); } }

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  document.addEventListener('sc:ready', schedule);
  frame();
})();
