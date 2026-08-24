# PLAN DE MEJORA v7 — Learn-SapB1

**Propietaria:** Brenda · **Fecha análisis:** 2026-08-24 · **Alcance:** plan, no implementación.
**Basado en:** lectura del código real (`src/app.mjs`, `src/activities.mjs`, `src/activities.css`, `src/masterclass*.mjs`, `src/content/*`, `test/activities.test.mjs`).

Cada item lleva: **Problema (evidencia en código)** · **Solución concreta (archivo)** · **Criterio de aceptación verificable**.
Prioridad: **P0** = bloquea la comprensión del usuario básico · **P1** = mejora sustancial · **P2** = refinamiento.

---

## 1. Diagnóstico de "Demostrar dominio" (por qué hoy no se entiende)

El modo "prove" (`renderProveMode`, `app.mjs:497-508`) presenta la actividad **sin contexto propio**: solo una cabecera con una etiqueta de tipo y **una instrucción genérica idéntica para las 72 skills** (`activityInstructions`, `app.mjs:461-471` — hay exactamente una frase por tipo, no por skill). El usuario salta de "Entender" (modo denso: ancla + masterclass + mindset + concept + objective + practice + ejemplo + tips + pitfall + checklist, `renderLearnMode` `app.mjs:430-458`) a una micro-tarea mecánica sin puente. No hay onboarding, ni micro-lección, ni ejemplo resuelto, ni pista.

Causas raíz concretas, todas verificadas en código:

1. **Instrucción no específica de la tarea.** El usuario ve "Completa los campos editables" pero no *qué* representa el documento ni *qué* decisión de negocio está tomando en ESTA skill. Evidencia: `activityInstructions` mapea solo por `type`, no por `skill.id`.

2. **Feedback binario y pobre.** `validateActivity` (`app.mjs:510-524`) devuelve `{correct, message}` con un mensaje **genérico por tipo** cuando falla (`app.mjs:520-522`), y solo revela la explicación real (`a.resolution`) **cuando ya acertaste** (`app.mjs:519`). No dice *qué* campo/eslabón estuvo mal ni *por qué*. El render solo pinta "✓ Misión resuelta / ↻ Aún no" (`app.mjs:505`).

3. **Sin pistas ni reintento guiado.** El único ciclo es "Comprobar decisión / Reiniciar" (`app.mjs:506`, handler `app.mjs:721-727`). No existe acción `hint` (confirmado: `grep hint src/app.mjs` = 0 en prove). El primer acierto marca la skill como dominada (`ASSESS_SKILL correct:true`, `app.mjs:726`) — sin gradación ni repetición.

4. **Scaffolding rico por skill EXISTE pero está desconectado.** Cada skill tiene `assessment` con `hints`, `distractorWhy`, `rationale`/`why`, `seniorSteps` (`sk()` en `base.mjs:119-140`). Nada de esto lo usa `activities.mjs` ni `renderProveMode`: la actividad se deriva mecánicamente de la masterclass, ignorando el material didáctico ya escrito.

5. **Motores mecánicamente frágiles** (detalle en §2): el simulador degrada a tarea sin sentido, el forense se autodelata, la cascada es siempre el mismo patrón. El usuario intuye que "hay truco", no que está aprendiendo.

Conclusión: no es un problema de estética sino de **andamiaje pedagógico ausente** entre comprender y demostrar, más **motores que no reproducen una decisión real**.

---

## 2. Análisis de los 6 motores (`activities.mjs`)

