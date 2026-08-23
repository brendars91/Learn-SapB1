const SCORE_FIELDS = ['knowledge', 'application', 'verification', 'risk'];

export function calculateMastery(scores = {}, safetyGatePassed = true) {
  const normalized = Object.fromEntries(SCORE_FIELDS.map(field => [field, Math.max(0, Math.min(100, Number(scores[field]) || 0))]));
  const score = Math.round((normalized.knowledge + normalized.application + normalized.verification + normalized.risk) / 4);
  if (!safetyGatePassed) return { score, mastered: false, reason: 'safety-gate', dimensions: normalized };
  const mastered = normalized.knowledge >= 80 && normalized.application >= 80 && normalized.verification >= 90 && normalized.risk >= 90;
  return { score, mastered, reason: mastered ? 'mastered' : 'threshold', dimensions: normalized };
}

export function recommendNext(skills, progress = {}, now = new Date(), options = {}) {
  const time = now instanceof Date ? now.getTime() : new Date(now).getTime();
  const track = ['functional', 'technical', 'dual'].includes(options.track) ? options.track : 'dual';
  const eligible = skills.filter(skill => {
    if (track === 'dual' || !skill.track) return true;
    return skill.track === track || skill.track === 'dual';
  });
  const recommendedLevel = Number(options.recommendedLevel);
  if (Object.keys(progress).length === 0 && Number.isInteger(recommendedLevel) && eligible.length) {
    const atOrAbove = eligible
      .filter(skill => skill.level >= recommendedLevel)
      .sort((a, b) => a.level - b.level || a.id.localeCompare(b.id));
    if (atOrAbove.length) return atOrAbove[0];
    return [...eligible].sort((a, b) => b.level - a.level || a.id.localeCompare(b.id))[0];
  }
  const ranked = eligible.map(skill => {
    const state = progress[skill.id] || {};
    const mastery = Number(state.mastery) || 0;
    const reviewAt = state.nextReview ? new Date(state.nextReview).getTime() : 0;
    const overdue = reviewAt <= time ? 60 : 0;
    const blockedPrerequisites = (skill.prerequisites || []).filter(id => (progress[id]?.mastery || 0) < 80).length;
    const prerequisiteBoost = blockedPrerequisites ? -80 * blockedPrerequisites : 0;
    const score = (100 - mastery) + overdue + (Number(skill.riskWeight) || 1) * 8 + prerequisiteBoost - skill.level * 2;
    return { skill, score };
  });
  ranked.sort((a, b) => b.score - a.score || a.skill.level - b.skill.level || a.skill.id.localeCompare(b.skill.id));
  return ranked[0]?.skill || null;
}

export function scanSensitiveInput(value = '') {
  const text = String(value);
  const reasons = [];
  const emails = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
  if (emails.some(email => !email.toLowerCase().endsWith('@example.test'))) reasons.push('email-domain');
  const urls = text.match(/https?:\/\/[^\s)]+/gi) || [];
  if (urls.some(rawUrl => {
    try {
      const url = rawUrl.replace(/[.,;!?]+$/, '');
      const host = new URL(url).hostname.toLowerCase();
      return !(host === 'example.test' || host.endsWith('.example.test'));
    } catch {
      return true;
    }
  })) reasons.push('url-domain');
  if (/\b[A-Z]{2}\d{2}[A-Z0-9]{11,30}\b/i.test(text)) reasons.push('bank-identifier');
  if (/\b(?:\d{1,3}\.){3}\d{1,3}\b/.test(text)) reasons.push('ip-address');
  if (/\b\d{12,}\b/.test(text)) reasons.push('long-identifier');
  return { safe: reasons.length === 0, reasons: [...new Set(reasons)] };
}

const PROMPT_SIGNALS = [
  ['role', /\b(role|rol|rolle)\b/i],
  ['goal', /\b(goal|objective|objetivo|ziel)\b/i],
  ['context', /\b(context|contexto|kontext)\b/i],
  ['evidence', /\b(evidence|evidencia|beleg|quelle)\b/i],
  ['uncertainty', /\b(uncertainty|uncertain|incertidumbre|no verific|unsicher|nicht verifiz)\b/i],
  ['output', /\b(output|salida|ausgabe|json|schema)\b/i],
  ['humanGate', /\b(human gate|human review|revisi[oó]n humana|intervenci[oó]n humana|menschliche pr[uü]fung|freigabe)\b/i]
];

export function lintPrompt(value = '') {
  const text = String(value);
  const present = PROMPT_SIGNALS.filter(([, pattern]) => pattern.test(text)).map(([name]) => name);
  const syntheticContext = /\bSYN-[A-Z0-9-]+\b/i.test(text);
  if (syntheticContext) present.push('syntheticContext');
  const required = [...PROMPT_SIGNALS.map(([name]) => name), 'syntheticContext'];
  const missing = required.filter(name => !present.includes(name));
  const privacy = scanSensitiveInput(text);
  const base = Math.round((present.length / required.length) * 100);
  const score = privacy.safe ? base : Math.max(0, base - 30);
  return { score, present, missing, privacy };
}

