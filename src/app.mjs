// app.mjs v2 — Motor entender-primero con visualizaciones SVG y evaluación 4 pasos.
import { I18N, LEVELS, SKILLS, CASES, INCIDENTS, BOSSES, EVIDENCE, DIAGNOSTIC, PROCESS_STEPS, translate } from './content.mjs';
import { calculateMastery, recommendNext, scanSensitiveInput, lintPrompt, validateProgressImport, nextReviewDate } from './domain.mjs';
import { b1Window } from './ui-b1.mjs';
import { trText, trNode, trList } from './i18n.mjs';
import { MASTERCLASS } from './masterclass.mjs';
import { getActivity, validateActivityDetailed, mapAnswerToLocale, journalSideTexts, journalSideKey } from './activities.mjs';
import { ADVANCED_QUERIES, DASHBOARD_PATTERNS, VIBE_PATTERNS } from './advanced.mjs';
import { CAREER, getTicket, careerProgress, kpiSnapshot } from './career.mjs';

const STORAGE_KEY = 'sap-b1-mastery-lab.v1';
const VIEWS = ['home', 'career', 'map', 'cases', 'incidents', 'simulator', 'ai', 'evidence'];

export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

export function createInitialState(saved = {}) {
  const locale = ['es', 'en', 'de'].includes(saved.locale) ? saved.locale : 'es';
  const track = ['functional', 'technical', 'dual'].includes(saved.track) ? saved.track : 'dual';
  return {
    locale, track,
    view: VIEWS.includes(saved.view) ? saved.view : 'home',
    progress: saved.progress && typeof saved.progress === 'object' ? structuredClone(saved.progress) : {},
    diagnosticIndex: Number(saved.diagnosticIndex) || 0,
    diagnosticScore: Number(saved.diagnosticScore) || 0,
    diagnosticCompleted: saved.diagnosticCompleted === undefined ? true : Boolean(saved.diagnosticCompleted),
    diagnosticFeedback: null,
    recommendedLevel: Number.isInteger(saved.recommendedLevel) ? saved.recommendedLevel : 0,
    selectedSkillId: saved.selectedSkillId || 'SYN-SK-L0-01',
    skillMode: ['learn','guided','prove'].includes(saved.skillMode) ? saved.skillMode : 'learn',
    assessmentStep: 0, assessmentChoice: null, assessmentPrinciple: null, assessmentShown: false,
    activityAnswers: {}, activitySequence: [], activityFeedback: null, activityHints: 0,
    consoleTab: 'queries', consoleQuery: null, consoleOpen: null,
    levelFilter: saved.levelFilter ?? 'all',
    trackFilter: saved.trackFilter || 'all',
    assessmentResult: null,
    caseIndex: Number(saved.caseIndex) || 0,
    incidentIndex: Number(saved.incidentIndex) || 0,
    bossIndex: Number(saved.bossIndex) || 0,
    process: saved.process || 'sales',
    processStep: Number(saved.processStep) || 0,
    promptDraft: '', promptResult: null,
    toast: ''
  };
}

function updateSkill(progress, skillId, change) {
  return { ...progress, [skillId]: { ...(progress[skillId] || {}), ...change } };
}

export function reduceState(state, action) {
  switch (action.type) {
    case 'SET_LOCALE': {
      if (!['es', 'en', 'de'].includes(action.locale)) return state;
      // i18n: el feedback de actividad y las respuestas viven en state como texto YA
      // localizado (FEEDBACK[locale], opciones de selects, tokens de secuencia). Al
      // cambiar de idioma se re-deriva TODO con el locale activo: respuestas mapeadas
      // por posición entre opciones equivalentes y feedback re-validado, para que ni
      // el bloque de corrección quede congelado ni un check correcto se invalide.
      let activityFeedback = state.activityFeedback;
      let activityAnswers = state.activityAnswers;
      let activitySequence = state.activitySequence;
      if (state.selectedSkillId) {
        const skill = SKILLS.find(s => s.id === state.selectedSkillId);
        const oldActivity = skill ? getActivity(skill, state.locale) : null;
        const activity = skill ? getActivity(skill, action.locale) : null;
        if (activity && !activity.unavailable) {
          if (activity.type === 'simulator' && oldActivity?.type === 'simulator') {
            activityAnswers = Object.fromEntries(Object.entries(activityAnswers).map(([key, value]) => {
              const index = Number(key.replace('sim-', ''));
              const oldOptions = oldActivity.targets[index]?.options || [];
              const newOptions = activity.targets[index]?.options || [];
              return [key, mapAnswerToLocale(value, oldOptions, newOptions)];
            }));
          } else if ((activity.type === 'config' || activity.type === 'consequence')) {
            activitySequence = activitySequence.map(value => mapAnswerToLocale(value, oldActivity?.tokens || [], activity.tokens || []));
          } else if (activity.type === 'journal') {
            activityAnswers = Object.fromEntries(Object.entries(activityAnswers).map(([key, value]) => {
              if (!key.startsWith('side-')) return [key, value];
              const semantic = journalSideKey(value);
              return [key, semantic ? journalSideTexts(action.locale)[semantic] : value];
            }));
          }
          if (activityFeedback) {
            const revalidated = validateActivityDetailed(activity, activityAnswers, activitySequence);
            const passed = revalidated.correct;
            activityFeedback = {
              correct: passed,
              message: passed ? (activity.resolution || translate(action.locale, 'actRightPrompt')) : translate(action.locale, 'actWrongPrompt'),
              details: revalidated.details
            };
          }
        } else if (activityFeedback) {
          activityFeedback = null;
        }
      }
      return { ...state, locale: action.locale, toast: '', activityAnswers, activitySequence, activityFeedback };
    }
    case 'SET_TRACK': return ['functional', 'technical', 'dual'].includes(action.track) ? { ...state, track: action.track, toast: '' } : state;
    case 'NAVIGATE': return VIEWS.includes(action.view) ? { ...state, view: action.view, assessmentResult: null, toast: '' } : state;
    case 'SELECT_SKILL': return { ...state, selectedSkillId: action.skillId, view: 'map', skillMode: 'learn', assessmentStep: 0, assessmentChoice: null, assessmentShown: false, assessmentResult: null, activityAnswers: {}, activitySequence: [], activityFeedback: null, activityHints: 0, toast: '' };
    case 'SET_SKILL_MODE': return { ...state, skillMode: ['learn','guided','prove'].includes(action.mode) ? action.mode : 'learn', assessmentStep: 0, assessmentChoice: null, assessmentPrinciple: null, assessmentShown: false, assessmentResult: null, activityAnswers: {}, activitySequence: [], activityFeedback: null, activityHints: 0 };
    case 'ACTIVITY_ANSWER': return { ...state, activityAnswers: { ...state.activityAnswers, [action.key]: action.value }, activityFeedback: null };
    case 'ACTIVITY_TOGGLE': {
      const selected = Boolean(state.activityAnswers[action.key]);
      return { ...state, activityAnswers: { ...state.activityAnswers, [action.key]: !selected }, activityFeedback: null };
    }
    case 'ACTIVITY_SEQUENCE': return { ...state, activitySequence: [...state.activitySequence, action.value], activityFeedback: null };
    case 'ACTIVITY_SEQUENCE_UNDO': return { ...state, activitySequence: state.activitySequence.slice(0, -1), activityFeedback: null };
    case 'ACTIVITY_FEEDBACK': return { ...state, activityFeedback: { correct: action.correct, message: action.message, details: action.details || null }, assessmentResult: { correct: action.correct } };
    case 'ACTIVITY_HINT': return { ...state, activityHints: (state.activityHints || 0) + 1 };
    case 'RESET_ACTIVITY': return { ...state, activityAnswers: {}, activitySequence: [], activityFeedback: null, assessmentResult: null };
    case 'ANSWER_STEP_DECIDE': return { ...state, assessmentChoice: action.index, assessmentStep: Math.max(state.assessmentStep, 1) };
    case 'ANSWER_STEP_PRINCIPLE': return { ...state, assessmentPrinciple: action.index, assessmentStep: Math.max(state.assessmentStep, 2) };
    case 'REVEAL_REASONING': return { ...state, assessmentShown: true, assessmentStep: 3 };
    case 'SET_LEVEL_FILTER': return { ...state, levelFilter: action.value, toast: '' };
    case 'SET_CONSOLE_TAB': return ['queries','dashboards','vibe'].includes(action.tab) ? { ...state, consoleTab: action.tab, consoleQuery: null, toast: '' } : state;
    case 'OPEN_CONSOLE_QUERY': return { ...state, consoleQuery: action.id, toast: '' };
    case 'CLOSE_CONSOLE_QUERY': return { ...state, consoleQuery: null, toast: '' };
    case 'TOGGLE_CONSOLE_CARD': return { ...state, consoleOpen: state.consoleOpen === action.id ? null : action.id, toast: '' };
    case 'SET_TRACK_FILTER': return { ...state, trackFilter: action.value, toast: '' };
    case 'ANSWER_DIAGNOSTIC':
      if (state.diagnosticFeedback) return state;
      return { ...state, diagnosticScore: state.diagnosticScore + (action.correct ? 1 : 0), diagnosticFeedback: { correct: action.correct } };
    case 'NEXT_DIAGNOSTIC': {
      const last = state.diagnosticIndex >= DIAGNOSTIC.length - 1;
      const score = state.diagnosticScore;
      return last
        ? { ...state, diagnosticCompleted: true, recommendedLevel: Math.min(8, Math.floor(score * 1.5)), diagnosticFeedback: null, toast: '' }
        : { ...state, diagnosticIndex: state.diagnosticIndex + 1, diagnosticFeedback: null, toast: '' };
    }
    case 'PRACTISE_SKILL': {
      const now = new Date(action.now || Date.now());
      const existing = state.progress[action.skillId] || {};
      const dimensions = { knowledge: Math.max(existing.knowledge || 0, 60), application: Math.max(existing.application || 0, 50), verification: Math.max(existing.verification || 0, 40), risk: Math.max(existing.risk || 0, 50) };
      const mastery = calculateMastery(dimensions);
      return { ...state, progress: updateSkill(state.progress, action.skillId, { ...dimensions, mastery: mastery.score, mastered: mastery.mastered, explored: true, streak: existing.streak || 0, lastPractised: now.toISOString(), nextReview: nextReviewDate(existing.streak || 0, now) }), toast: 'practice-recorded' };
    }
    case 'ASSESS_SKILL': {
      const now = new Date(action.now || Date.now());
      const existing = state.progress[action.skillId] || {};
      const increment = (field, amount) => Math.min(100, (Number(existing[field]) || 0) + amount);
      const dimensions = action.correct
        ? { knowledge: increment('knowledge', 10), application: increment('application', 15), verification: increment('verification', 20), risk: increment('risk', 15) }
        : { knowledge: increment('knowledge', 5), application: Number(existing.application) || 0, verification: Number(existing.verification) || 0, risk: Number(existing.risk) || 0 };
      const safetyGatePassed = action.safetyGatePassed !== false;
      const mastery = calculateMastery(dimensions, safetyGatePassed);
      const streak = action.correct ? (existing.streak || 0) + 1 : 0;
      const correctAttempts = action.correct ? (existing.correctAttempts || 0) + 1 : (existing.correctAttempts || 0);
      const principleBonus = action.principleCorrect ? 5 : 0;
      if (principleBonus) { dimensions.verification = Math.min(100, dimensions.verification + principleBonus); }
      return {
        ...state,
        progress: updateSkill(state.progress, action.skillId, { ...dimensions, mastery: mastery.score, mastered: action.correct && mastery.mastered, explored: true, streak, correctAttempts, safetyGatePassed, lastPractised: now.toISOString(), nextReview: nextReviewDate(streak, now) }),
        assessmentResult: { kind: 'skill', correct: action.correct, safetyGatePassed, principleCorrect: action.principleCorrect }
      };
    }
    case 'CLEAR_SKILL_ASSESSMENT': return { ...state, assessmentResult: null, assessmentStep: 0, assessmentChoice: null, assessmentPrinciple: null, assessmentShown: false };
    case 'ANSWER_DECISION': return { ...state, assessmentResult: { kind: action.kind, correct: action.correct, rationale: action.rationale } };
    case 'NEXT_DECISION': {
      const key = action.kind === 'case' ? 'caseIndex' : action.kind === 'incident' ? 'incidentIndex' : 'bossIndex';
      const length = action.kind === 'case' ? CASES.length : action.kind === 'incident' ? INCIDENTS.length : BOSSES.length;
      return { ...state, [key]: (state[key] + 1) % length, assessmentResult: null };
    }
    case 'SELECT_BOSS': return { ...state, bossIndex: Math.max(0, Math.min(8, Number(action.index) || 0)), assessmentResult: null };
    case 'SELECT_PROCESS': return Object.hasOwn(PROCESS_STEPS, action.process) ? { ...state, process: action.process, processStep: 0 } : state;
    case 'SELECT_PROCESS_STEP': return { ...state, processStep: Math.max(0, Number(action.index) || 0) };
    case 'PROMPT_RESULT': return { ...state, promptDraft: action.prompt, promptResult: action.result };
    case 'IMPORT_STATE': return { ...createInitialState(action.value), toast: 'import-ok' };
    case 'RESET': return { ...createInitialState(), toast: 'reset-ok' };
    case 'CLEAR_TOAST': return { ...state, toast: '' };
    default: return state;
  }
}

