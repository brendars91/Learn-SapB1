# PLAN UX v2 — "The Living Ledger, Alive" (magistral)
**Fecha:** 2026-08-28 · **Repo:** Learn-SapB1 · **Base:** main @ 39f2802
**Sustituye a:** PLAN-UX-LEDGER-2026-08-28.md (v1 — se conserva como referencia de la fase visual)
**Verificación:** todo lo citado fue confirmado contra código con línea exacta. Web search no disponible esta sesión (resultados vacíos ×2) — cero datos externos no verificables.

## La tesis del plan

La v1 arreglaba lo que se ve mal. La v2 hace algo superior: **convierte la app en un sistema vivo**.
Un ledger "vivo" no es uno bonito — es uno que **responde, recuerda y reclama**. Hoy la app recuerda
(el motor existe) pero no responde ni reclama: nada le dice al usuario "tienes 3 skills vencidas de
repaso" o "llevas 4 días seguidos". El usuario no engancha porque la app no le cuenta su historia.

### El Loop del Ledger Vivo (la innovación central)

```
   ┌──────────────────────────────────────────────────────────┐
   │  ESCITORIO (home): "Hoy te tocan N repasos · racha Xd     │
   │     → siguiente recomendada: ⟨skill⟩"                     │
   ↓                                                            │
   │  PRÁCTICA (guiada/probar): check → feedback vivo          │
   ↓                                                            │
   │  MOMENTO DE MAESTRÍA: mastered false→true → entrada        │
   │     ILUMINADA del ledger (iluminación editorial, no confetti)│
   ↓                                                            │
   │  EL LEDGER RECLAMA: nextReview 1/3/7/14d → cola de repaso  │
   │     visible → el usuario vuelve mañana                     │
   └──────────────────────────────────────────────────────────┘
```

Cada pieza del loop YA existe en código y está dormida. El plan las despierta y las conecta.

## Hallazgos verificados que gobiernan v2 (líneas exactas)

| # | Hecho | Evidencia | Implicación |
|---|---|---|---|
| H1 | `renderReview` es código muerto — nunca invocado | app.mjs:645, sin callers | La cola de repaso se resucita, no se inventa |
| H2 | Repetición espaciada 1/3/7/14 días escribe `nextReview` | domain.mjs:142-148 | El motor ya agenda; falta superficio |
| H3 | `recommendNext` puntúa vencidas +60, prerrequisitos bloqueados −80 | domain.mjs:29-33 | El "qué toca hoy" ya se calcula |
| H4 | `streak` por skill se persiste pero NUNCA se muestra | app.mjs:151, 0 renderers | Racha visible = engagement gratis |
| H5 | Mastered transita false→true con solo toast 'practice-recorded' | app.mjs:140-157 | Sin celebración, el clímax es invisible |
| H6 | Racha global de días es DERIVABLE de lastPractised existentes | app.mjs:140,157 | Cero campos nuevos en localStorage |
| H7 | `skillStatus` mastered/learning/new ya existe | app.mjs:441-446 | Estados = render puro |
| H8 | Bug heatmap: HTML `.sbl-heat-cell` vs CSS `.sbl-heatcell` | app.mjs:320-321 vs styles.css:288 | Fix inmediato + test de clase |
| H9 | Tokens bloqueados: steps 1.25, spacing ×4, oxblood #7c2d2d | styles.css:root | Todo CSS nuevo usa tokens, test T1.2 |
| H10 | Bundle único 1.3MB; tesis escrita en el propio CSS ("living ledger") | dist/ | Animaciones: solo transform/opacity |
| H11 | `validateProgressImport` whitelista campos persistidos | domain.mjs:86 | Prohibido añadir campos — todo derivable |

## Pirámide de test (sin cambios desde v1, ahora con presupuesto)

- **N1 Contract/VM** — node:test, reduceState + renderAppMarkup + bootApp. Matrices trilingües.
- **N2 Browser computed** — Playwright: layout real, contraste WCAG medido, focus, reduced-motion,
  baselines DPR-locked. **NUEVO presupuesto de rendimiento**: interactions sin longtask >50ms;
  animaciones solo propiedades compositables (transform/opacity) — test computa si alguna animación
  toca layout (width/top/margin).
- **N3 Gates globales** — npm test + build + browser-smoke (0 fugas ×3 idiomas) + CI verify.
- **Regla RED→GREEN por fase:** cada fase abre convirtiendo un indicador del instrumento en rojo,
  lo implementa, y flipa su check a enforcement permanente. Nada se declara mejorado sin número.

## FASES

### F0 — Preparación (0.25d)
Rama `feat/living-ledger`. Regenerar instrumento v1 (F1 completa de v1) si no está: T1.1
class-coverage, T1.2 token-discipline, T1.4 computed-contract, T1.5 contraste, T1.6 touch,
T1.7 overflow, T1.8 focus, T1.9 reduced-motion, T1.10 baselines. Modo informe → findings.json
= la línea base cuantificada del "antes". **Criterio:** findings.json existe con números, suite 84/84.