export function validateProgressImport(value) {
  const allowed = ['schemaVersion', 'classification', 'locale', 'track', 'progress', 'settings', 'exportedAt'];
  const allowedRecord = ['knowledge', 'application', 'verification', 'risk', 'mastery', 'mastered', 'explored', 'streak', 'correctAttempts', 'safetyGatePassed', 'lastPractised', 'nextReview'];
  const requiredRecord = ['knowledge', 'application', 'verification', 'risk', 'mastery', 'mastered', 'explored', 'streak', 'lastPractised', 'nextReview'];
  const allowedSettings = ['diagnosticCompleted', 'diagnosticScore', 'recommendedLevel', 'selectedSkillId'];
  const validSkillId = value => /^SYN-SK-L[0-8]-0[1-8]$/.test(value);
  const validDate = value => typeof value === 'string'
    && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)
    && !Number.isNaN(Date.parse(value));
  const scoreFields = ['knowledge', 'application', 'verification', 'risk', 'mastery'];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { valid: false, reason: 'object-required' };
  const unknown = Object.keys(value).filter(key => !allowed.includes(key));
  if (unknown.length) return { valid: false, reason: 'unknown-fields', fields: unknown };
  if (value.schemaVersion !== 1 || value.classification !== 'synthetic-progress') return { valid: false, reason: 'classification' };
  if (!['es', 'en', 'de'].includes(value.locale)) return { valid: false, reason: 'locale' };
  if (!['functional', 'technical', 'dual'].includes(value.track)) return { valid: false, reason: 'track' };
  if (!value.progress || typeof value.progress !== 'object' || Array.isArray(value.progress)) return { valid: false, reason: 'progress' };
  for (const [skillId, record] of Object.entries(value.progress)) {
    if (!validSkillId(skillId) || !record || typeof record !== 'object' || Array.isArray(record)) return { valid: false, reason: 'progress-record' };
    if (Object.keys(record).some(key => !allowedRecord.includes(key))) return { valid: false, reason: 'progress-fields' };
    if (requiredRecord.some(key => !Object.hasOwn(record, key))) return { valid: false, reason: 'progress-required' };
    for (const [key, fieldValue] of Object.entries(record)) {
      if (['mastered', 'explored', 'safetyGatePassed'].includes(key) && typeof fieldValue !== 'boolean') return { valid: false, reason: 'progress-type' };
      if (scoreFields.includes(key) && (typeof fieldValue !== 'number' || !Number.isFinite(fieldValue) || fieldValue < 0 || fieldValue > 100)) return { valid: false, reason: 'progress-range' };
      if (['streak', 'correctAttempts'].includes(key) && (!Number.isInteger(fieldValue) || fieldValue < 0 || fieldValue > 1000)) return { valid: false, reason: 'progress-range' };
      if (['lastPractised', 'nextReview'].includes(key) && !validDate(fieldValue)) return { valid: false, reason: 'progress-date' };
    }
    const derived = calculateMastery(record, record.safetyGatePassed !== false);
    if (record.mastery !== derived.score || record.explored !== true) return { valid: false, reason: 'progress-consistency' };
    if (record.mastered && (!derived.mastered || !record.safetyGatePassed || (record.correctAttempts || 0) < 3)) return { valid: false, reason: 'progress-mastery' };
    if (Date.parse(record.nextReview) <= Date.parse(record.lastPractised)) return { valid: false, reason: 'progress-review-date' };
  }
  if (value.settings !== undefined) {
    if (!value.settings || typeof value.settings !== 'object' || Array.isArray(value.settings)) return { valid: false, reason: 'settings' };
    if (Object.keys(value.settings).some(key => !allowedSettings.includes(key))) return { valid: false, reason: 'settings-fields' };
    if (value.settings.diagnosticCompleted !== undefined && typeof value.settings.diagnosticCompleted !== 'boolean') return { valid: false, reason: 'settings-type' };
    if (value.settings.diagnosticScore !== undefined && (!Number.isInteger(value.settings.diagnosticScore) || value.settings.diagnosticScore < 0 || value.settings.diagnosticScore > 6)) return { valid: false, reason: 'settings-range' };
    if (value.settings.recommendedLevel !== undefined && (!Number.isInteger(value.settings.recommendedLevel) || value.settings.recommendedLevel < 0 || value.settings.recommendedLevel > 8)) return { valid: false, reason: 'settings-range' };
    if (value.settings.selectedSkillId !== undefined && !validSkillId(value.settings.selectedSkillId)) return { valid: false, reason: 'settings-skill' };
  }
  if (value.exportedAt !== undefined && !validDate(value.exportedAt)) return { valid: false, reason: 'export-date' };
  return { valid: true, value };
}

export function seededOrder(items, seed = 20260822) {
  const result = [...items];
  let state = Number(seed) >>> 0;
  const random = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

export function nextReviewDate(correctStreak, from = new Date()) {
  const schedule = [1, 3, 7, 14];
  const days = schedule[Math.min(Math.max(0, Number(correctStreak) || 0), schedule.length - 1)];
  const date = new Date(from);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
}
