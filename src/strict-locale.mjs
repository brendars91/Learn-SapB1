const MAP = {
  'Práctica guiada': { en: 'Guided practice', de: 'Geführte Praxis' },
  '· guiado': { en: '· guided', de: '· geführt' },
  '— Selecciona —': { en: '— Select —', de: '— Auswählen —' },
  'La ruta aparece aquí…': { en: 'The path appears here…', de: 'Der Pfad erscheint hier…' },
  '↶ Deshacer último': { en: '↶ Undo last', de: '↶ Letzten Schritt zurück' },
  'Evento observado': { en: 'Observed event', de: 'Beobachtetes Ereignis' },
  'Construye la cascada…': { en: 'Build the cascade…', de: 'Kaskade aufbauen…' },
  '¿Qué es esto?': { en: 'What is this?', de: 'Was ist das?' },
  'Tu tarea': { en: 'Your task', de: 'Deine Aufgabe' },
  'Se evalúa': { en: 'What is assessed', de: 'Bewertet wird' },
  'Modo guiado': { en: 'Guided mode', de: 'Geführter Modus' },
  'Errores no cuentan. Pide pista cuando lo necesites.': { en: 'Mistakes do not count. Ask for a hint when you need one.', de: 'Fehler zählen nicht. Nutze bei Bedarf einen Hinweis.' },
  'Comprobar': { en: 'Check', de: 'Prüfen' },
  'Pista': { en: 'Hint', de: 'Hinweis' },
  'Reiniciar': { en: 'Reset', de: 'Zurücksetzen' },
  'Actividad en preparación.': { en: 'Activity in preparation.', de: 'Aktivität in Vorbereitung.' },
  '✓ Misión resuelta': { en: '✓ Mission solved', de: '✓ Aufgabe gelöst' },
  '↻ Aún no — te digo exactamente qué falló': { en: '↻ Not yet — here is exactly what failed', de: '↻ Noch nicht — hier ist genau, was fehlgeschlagen ist' },
  'Decisión correcta: la evidencia, el control y el resultado son coherentes.': { en: 'Correct decision: the evidence, control, and result are consistent.', de: 'Richtige Entscheidung: Nachweis, Kontrolle und Ergebnis sind konsistent.' },
  'Revisa los elementos marcados y vuelve a intentarlo.': { en: 'Review the marked items and try again.', de: 'Prüfe die markierten Elemente und versuche es erneut.' },
  'Configuración exacta': { en: 'Exact configuration', de: 'Exakte Konfiguration' },
  'Proceso end-to-end': { en: 'End-to-end process', de: 'End-to-End-Prozess' },
  'Síntoma': { en: 'Symptom', de: 'Symptom' },
  'Causa raíz': { en: 'Root cause', de: 'Ursache' },
  'Resolución': { en: 'Resolution', de: 'Lösung' },
  'Buenas prácticas senior': { en: 'Senior best practices', de: 'Senior-Best-Practices' },
  'Volver a la lista': { en: 'Back to list', de: 'Zurück zur Liste' },
  '¿Por qué funciona?': { en: 'Why does it work?', de: 'Warum funktioniert das?' },
  '⚠️ Trampa': { en: '⚠️ Pitfall', de: '⚠️ Stolperstein' },
  'Nivel': { en: 'Level', de: 'Niveau' },
  'Cuenta': { en: 'Account', de: 'Konto' },
  'Debe / Haber': { en: 'Debit / Credit', de: 'Soll / Haben' },
  'Importe': { en: 'Amount', de: 'Betrag' },
  'Debe': { en: 'Debit', de: 'Soll' },
  'Haber': { en: 'Credit', de: 'Haben' },
  'Cuadrado': { en: 'Balanced', de: 'Ausgeglichen' },
  'Diferencia': { en: 'Difference', de: 'Differenz' },
  'Marcar': { en: 'Mark', de: 'Markieren' },
  'No marcar': { en: 'Do not mark', de: 'Nicht markieren' },
  'Marcado': { en: 'Marked', de: 'Markiert' },
  'Sin marcar': { en: 'Not marked', de: 'Nicht markiert' },
  'Eslabón señalado': { en: 'Selected link', de: 'Markiertes Glied' },
  'El eslabón roto real': { en: 'The actual broken link', de: 'Das tatsächlich gebrochene Glied' },
  'Incluiste señuelos que no pertenecen a la cadena': { en: 'You included decoys that do not belong in the chain', de: 'Du hast Köder aufgenommen, die nicht zur Kette gehören' },
  'Gestión': { en: 'Administration', de: 'Administration' },
  'Informes': { en: 'Reports', de: 'Berichte' },
  'Parametrizaciones generales': { en: 'General settings', de: 'Allgemeine Einstellungen' },
  'Herramientas': { en: 'Tools', de: 'Werkzeuge' },
  'Automático': { en: 'Automatic', de: 'Automatisch' },
  'Bloqueado': { en: 'Locked', de: 'Gesperrt' },
  'Manual': { en: 'Manual', de: 'Manuell' },
  '— Sin valor —': { en: '— No value —', de: '— Kein Wert —' }
};

export function strictTranslateText(value, locale) {
  const text = String(value ?? '');
  if (locale === 'es' || !['en', 'de'].includes(locale)) return text;
  const trimmed = text.trim();
  const exact = MAP[trimmed]?.[locale];
  if (exact) return text.replace(trimmed, exact);
  let out = text;
  out = out.replace(/\bPaso (\d+): esperaba\b/g, locale === 'de' ? 'Schritt $1: erwartet' : 'Step $1: expected');
  out = out.replace(/\bcorrecto:/gi, locale === 'de' ? 'richtig:' : 'correct:');
  out = out.replace(/\blado\/importe\b/gi, locale === 'de' ? 'Seite/Betrag' : 'side/amount');
  out = out.replace(/\bpasos exactos\b/gi, locale === 'de' ? 'exakte Schritte' : 'exact steps');
  out = out.replace(/\bpasos\b/gi, locale === 'de' ? 'Schritte' : 'steps');
  return out;
}

export function strictLocaleText(value, locale) {
  if (value == null) return '';
  if (typeof value === 'object' && !Array.isArray(value)) {
    const selected = value[locale];
    return selected == null ? '' : String(selected);
  }
  if (locale === 'es' && ['string', 'number', 'boolean'].includes(typeof value)) return String(value);
  return '';
}

export function hasLegacySpanish(text) {
  return /[¿¡]|\b(?:ventas|compras|finanzas|banco|pedido|factura|entrega|pago|cliente|proveedor|almac[eé]n|cantidad|precio|cuenta|debe|haber|fecha|descripci[oó]n|estado|abierto|cerrado|contabilidad|log[ií]stica|contenido|usuario|ruta|ejemplo|gesti[oó]n|informes|herramientas|parametrizaciones|socio|maestro|crear|duplicados|riesgo|documento|selecciona|comprobar|reiniciar|pista|correcta|revisa|fall[oó]|resuelta)\b/i.test(String(text ?? ''));
}