### F1 — El Escritorio: la home cuenta tu historia (1.25d) ⭐ núcleo del loop
Reemplaza el hero estático por **el escritorio de hoy** (la home responde a `progress`):
1. **Fila de repaso** (resucita renderReview H1): "Repasos de hoy: N" con chips de skills vencidas
   (`nextReview <= hoy`, H2) → clic = select-skill. Vacía = mensaje sereno "Nada vencido hoy".
2. **Siguiente recomendada** — `recommendNext` (H3) ya corre en home (app.mjs:404): elevarlo a
   tarjeta protagonista con "por qué" (vencida / prerrequisito pendiente / nueva en tu nivel).
3. **Racha global** (H6): derivada de `lastPractised` de todos los records — días consecutivos con
   actividad. UI: sello de lomo "Racha · 4d" (editorial, no llama de Duolingo — sello tinta oxblood).
4. CTA primario único: "Continuar" → recomendada. (web-principles: un filled por vista.)
- **Tests N1:** cola derivada correcta con fixtures (2 vencidas, 0 vencidas, fecha futura);
  racha derivada 0/1/4 días consecutivos y corte por hueco; "por qué" de la recomendada traducido ×3.
  **N2:** escritorio renderiza distinto con progress vacío vs 3 skills exploradas (assert de contenido
  no de pixel); contraste chips AA; focus en chips. **i18n:** todas las strings nuevas ×3 desde el
  primer commit (i18n-coverage lo exige en CI).

### F2 — Estados visibles en el mapa (1d)
Badge estructural por card: ○ nueva (--ink-soft AA) · ◐ en curso (--accent) · ✓ dominada (--good)
+ marca brújula en la recomendada (H7: solo render). aria-label "título — estado". Micro-barra de
progreso por level-header (width = dominadas/total, role=progressbar).
- **N1:** matriz 3 estados × 3 locales × render; aria-label contiene estado; MASTER_SKILL → ✓ sin
  recargar. **N2:** contraste ≥4.5:1 por estado; bounding box de barra ±1px. Baselines nuevos.

### F3 — El Momento de Maestría: entrada iluminada (1.5d) ⭐ clímax emocional
Cuando `mastered` transita false→true (H5) — detectable como `correctAttempts === 3 && mastered`
(la validación exige ≥3 correctas, domain.mjs:113) — el ledger recibe una **entrada iluminada**:
- Overlay editorial de un solo uso (NO confetti): la skill se "estampa" en el ledger con capitular
  oxblood + filete dorado (--gold nuevo token derivado de --accent-ink), 900ms ease-out, respeta
  reduced-motion (fade sin transform). La card del mapa conserva un eco permanente: filete dorado.
- Estado efímero en memoria (assessmentResult ya es efímero — mismo patrón): cero persistencia (H11).
- **Tests N1:** transición detectada (fixture correctAttempts=2 correcto → mastered+overlay flag;
  correctAttempts=3 correcto otra vez → sin overlay de nuevo); flag no sobrevive NAVIGATE.
  **N2:** overlay presente tras 3ª correcta (browser E2E real), ausente tras 4ª; reduced-motion →
  transition-duration 0s; sin longtask >50ms durante el overlay (presupuesto H10).

### F4 — El ledger reclama: repaso como ciudadano de primera clase (1d)
- La fila de repaso de F1 se replica en la vista Mapa (banner fino cuando hay vencidas) y el
  flujo guiado de una skill vencida marca "repaso" (badge) — completar un repaso reagenda
  (nextReviewDate(streak+1) ya lo hace, H2).
- Contador global de vencidas en el nav (punto discreto en "Mapa", solo si >0 — no badge rojo
  de ansiedad; punto tinta --accent de 6px).
- **Tests N1:** repaso completado → nextReview avanza según schedule (1→3→7→14); badge desaparece;
  punto nav = count exacto. **N2:** E2E: fixture con nextReview ayer → chip visible → completar →
  chip desaparece sin recarga (dispatch + re-render).

### F5 — Affordances + selects + tipografía de estados (1d)
Hover viz-tile (border --accent, translateY(-2px), 180ms), focus-visible ring, tabs activos vs
disponibles (inactivo ≠ disabled), selects estilizados con appearance:none + chevron (menú nativo
intacto), "Nueva" a --ink-soft (AA). Todo con tokens (H9).
- **N2:** hover computado cambia; Tab secuencial → focus; reduced-motion 0s; selects ≥44px alto.
  Flip T1.5/T1.8/T1.9 a enforcement.

### F6 — Hero: la espina del ledger (1.25d)
Espina vertical SVG con 9 nodos (niveles): relleno según dominio del nivel, clic → filtro+navega.
Estética lomo contable: hairlines --rule, nodos --accent, caps --step--1. Datos = mismo cálculo
que heatmap (fix H8 incluido aquí si no se aplicó en F0). Reemplaza la fila del heatmap roto.
- **N1:** 9 nodos data-level; nodo 100% → is-complete; dispatch → levelFilter+view. **N2:** nodos
  ≥24px clicables; aria-label "Nivel 4 · Finanzas · 37%"; baseline home nueva.

