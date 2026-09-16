const SCORE_FIELDS = ['knowledge', 'application', 'verification', 'risk'];
const MASTERY_THRESHOLDS = { knowledge: 80, application: 80, verification: 90, risk: 90 };

/** Persisted progress contract. v2 splits historical achievement from current aptitude. */
export const PROGRESS_SCHEMA_VERSION = 2;
/** Consecutive correct answers required for current aptitude; one failure resets the streak. */
export const SUSTAINED_CORRECT = 3;

function normalizeDimensions(scores = {}) {
  return Object.fromEntries(SCORE_FIELDS.map(field => [field, Math.max(0, Math.min(100, Number(scores[field]) || 0))]));
}

/**
 * Single source of truth for the mastery rules. The reducer, the UI and the import
 * validator all derive from here; none of them may re-implement a part of it.
 * `mastered` is CURRENT aptitude; `everMastered` is the separate historical achievement,
 * which never regresses. The sustained streak is what EARNS aptitude the first time; after
 * that, a plain miss only resets the streak, while a failed safety gate suspends aptitude
 * without erasing the achievement.
 */
export function evaluateSkill(record = {}) {
  const dimensions = normalizeDimensions(record);
  const score = Math.round(SCORE_FIELDS.reduce((total, field) => total + dimensions[field], 0) / SCORE_FIELDS.length);
  const thresholdMet = SCORE_FIELDS.every(field => dimensions[field] >= MASTERY_THRESHOLDS[field]);
  const safetyGatePassed = record.safetyGatePassed !== false;
  const sustained = (Number(record.streak) || 0) >= SUSTAINED_CORRECT;
  // Una acreditación previa sólo sigue valiendo si los aciertos que la sostienen están
  // registrados. Así un registro heredado sin historial de intentos conserva la historia
  // (`everMastered`) pero tiene que volver a ganarse la aptitud, y ningún fichero manipulado
  // consigue aptitud con menos evidencia de la que siempre se exigió.
  const credited = sustained || (record.everMastered === true && (Number(record.correctAttempts) || 0) >= SUSTAINED_CORRECT);
  const mastered = thresholdMet && credited && safetyGatePassed;
  const reason = mastered ? 'mastered' : !safetyGatePassed ? 'safety-gate' : !thresholdMet ? 'threshold' : 'not-sustained';
  return { score, dimensions, thresholdMet, sustained, credited, safetyGatePassed, mastered, reason };
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
    // A new skill has no review date: it must not be treated as overdue.
    const overdue = reviewAt > 0 && reviewAt <= time ? 60 : 0;
    const blockedPrerequisites = (skill.prerequisites || []).filter(id => (progress[id]?.mastery || 0) < 80).length;
    const prerequisiteBoost = blockedPrerequisites ? -80 * blockedPrerequisites : 0;
    const score = (100 - mastery) + overdue + (Number(skill.riskWeight) || 1) * 8 + prerequisiteBoost - skill.level * 2;
    return { skill, score };
  });
  ranked.sort((a, b) => b.score - a.score || a.skill.level - b.skill.level || a.skill.id.localeCompare(b.skill.id));
  return ranked[0]?.skill || null;
}

/** Skill ids whose persisted review date is due, oldest first. Pure + UTC-safe. */
export function deriveDueReviews(progress = {}, now = new Date()) {
  const time = now instanceof Date ? now.getTime() : new Date(now).getTime();
  return Object.entries(progress)
    .filter(([, record]) => record?.explored && record.nextReview && new Date(record.nextReview).getTime() <= time)
    .sort((a, b) => new Date(a[1].nextReview) - new Date(b[1].nextReview) || a[0].localeCompare(b[0]))
    .map(([skillId]) => skillId);
}

/** Consecutive UTC practice days ending today or yesterday; multiple skills/day count once. */
export function deriveGlobalStreak(progress = {}, now = new Date()) {
  const dayKey = value => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  };
  const days = new Set(Object.values(progress).map(record => dayKey(record?.lastPractised)).filter(value => value !== null));
  if (!days.size) return 0;
  const DAY = 86400000;
  const today = dayKey(now);
  let cursor = days.has(today) ? today : today - DAY;
  let streak = 0;
  while (days.has(cursor)) { streak += 1; cursor -= DAY; }
  return streak;
}

const RECOMMENDATION_REASON = {
  es: { overdue: 'Repaso vencido: consolida antes de avanzar', learning: 'Continúa una habilidad en curso', fresh: 'Siguiente paso recomendado en tu ruta' },
  en: { overdue: 'Review due: consolidate before moving on', learning: 'Continue a skill already in progress', fresh: 'Recommended next step in your path' },
  de: { overdue: 'Wiederholung fällig: festigen vor dem nächsten Schritt', learning: 'Eine begonnene Kompetenz fortsetzen', fresh: 'Empfohlener nächster Schritt auf deinem Pfad' }
};

