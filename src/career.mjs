// career.mjs — Modo Carrera: la empresa Nordwind Handel GmbH.
// Cada skill dominada resuelve un ticket real; los KPIs de la empresa evolucionan con el usuario.

export const CAREER = {
  company: { es: 'Nordwind Handel GmbH', en: 'Nordwind Trading Ltd.', de: 'Nordwind Handel GmbH' },
  intro: {
    es: 'Eres el nuevo consultor de Nordwind Handel GmbH. Cada skill que dominas resuelve un ticket real de la empresa y mueve sus KPIs. Tu cargo evoluciona con los tickets cerrados.',
    en: 'You are Nordwind Trading\'s new consultant. Each mastered skill resolves a real ticket and moves company KPIs. Your title evolves as you close tickets.',
    de: 'Du bist der neue Berater der Nordwind Handel GmbH. Jede gemeisterte Skill löst ein echtes Ticket und bewegt die KPIs. Deine Rolle wächst mit jedem geschlossenen Ticket.'
  },
  roles: [
    { at: 0,  es: 'Becario', en: 'Intern', de: 'Praktikant' },
    { at: 8,  es: 'Consultor junior', en: 'Junior consultant', de: 'Junior-Berater' },
    { at: 20, es: 'Consultor', en: 'Consultant', de: 'Berater' },
    { at: 35, es: 'Consultor senior', en: 'Senior consultant', de: 'Senior-Berater' },
    { at: 50, es: 'Arquitecto de procesos', en: 'Process architect', de: 'Prozessarchitekt' },
    { at: 64, es: 'Arquitecto B1 principal', en: 'Principal B1 architect', de: 'Principal-B1-Architekt' }
  ],
  kpis: [
    { id: 'tickets', label: { es: 'Tickets cerrados', en: 'Tickets closed', de: 'Geschlossene Tickets' }, unit: '' },
    { id: 'dso',     label: { es: 'DSO · días de cobro', en: 'DSO · days to collect', de: 'DSO · Tage bis zum Zahlungseingang' }, unit: 'd' },
    { id: 'stock',   label: { es: 'Capital en stock', en: 'Capital in stock', de: 'Lagerkapital' }, unit: 'k€' },
    { id: 'errors',  label: { es: 'Errores de proceso/mes', en: 'Process errors/month', de: 'Prozessfehler/Monat' }, unit: '' }
  ]
};

export function skillIndexNumber(id) {
  const m = /L(\d+)-(\d+)/.exec(id || '');
  return m ? Number(m[1]) * 8 + Number(m[2]) : 0;
}

// Departamento emisor del ticket, derivado del nivel del skill.
export function departmentFor(level, locale = 'es', levelsMeta) {
  const t = levelsMeta?.[level]?.title;
  const v = t?.[locale] ?? t?.es ?? '';
  return v || 'Nordwind';
}

// Ticket derivado del war story del skill: síntoma → petición del cliente.
export function getTicket(skill, mc, locale = 'es', levelsMeta) {
  const L = v => Array.isArray(v) ? v.map(L).join(' ') : (v?.[locale] ?? v?.es ?? (v === undefined || v === null ? '' : String(v)));
  const war = mc?.war;
  if (!war) return null;
  const sympt = Array.isArray(war.sympt) ? war.sympt.map(L).join(' ') : L(war.sympt);
  return {
    id: `NW-${String(skillIndexNumber(skill.id)).padStart(3, '0')}`,
    from: departmentFor(skill.level, locale, levelsMeta),
    subject: L(war.q),
    body: sympt,
    resolution: L(war.fix),
    skillId: skill.id
  };
}

export function careerProgress(masteredCount, locale = 'es', totalSkills = 72) {
  const role = [...CAREER.roles].reverse().find(r => masteredCount >= r.at) || CAREER.roles[0];
  const pct = Math.round(masteredCount / totalSkills * 100);
  return { role: role[locale] || role.es, pct };
}

// KPIs vivos: mejoran con el dominio (memoria realista: no llegan a cero/perfección).
export function kpiSnapshot(masteredCount, totalSkills = 72) {
  const f = Math.max(0, Math.min(1, masteredCount / totalSkills));
  return CAREER.kpis.map(k => {
    let value = 0;
    if (k.id === 'tickets') value = masteredCount;
    else if (k.id === 'dso') value = Math.max(34, Math.round(62 - 28 * f));
    else if (k.id === 'stock') value = Math.max(210, Math.round(480 - 200 * f));
    else if (k.id === 'errors') value = Math.max(4, Math.round(23 - 17 * f));
    return { id: k.id, label: k.label, unit: k.unit, value };
  });
}