| Motor | Skills | Estado | Veredicto |
|---|---|---|---|
| `journal` (asientos) | 7 (L4) | Sólido: datos curados en `JOURNALS` (`activities.mjs:29-37`), balance real, validación por lado+importe | **Conservar**, es el modelo a imitar |
| `config` (ruta menú) | 14 | Funcional pero decoys siempre los mismos 4 genéricos (`activities.mjs:46`), ruta parseada de `cfg[0]` por `:`/`>` (frágil) | **Rediseñar decoys** (P1) |
| `bughunt` | 14 | Error = siempre `war.root`; no-errores = `bp[0]/e2e[0]/cfg[0]` (`activities.mjs:61-68`). Distinguibles por *forma* de la frase | **Rediseñar distractores** (P1) |
| `forensic` | 9 | **Roto pedagógicamente**: el eslabón correcto se prefija con `⚠` (`activities.mjs:58`) → se ve a simple vista | **Corregir (P0)** |
| `consequence` | 25 | Tokens = la cadena **invertida** (`app.mjs:484`); patrón único causa→impacto→fix para las 25; el mensaje de error revela el meta-truco (`app.mjs:522`) | **Rediseñar (P0)**, es el motor más usado |
| `simulator` | 3 | **Roto**: ningún `screen` tiene `fields` (verificado: `grep -c "fields:" src/masterclass*` = 0), así que cae al fallback de `rows` (`activities.mjs:52-53`) → "elige el valor de *Ventas–CRM*" con opciones `✔ / Vacío / Bloqueado`. Sin sentido | **Corregir (P0)** |

**Fusiones/altas propuestas:** no crear motores nuevos (YAGNI). `bughunt` y `forensic` comparten mecánica ("marca el elemento anómalo de una lista"); pueden compartir generador de distractores. Falta un formato de **transición guiada** (no un motor de evaluación, sino un paso previo) — ver P0-2.

---

## 3. P0 — Bloquean la comprensión del usuario básico

### P0-1 · Micro-lección + instrucción específica antes de cada actividad
- **Problema (evidencia):** `renderProveMode` (`app.mjs:497-508`) no da contexto de la tarea; `activityInstructions` es una frase por tipo (`app.mjs:461-471`), igual para las 72 skills.
- **Solución (archivo `app.mjs`):** insertar, antes de `renderActivityBody`, un bloque de encuadre de 3 líneas fijas por actividad, alimentado del contenido YA existente de la skill: (1) *qué documento/decisión* es (`skill.objective`), (2) *qué tienes que hacer aquí* (instrucción reescrita en función del tipo + título de la skill), (3) *qué se evalúa*. Añadir además un botón **"Ver ejemplo resuelto"** que muestre `skill.example` (`base.mjs` `ex`) — ya renderizado en learn (`app.mjs:437`), reutilizar el fragmento.
- **Aceptación:** cada una de las 72 actividades muestra un encuadre distinto (no la frase genérica) derivado de `skill.objective`; test nuevo en `test/activities.test.mjs` que verifique que el encuadre por skill no es idéntico entre dos skills del mismo tipo.

### P0-2 · Puente "Práctica guiada" entre Entender y Demostrar
- **Problema (evidencia):** salto directo de `renderLearnMode` (denso) a `renderProveMode` (mecánico) vía toggle (`app.mjs:531-534`); no hay práctica intermedia con red de seguridad.
- **Solución (archivo `app.mjs`, opcional `activities.mjs`):** añadir un tercer estado de skill entre "learn" y "prove": **"guided"**, que ejecuta la MISMA actividad pero (a) con la respuesta correcta preseleccionable tras 1 intento fallido, (b) mostrando `assessment.hints` / `assessment.distractorWhy` de la skill (ya existen en datos, `base.mjs:135-137`), (c) sin marcar mastery. "Demostrar" queda como evaluación limpia sin ayudas.
- **Aceptación:** el toggle de modo ofrece 3 estados; en "guided" un fallo revela pista específica de la skill; en "prove" no hay pista y el acierto marca mastery. Test: `state.skillMode==='guided'` no dispara `ASSESS_SKILL`.

### P0-3 · Feedback específico por elemento, no binario
- **Problema (evidencia):** al fallar, mensaje genérico por tipo (`app.mjs:520-522`); no señala qué campo/eslabón falló; `resolution` solo visible al acertar (`app.mjs:519`).
- **Solución (archivo `app.mjs`, `validateActivity`):** devolver, además de `correct`, una lista de aciertos/errores por elemento (qué campo del simulador/asiento estuvo mal, qué eslabón del orden está fuera de sitio) y renderizarla en `.act-feedback`. Mostrar *siempre* (acierto o fallo) la explicación de negocio (`resolution`/`skill.pitfall`) tras comprobar.
- **Aceptación:** al fallar un `journal` con un lado incorrecto, el feedback nombra la línea concreta; al fallar `config`/`consequence`, señala la primera posición divergente. Verificable con test unitario sobre el nuevo retorno de `validateActivity`.