export function serializeProgress(state, exportedAt = new Date().toISOString()) {
  const progress = {};
  for (const [skillId, record] of Object.entries(state.progress || {})) {
    if (!/^SYN-SK-L[0-8]-0[1-8]$/.test(skillId) || !record || typeof record !== 'object') continue;
    progress[skillId] = Object.fromEntries(Object.entries(record).filter(([key, value]) =>
      ['knowledge', 'application', 'verification', 'risk', 'mastery', 'mastered', 'explored', 'streak', 'correctAttempts', 'safetyGatePassed', 'lastPractised', 'nextReview'].includes(key)
      && ['number', 'boolean', 'string'].includes(typeof value)));
  }
  return {
    schemaVersion: 1, classification: 'synthetic-progress',
    locale: state.locale, track: state.track, progress,
    settings: {
      diagnosticCompleted: Boolean(state.diagnosticCompleted),
      diagnosticScore: Number(state.diagnosticScore) || 0,
      recommendedLevel: Number(state.recommendedLevel) || 0,
      selectedSkillId: state.selectedSkillId
    },
    exportedAt
  };
}

function t(state, key) { return escapeHtml(translate(state.locale, key)); }
function local(value, locale) { return escapeHtml(trNode(value, locale)); }

function navButton(state, view, key) {
  const selected = state.view === view;
  return `<button type="button" class="btn${selected ? ' btn-primary' : ''}" data-action="nav" data-view="${view}" aria-pressed="${selected}">${t(state, key)}</button>`;
}

