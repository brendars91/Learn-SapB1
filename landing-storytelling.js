(() => {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

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
      // Keep the last known transaction state visible while the live document is edited.
      setFolioEffect('stock', document.querySelector('[data-beleg-card="2"] .beleg__eff li:first-child')?.textContent.replace(/^Stock:\s*/, '') || '−12');
      setFolioEffect('ledger', document.querySelector('[data-f-debit]')?.textContent || '856.80');
      setFolioEffect('balance', document.querySelector('[data-beleg-card="4"] .beleg__eff li:last-child')?.textContent.replace(/^Balance:\s*/, '') || '0.00');
    }
  }

  const cold = document.querySelector('[data-ch1-cold]');
  const coldScreens = cold ? [...cold.querySelectorAll('.hb-ch1-screens span')] : [];
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
    coldScreens.forEach((screen, index) => screen.toggleAttribute('data-open', index < count));
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
  const liveInputs = [...document.querySelectorAll('[data-f-qty], [data-f-price], [data-f-vat]')];
  const firstField = document.querySelector('[data-f-qty]')?.closest('.fenster__field');
  let invited = false;

  function inviteLiveEdit() {
    if (!liveWindow || liveWindow.hidden || invited) return;
    invited = true;
    firstField?.setAttribute('data-invite', '');
    if (!reduced) setTimeout(() => firstField?.removeAttribute('data-invite'), 1600);
  }

  function propagateLiveEffects() {
    if (!liveWindow) return;
    liveWindow.setAttribute('data-edited', '');
    const stock = document.querySelector('[data-beleg-card="2"] .beleg__eff li:first-child')?.textContent.replace(/^Stock:\s*/, '') || '—';
    const ledger = document.querySelector('[data-f-debit]')?.textContent || '—';
    const balance = document.querySelector('[data-beleg-card="4"] .beleg__eff li:last-child')?.textContent.replace(/^Balance:\s*/, '') || '—';
    setFolioEffect('stock', stock);
    setFolioEffect('ledger', ledger);
    setFolioEffect('balance', balance);
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
    requestAnimationFrame(frame);
  }

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  document.addEventListener('sc:ready', schedule);
  schedule();
})();
