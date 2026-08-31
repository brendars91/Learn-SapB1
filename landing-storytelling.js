(() => {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const money = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const chapter1CaseStyle = document.createElement('link');
  chapter1CaseStyle.rel = 'stylesheet';
  chapter1CaseStyle.href = 'chapter1-case-screens.css';
  document.head.appendChild(chapter1CaseStyle);

  const folioEffects = Object.fromEntries([...document.querySelectorAll('[data-folio-effect]')].map(el => [el.dataset.folioEffect, el]));
  const mobileCurrent = document.querySelector('[data-folio-mobile-current]');
  const chapters = [...document.querySelectorAll('[data-hb-kap]')];

  function setFolioEffect(name, value, active = true) {
    const el = folioEffects[name];
    if (!el) return;
    const valueEl = el.querySelector('i');
    if (valueEl) valueEl.textContent = value;
    el.toggleAttribute('data-active', active);
  }

  function updateFolioFromChapter() {
    const mid = innerHeight / 2;
    let current = chapters[0];
    for (const chapter of chapters) {
      const box = chapter.getBoundingClientRect();
      if (box.top <= mid && box.bottom > mid) { current = chapter; break; }
      if (box.top <= mid) current = chapter;
    }
    if (!current) return;
    if (mobileCurrent) mobileCurrent.textContent = `${current.dataset.hbNum === '—' ? '' : `${current.dataset.hbNum} · `}${current.dataset.hbKap}`;

    const name = current.dataset.hbKap;
    if (name === 'The Turn') {
      const p = clamp(Number(getComputedStyle(current).getPropertyValue('--sc-p')) || 0, 0, 1);
      if (p < .25) {
        setFolioEffect('stock', '—', false); setFolioEffect('ledger', '—', false); setFolioEffect('balance', '—', false);
      } else if (p < .5) {
        setFolioEffect('stock', '−12'); setFolioEffect('ledger', '—', false); setFolioEffect('balance', '—', false);
      } else if (p < .75) {
        setFolioEffect('stock', '−12'); setFolioEffect('ledger', '+856.80'); setFolioEffect('balance', '+856.80');
      } else {
        setFolioEffect('stock', '−12'); setFolioEffect('ledger', '+856.80'); setFolioEffect('balance', '0.00');
      }
    } else if (name === 'The Document Chain') {
      const stockText = document.querySelector('[data-beleg-card="2"] .beleg__eff li:first-child')?.textContent || 'Stock: −12';
      const balanceText = document.querySelector('[data-beleg-card="4"] .beleg__eff li:last-child')?.textContent || 'Balance: 0.00';
      setFolioEffect('stock', stockText.replace(/^(Stock|Bestand):\s*/, ''));
      setFolioEffect('ledger', document.querySelector('[data-f-debit]')?.textContent || '856.80');
      setFolioEffect('balance', balanceText.replace(/^(Balance|Saldo):\s*/, ''));
    }
  }

  const cold = document.querySelector('[data-ch1-cold]');
  const coldScreens = cold ? [...cold.querySelectorAll('[data-ch1-case-screen]')] : [];
  const coldMore = cold?.querySelector('[data-ch1-more]');
  const coldCount = cold?.querySelector('[data-ch1-screen-count]');
  const coldPlural = cold?.querySelector('[data-ch1-screen-plural]');
  const coldReveal = cold?.querySelector('.hb-ch1-reveal');
  let coldFrame = 0;

  function updateColdOpen() {
    if (!cold || !coldScreens.length) return;
    const rect = cold.getBoundingClientRect();
    const enter = innerHeight - rect.top;
    const span = innerHeight + rect.height;
    const progress = clamp(enter / span, 0, 1);
    const count = reduced ? 11 : clamp(Math.ceil(progress * 14) - 2, 1, 11);
    if (count === coldFrame) return;
    coldFrame = count;

    const visibleCount = Math.min(count, coldScreens.length);
    coldScreens.forEach((screen, index) => screen.toggleAttribute('data-open', index < visibleCount));

    const extra = Math.max(0, count - coldScreens.length);
    if (coldMore) {
      coldMore.hidden = extra === 0;
      coldMore.textContent = `+${extra} more`;
    }
    if (coldCount) coldCount.textContent = String(count);
    if (coldPlural) coldPlural.textContent = count === 1 ? '' : 's';
    if (coldReveal) coldReveal.toggleAttribute('data-on', count === 11);
  }

  const ch3 = document.querySelector('.hb-ch3-blueprint');
  const ch3Impacts = [...document.querySelectorAll('[data-ch3-impact]')];
  let lastCh3Index = -1;
  let impactTimer = 0;

  function updateChapter3Impacts() {
    if (!ch3 || !ch3Impacts.length) return;
    const p = clamp(Number(getComputedStyle(ch3).getPropertyValue('--sc-p')) || 0, 0, 1);
    const activeIndex = Math.min(3, Math.floor(p * 4));
    if (activeIndex === lastCh3Index) return;
    lastCh3Index = activeIndex;
    ch3Impacts.forEach(node => node.removeAttribute('data-on'));
    clearTimeout(impactTimer);
    const impact = document.querySelector(`[data-ch3-impact="${activeIndex}"]`);
    if (!impact) return;
    impact.setAttribute('data-on', '');
    if (!reduced) impactTimer = setTimeout(() => impact.removeAttribute('data-on'), 1150);
  }

  const liveWindow = document.querySelector('[data-fenster]');
  const qty = document.querySelector('[data-f-qty]');
  const price = document.querySelector('[data-f-price]');
  const vat = document.querySelector('[data-f-vat]');
  const liveInputs = [qty, price, vat].filter(Boolean);
  const firstField = qty?.closest('.fenster__field');
  const stockLine = document.querySelector('[data-beleg-card="2"] .beleg__eff li:first-child');
  const invoiceBalanceLine = document.querySelector('[data-beleg-card="3"] .beleg__eff li:last-child');
  const paymentBalanceLine = document.querySelector('[data-beleg-card="4"] .beleg__eff li:last-child');
  const hint = document.querySelector('[data-f-hint]');
  let invited = false;

  function inviteLiveEdit() {
    if (!liveWindow || liveWindow.hidden || invited) return;
    invited = true;
    firstField?.setAttribute('data-invite', '');
    if (!reduced) setTimeout(() => firstField?.removeAttribute('data-invite'), 1600);
  }

  function propagateLiveEffects() {
    if (!liveWindow || !qty || !price || !vat) return;
    const q = clamp(Number(qty.value) || 1, 1, 99);
    const unitPrice = clamp(Number(price.value) || 0, 0, 999);
    const gross = q * unitPrice * (1 + Number(vat.value) / 100);
    const grossText = money.format(gross);

    if (stockLine) stockLine.textContent = `Stock: −${q}`;
    if (invoiceBalanceLine) invoiceBalanceLine.textContent = `Balance: +${grossText}`;
    if (paymentBalanceLine) paymentBalanceLine.textContent = 'Balance: 0.00';
    if (hint) hint.textContent = `One change, three effects: ${q} units leave stock, the ledger moves ${grossText}, and the partner balance returns to zero after payment.`;

    liveWindow.setAttribute('data-edited', '');
    setFolioEffect('stock', `−${q}`);
    setFolioEffect('ledger', grossText);
    setFolioEffect('balance', '0.00');
  }
  liveInputs.forEach(input => input.addEventListener('input', () => requestAnimationFrame(propagateLiveEffects)));

  let queued = false;
  function frame() {
    queued = false;
    updateFolioFromChapter();
    updateColdOpen();
    updateChapter3Impacts();
    inviteLiveEdit();
  }
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(frame));
  }

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  document.addEventListener('sc:ready', schedule);
  schedule();
})();
