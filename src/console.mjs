// console.mjs — Consola avanzada: consultas interactivas + vibecoding aplicado.
import { ADVANCED_QUERIES, DASHBOARD_PATTERNS, VIBE_PATTERNS } from './advanced.mjs';

export const CONSOLE_TABS = [
  { id: 'queries', label: { es: 'Consultas expertas', en: 'Expert queries', de: 'Expertenabfragen' } },
  { id: 'dashboards', label: { es: 'Dashboards & KPI', en: 'Dashboards & KPI', de: 'Dashboards & KPI' } },
  { id: 'vibe', label: { es: 'Vibecoding B1', en: 'B1 vibecoding', de: 'B1-Vibecoding' } }
];

export function renderConsole(state, dispatch) { return ''; }
