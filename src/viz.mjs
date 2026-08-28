// ─── Instrumentos visuales de dominio por nivel ──────────────────────────────
// Cada nivel (L0–L8) representa el mismo registro de 4 dimensiones con un
// instrumento nativo de su dominio SAP B1 y vocabulario propio por idioma.
// El motor de cálculo (4 valores 0–100) NO cambia: cambia la representación.

const VIZ = {
  chain: {
    instrument: 'chain',
    label: { es: 'Cadena documental', en: 'Document chain', de: 'Belegkette' },
    dims: {
      knowledge:    { es: 'Mapa',   en: 'Map',    de: 'Karte' },
      application:  { es: 'Flujo',  en: 'Flow',   de: 'Fluss' },
      verification: { es: 'Rastro', en: 'Trail',  de: 'Spur' },
      risk:         { es: 'Riesgo', en: 'Risk',   de: 'Risiko' }
    },
    docs: [
      { kind: 'OFERTA' }, { kind: 'PEDIDO' }, { kind: 'ENTREGA' }, { kind: 'FACTURA' }, { kind: 'COBRO' }
    ]
  },
  recordCard: {
    instrument: 'recordCard',
    label: { es: 'Ficha de datos', en: 'Master record', de: 'Stammsatz' },
    dims: {
      knowledge:    { es: 'Campos', en: 'Fields', de: 'Felder' },
      application:  { es: 'Alta',   en: 'Entry',  de: 'Anlage' },
      verification: { es: 'Hallazgo', en: 'Lookup', de: 'Fund' },
      risk:         { es: 'Riesgo', en: 'Risk',   de: 'Risiko' }
    }
  },
  processLine: {
    instrument: 'processLine',
    label: { es: 'Línea de proceso', en: 'Process line', de: 'Prozesslinie' },
    dims: {
      knowledge:    { es: 'Ruta',  en: 'Route',  de: 'Route' },
      application:  {   es: 'Paso',  en: 'Step',   de: 'Schritt' },
      verification: { es: 'Control', en: 'Checkpoint', de: 'Kontrolle' },
      risk:         { es: 'Riesgo', en: 'Risk',  de: 'Risiko' }
    }
  },
  cascade: {
    instrument: 'cascade',
    label: { es: 'Cascada documental', en: 'Document cascade', de: 'Belegkaskade' },
    dims: {
      knowledge:    { es: 'Plan',     en: 'Plan',    de: 'Plan' },
      application:  { es: 'Ejecución', en: 'Execution', de: 'Ausführung' },
      verification: { es: 'Recepción', en: 'Receipt',  de: 'Wareneingang' },
      risk:         { es: 'Riesgo',   en: 'Risk',     de: 'Risiko' }
    }
  },
  balance: {
    instrument: 'balance',
    label: { es: 'Balanza contable', en: 'Ledger balance', de: 'Saldo-Bilanz' },
    dims: {
      knowledge:    { es: 'Cuentas', en: 'Accounts', de: 'Konten' },
      application:  { es: 'Asiento', en: 'Entry',    de: 'Buchung' },
      verification: { es: 'Concilio', en: 'Reconcile', de: 'Abgleich' },
      risk:         { es: 'Riesgo',  en: 'Risk',     de: 'Risiko' }
    }
  },
  phases: {
    instrument: 'phases',
    label: { es: 'Fases de proyecto', en: 'Project phases', de: 'Projektphasen' },
    dims: {
      knowledge:    { es: 'Alcance', en: 'Scope',  de: 'Umfang' },
      application:  { es: 'Montaje', en: 'Setup',  de: 'Aufbau' },
      verification: { es: 'Go-live', en: 'Go-live', de: 'Go-live' },
      risk:         { es: 'Riesgo',  en: 'Risk',   de: 'Risiko' }
    }
  },
  pulse: {
    instrument: 'pulse',
    label: { es: 'Pulso de indicadores', en: 'KPI pulse', de: 'Kennzahlen-Puls' },
    dims: {
      knowledge:    { es: 'Consulta', en: 'Query',  de: 'Abfrage' },
      application:  { es: 'Panel',   en: 'Board',  de: 'Panel' },
      verification: { es: 'Dato',    en: 'Datum',  de: 'Datum' },
      risk:         { es: 'Riesgo',  en: 'Risk',   de: 'Risiko' }
    }
  },
  terminal: {
    instrument: 'terminal',
    label: { es: 'Terminal del sistema', en: 'System terminal', de: 'System-Terminal' },
    dims: {
      knowledge:    { es: 'API',    en: 'API',   de: 'API' },
      application:  { es: 'Build',  en: 'Build', de: 'Build' },
      verification: { es: 'Test',   en: 'Test',  de: 'Test' },
      risk:         { es: 'Riesgo', en: 'Risk',  de: 'Risiko' }
    }
  },
  spectrum: {
    instrument: 'spectrum',
    label: { es: 'Espectro del modelo', en: 'Model spectrum', de: 'Modell-Spektrum' },
    dims: {
      knowledge:    { es: 'Prompt', en: 'Prompt', de: 'Prompt' },
      application:  { es: 'Agente', en: 'Agent',  de: 'Agent' },
      verification: { es: 'Juez',   en: 'Judge',  de: 'Prüfer' },
      risk:         { es: 'Riesgo', en: 'Risk',   de: 'Risiko' }
    }
  }
};

export const LEVEL_VIZ = [
  VIZ.chain, VIZ.recordCard, VIZ.processLine, VIZ.cascade, VIZ.balance,
  VIZ.phases, VIZ.pulse, VIZ.terminal, VIZ.spectrum
];

export function vizLabel(viz, locale) {
  return viz.label[locale] || viz.label.es;
}