// ─── Diagramas SVG por arquetipo ─────────────────────────────────────────────
function svgDiagram(diagram, locale) {
  if (!diagram) return '';
  const nodes = diagram.n || [];
  const kind = diagram.k;
  const cap = local(diagram.cap, locale);
  const theme = { stroke: 'var(--sbl-accent, #4aa3ff)', dim: 'var(--sbl-dim, #8a93a6)' };
  const box = (x, y, w, h, title, sub, hl) => `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${hl ? 'rgba(74,163,255,0.16)' : 'rgba(255,255,255,0.05)'}" stroke="${hl ? theme.stroke : 'rgba(255,255,255,0.22)'}"/>
    <text x="${x + w / 2}" y="${y + h / 2 - 6}" text-anchor="middle" font-size="13" font-weight="600" fill="var(--sbl-ink, #e8edf7)">${escapeHtml(title)}</text>
    ${sub ? `<text x="${x + w / 2}" y="${y + h / 2 + 12}" text-anchor="middle" font-size="10.5" fill="${theme.dim}">${escapeHtml(sub)}</text>` : ''}`;
  const arrow = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${theme.stroke}" stroke-width="1.6" marker-end="url(#sblArrow)"/>`;
  let body = '';
  if (kind === 'chain') {
    const n = Math.min(nodes.length, 5), w = 128, gap = 34, x0 = 18, y = 30;
    body = nodes.slice(0, n).map((node, i) => box(x0 + i * (w + gap), y, w, 54, local(node.t, locale), local(node.s, locale), i === 0)).join('')
      + nodes.slice(0, n - 1).map((_, i) => arrow(x0 + i * (w + gap) + w + 3, y + 27, x0 + (i + 1) * (w + gap) - 4, y + 27)).join('');
    return wrap(140 + 0, n * (w + gap) + 20, cap, body);
  }
  if (kind === 'tree') {
    const n = Math.min(nodes.length, 4), w = 130, y0 = 22, cx = 300;
    body = box(cx - w / 2, y0, w, 46, local(nodes[0].t, locale), local(nodes[0].s, locale), true)
      + nodes.slice(1, n).map((node, i) => {
        const x = 24 + i * (150), y = y0 + 84;
        return arrow(cx, y0 + 46 + 2, x + w / 2, y - 3) + box(x, y, w, 46, local(node.t, locale), local(node.s, locale));
      }).join('');
    return wrap(160, 640, cap, body);
  }
  if (kind === 'hub') {
    const cx = 300, cy = 84, r = 44;
    body = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(74,163,255,0.16)" stroke="${theme.stroke}" stroke-width="1.6"/>
      <text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="12.5" font-weight="700" fill="var(--sbl-ink, #e8edf7)">${local(nodes[nodes.length - 1]?.t || nodes[0].t, locale)}</text>
      <text x="${cx}" y="${cy + 15}" text-anchor="middle" font-size="10" fill="${theme.dim}">${local(nodes[nodes.length - 1]?.s || '', locale)}</text>`
      + nodes.slice(0, 4).map((node, i) => {
        const angle = (Math.PI * 2 * i) / Math.min(nodes.length - 1, 4) - Math.PI / 2;
        const x = cx + Math.cos(angle) * 175 - 60, y = cy + Math.sin(angle) * 74 - 20;
        return `<line x1="${cx + Math.cos(angle) * (r + 3)}" y1="${cy + Math.sin(angle) * (r + 3)}" x2="${x + 60}" y2="${y + 20}" stroke="rgba(74,163,255,0.5)" stroke-width="1.3"/>` + box(x, y, 120, 42, local(node.t, locale), local(node.s, locale));
      }).join('');
    return wrap(190, 600, cap, body);
  }
  if (kind === 'timeline') {
    const n = Math.min(nodes.length, 4), w = 132, y = 62;
    body = `<line x1="18" y1="${y}" x2="${18 + n * (w + 26)}" y2="${y}" stroke="rgba(74,163,255,0.45)" stroke-width="2"/>`
      + nodes.slice(0, n).map((node, i) => {
        const x = 18 + i * (w + 26) + (w - 24) / 2;
        return `<circle cx="${x + 12}" cy="${y}" r="7" fill="var(--sbl-accent, #4aa3ff)"/>` + box(18 + i * (w + 26), y + 18, w, 50, local(node.t, locale), local(node.s, locale), i === n - 1);
      }).join('');
    return wrap(140, 18 + n * (w + 26) + 10, cap, body);
  }
  if (kind === 'layers') {
    const n = Math.min(nodes.length, 4), h = 40, gap = 12, y0 = 20;
    body = nodes.slice(0, n).map((node, i) => {
      const w = 480 - i * 60, x = (600 - w) / 2;
      return box(x, y0 + i * (h + gap), w, h, local(node.t, locale), local(node.s, locale), i === n - 1);
    }).join('');
    return wrap(y0 + n * (h + gap) + 10, 600, cap, body);
  }
  if (kind === 'matrix') {
    const n = Math.min(nodes.length, 4), w = 136, h = 52;
    body = nodes.slice(0, n).map((node, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      return box(30 + col * (w + 16), 20 + row * (h + 14), w, h, local(node.t, locale), local(node.s, locale), row === 0 && col === 0);
    }).join('');
    const rows = Math.ceil(n / 2);
    return wrap(20 + rows * (h + 14) + 8, 600, cap, body);
  }
  if (kind === 'split') {
    const n = Math.min(nodes.length, 3), w = 158;
    body = box(600 / 2 - w / 2, 18, w, 44, local(nodes[0].t, locale), local(nodes[0].s, locale), true)
      + nodes.slice(1, n).map((node, i) => {
        const x = 40 + i * 190, y = 96;
        return arrow(300, 62, x + w / 2, y - 3) + box(x, y, w, 44, local(node.t, locale), local(node.s, locale));
      }).join('');
    return wrap(150, 600, cap, body);
  }
  if (kind === 'gauge') {
    const n = Math.min(nodes.length, 4);
    body = `<line x1="30" y1="52" x2="570" y2="52" stroke="rgba(255,255,255,0.14)" stroke-width="8" stroke-linecap="round" stroke-dasharray="2 10"/>`
      + nodes.slice(0, n).map((node, i) => {
        const x = 60 + i * 160;
        const last = i === n - 1;
        return `<circle cx="${x}" cy="52" r="${last ? 10 : 7}" fill="${last ? 'var(--sbl-gold, #ffc857)' : 'var(--sbl-accent, #4aa3ff)'}"/>`
          + `<text x="${x}" y="30" text-anchor="middle" font-size="11.5" font-weight="600" fill="var(--sbl-ink, #e8edf7)">${local(node.t, locale)}</text>`
          + `<text x="${x}" y="80" text-anchor="middle" font-size="10" fill="${theme.dim}">${local(node.s, locale)}</text>`;
      }).join('');
    return wrap(100, 600, cap, body);
  }
  return '';
}
function wrap(h, w, cap, body) {
  return `<figure class="sbl-diagram" role="img" aria-label="${escapeHtml(cap)}"><svg viewBox="0 0 ${Math.max(w, 320)} ${h + 14}" preserveAspectRatio="xMidYMin meet"><defs><marker id="sblArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--sbl-accent, #4aa3ff)"/></marker></defs>${body}</svg><figcaption>${escapeHtml(cap)}</figcaption></figure>`;
}

// ─── Radar de dominio (4 dimensiones) ────────────────────────────────────────
function svgRadar(record, state) {
  const dims = [['knowledge', 'dimensionKnowledge'], ['application', 'dimensionApplication'], ['verification', 'dimensionVerification'], ['risk', 'dimensionRisk']];
  const cx = 84, cy = 80, R = 58;
  const pt = (i, r) => { const a = (Math.PI * 2 * i) / 4 - Math.PI / 2; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; };
  const rings = [0.33, 0.66, 1].map(f => `<polygon points="${dims.map((_, i) => pt(i, R * f).join(',')).join(' ')}" fill="none" stroke="rgba(255,255,255,0.14)"/>`).join('');
  const spokes = dims.map((_, i) => { const [x, y] = pt(i, R); return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="rgba(255,255,255,0.14)"/>`; }).join('');
  const vals = dims.map(([f]) => Math.max(0, Math.min(100, Number(record?.[f]) || 0)) / 100);
  const poly = `<polygon points="${vals.map((v, i) => pt(i, R * v).join(',')).join(' ')}" fill="rgba(74,163,255,0.28)" stroke="var(--sbl-accent, #4aa3ff)" stroke-width="1.8"/>`;
  const labels = dims.map(([f, key], i) => { const [x, y] = pt(i, R + 17); return `<text x="${x}" y="${y}" text-anchor="middle" font-size="9.5" fill="var(--sbl-dim, #8a93a6)">${escapeHtml(translate(state.locale, key).slice(0, 12))}</text>`; }).join('');
  return `<svg class="sbl-radar" viewBox="0 0 168 164" role="img" aria-label="${t(state, 'radarLabel')}">${rings}${spokes}${poly}${labels}</svg>`;
}

// ─── Heatmap de dominio por nivel ────────────────────────────────────────────
function renderHeatmap(state) {
  const cells = LEVELS.map(level => {
    const levelSkills = SKILLS.filter(s => s.level === level.id);
    const mastered = levelSkills.filter(s => state.progress[s.id]?.mastered).length;
    const pct = Math.round((mastered / levelSkills.length) * 100);
    const heat = pct === 0 ? ' sbl-heat-0' : pct < 34 ? ' sbl-heat-1' : pct < 67 ? ' sbl-heat-2' : pct < 100 ? ' sbl-heat-3' : ' sbl-heat-4';
    return `<button type="button" class="sbl-heat-cell${heat}" data-action="set-level-filter" data-value="${level.id}" title="${local(level.title, state.locale)}: ${pct}%" aria-label="${local(level.title, state.locale)} ${pct}%"><span class="sbl-heat-num">${pct}</span><span class="sbl-heat-lab text-small">${local(level.title, state.locale).slice(0, 14)}</span></button>`;
  }).join('');
  return `<section class="sbl-stack" aria-labelledby="heat-title"><h2 id="heat-title">${t(state, 'heatmapLabel')}</h2><div class="sbl-heatmap">${cells}</div></section>`;
}

function renderChrome(state) {
  return `<div class="sbl-stack">
    <div class="sbl-topline">
      <div class="sbl-statusline"><span class="viz-badge">${t(state, 'noNetwork')}</span><span class="text-small">${t(state, 'syntheticNotice')}</span></div>
      <div class="viz-controls">
        <label class="form-label">${t(state, 'language')}<select class="form-select" data-action="locale">
          <option value="es"${state.locale === 'es' ? ' selected' : ''}>Español</option><option value="en"${state.locale === 'en' ? ' selected' : ''}>English</option><option value="de"${state.locale === 'de' ? ' selected' : ''}>Deutsch</option>
        </select></label>
        <label class="form-label">${t(state, 'track')}<select class="form-select" data-action="track">
          <option value="functional"${state.track === 'functional' ? ' selected' : ''}>${t(state, 'trackFunctional')}</option>
          <option value="technical"${state.track === 'technical' ? ' selected' : ''}>${t(state, 'trackTechnical')}</option>
          <option value="dual"${state.track === 'dual' ? ' selected' : ''}>${t(state, 'trackDual')}</option>
        </select></label>
      </div>
    </div>
    <nav class="sbl-nav" aria-label="${escapeHtml(I18N[state.locale].appLabel)}">
      ${navButton(state, 'home', 'navHome')}${navButton(state, 'career', 'navCareer')}${navButton(state, 'map', 'navMap')}${navButton(state, 'cases', 'navCases')}${navButton(state, 'incidents', 'navIncidents')}${navButton(state, 'simulator', 'navSimulator')}${navButton(state, 'ai', 'navAI')}${navButton(state, 'evidence', 'navEvidence')}
    </nav>`;
}

function renderFeedback(state, entry) {
  if (!state.assessmentResult) return '';
  const correct = state.assessmentResult.correct;
  return `<div class="sbl-answer-feedback" data-correct="${correct}"><strong>${correct ? t(state, 'correct') : t(state, 'incorrect')}</strong><p>${local(entry.rationale, state.locale)}</p></div>`;
}

function renderSeniorPanel(state, entry) {
  const steps = entry.seniorSteps || [];
  if (!steps.length) return '';
  const items = steps.map((s, i) => `<li><span class="sbl-step-n">${i + 1}</span><span>${local(s, state.locale)}</span></li>`).join('');
  return `<div class="sbl-senior"><h4>${t(state, 'seniorLabel')}</h4><ol class="sbl-steps">${items}</ol></div>`;
}

function renderDistractorPanel(state, entry) {
  const dw = entry.distractorWhy;
  if (!dw || !Array.isArray(dw.es)) return '';
  const items = (dw[state.locale] || dw.es).map((txt, i) => `<li>${escapeHtml(txt)}</li>`).join('');
  return `<div class="sbl-distractors"><h4>${t(state, 'whyOptions')}</h4><ul>${items}</ul></div>`;
}

function renderDecision(state, entry, kind) {
  const answered = state.assessmentResult?.kind === kind;
  return `<section class="card sbl-stack" aria-labelledby="decision-title">
    <div class="sbl-card-head"><span class="viz-badge">${escapeHtml(entry.id)}</span><span class="text-small">${t(state, 'level')} ${entry.level}</span></div>
    <h2 id="decision-title">${local(entry.prompt, state.locale)}</h2>
    <p class="text-muted">${t(state, 'choose')}</p>
    <div class="sbl-choice-list">${trList(entry.optionsText, state.locale).map((option, index) => `<button type="button" class="btn${index === entry.correct && answered ? ' btn-primary' : ''}" data-action="answer-decision" data-kind="${kind}" data-correct="${index === entry.correct}" data-rationale="${escapeHtml(trNode(entry.rationale, state.locale))}"${answered ? ' disabled' : ''}>${escapeHtml(option)}</button>`).join('')}</div>
    ${answered ? renderFeedback(state, entry) : ''}
    ${answered ? renderSeniorPanel(state, entry) : ''}
    ${answered ? renderDistractorPanel(state, entry) : ''}
    ${answered ? `<div class="sbl-actions"><button type="button" class="btn btn-primary" data-action="next-decision" data-kind="${kind}">${t(state, 'next')}</button></div>` : ''}
  </section>`;
}

