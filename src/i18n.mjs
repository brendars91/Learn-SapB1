// i18n.mjs — Resolución de idioma en tiempo de render.
// El contenido nace en español; cuando un nodo no trae su traducción, TERMS la aporta.
// Regla del proyecto: el usuario que elige un idioma no debe ver ni una palabra de otro.
import { TERMS, INVARIANT } from './content/i18n-terms.mjs';

// Un texto es invariante cuando se escribe igual en los tres idiomas:
// códigos de SAP, alias SQL, nombres de tabla, siglas y unidades.
export function isInvariant(value) { return INVARIANT.has(value); }

// Texto suelto (celdas de mockup, rutas de menú, etiquetas de diagrama).
export function trText(value, locale) {
  if (typeof value !== 'string' || !value) return value == null ? '' : String(value);
  if (locale === 'es' || !locale) return value;
  const hit = TERMS[value];
  const translated = hit && hit[locale];
  return typeof translated === 'string' && translated ? translated : value;
}

// Nodo { es, en, de } → cadena. Cae al catálogo cuando falta el idioma pedido.
export function trNode(value, locale) {
  if (value == null) return '';
  if (typeof value === 'string') return trText(value, locale);
  if (Array.isArray(value)) return value.map(item => trNode(item, locale)).filter(Boolean).join(' ');
  const source = typeof value.es === 'string' ? value.es : typeof value.en === 'string' ? value.en : '';
  const direct = value[locale];
  // Un nodo que copia el español en otro idioma no está traducido: el catálogo manda.
  if (typeof direct === 'string' && direct.trim() && direct !== source) return direct;
  return trText(source, locale);
}

// Nodo { es: [], en: [], de: [] } o array suelto → array de cadenas ya traducidas.
// Traduce elemento a elemento: un array parcialmente traducido no arrastra huecos.
export function trList(value, locale) {
  if (value == null) return [];
  if (Array.isArray(value)) return value.map(item => trNode(item, locale)).filter(item => item !== '');
  const direct = Array.isArray(value[locale]) ? value[locale] : [];
  const source = Array.isArray(value.es) ? value.es : Array.isArray(value.en) ? value.en : [];
  if (!source.length) return direct.map(item => trNode(item, locale));
  return source.map((item, index) => {
    const own = direct[index];
    if (typeof own === 'string' && own.trim() && own !== item) return own;
    if (own && typeof own === 'object') return trNode(own, locale);
    return trNode(item, locale);
  });
}