### P0-4 · Corregir el motor `simulator` (hoy sin sentido)
- **Problema (evidencia):** `simulatorSpec` (`activities.mjs:49-55`) espera `mc.screen.fields`, inexistente en todos los datos (`grep -c "fields:" src/masterclass*.mjs` = 0) → usa `rows`, generando tareas tipo "elige el valor de *Ventas–CRM*: ✔ / Vacío / Bloqueado".
- **Solución (archivos `masterclass*.mjs` + `activities.mjs`):** para las 3 skills simulator, definir en su `screen` un array `fields` real `[label, valorCorrecto, editable]` con decoys plausibles de negocio (p. ej. serie de numeración, condición de pago, almacén). Alternativa mínima si no se quiere tocar datos: reasignar esas 3 skills a un tipo que sí funcione con sus datos. Recomendación: definir `fields` (mantiene los 6 formatos vivos, requisito del test `activities.test.mjs:7`).
- **Aceptación:** para las 3 skills simulator, `getActivity().targets` tiene opciones donde los decoys son valores de negocio plausibles (no `Vacío/Bloqueado/Automático`); test que verifique que ningún `option` es literal `'— Vacío —'` para simulator.

### P0-5 · Corregir el autodelato del motor `forensic`
- **Problema (evidencia):** el eslabón roto se etiqueta con prefijo `⚠` (`activities.mjs:58`), visible en el render (`app.mjs:477`), regalando la respuesta.
- **Solución (archivo `activities.mjs`):** quitar el `⚠` del `label` del eslabón roto; el marcado de error debe ser lógico (`broken:true`), no visual en el texto. El feedback (P0-3) explica tras responder.
- **Aceptación:** ningún `evidence[].label` contiene `⚠`; el `broken:true` sigue siendo único (test existente `activities.test.mjs:8` sigue verde).

### P0-6 · Romper el meta-patrón del motor `consequence`
- **Problema (evidencia):** con 25 skills es el motor dominante; `consequenceSpec` (`activities.mjs:69-75`) genera siempre `[root, e2e[1], fix]` y los tokens son esa cadena **invertida** (`app.mjs:484`); el mensaje de error enseña el truco ("empieza por la causa raíz", `app.mjs:522`). Una vez visto, las 25 se resuelven igual sin pensar.
- **Solución (archivos `activities.mjs` + `app.mjs`):** (a) barajar los tokens de forma determinista (usar `shuffledDeterministic`, ya disponible) en vez de invertir; (b) añadir 1-2 distractores de cascada plausibles pero incorrectos por skill (evento no relacionado / consecuencia falsa) para que ordenar exija comprender la causalidad, no invertir; (c) quitar del mensaje la pista del meta-patrón.
- **Aceptación:** los tokens de `consequence` no son la cadena en orden inverso exacto; hay ≥1 token distractor que no pertenece a `a.chain`; validación sigue exigiendo el orden correcto.

---

## 4. P1 — Mejoras sustanciales

### P1-1 · Distractores con significado en `bughunt` y `config`
- **Problema (evidencia):** `bughuntSpec` (`activities.mjs:61-68`) toma no-errores de `bp[0]/e2e[0]/cfg[0]` → distinguibles por la *forma* de la frase, no por el contenido. `configSpec` (`activities.mjs:46`) usa siempre los 4 mismos decoys genéricos.
- **Solución (archivos `activities.mjs`, opcional datos):** en bughunt, generar los no-errores como variaciones plausibles del *mismo registro/pantalla* (mismo tono que el error). En config, extraer decoys de rutas de menú *reales adyacentes* de otras skills del mismo nivel, no de una lista fija.
- **Aceptación:** en config, los tokens decoy varían entre skills; en bughunt, los 4 clues comparten longitud/tono comparables (métrica simple de longitud) para que la distinción sea semántica.