function renderDiagnostic(state) {
  const entry = DIAGNOSTIC[state.diagnosticIndex];
  const answered = Boolean(state.diagnosticFeedback);
  const percent = Math.round((state.diagnosticIndex / DIAGNOSTIC.length) * 100);
  return `<section class="card sbl-stack" aria-labelledby="diagnostic-title">
    <div><span class="viz-badge">${t(state, 'question')} ${state.diagnosticIndex + 1}/${DIAGNOSTIC.length}</span></div>
    <h2 id="diagnostic-title">${t(state, 'diagnosticTitle')}</h2><p>${t(state, 'diagnosticIntro')}</p>
    <div class="sbl-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><div class="sbl-progress-fill" style="width:${percent}%"></div></div>
    <h3>${local(entry.prompt, state.locale)}</h3>
    <div class="sbl-choice-list">${trList(entry.optionsText, state.locale).map((option, index) => `<button type="button" class="btn" data-action="answer-diagnostic" data-correct="${index === entry.correct}"${answered ? ' disabled' : ''}>${escapeHtml(option)}</button>`).join('')}</div>
    ${answered ? `<div class="sbl-answer-feedback" data-correct="${state.diagnosticFeedback.correct}"><strong>${state.diagnosticFeedback.correct ? t(state, 'correct') : t(state, 'incorrect')}</strong><p>${local(entry.rationale, state.locale)}</p></div><button type="button" class="btn btn-primary" data-action="next-diagnostic">${state.diagnosticIndex === DIAGNOSTIC.length - 1 ? t(state, 'finish') : t(state, 'next')}</button>` : ''}
  </section>`;
}

function progressStats(state) {
  const records = Object.values(state.progress);
  const explored = records.filter(record => record.explored).length;
  const mastered = records.filter(record => record.mastered).length;
  const due = records.filter(record => record.nextReview && new Date(record.nextReview) <= new Date()).length;
  return { explored, mastered, due, percent: Math.round((mastered / SKILLS.length) * 100) };
}

function renderHome(state) {
  const stats = progressStats(state);
  const nextSkill = recommendNext(SKILLS, state.progress, new Date(), { track: state.track, recommendedLevel: state.recommendedLevel }) || SKILLS[0];
  const byTrack = trackId => SKILLS.filter(s => s.track === trackId || s.track === 'dual');
  const trackPct = list => Math.round(list.filter(s => state.progress[s.id]?.mastered).length / Math.max(1, list.length) * 100);
  const funcPct = trackPct(byTrack('functional'));
  const techPct = trackPct(byTrack('dual').concat(byTrack('technical')));
  return `<div class="sbl-stack">
    <section class="sbl-cover">
      <span class="sbl-kicker">${t(state, 'kicker')}</span>
      <h1>${t(state, 'coverTitle')}</h1>
      <p class="sbl-sub">${t(state, 'coverSub')}</p>
      <span class="sbl-rule-orn" aria-hidden="true">❦</span>
      <div class="viz-grid">
        <div class="card viz-stat"><span class="text-muted">${t(state, 'mastery')}</span><span class="viz-stat-value">${stats.percent}%</span><span class="text-small">${stats.mastered}/72</span></div>
        <div class="card viz-stat"><span class="text-muted">${t(state, 'skillsExplored')}</span><span class="viz-stat-value">${stats.explored}</span><span class="text-small">72</span></div>
        <div class="card viz-stat"><span class="text-muted">${state.locale === 'de' ? 'Funktionale Spur' : state.locale === 'en' ? 'Functional track' : 'Ruta funcional'}</span><span class="viz-stat-value">${funcPct}%</span><span class="text-small">L0-L5</span></div>
        <div class="card viz-stat"><span class="text-muted">${t(state, 'techTrackLabel')}</span><span class="viz-stat-value">${techPct}%</span><span class="text-small">L6-L8</span></div>
      </div>
      <div class="sbl-actions">
        <button type="button" class="btn btn-primary" data-action="select-skill" data-skill="${nextSkill.id}">${t(state, 'begin')} · ${local(nextSkill.title, state.locale)}</button>
        <button type="button" class="btn" data-action="nav" data-view="ai">${state.locale === 'de' ? 'Erweiterte Konsole öffnen' : state.locale === 'en' ? 'Open advanced console' : 'Abrir consola avanzada'}</button>
      </div>
    </section>
    ${renderHeatmap(state)}
    ${renderLevelBars(state)}
  </div>`;
}

function renderLevelBars(state) {
  return `<section class="card sbl-stack" aria-labelledby="lvl-bars">
    <h2 id="lvl-bars">${state.locale === 'de' ? 'Fortschritt nach Niveau' : state.locale === 'en' ? 'Progress by level' : 'Progreso por nivel'}</h2>
    <div class="csl-levelbars">${LEVELS.map(level => {
      const list = SKILLS.filter(s => s.level === level.id);
      const pct = Math.round(list.filter(s => state.progress[s.id]?.mastered).length / Math.max(1, list.length) * 100);
      return `<div class="csl-lvlrow"><span class="csl-lvlname">L${level.id} · ${local(level.title, state.locale)}</span><div class="csl-lvltrack"><div class="csl-lvlfill" style="width:${pct}%"></div></div><span class="csl-lvlpct">${pct}%</span></div>`;
    }).join('')}</div>
  </section>`;
}
function skillStatus(state, skill) {
  const record = state.progress[skill.id];
  if (record?.mastered) return t(state, 'masteredStatus');
  if (record?.explored) return t(state, 'learningStatus');
  return t(state, 'newStatus');
}


// —— Masterclass: pantalla B1 real + configuración + E2E + war story + best practices ——
function renderMasterclass(state, skill) {
  const mc = MASTERCLASS[skill.id];
  if (!mc) return '';
  const L = state.locale;
  const loc = v => trNode(v, L);
  const screen = b1Window(mc.screen, L);
  const cfg = (mc.cfg || []).map(c => `<li>${escapeHtml(loc(c))}</li>`).join('');
  const e2e = (mc.e2e || []).map(step => `<li>${escapeHtml(loc(step))}</li>`).join('');
  const bp = (mc.bp || []).map(b => `<li>${escapeHtml(loc(b))}</li>`).join('');
  const war = mc.war;
  const warHtml = war ? `<div class="sbl-war" data-correct="false">
    <h4>⚠️ ${escapeHtml(loc(war.q))}</h4>
    <p class="war-line"><strong>${t(state, 'warSymptom')}</strong> ${(war.sympt || []).map(x => escapeHtml(loc(x))).join(' ')}</p>
    <p class="war-line"><strong>${t(state, 'warRootCause')}</strong> ${(war.root || []).map(x => escapeHtml(loc(x))).join(' ')}</p>
    <p class="war-line"><strong>${t(state, 'warResolution')}</strong> ${(war.fix || []).map(x => escapeHtml(loc(x))).join(' ')}</p>
  </div>` : '';
  return `<section class="sbl-masterclass" aria-label="${t(state, 'mcTitle')}">
    <h3 class="mc-title">🎓 ${t(state, 'mcTitle')}</h3>
    ${screen}
    <div class="mc-grid">
      <div class="mc-block"><h4>⚙️ ${t(state, 'mcConfig')}</h4><ul>${cfg}</ul></div>
      <div class="mc-block"><h4>🔗 ${t(state, 'mcE2E')}</h4><ol>${e2e}</ol></div>
    </div>
    ${warHtml}
    <div class="mc-block mc-bp"><h4>🏆 ${t(state, 'mcBestPractices')}</h4><ul>${bp}</ul></div>
  </section>`;
}