### F7 — Móvil: el viaje en el bolsillo (1d)
Ritmo entre secciones a --s8, padding cards --s3, chips de repaso apilables, barra y badge
táctil-legibles, overflow ×3 idiomas @320/390. Flip T1.6/T1.7 a enforcement total.
- **N2:** cero scroll horizontal en 5 anchuras × 3 idiomas; touch ≥44 en primarios; gap secciones
  computado = var(--s8).

### F8 — Rendimiento y presupuesto de animación (0.5d)
Auditoría: solo transform/opacity animadas (test computa las propiedades de todas las transitions/
keyframes del CSS); sin longtask >50ms en interacciones clave (check, cambio de skill, cambio de
idioma). Limpieza de transiciones decorativas que no comunican estado (regla web-principles).
- **N2:** script de perfil (PerformanceObserver) sobre 6 interacciones × 3 vistas → reporte JSON.

### F9 — Verificación adversarial y cierre en producción (0.75d)
1. Auto-auditoría completa contra web-principles.md + anti-patterns.md (checkbox a checkbox).
2. **Golden Path E2E** (el test que valida el LOOP entero): usuario nuevo → escritorio muestra
   recomendada → práctica guiada + check → estado ◐ en mapa → 3 evaluaciones correctas →
   entrada iluminada + ✓ → nextReview en +1d → fixture avanzado a mañana → chip de repaso visible.
   Un solo test de navegador que recorre el loop completo — si pasa, el sistema está vivo.
3. Suite completa N1+N2 verde; build; smoke trilingüe; CI.
4. Post-merge: verificación EN VIVO de la URL publicada (patrón PR #38): loop medido en producción.

## PRs (flujo Brenda: rama → PR → merge squash → delete)

| PR | Fases | Entrega de valor |
|---|---|---|
| **PR-A "Instrumento + Escritorio"** | F0+F1 | El loop nace: la home cuenta tu historia |
| **PR-B "Estados + Maestría + Repaso"** | F2+F3+F4 | El viaje es visible y tiene clímax |
| **PR-C "Affordances + Espina + Móvil + Perf"** | F5+F6+F7+F8 | Ejecución premium completa |
| Cierre F9 en cada merge + verificación en vivo final | | |

Commits atómicos por fase: detector RED → implementación GREEN → flip enforcement.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Overlay de maestría se siente cursi/anti-editorial | Diseño: capitular + filete dorado, 900ms, sin partículas. Baseline visual lo congela; Brenda lo revisa en PR |
| Racha presiona al usuario (ansiedad) en contexto formativo profesional | Sello sereno de tinta, no llama; sin notificaciones; la racha es informativa, nunca penaliza |
| Derivar racha global de lastPractised es frágil (zona horaria) | Derivación en UTC puro (nextReviewDate ya usa setUTCDate); test con fixtures de 3 TZ |
| Overlay efímero rompe la hidratación tras import/export | assessmentResult ya es efímero y no se persiste (H11 intacto); test de import/export durante overlay |
| Baselines ruidosas | DPR 1 + viewport fijo + hash; regeneración documentada con --update-visuals |
| Scope creep | Regla dura: si no sirve al Loop del Ledger (mostrar progreso, reclamar repaso, premiar maestría, guiar siguiente), se rechaza en review |

## Qué hace magistral a este plan (la diferencia con v1)

1. **Despierta motor dormido verificado** — repetición espaciada, cola de repaso, streaks y
   recomendación ya existen en código; el plan los conecta en un loop narrativo. Cero invención.
2. **El Loop del Ledger Vivo** — cada sesión tiene arco: te tocan N cosas → las haces → tu progreso
   se materializa (estados, iluminación) → el ledger agenda tu vuelta. Eso es retención por diseño.
3. **Momento de maestría con identidad** — entrada iluminada: celebración que EMANA de la tesis
   (manuscrito iluminado = ledger contable medieval), no confetti prestado de Duolingo.
4. **Presupuesto de rendimiento explícito** — 1.3MB exigen disciplina: solo transform/opacity,
   cero longtask, medido en N2, no deseado.
5. **Golden Path E2E** — un test que recorre el loop completo del usuario. Si pasa, el sistema
   entero está vivo; si falla, te dice exactamente dónde se rompió la narrativa.
6. **Instrumento primero, opinión nunca** — cada fase convierte un número rojo del findings.json
   en verde y congela su ganancia con enforcement.

## Duración total

F0 0.25 + F1 1.25 + F2 1 + F3 1.5 + F4 1 + F5 1 + F6 1.25 + F7 1 + F8 0.5 + F9 0.75 ≈ **9.5 días**.