export function recommendationReason(record = {}, now = new Date(), locale = 'es') {
  const copy = RECOMMENDATION_REASON[locale] || RECOMMENDATION_REASON.es;
  if (record.nextReview && new Date(record.nextReview).getTime() <= new Date(now).getTime()) return copy.overdue;
  return record.explored ? copy.learning : copy.fresh;
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

const ALLOWED_TOP_LEVEL = ['schemaVersion', 'classification', 'locale', 'track', 'progress', 'settings', 'exportedAt'];
const ALLOWED_SETTINGS = ['diagnosticCompleted', 'diagnosticScore', 'recommendedLevel', 'selectedSkillId'];
const V1_RECORD_FIELDS = ['knowledge', 'application', 'verification', 'risk', 'mastery', 'mastered', 'explored', 'streak', 'correctAttempts', 'safetyGatePassed', 'lastPractised', 'nextReview'];
const V1_REQUIRED_RECORD = ['knowledge', 'application', 'verification', 'risk', 'mastery', 'mastered', 'explored', 'streak', 'lastPractised', 'nextReview'];
const RECORD_FIELDS = [...V1_RECORD_FIELDS, 'everMastered', 'legacy'];
const REQUIRED_RECORD = ['knowledge', 'application', 'verification', 'risk', 'mastery', 'mastered', 'everMastered', 'explored', 'streak', 'correctAttempts', 'safetyGatePassed', 'lastPractised', 'nextReview'];
const SCORE_RANGE_FIELDS = ['knowledge', 'application', 'verification', 'risk', 'mastery'];
const BOOLEAN_FIELDS = ['mastered', 'everMastered', 'explored', 'safetyGatePassed', 'legacy'];
const COUNTER_FIELDS = ['streak', 'correctAttempts'];
const isSkillId = value => /^SYN-SK-L[0-8]-0[1-8]$/.test(value);
const isTimestamp = value => typeof value === 'string'
  && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)
  && !Number.isNaN(Date.parse(value));

/**
 * Lift a v1 payload to v2 without inventing evidence. Derived values (mastery, mastered)
 * are recomputed from the stored dimensions, so a forged claim cannot take effect; it is
 * neutralized rather than trusted. A record that never stored `correctAttempts` cannot have
 * its attempt history reconstructed, so it is flagged `legacy` instead of being given one.
 * Structural defects (unknown fields, bad ids, missing v1 fields) still reject the payload.
 */
export function migrateProgressPayload(value) {
  const unknown = Object.keys(value).filter(key => !ALLOWED_TOP_LEVEL.includes(key));
  if (unknown.length) return { ok: false, reason: 'unknown-fields', fields: unknown };
  if (!value.progress || typeof value.progress !== 'object' || Array.isArray(value.progress)) return { ok: false, reason: 'progress' };
  const progress = {};
  for (const [skillId, record] of Object.entries(value.progress)) {
    if (!isSkillId(skillId) || !record || typeof record !== 'object' || Array.isArray(record)) return { ok: false, reason: 'progress-record' };
    if (Object.keys(record).some(key => !V1_RECORD_FIELDS.includes(key))) return { ok: false, reason: 'progress-fields' };
    if (V1_REQUIRED_RECORD.some(key => !Object.hasOwn(record, key))) return { ok: false, reason: 'progress-required' };
    // Los booleanos del v1 se comprueban aquí: el registro migrado ya no los lleva tal cual,
    // así que si no se validan ahora, `mastered: 'yes'` entraría por la puerta de atrás.
    if (typeof record.mastered !== 'boolean' || typeof record.explored !== 'boolean') return { ok: false, reason: 'progress-type' };
    if (Object.hasOwn(record, 'safetyGatePassed') && typeof record.safetyGatePassed !== 'boolean') return { ok: false, reason: 'progress-type' };
    const reconstructable = Object.hasOwn(record, 'correctAttempts');
    const declared = evaluateSkill(record);
    // El logro histórico se decide primero y alimenta la aptitud, para que el registro migrado
    // sea internamente consistente cuando el validador lo vuelva a derivar.
    const candidate = {
      knowledge: record.knowledge, application: record.application, verification: record.verification, risk: record.risk,
      everMastered: declared.thresholdMet ? record.mastered || declared.mastered : declared.mastered,
      explored: record.explored,
      streak: record.streak,
      correctAttempts: reconstructable ? record.correctAttempts : record.streak,
      safetyGatePassed: record.safetyGatePassed !== false,
      lastPractised: record.lastPractised,
      nextReview: record.nextReview,
      ...(reconstructable ? {} : { legacy: true })
    };
    const evaluation = evaluateSkill(candidate);
    progress[skillId] = { ...candidate, mastery: evaluation.score, mastered: evaluation.mastered };
  }
  return { ok: true, value: { ...value, schemaVersion: PROGRESS_SCHEMA_VERSION, progress } };
}