function renderLearnMode(state, skill) {
  const record = state.progress[skill.id] || {};
  const tips = trList(skill.tips, state.locale).map(tip => `<li>${escapeHtml(tip)}</li>`).join('');
  const steps = (skill.verifySteps || []).map((s, i) => `<li><span class="sbl-step-n">${i + 1}</span><span>${local(s, state.locale)}</span></li>`).join('');
  const an = skill.anchor;
  const pathHtml = (skill.path || []).length ? `<div class="sbl-detail-grid__full"><h4>${t(state, 'pathLabel')}</h4><div class="sbl-path">${skill.path.map((crumb, i) => `${i ? '<span class="sep">›</span>' : ''}<span class="crumb">${escapeHtml(trText(crumb, state.locale))}</span>`).join('')}</div></div>` : '';
  const ex = skill.example;
  const exHtml = ex ? `<div class="sbl-example"><h4>${t(state, 'exampleLabel')}</h4><p><strong>${escapeHtml(trNode(ex.q, state.locale))}</strong></p><pre class="sbl-figure">${(ex.show || []).map(l => escapeHtml(trText(l, state.locale))).join('\n')}</pre>${ex.a ? `<p class="text-small"><em>${escapeHtml(trNode(ex.a, state.locale))}</em></p>` : ''}</div>` : '';
  const anHtml = an ? `<div class="sbl-anchor"><h4>${t(state, 'anchorLabel')}</h4><span class="glyph" aria-hidden="true">${an.g}</span><p><em>${local(an, state.locale)}</em></p></div>` : '';
  return `<div class="sbl-learn">
    ${anHtml}
    ${renderMasterclass(state, skill)}
    ${pathHtml}
    <div class="sbl-detail-grid">
      <section><h3>${t(state, 'mindsetLabel')}</h3><p class="sbl-mindset">${local(skill.mindset, state.locale)}</p></section>
      <section><h3>${t(state, 'concept')}</h3><p>${local(skill.concept, state.locale)}</p></section>
      <section><h3>${t(state, 'objective')}</h3><p>${local(skill.objective, state.locale)}</p></section>
      <section><h3>${t(state, 'practice')}</h3><p>${local(skill.practice, state.locale)}</p></section>
    </div>
    ${exHtml}
    <div class="sbl-tips"><h4>${t(state, 'tipsLabel')}</h4><ul>${tips}</ul></div>
    <div class="sbl-answer-feedback" data-correct="false"><strong>${t(state, 'pitfallLabel')}</strong><p>${local(skill.pitfall, state.locale)}</p></div>
    <div class="sbl-checklist"><h4>${t(state, 'checklistLabel')}</h4><ol class="sbl-steps">${steps}</ol></div>
    <div class="sbl-actions">
      <button type="button" class="btn" data-action="practise-skill" data-skill="${skill.id}">${t(state, 'markPractice')}</button>
      <button type="button" class="btn btn-primary" data-action="set-skill-mode" data-mode="prove">${t(state, 'proveSkill')}</button>
    </div>
    <div class="sbl-radar-row">${svgRadar(record, state)}<div class="sbl-stack"><span class="viz-badge">${skillStatus(state, skill)} · ${record.mastery || 0}%</span><span class="text-small">${local(LEVELS[skill.level].title, state.locale)}</span></div></div>
  </div>`;
}

function activityInstructions(type, locale) {
  const all = {
    simulator:{es:'Completa los campos editables de la ventana. No memorices: interpreta el documento.',en:'Complete the editable fields. Interpret the document; do not guess.',de:'Fülle die bearbeitbaren Felder aus. Interpretiere den Beleg.'},
    bughunt:{es:'Audita la evidencia y marca únicamente la anomalía que explica el incidente.',en:'Audit the evidence and mark only the anomaly that explains the incident.',de:'Prüfe die Evidenz und markiere nur die ursächliche Anomalie.'},
    journal:{es:'Construye el asiento: asigna Debe/Haber e importe. El total debe cuadrar.',en:'Build the journal: assign Debit/Credit and amount. Totals must balance.',de:'Erstelle den Buchungssatz: Soll/Haben und Betrag. Summen müssen stimmen.'},
    forensic:{es:'Sigue la cadena documental y señala exactamente el eslabón roto.',en:'Trace the document chain and identify the exact broken link.',de:'Verfolge die Belegkette und finde das gebrochene Glied.'},
    consequence:{es:'Ordena la cascada real: causa → impacto → respuesta segura.',en:'Order the real cascade: cause → impact → safe response.',de:'Ordne die Kaskade: Ursache → Auswirkung → sichere Reaktion.'},
    config:{es:'Construye la ruta exacta de configuración. Sobran opciones.',en:'Build the exact configuration path. Some options are decoys.',de:'Baue den exakten Konfigurationspfad. Einige Optionen sind Ablenkungen.'}
  };
  return all[type]?.[locale] || all[type]?.es || '';
}

function renderActivityBody(state, activity) {
  const A = state.activityAnswers || {};
  if (activity.type === 'simulator') return `<div class="act-form">${activity.targets.map((f,i)=>`<label><strong>${escapeHtml(f.label)}</strong><select class="form-select" data-activity-input="sim-${i}"><option value="">${t(state, 'actSelect')}</option>${f.options.map(v=>`<option value="${escapeHtml(v)}"${A[`sim-${i}`]===v?' selected':''}>${escapeHtml(v)}</option>`).join('')}</select></label>`).join('')}</div>`;
  if (activity.type === 'bughunt') return `<div class="act-evidence">${activity.clues.map((c,i)=>`<button type="button" class="act-clue${A[`clue-${i}`]?' is-marked':''}" data-action="activity-toggle" data-key="clue-${i}"><span>${A[`clue-${i}`]?'⚑':'○'}</span>${escapeHtml(c.label)}</button>`).join('')}</div>`;
  if (activity.type === 'forensic') return `<div class="act-chain">${activity.evidence.map((e,i)=>`<button type="button" class="act-link${A.broken===String(i)?' is-marked':''}" data-action="activity-answer" data-key="broken" data-value="${i}"><span>${i+1}</span>${escapeHtml(e.label)}</button>`).join('<b>→</b>')}</div>`;
  if (activity.type === 'config') {
    const sequence = state.activitySequence || [];
    return `<div class="act-route-built">${sequence.length?sequence.map(x=>`<span>${escapeHtml(x)}</span>`).join('<b>›</b>'):`<em>${t(state, 'actRouteHere')}</em>`}</div><div class="act-token-bank">${activity.tokens.map(x=>`<button type="button" class="btn" data-action="activity-sequence" data-value="${escapeHtml(x)}"${sequence.includes(x)?' disabled':''}>${escapeHtml(x)}</button>`).join('')}</div><button type="button" class="btn btn-small" data-action="activity-undo">↶ ${t(state, 'actUndo')}</button>`;
  }
  if (activity.type === 'consequence') {
    const sequence = state.activitySequence || [];
    // Se usan los tokens que produce la capa de datos: barajados de forma
    // determinista y CON los señuelos de la skill. Antes esta línea era
    // `[...activity.chain].reverse()`, que descartaba ambas cosas y pintaba la
    // cadena exacta en orden inverso: el ejercicio se resolvía leyendo los
    // botones de derecha a izquierda, sin razonar la causalidad ni descartar un
    // señuelo. El defecto P0-6 estaba corregido en los datos y seguía vivo aquí.
    const tokens = activity.tokens || [...activity.chain].reverse();
    return `<div class="act-trigger"><strong>${t(state, 'actEventSeen')}</strong><p>${escapeHtml(activity.trigger)}</p></div><div class="act-route-built">${sequence.length?sequence.map((x,i)=>`<span><small>${i+1}</small>${escapeHtml(x)}</span>`).join('<b>→</b>'):`<em>${t(state, 'actBuildCascade')}</em>`}</div><div class="act-token-bank">${tokens.map(x=>`<button type="button" class="btn" data-action="activity-sequence" data-value="${escapeHtml(x)}"${sequence.includes(x)?' disabled':''}>${escapeHtml(x)}</button>`).join('')}</div><button type="button" class="btn btn-small" data-action="activity-undo">↶ ${t(state, 'actUndo')}</button>`;
  }
  if (activity.type === 'journal') {
    const amount = v => Number(String(v||'0').replace(/\./g,'').replace(',','.')) || 0;
    // Los lados se guardan y comparan con el texto del locale activo (Debe/Haber,
    // Debit/Credit, Soll/Haben): SET_LOCALE re-mapea las respuestas al cambiar idioma.
    const sides = journalSideTexts(state.locale);
    const debit = activity.lines.reduce((sum,_,i)=>sum+(journalSideKey(A[`side-${i}`])==='debit'?amount(A[`amount-${i}`]):0),0);
    const credit = activity.lines.reduce((sum,_,i)=>sum+(journalSideKey(A[`side-${i}`])==='credit'?amount(A[`amount-${i}`]):0),0);
    const balanced = debit>0 && Math.abs(debit-credit)<.005;
    return `<div class="act-journal"><div class="act-jhead"><span>${t(state, 'actAccount')}</span><span>${t(state, 'actSide')}</span><span>${t(state, 'actAmount')}</span></div>${activity.lines.map((line,i)=>`<div class="act-jline"><strong>${escapeHtml(trText(line[0], state.locale))}</strong><select class="form-select" data-activity-input="side-${i}"><option value="">—</option><option value="${sides.debit}"${journalSideKey(A[`side-${i}`])==='debit'?' selected':''}>${t(state, 'actDebit')}</option><option value="${sides.credit}"${journalSideKey(A[`side-${i}`])==='credit'?' selected':''}>${t(state, 'actCredit')}</option></select><input class="form-control" inputmode="decimal" data-activity-input="amount-${i}" value="${escapeHtml(A[`amount-${i}`]||'')}" placeholder="0,00"></div>`).join('')}<div class="act-balance${balanced?' is-balanced':''}">Σ ${t(state, 'actDebit')} <output>${debit.toFixed(2).replace('.',',')}</output> · Σ ${t(state, 'actCredit')} <output>${credit.toFixed(2).replace('.',',')}</output> · ${balanced?`✓ ${t(state, 'actBalanced')}`:`⚠ ${t(state, 'actDifference')} `+Math.abs(debit-credit).toFixed(2).replace('.',',')}</div><p class="act-account-notice">${t(state, 'accountNotice')}</p></div>`;
  }
  return '';
}

