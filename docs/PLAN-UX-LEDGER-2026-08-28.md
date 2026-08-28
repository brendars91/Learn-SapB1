# PLAN UX — "The Living Ledger" fase premium
**Fecha:** 2026-08-28 · **Repo:** Learn-SapB1 · **Base:** main @ 39f2802 (post PR #38)
**Autor:** Hermes (auditoría visual en vivo: 7 capturas desktop/móvil + análisis contra web-principles)

## Objetivo

Elevar la ejecución visual de "prototipo medio-acabado" a "producto premium que engancha",
SIN tocar la tesis visual (ledger editorial oxblood/cream), SIN nueva arquitectura, SIN
campos nuevos en localStorage. Todo es CSS + render condicional sobre state existente.

## Hechos verificados que gobiernan este plan

1. `skillStatus()` (app.mjs:441) ya distingue mastered / explored / new — solo falta render visual.
2. Bug confirmado: HTML emite `.sbl-heat-cell|.sbl-heat-num|.sbl-heat-lab|.sbl-heat-0..4`
   (app.mjs:320-321) pero styles.css solo define `.sbl-heatcell` (:288) → mapa de dominio sin estilo.
3. Tokens ya bloqueados en :root — escala tipográfica --step--1..4 (1.25), espaciado --s1..s16 (×4),
   paleta --paper/--ink/--accent(#7c2d2d)/--good/--bad. Todo CSS nuevo DEBE usar estos tokens.
4. Harness de tests disponible: contract (app-contract), VM DOM (i18n-dom-defects bootApp),
   navegador real (browser-smoke-local Playwright), CI verify. Suite actual: 84/84.
5. `serializeProgress`/`validateProgressImport` (domain.mjs:86) whitelistan campos — no añadir campos persistidos.

## Pirámide de test de 3 niveles (todo test nuevo pertenece a un nivel)

- **N1 Contract/VM** (node:test, sin navegador): reduceState + renderAppMarkup + bootApp con DOM mock.
- **N2 Browser computed** (Playwright headless local): getComputedStyle, bounding boxes, contraste WCAG,
  focus, reduced-motion, overflow multi-viewport, baselines visuales.
- **N3 Gates globales**: npm test completo + build + browser-smoke-local (0 fugas idioma) + CI verify.

## FASE 1 — Instrumentación de medición (los tests avanzados primero)

**Principio inteligente:** construir el instrumento ANTES que el fix. Cada fase posterior
convierte indicadores rojos del instrumento en verdes. Nada se declara "mejor" sin número.

**Archivo nuevo `test/design-system.test.mjs` (N1):**
- T1.1 **class-coverage**: boot de las 8 vistas × 3 locales → extraer todos los class tokens del HTML
  renderizado → cada token debe tener selector en styles.css (o whitelist documentada).
  HOY EN ROJO: .sbl-heat-cell, .sbl-heat-num, .sbl-heat-lab, .sbl-heat-0..4 (evidencia del bug real).
  Este test solo habría prevenido DOS bugs históricos (sbl-effect y heat-cell).
- T1.2 **token-discipline**: parse de styles.css → prohibir font-size fuera de --step-*, espaciados
  fuera de --s* (whitelist explícita: bordes 1px, line-heights). Congela el sistema contra deriva.
- T1.3 **single-radius**: valores border-radius ∈ {un valor, 0} documentados.

**Archivo nuevo `test/browser-design-gate.mjs` (N2, modelo browser-smoke-local):**
- T1.4 **computed-contract**: manifiesto {selector → propiedades obligatorias} p.ej. heat-cell debe
  tener background ≠ transparent y border-width ≥ 1px. Detecta la clase de bug "CSS nunca aplicado".
- T1.5 **contraste WCAG AA**: recorrer nodos de texto visibles, luminancia relativa vs fondo efectivo,
  ≥4.5:1 body / ≥3:1 large. HOY EN ROJO esperado: label "Nueva" teal-faint sobre crema.
- T1.6 **touch-targets** @390px: todo botón/select ≥24×24 (AA), objetivo ≥44 (AAA) en acciones primarias.
- T1.7 **overflow** @320/390/768/1024/1440 × 8 vistas: scrollWidth ≤ viewport; por-card scrollWidth
  ≤ clientWidth (títulos largos "Códigos fiscales: control de riesgo" no pueden clipear).
- T1.8 **focus-visible**: Tab por los N primeros interactivos → outline/box-shadow ≠ none.
- T1.9 **reduced-motion**: emular prefers-reduced-motion → transition-duration = 0s en elementos animados.
- T1.10 **baselines visuales**: screenshots de vistas clave a test/visual-baselines/ + hash; el cambio
  intencional regenera con --update-visuals y revisa un humano (Brenda).

**Modo reporte:** F1 ejecuta T1.5–T1.9 en modo informe (findings.json, exit 0) para documentar
el estado real; cada fase posterior FLIP su check a modo enforcement (exit 1 si falla).

**Criterio de aceptación F1:** instrumentos corren, findings.json documenta cada defecto actual
con selector+medida. Suite existente sigue 84/84.

## FASE 2 — Fix bug heatmap + escalas de calor (rojo→verde de T1.1/T1.4)

- styles.css: renombrar `.sbl-heatcell`→`.sbl-heat-cell` + añadir .sbl-heat-num/.sbl-heat-lab
  (stack vertical, gap --s1) y escala .sbl-heat-0..4 (rampa paper→accent por % mastery del nivel).
- N1: T1.1 verde (cero clases huérfanas). N2: T1.4 verde para heat-cell; screenshot baseline nueva.
- Visual: las 9 celdas del "Mapa de dominio" de la home pasan de rotas a componente con estado.

## FASE 3 — Sistema de estados en cards (el corazón del "engancha")

- app.mjs renderMap: sustituir `<span class="sbl-node-meta">Nueva</span>` por badge estructural:
  `is-new` (○ punto hueco, --ink-faint PERO AA), `is-learning` (◐ medio, --accent),
  `is-mastered` (✓, --good), + marca `is-next` (brújula/ancla) en la skill recomendada
  (recommendNext ya existe, app.mjs:404/710).
- aria: aria-label compuesto "título — estado" en el botón (lectores de pantalla leen el viaje).
- No se añaden campos al estado: mastered/explored ya persisten.
- **Tests nuevos (N1) `test/status-system.test.mjs`:** matriz 3 estados × 3 locales × render map
  → badge clase correcta + label traducida correcta + aria-label contiene estado; skill con
  progress vira is-learning sin recargar; mastered surge tras MASTER_SKILL. Matriz = 9+ casos.
- **N2:** contraste del badge ≥4.5:1 en los 3 estados (T1.5 flip a enforcement para .sbl-node-meta).
- i18n: labels ya existen (masteredStatus/learningStatus/newStatus) — cero strings nuevas salvo
  "recomendada" ×3 idiomas → i18n-coverage test lo exige.

## FASE 4 — Affordances: hover, focus, active, tabs

- viz-tile: :hover borde --accent + translateY(-2px) 180ms ease-out + cursor pointer;
  :focus-visible ring --accent 2px offset 2px; estado seleccionado is-selected realzado.
- Tabs modo (Entender/Guiada/Demostrar): peso activo vs inactivo claro (inactivo NO parece disabled:
  borde --rule-strong, texto --ink-soft; activo fill --accent).
- @media (prefers-reduced-motion: reduce): transiciones a 0s (T1.9 flip enforcement).
- **Tests (N2):** hover con page.hover → borde computado cambia; Tab secuencial → focus-visible
  presente (T1.8 flip); transición 180ms en estado normal, 0s con emulación reduce.
- N1: class-coverage sigue verde (nuevas clases en CSS antes de render).

## FASE 5 — Selects nativos estilizados (sin matar la accesibilidad)

- Solo CSS: appearance:none + padding --s2 --s3 + chevron SVG inline (data-URI, color --rule-strong)
  + focus ring. Se CONSERVA <select> nativo: teclado, lector de pantalla y menú del SO intactos.
- **Tests (N2):** computed appearance='none' en .form-select; chevron background-image presente;
  focus ring visible; width no colapsa en móvil; T1.6 verde (alto ≥44 con padding).
- N1: nada cambia en markup → suite intacta.

## FASE 6 — Headers de nivel con micro-progreso

- renderMap: en .sbl-level-heading añadir barra fina (h --s1, rampa accent) width = mastered/total
  del nivel + aria progressbar (role/aria-valuenow/aria-valuemax). El "8/8" textual se conserva
  como complemento.
- **Tests (N1):** state con 3 skills mastered en L0 → width esperado 37.5% renderizado como style
  inline o CSS var --p; aria-valuenow=3 de 8. Locale switch no rompe (los números no se traducen).
- **N2:** bounding box de la barra = ancho esperado ±1px (layout real, no solo atributo).

## FASE 7 — Hero home: el "Mapa de dominio" como lomo del ledger

- Elevar el grid F2 a pieza de anclaje: espina vertical SVG con 9 nodos (uno por nivel), cada nodo
  se rellena según mastery del nivel (mismo cálculo que heatmap), clic → nivel-filter + navigate map.
  Estética: lomo de libro contable — hairlines --rule, nodos --accent, tipografía --step--1 caps.
- Reusa svgDiagram patterns (app.mjs:201+ ya genera SVG por skill); cero dependencias.
- **Tests (N1):** SVG tiene 9 nodos con data-level; nodo de nivel con 100% mastery lleva clase
  is-complete; click (dispatch) aplica levelFilter y view=map. **(N2):** nodos visibles, clicables
  (bounding box ≥24px), aria-label por nodo con nombre de nivel + %.
- Baseline visual nueva de la home (T1.10) — primera impresión documentada.

## FASE 8 — Móvil: ritmo, densidad y viaje

- Espaciado entre secciones del mapa a escala (--s8, no "3× el gap de cards" arbitrario);
  padding interno de cards --s3 mínimo; label "8/8" junto a barra (ya con barra F6);
  badge de estado tamaño táctil-legible (≥13px y AA).
- **Tests (N2):** overflow 320/390 verde (T1.7 flip enforcement total); touch targets ≥44 en
  acciones primarias (T1.6 flip); ritmo: gap entre secciones computado = var(--s8) exacto;
  títulos largos ES/EN/DE sin clip (triple idioma en 390px).
- Checklist web-principles responsive re-corrido a las 5 anchuras.

## FASE 9 — Cierre y verificación adversarial

- Suite completa N1+N2 verde; npm build; browser-smoke-local (8 vistas, 0 fugas idioma, 0 errores);
- Auto-auditoría contra anti-patterns.md + web-principles.md checklist completo (checkbox a checkbox);
- PR final: evidencia RED→GREEN por fase en descripción (findings.json inicial vs final);
- Post-merge: verificación EN VIVO contra la URL publicada (mismo patrón que PR #38):
  nodos del hero, badges, contraste — medidos en producción, no en local.

## Agrupación en PRs (flujo Brenda: rama → PR → merge squash → delete)

- **PR-A "Instrumentación + fix heatmap"**: F1+F2. El instrumento nace con su primer bug cazado.
- **PR-B "Estados + interacción"**: F3+F4+F5. El corazón del engagement.
- **PR-C "Composición + móvil + cierre"**: F6+F7+F8+F9.
Cada fase = commits atómicos dentro de su PR (detector RED, implementación GREEN, flip enforcement).

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Contraste AA fuerza a oscurecer "Nueva" y rompe la paleta | Usar tokens existentes (--ink-soft #4a4235 pasa 4.5:1 sobre #f7f2e7); la paleta no se toca, solo qué token pinta cada estado |
| Selects estilizados rompen teclado/lector | Solo appearance:none; el menú sigue siendo nativo del SO. Test focus + sin JS |
| VM DOM no tiene layout (falsos verdes) | Por eso existe N2: toda afirmación de tamaño/posición/contraste se mide en Chromium real |
| Baselines visuales ruidosas (antialiasing) | Hash sobre capturas a viewport fijado + DPR 1; regeneración intencional documentada |
| Scope creep hacia rediseño | Regla dura: cualquier cambio que no sirva a estados/progreso/affordance/hero se rechaza en review |

## Duración estimada

F1 0.5d · F2 0.5d · F3 1d · F4 1d · F5 0.5d · F6 0.5d · F7 1d · F8 1d · F9 0.5d → **≈ 6.5 días**.