function validateCurrentPayload(value) {
  const unknown = Object.keys(value).filter(key => !ALLOWED_TOP_LEVEL.includes(key));
  if (unknown.length) return { valid: false, reason: 'unknown-fields', fields: unknown };
  if (value.schemaVersion !== PROGRESS_SCHEMA_VERSION || value.classification !== 'synthetic-progress') return { valid: false, reason: 'classification' };
  if (!['es', 'en', 'de'].includes(value.locale)) return { valid: false, reason: 'locale' };
  if (!['functional', 'technical', 'dual'].includes(value.track)) return { valid: false, reason: 'track' };
  if (!value.progress || typeof value.progress !== 'object' || Array.isArray(value.progress)) return { valid: false, reason: 'progress' };
  for (const [skillId, record] of Object.entries(value.progress)) {
    if (!isSkillId(skillId) || !record || typeof record !== 'object' || Array.isArray(record)) return { valid: false, reason: 'progress-record' };
    if (Object.keys(record).some(key => !RECORD_FIELDS.includes(key))) return { valid: false, reason: 'progress-fields' };
    if (REQUIRED_RECORD.some(key => !Object.hasOwn(record, key))) return { valid: false, reason: 'progress-required' };
    for (const [key, fieldValue] of Object.entries(record)) {
      if (BOOLEAN_FIELDS.includes(key) && typeof fieldValue !== 'boolean') return { valid: false, reason: 'progress-type' };
      if (SCORE_RANGE_FIELDS.includes(key) && (typeof fieldValue !== 'number' || !Number.isFinite(fieldValue) || fieldValue < 0 || fieldValue > 100)) return { valid: false, reason: 'progress-range' };
      if (COUNTER_FIELDS.includes(key) && (!Number.isInteger(fieldValue) || fieldValue < 0 || fieldValue > 1000)) return { valid: false, reason: 'progress-range' };
      if (['lastPractised', 'nextReview'].includes(key) && !isTimestamp(fieldValue)) return { valid: false, reason: 'progress-date' };
    }
    // A run of correct answers cannot exceed the total ever answered correctly.
    if (record.correctAttempts < record.streak) return { valid: false, reason: 'progress-attempts' };
    const evaluation = evaluateSkill(record);
    if (record.mastery !== evaluation.score || record.explored !== true) return { valid: false, reason: 'progress-consistency' };
    // Current aptitude is fully derivable, so a claimed value that disagrees is a forgery.
    if (record.mastered !== evaluation.mastered) return { valid: false, reason: 'progress-mastery' };
    if (record.mastered && !record.everMastered) return { valid: false, reason: 'progress-history' };
    // `legacy` sólo exime de justificar la HISTORIA: un registro migrado pudo acreditarse sin
    // que se guardaran los intentos. La aptitud actual no se exime nunca (ver evaluateSkill).
    if (record.everMastered && !record.legacy && record.correctAttempts < SUSTAINED_CORRECT) return { valid: false, reason: 'progress-history' };
    if (Date.parse(record.nextReview) <= Date.parse(record.lastPractised)) return { valid: false, reason: 'progress-review-date' };
  }
  if (value.settings !== undefined) {
    if (!value.settings || typeof value.settings !== 'object' || Array.isArray(value.settings)) return { valid: false, reason: 'settings' };
    if (Object.keys(value.settings).some(key => !ALLOWED_SETTINGS.includes(key))) return { valid: false, reason: 'settings-fields' };
    if (value.settings.diagnosticCompleted !== undefined && typeof value.settings.diagnosticCompleted !== 'boolean') return { valid: false, reason: 'settings-type' };
    if (value.settings.diagnosticScore !== undefined && (!Number.isInteger(value.settings.diagnosticScore) || value.settings.diagnosticScore < 0 || value.settings.diagnosticScore > 6)) return { valid: false, reason: 'settings-range' };
    if (value.settings.recommendedLevel !== undefined && (!Number.isInteger(value.settings.recommendedLevel) || value.settings.recommendedLevel < 0 || value.settings.recommendedLevel > 8)) return { valid: false, reason: 'settings-range' };
    if (value.settings.selectedSkillId !== undefined && !isSkillId(value.settings.selectedSkillId)) return { valid: false, reason: 'settings-skill' };
  }
  if (value.exportedAt !== undefined && !isTimestamp(value.exportedAt)) return { valid: false, reason: 'export-date' };
  return { valid: true, value };
}

export function validateProgressImport(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { valid: false, reason: 'object-required' };
  if (value.schemaVersion === 1) {
    const migrated = migrateProgressPayload(value);
    if (!migrated.ok) return { valid: false, reason: migrated.reason, ...(migrated.fields ? { fields: migrated.fields } : {}) };
    const result = validateCurrentPayload(migrated.value);
    return result.valid ? { ...result, migratedFrom: 1 } : result;
  }
  return validateCurrentPayload(value);
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