function renderProveMode(state, skill) {
  const activity = getActivity(skill, state.locale);
  const feedback = state.activityFeedback;
  const guided = state.skillMode === 'guided';
  const hints = state.activityHints || 0;
  const skillHints = asArrayHints(skill.assessment?.hints);
  if (activity.unavailable) return `<p>${t(state, 'actUnavailable')}</p>`;
  const briefHtml = activity.brief ? `<div class="act-brief">
    <div><strong>${t(state, 'actWhatIsThis')}</strong><span>${escapeHtml(activity.brief.what)}</span></div>
    <div><strong>${t(state, 'actYourTask')}</strong><span>${escapeHtml(activity.brief.task)}</span></div>
    <div><strong>${t(state, 'actGraded')}</strong><span>${escapeHtml(activity.brief.graded)}</span></div>
  </div>` : '';
  const guidedHtml = guided ? `<div class="act-guided"><strong>${t(state, 'actGuidedMode')}</strong><span>${t(state, 'actGuidedHelp')}</span>
    ${hints > 0 ? `<ol class="act-hints">${skillHints.slice(0, hints).map(h => `<li>${escapeHtml(localizeHint(h, state.locale))}</li>`).join('')}</ol>` : ''}</div>` : '';
  const detailsHtml = feedback?.details?.length ? `<ul class="act-details">${feedback.details.map(d => `<li class="${d.ok ? 'ok' : 'ko'}">${d.ok ? '✓' : '✗'} ${escapeHtml(trText(d.item, state.locale))}${d.ok ? '' : ` — <em>${t(state, 'actCorrectAnswer')}: ${escapeHtml(trText(String(d.expected), state.locale)).slice(0,60)}</em>`}</li>`).join('')}</ul>` : '';
  return `<section class="sbl-activity" data-activity-type="${activity.type}">
    <header class="act-head"><span class="act-icon">${{simulator:'⌨',bughunt:'⌖',journal:'⚖',forensic:'⌕',consequence:'⟿',config:'⚙'}[activity.type]}</span><div><span class="viz-badge">${escapeHtml(activity.label)}${guided ? ` · ${t(state, 'actGuidedTag')}` : ''}</span><h3>${local(skill.title,state.locale)}</h3></div></header>
    ${briefHtml}
    ${guidedHtml}
    ${activity.mc?.screen && ['simulator','bughunt','journal','forensic'].includes(activity.type) ? `<div class="act-screen">${b1Window(activity.mc.screen,state.locale)}</div>`:''}
    ${renderActivityBody(state,activity)}
    ${feedback?`<div class="act-feedback ${feedback.correct?'is-correct':'is-wrong'}"><strong>${feedback.correct?`✓ ${t(state, 'actSolved')}`:`↻ ${t(state, 'actNotYet')}`}</strong><p>${escapeHtml(feedback.message)}</p>${detailsHtml}</div>`:''}
    <div class="sbl-actions">
      <button type="button" class="btn btn-primary" data-action="check-activity">${t(state, 'actCheck')}</button>
      ${guided && skillHints.length && hints < skillHints.length ? `<button type="button" class="btn" data-action="activity-hint">💡 ${t(state, 'actHint')} (${hints}/${skillHints.length})</button>`:''}
      <button type="button" class="btn" data-action="reset-activity">${t(state, 'actReset')}</button>
    </div>
  </section>`;
}
function asArrayHints(v) { return Array.isArray(v) ? v : v ? [v] : []; }
function localizeHint(h, locale) { return trNode(h, locale); }
function renderSkillDetail(state, skill) {
  const record = state.progress[skill.id] || {};
  const mode = state.skillMode;
  return `<article class="card sbl-stack" aria-labelledby="skill-title">
    <div class="sbl-card-head"><span class="viz-badge">${escapeHtml(skill.id)}</span>
      <div class="sbl-mode-toggle" role="tablist">
        <button type="button" class="btn${mode === 'learn' ? ' btn-primary' : ''}" data-action="set-skill-mode" data-mode="learn" aria-pressed="${mode === 'learn'}">${t(state, 'learnMode')}</button>
        <button type="button" class="btn${mode === 'guided' ? ' btn-primary' : ''}" data-action="set-skill-mode" data-mode="guided" aria-pressed="${mode === 'guided'}">${t(state, 'guidedPractice')}</button>
        <button type="button" class="btn${mode === 'prove' ? ' btn-primary' : ''}" data-action="set-skill-mode" data-mode="prove" aria-pressed="${mode === 'prove'}">${t(state, 'proveSkill')}</button>
      </div></div>
    <h2 id="skill-title">${local(skill.title, state.locale)}</h2>
    ${mode === 'learn' ? renderLearnMode(state, skill) : renderProveMode(state, skill)}
  </article>`;
}

function renderMap(state) {
  const selected = SKILLS.find(skill => skill.id === state.selectedSkillId) || SKILLS[0];
  const filtered = SKILLS.filter(skill => (state.levelFilter === 'all' || String(skill.level) === String(state.levelFilter)) && (state.trackFilter === 'all' || skill.track === state.trackFilter || skill.track === 'dual'));
  return `<div class="sbl-stack">
    <div class="viz-controls">
      <label class="form-label">${t(state, 'level')}<select class="form-select" data-action="level-filter"><option value="all">${t(state, 'allLevels')}</option>${LEVELS.map(level => `<option value="${level.id}"${String(state.levelFilter) === String(level.id) ? ' selected' : ''}>${level.id} · ${local(level.title, state.locale)}</option>`).join('')}</select></label>
      <label class="form-label">${t(state, 'track')}<select class="form-select" data-action="track-filter"><option value="all">${t(state, 'allTracks')}</option><option value="functional"${state.trackFilter === 'functional' ? ' selected' : ''}>${t(state, 'trackFunctional')}</option><option value="technical"${state.trackFilter === 'technical' ? ' selected' : ''}>${t(state, 'trackTechnical')}</option><option value="dual"${state.trackFilter === 'dual' ? ' selected' : ''}>${t(state, 'trackDual')}</option></select></label>
    </div>
    <div class="sbl-levels">${LEVELS.filter(level => filtered.some(skill => skill.level === level.id)).map(level => `<section class="sbl-level-group" aria-labelledby="level-${level.id}"><div class="sbl-level-heading"><h2 id="level-${level.id}">${t(state, 'level')} ${level.id} · ${local(level.title, state.locale)}</h2><span class="text-small">${filtered.filter(skill => skill.level === level.id).length}/8</span></div><div class="viz-grid">${filtered.filter(skill => skill.level === level.id).map(skill => `<button type="button" class="btn viz-tile sbl-node${skill.id === selected.id ? ' is-selected' : ''}" data-action="select-skill" data-skill="${skill.id}" aria-pressed="${skill.id === selected.id}">${local(skill.title, state.locale)}<span class="sbl-node-meta text-small">${skillStatus(state, skill)}</span></button>`).join('')}</div></section>`).join('')}</div>
    ${renderSkillDetail(state, selected)}
  </div>`;
}

function renderSimulator(state) {
  const keys = ['sales', 'purchase', 'finance', 'integration'];
  const labelKeys = { sales: 'processSales', purchase: 'processPurchase', finance: 'processFinance', integration: 'processIntegration' };
  const steps = PROCESS_STEPS[state.process];
  const step = steps[state.processStep] || steps[0];
  const effectRow = (label, value) => `<div class="sbl-effect"><span class="text-small">${label}</span><strong>${local(value, state.locale)}</strong></div>`;
  return `<section class="sbl-stack" aria-labelledby="sim-title"><h2 id="sim-title">${t(state, 'simulatorTitle')}</h2><p class="text-muted">${t(state, 'chainExplorer')}</p><div class="sbl-toolbar">${keys.map(key => `<button type="button" class="btn${state.process === key ? ' btn-primary' : ''}" data-action="select-process" data-process="${key}" aria-pressed="${state.process === key}">${t(state, labelKeys[key])}</button>`).join('')}</div>
  <div class="sbl-process" role="list">${steps.map((item, index) => `<button type="button" class="btn sbl-process-stage" data-action="select-process-step" data-index="${index}" aria-current="${index === state.processStep ? 'step' : 'false'}"><span>${index + 1}. ${local(item.labels, state.locale)}</span><span class="sbl-process-mark" aria-hidden="true"></span></button>`).join('')}</div>
  <div class="card sbl-stack"><strong>${local(step.labels, state.locale)}</strong>
    <div class="sbl-checks">${trList(step.checks, state.locale).map(c => `<span class="viz-badge">${escapeHtml(c)}</span>`).join('')}</div>
    <div class="sbl-effects-grid">
      ${effectRow(t(state, 'effectStock'), step.effects.stock)}
      ${effectRow(t(state, 'effectAccounting'), step.effects.accounting)}
      ${effectRow(t(state, 'effectBalance'), step.effects.balance)}
    </div>
  </div></section>`;
}

function renderAI(state) {
  const result = state.promptResult;
  const defaults = {
    es: 'ROL: mentor de aprendizaje de SAP Business One\nOBJETIVO: Explicar una acción diagnóstica segura para SYN-CASE-AI-01\nCONTEXTO: Solo evidencia sintética\n',
    en: 'ROLE: SAP Business One learning coach\nGOAL: Explain a safe diagnostic action for SYN-CASE-AI-01\nCONTEXT: Synthetic evidence only\n',
    de: 'ROLLE: Lerncoach für SAP Business One\nZIEL: Eine sichere Diagnoseaktion für SYN-CASE-AI-01 erklären\nKONTEXT: Nur synthetische Nachweise\n'
  };
  const fieldKeys = { role: 'promptFieldRole', goal: 'promptFieldGoal', context: 'promptFieldContext', evidence: 'promptFieldEvidence', uncertainty: 'promptFieldUncertainty', output: 'promptFieldOutput', humanGate: 'promptFieldHumanGate', syntheticContext: 'promptFieldSyntheticContext' };
  const defaultPrompt = state.promptDraft || defaults[state.locale];
  const present = Array.isArray(result?.present) ? result.present : [];
  const fieldBar = (isOn, name) => `<span class="sbl-contract-cell${isOn ? ' is-on' : ''}">${t(state, fieldKeys[name] || name)}</span>`;
  return `<section class="sbl-stack" aria-labelledby="ai-title"><h2 id="ai-title">${t(state, 'aiTitle')}</h2><p>${t(state, 'promptHelp')}</p><label class="form-label" for="sbl-prompt">${t(state, 'promptLabel')}</label><textarea id="sbl-prompt" class="form-control" rows="9">${escapeHtml(defaultPrompt)}</textarea><div class="sbl-actions"><button type="button" class="btn btn-primary" data-action="analyze-prompt">${t(state, 'analyze')}</button></div>${result ? `<div class="card sbl-stack"><div class="sbl-card-head"><span class="sbl-score-ring" aria-label="${t(state, 'promptScore')} ${result.score}%">${result.score}%</span><span>${result.privacy.safe ? t(state, 'privacySafe') : t(state, 'privacyBlocked')}</span></div><div class="sbl-contract">${['role', 'goal', 'context', 'evidence', 'uncertainty', 'output', 'humanGate'].map(name => fieldBar(present.includes(name), name)).join('')}${fieldBar(present.includes('syntheticContext'), 'syntheticContext')}</div>${(result.missing || []).length ? `<p><strong>${t(state, 'missing')}:</strong> ${(result.missing || []).map(key => t(state, fieldKeys[key] || key)).join(', ')}</p>` : `<p>${t(state, 'correct')}</p>`}</div>` : ''}</section>`;
}