### P1-2 · Estilo "breve + simple + explicativo" en el contenido de nivel avanzado
- **Problema (evidencia):** requisito de la propietaria (brief §3, §2). El contenido experto ya es denso (`masterclass*.mjs`, `deep.mjs`) pero el brief pide *densidad de insight por línea*, no longitud.
- **Solución (archivos `content/*.mjs`, `masterclass*.mjs`):** pasada editorial que garantice, por skill: 1 frase-ancla memorable (ya existe `anchor`), explicación en lenguaje llano ANTES del término técnico, y que cada `bp`/`cfg` empiece por el *porqué* de negocio. No añadir texto: comprimir. Auditar skills donde `concept`/`objective` exceden N caracteres sin ganar insight.
- **Aceptación:** métrica automatizable (test) — ninguna cadena de `concept`/`objective` supera un umbral de longitud sin justificación; revisión de Brenda sobre una muestra de 8 skills (1 por nivel).

### P1-3 · Estado de progreso honesto (no mastery al primer acierto)
- **Problema (evidencia):** un solo acierto marca la skill dominada (`app.mjs:726`, `ASSESS_SKILL correct:true`).
- **Solución (archivo `app.mjs` / reducer de progreso):** exigir acierto en modo "prove" (sin ayudas) y opcionalmente 2 aciertos separados para marcar dominio; "guided" no cuenta.
- **Aceptación:** acertar solo en "guided" no marca dominio; el dashboard de inicio refleja la distinción.

---

## 5. P2 — Refinamientos

### P2-1 · Curva L0→L8 y orden de skills
- **Problema (evidencia):** orden lineal fijo `L0-01..L8-08` con `prerequisites` encadenados (`base.mjs:136-138`); niveles: Modelo mental → Datos maestros → Logística → Ops avanzadas → Finanzas → Implementación → Web/Reporting → Ingeniería → IA/vibecoding (`base.mjs LEVEL_META`). El salto funcional→técnico L6→L7 (dual→technical) es el más brusco para un básico.
- **Solución:** no reordenar por reordenar (el orden funcional es correcto). Insertar en L7-01 y L8-01 una micro-lección puente "de consultor funcional a técnico" que reconecte con lo ya aprendido. Marcar visualmente en el Mapa (`renderMap`, `app.mjs:540-551`) el cambio de track.
- **Aceptación:** L7 y L8 arrancan con un bloque puente; Brenda valida que un básico no "cae por un precipicio" en L7.

### P2-2 · Accesibilidad del feedback
- **Problema (evidencia):** el feedback se distingue por color (`.act-feedback.is-correct/.is-wrong`, `activities.css:10`) más un símbolo; correcto, pero el color de "war" en learn usa `data-correct="false"` fijo (`app.mjs:412,451`) — inconsistencia semántica menor.
- **Solución:** unificar `data-correct` a semántica real; asegurar que correcto/incorrecto no dependan solo de color (ya hay ✓/↻, mantener).
- **Aceptación:** revisión manual; sin regresión de tests.

---

## 6. Lo que está BIEN y solo conviene pulir (honestidad)

- **Motor `journal`**: datos curados, balance en vivo, validación correcta. Es el patrón de referencia. No tocar salvo P0-3.
- **Masterclass (`masterclass*.mjs`)**: pantallas B1 realistas, war stories con cifras encadenadas, cfg/e2e/bp con densidad senior. Base sólida; solo pasada editorial (P1-2).
- **Modo "Entender" (`renderLearnMode`)**: completo y bien estructurado. El problema no es su contenido sino que no tiende un puente a "Demostrar" (P0-2).
- **Cobertura de tests**: 72/72 skills con actividad y evidencia (`activities.test.mjs`), determinismo garantizado. Mantener verdes y extender con los criterios de aceptación de arriba.
- **Orden curricular L0→L8**: pedagógicamente coherente; solo necesita puentes en los saltos de track (P2-1), no reordenación.

---

## 7. Secuencia de implementación recomendada

1. **P0-4, P0-5, P0-6** (correcciones de motores rotos/triviales) — bajo riesgo, alto impacto, aíslan bugs.
2. **P0-1, P0-3** (encuadre + feedback específico) — el mayor salto de comprensión.
3. **P0-2** (práctica guiada) — requiere estado nuevo; hacerlo tras estabilizar feedback.
4. **P1** completo, luego **P2**.

Cada paso: extender `test/activities.test.mjs` con su criterio de aceptación antes de dar por hecho. No marcar "hecho" sin tests verdes ejecutados.