function renderReview(state) {
  const now = new Date();
  let queue = SKILLS.filter(skill => state.progress[skill.id]?.nextReview && new Date(state.progress[skill.id].nextReview) <= now);
  if (!queue.length) queue = SKILLS.filter(skill => state.progress[skill.id]?.explored && !state.progress[skill.id]?.mastered).slice(0, 5);
  return `<section class="sbl-stack" aria-labelledby="review-title"><h2 id="review-title">${t(state, 'reviewTitle')}</h2>${queue.length ? `<div class="sbl-review-list">${queue.map(skill => `<div class="card sbl-card-head"><div><strong>${local(skill.title, state.locale)}</strong><span class="sbl-node-meta text-small">${skillStatus(state, skill)}</span></div><button type="button" class="btn" data-action="select-skill" data-skill="${skill.id}">${t(state, 'begin')}</button></div>`).join('')}</div>` : `<p>${t(state, 'noReviews')}</p>`}</section>`;
}

function renderEvidence(state) {
  return `<section class="sbl-stack" aria-labelledby="evidence-title"><h2 id="evidence-title">${t(state, 'evidenceTitle')}</h2><div class="table-responsive"><table class="table table-sm"><thead><tr><th>${t(state, 'sourceOfficial')}</th><th>${t(state, 'applicability')}</th><th>${t(state, 'verifiedAt')}</th><th></th></tr></thead><tbody>${EVIDENCE.map(item => `<tr><td>${escapeHtml(item.title)}</td><td>${local(item.applicability, state.locale)}${item.quote ? `<blockquote class="ev-quote">“${escapeHtml(item.quote)}”</blockquote>` : ''}</td><td class="text-nowrap">${escapeHtml(item.verifiedAt)}</td><td><a class="btn" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">${t(state, 'openSource')}</a></td></tr>`).join('')}</tbody></table></div></section>`;
}

function renderConsole(state) {
  const tab = state.consoleTab || 'queries';
  const L = state.locale;
  const loc = v => trNode(v, L);
  const open = state.consoleOpen;
  const tabBtn = (id, label) => `<button type="button" class="btn${tab===id?' btn-primary':''}" data-action="console-tab" data-tab="${id}">${escapeHtml(label)}</button>`;
  let body = '';
  if (tab === 'queries') {
    const sel = ADVANCED_QUERIES.find(q => q.id === state.consoleQuery);
    if (sel) {
      body = `<article class="card sbl-stack csl-detail">
        <div class="csl-toprow"><button type="button" class="btn" data-action="console-close">← ${t(state, 'cslBack')}</button>
        <span class="viz-badge">${sel.engines.join(' · ')}</span></div>
        <h3>${escapeHtml(loc(sel.domain))}</h3>
        <p class="csl-ask">${escapeHtml(loc(sel.ask))}</p>
        <pre class="csl-sql"><code>${escapeHtml(sel.sql)}</code></pre>
        <div class="csl-why"><strong>${t(state, 'cslWhy')}</strong><p>${escapeHtml(loc(sel.why))}</p></div>
        <div class="csl-pitfall"><strong>⚠️ ${t(state, 'cslTrap')}</strong><p>${escapeHtml(loc(sel.pitfall))}</p></div>
      </article>`;
    } else {
      body = `<div class="csl-grid">${ADVANCED_QUERIES.map(q => `
        <button type="button" class="card csl-card" data-action="console-query" data-id="${q.id}">
          <span class="viz-badge">${q.engines.join(' · ')}</span>
          <strong>${escapeHtml(loc(q.domain))}</strong>
          <span class="text-small">${escapeHtml(loc(q.ask).slice(0,90))}…</span>
        </button>`).join('')}</div>`;
    }
  } else if (tab === 'dashboards') {
    body = DASHBOARD_PATTERNS.map(d => `
      <article class="card sbl-stack csl-panel">
        <button type="button" class="csl-toggle" data-action="console-toggle" data-id="${d.id}"><strong>${escapeHtml(loc(d.name))}</strong><span>${open===d.id?'−':'+'}</span></button>
        ${open===d.id?`<p class="csl-ask">${escapeHtml(loc(d.build))}</p><ol class="csl-steps">${d.how.map(h=>`<li>${escapeHtml(loc(h))}</li>`).join('')}</ol><div class="csl-why"><strong>${t(state, 'cslLevel')}</strong><p>${escapeHtml(loc(d.level))}</p></div>`:''}
      </article>`).join('');
  } else {
    body = VIBE_PATTERNS.map(v => `
      <article class="card sbl-stack csl-panel">
        <button type="button" class="csl-toggle" data-action="console-toggle" data-id="${v.id}"><strong>${escapeHtml(loc(v.name))}</strong><span>${open===v.id?'−':'+'}</span></button>
        ${open===v.id?`<p>${escapeHtml(loc(v.idea))}</p><pre class="csl-sql csl-prompt"><code>${escapeHtml(trText(v.template, L))}</code></pre><ul class="csl-check">${v.check.map(c=>`<li>☐ ${escapeHtml(trText(c, L))}</li>`).join('')}</ul>`:''}
      </article>`).join('');
  }
  return `<section class="sbl-console" aria-labelledby="console-title">
    <header class="csl-head"><h2 id="console-title">${t(state, 'navAI')}</h2>
    <p class="text-small">${t(state, 'cslSubtitle')}</p>
    <div class="csl-tabs">${tabBtn('queries',translate(L, 'cslQueries'))}${tabBtn('dashboards',translate(L, 'cslDashboards'))}${tabBtn('vibe',translate(L, 'cslVibecoding'))}</div></header>
    ${body}
  </section>`;
}

function renderCareer(state) {
  const L = state.locale;
  const loc = v => trNode(v, L);
  const mastered = SKILLS.filter(s => state.progress[s.id]?.mastered).length;
  const cp = careerProgress(mastered, L);
  const kpis = kpiSnapshot(mastered);
  const nextSkill = recommendNext(SKILLS, state.progress, new Date(), { track: state.track, recommendedLevel: state.recommendedLevel }) || SKILLS[0];
  const nextMc = MASTERCLASS[nextSkill.id];
  const ticket = nextMc ? getTicket(nextSkill, nextMc, L, LEVELS) : null;
  const roleUp = [...CAREER.roles].reverse().find(r => mastered < r.at);
  const nextRole = roleUp ? trNode(roleUp, L) : '';
  const nextAt = roleUp ? roleUp.at : 72;
  return `<section class="sbl-stack" aria-labelledby="career-title">
    <header class="cr-head">
      <div><span class="viz-badge">SAP BUSINESS ONE · CONSULTING CAREER MODE</span>
      <h2 id="career-title">${escapeHtml(loc(CAREER.company))}</h2>
      <p class="text-small">${escapeHtml(loc(CAREER.intro))}</p></div>
      <div class="cr-role">
        <span class="text-small">${t(state, 'crCurrentRole')}</span>
        <strong>${escapeHtml(cp.role)}</strong>
        <span class="text-small">${mastered}/72 · ${t(state, 'crNextRole')}: ${escapeHtml(nextRole)} ${t(state, 'crAt')} ${nextAt}</span>
      </div>
    </header>
    <div class="cr-kpis">${kpis.map(k => `<div class="card viz-stat"><span class="text-muted">${escapeHtml(loc(k.label))}</span><span class="viz-stat-value">${k.value}${k.unit}</span></div>`).join('')}</div>
    ${ticket ? `<section class="card cr-ticket">
      <header><span class="viz-badge">${t(state, 'crNextTicket')}</span><strong>${escapeHtml(ticket.id)} · ${escapeHtml(ticket.from)}</strong></header>
      <h3>${escapeHtml(ticket.subject)}</h3>
      <p>${escapeHtml(ticket.body)}</p>
      <div class="sbl-actions"><button type="button" class="btn btn-primary" data-action="select-skill" data-skill="${ticket.skillId}">${t(state, 'crWorkTicket')}</button></div>
    </section>` : ''}
    <section class="card sbl-stack">
      <h3>${t(state, 'crTicketLog')}</h3>
      <div class="cr-log">${SKILLS.filter(s => state.progress[s.id]?.mastered).slice(0, 30).reverse().map(s => {
        const mc = MASTERCLASS[s.id];
        const tk = mc ? getTicket(s, mc, L, LEVELS) : null;
        return tk ? `<div class="cr-log-row"><span class="cr-log-id">${tk.id}</span><span>${escapeHtml(tk.subject)}</span><span class="cr-log-ok">✓ ${t(state, 'crResolved')}</span></div>` : '';
      }).join('') || `<em>${t(state, 'crNoTickets')}</em>`}</div>
    </section>
  </section>`;
}

function renderView(state) {
  switch (state.view) {
    case 'career': return renderCareer(state);
    case 'map': return renderMap(state);
    case 'cases': return `<div class="sbl-stack"><h2>${t(state, 'caseLabTitle')}</h2>${renderDecision(state, CASES[state.caseIndex], 'case')}</div>`;
    case 'incidents': return `<div class="sbl-stack"><h2>${t(state, 'incidentTitle')}</h2>${renderDecision(state, INCIDENTS[state.incidentIndex], 'incident')}</div>`;
    case 'simulator': return renderSimulator(state);
    case 'ai': return renderConsole(state);
    case 'evidence': return renderEvidence(state);
    default: return renderHome(state);
  }
}

function toastText(state) {
  const map = { 'practice-recorded': 'markPractice', 'import-ok': 'importOk', 'reset-ok': 'resetConfirm', 'import-error': 'importError', 'export-ok': 'exportOk' };
  return state.toast ? `<div class="sbl-toast" role="status">${t(state, map[state.toast] || state.toast)}</div>` : '';
}

export function renderAppMarkup(state) {
  return `${renderChrome(state)}<main class="sbl-main">${toastText(state)}${renderView(state)}<div class="sbl-toolbar"><button type="button" class="btn btn-ghost" data-action="export-progress">${t(state, 'export')}</button><label class="form-label sbl-file">${t(state, 'import')}<input class="form-control" type="file" accept="application/json" data-action="import-progress"></label><button type="button" class="btn btn-ghost" data-action="reset-progress">${t(state, 'reset')}</button></div></main></div>`;
}

function loadStored() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!value) return createInitialState();
    const validation = validateProgressImport(value);
    if (!validation.valid) return createInitialState();
    return createInitialState({
      locale: value.locale, track: value.track, progress: value.progress,
      diagnosticCompleted: value.settings?.diagnosticCompleted,
      diagnosticScore: value.settings?.diagnosticScore,
      recommendedLevel: value.settings?.recommendedLevel,
      selectedSkillId: value.settings?.selectedSkillId
    });
  } catch { return createInitialState(); }
}

function saveStored(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeProgress(state))); } catch { /* local persistence is optional */ }
}

function downloadProgress(state) {
  const blob = new Blob([JSON.stringify(serializeProgress(state), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'sap-b1-mastery-progress-synthetic.json';
  anchor.click();
  URL.revokeObjectURL(url);
}

export function mountSapB1Lab(root) {
  if (!root) throw new Error('SAP B1 lab root is required');
  let state = loadStored();
  const render = () => {
    root.innerHTML = renderAppMarkup(state);
    root.setAttribute('lang', state.locale);
    if (globalThis.lucide?.createIcons) globalThis.lucide.createIcons({ attrs: { width: 16, height: 16 } });
  };
  const dispatch = action => { state = reduceState(state, action); saveStored(state); render(); };

  root.addEventListener('click', event => {
    const control = event.target.closest('[data-action]');
    if (!control || control.disabled) return;
    const action = control.dataset.action;
    if (action === 'nav') dispatch({ type: 'NAVIGATE', view: control.dataset.view });
    else if (action === 'select-skill') dispatch({ type: 'SELECT_SKILL', skillId: control.dataset.skill });
    else if (action === 'set-skill-mode') dispatch({ type: 'SET_SKILL_MODE', mode: control.dataset.mode });
    else if (action === 'console-tab') dispatch({ type: 'SET_CONSOLE_TAB', tab: control.dataset.tab });
    else if (action === 'console-query') dispatch({ type: 'OPEN_CONSOLE_QUERY', id: control.dataset.id });
    else if (action === 'console-close') dispatch({ type: 'CLOSE_CONSOLE_QUERY' });
    else if (action === 'console-toggle') dispatch({ type: 'TOGGLE_CONSOLE_CARD', id: control.dataset.id });
    else if (action === 'activity-toggle') dispatch({ type: 'ACTIVITY_TOGGLE', key: control.dataset.key });
    else if (action === 'activity-answer') dispatch({ type: 'ACTIVITY_ANSWER', key: control.dataset.key, value: control.dataset.value });
    else if (action === 'activity-sequence') dispatch({ type: 'ACTIVITY_SEQUENCE', value: control.dataset.value });
    else if (action === 'activity-undo') dispatch({ type: 'ACTIVITY_SEQUENCE_UNDO' });
    else if (action === 'reset-activity') dispatch({ type: 'RESET_ACTIVITY' });
    else if (action === 'check-activity') {
      const skill = SKILLS.find(s => s.id === state.selectedSkillId);
      if (!skill) return;
      const activity = getActivity(skill, state.locale);
      const result = validateActivityDetailed(activity, state.activityAnswers, state.activitySequence, state.locale);
      const passed = result.correct;
      dispatch({ type: 'ACTIVITY_FEEDBACK', correct: passed, message: passed ? (activity.resolution || translate(state.locale, 'actRightPrompt')) : translate(state.locale, 'actWrongPrompt'), details: result.details });
      if (passed && state.skillMode === 'prove' && state.activityFeedback?.correct !== true) dispatch({ type: 'ASSESS_SKILL', skillId: skill.id, correct: true, safetyGatePassed: true, principleCorrect: true });
    }
    else if (action === 'activity-hint') dispatch({ type: 'ACTIVITY_HINT' });
    else if (action === 'step-decide') dispatch({ type: 'ANSWER_STEP_DECIDE', index: Number(control.dataset.index) });
    else if (action === 'step-principle') dispatch({ type: 'ANSWER_STEP_PRINCIPLE', index: Number(control.dataset.index) });
    else if (action === 'reveal-reasoning') {
      const skillId = state.selectedSkillId;
      const skill = SKILLS.find(s => s.id === skillId);
      dispatch({ type: 'ASSESS_SKILL', skillId, correct: control.dataset.correct === 'true', safetyGatePassed: control.dataset.safety === 'true', principleCorrect: control.dataset.principle === 'true' });
      dispatch({ type: 'REVEAL_REASONING' });
    }
    else if (action === 'answer-diagnostic') dispatch({ type: 'ANSWER_DIAGNOSTIC', correct: control.dataset.correct === 'true' });
    else if (action === 'next-diagnostic') dispatch({ type: 'NEXT_DIAGNOSTIC' });
    else if (action === 'practise-skill') dispatch({ type: 'PRACTISE_SKILL', skillId: control.dataset.skill });
    else if (action === 'assess-skill') dispatch({ type: 'ASSESS_SKILL', skillId: control.dataset.skill, correct: control.dataset.correct === 'true', safetyGatePassed: control.dataset.safety === 'true' });
    else if (action === 'clear-skill-assessment') dispatch({ type: 'CLEAR_SKILL_ASSESSMENT' });
    else if (action === 'answer-decision') dispatch({ type: 'ANSWER_DECISION', kind: control.dataset.kind, correct: control.dataset.correct === 'true', rationale: control.dataset.rationale });
    else if (action === 'next-decision') dispatch({ type: 'NEXT_DECISION', kind: control.dataset.kind });
    else if (action === 'select-boss') dispatch({ type: 'SELECT_BOSS', index: control.dataset.index });
    else if (action === 'select-process') dispatch({ type: 'SELECT_PROCESS', process: control.dataset.process });
    else if (action === 'select-process-step') dispatch({ type: 'SELECT_PROCESS_STEP', index: control.dataset.index });
    else if (action === 'set-level-filter') dispatch({ type: 'SET_LEVEL_FILTER', value: control.dataset.value });
    else if (action === 'analyze-prompt') {
      const prompt = root.querySelector('#sbl-prompt')?.value || '';
      dispatch({ type: 'PROMPT_RESULT', prompt, result: lintPrompt(prompt) });
    } else if (action === 'export-progress') {
      downloadProgress(state); state = { ...state, toast: 'export-ok' }; render();
    } else if (action === 'reset-progress') {
      localStorage.removeItem(STORAGE_KEY); dispatch({ type: 'RESET' });
    }
  });

  root.addEventListener('change', event => {
    const direct = event.target;
    if (direct.dataset.activityInput) { dispatch({ type: 'ACTIVITY_ANSWER', key: direct.dataset.activityInput, value: direct.value }); return; }
    const control = event.target.closest('[data-action]');
    if (!control) return;
    if (control.dataset.action === 'locale') dispatch({ type: 'SET_LOCALE', locale: control.value });
    else if (control.dataset.action === 'track') dispatch({ type: 'SET_TRACK', track: control.value });
    else if (control.dataset.action === 'level-filter') dispatch({ type: 'SET_LEVEL_FILTER', value: control.value });
    else if (control.dataset.action === 'track-filter') dispatch({ type: 'SET_TRACK_FILTER', value: control.value });
    else if (control.dataset.action === 'import-progress' && control.files?.[0]) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        try {
          const value = JSON.parse(String(reader.result));
          const validation = validateProgressImport(value);
          if (!validation.valid) throw new Error(validation.reason);
          dispatch({ type: 'IMPORT_STATE', value: {
            locale: value.locale, track: value.track, progress: value.progress,
            diagnosticCompleted: value.settings?.diagnosticCompleted,
            diagnosticScore: value.settings?.diagnosticScore,
            recommendedLevel: value.settings?.recommendedLevel,
            selectedSkillId: value.settings?.selectedSkillId
          } });
        } catch { state = { ...state, toast: 'import-error' }; render(); }
      });
      reader.readAsText(control.files[0]);
    }
  });

  render();
  return { getState: () => structuredClone(state), dispatch };
}
