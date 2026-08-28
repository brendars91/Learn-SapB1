# Auditoría de idioma — Learn-SapB1 Lab (ES / EN / DE)

**Fecha:** 2026-08-27 · **Método:** DOM renderizado completo en Chromium real (Playwright), 3 idiomas × 8 vistas × 72 skills × 3 modos + actividades interactivas (check vacío + pista) + consola avanzada (4 tabs) + diagnóstico + 12 casos + 6 incidentes + simulador (4 procesos) — 373 secciones por idioma, 0 errores de consola. Análisis posterior con detectores de fuga lingüística (ES/EN/DE), mojibake, caracteres de control, entidades HTML, residuos de plantilla y ortografía (pyspellchecker es/en/de). Cada hallazgo verificado contra el código fuente.

**Cobertura verificada:** 72 temarios (learn/guided/prove), 72 masterclasses, 74 anchors DEEP, 12 casos, 6 incidentes, 9 niveles, simulador, consola IA, diagnóstico adaptativo.

**Limitaciones declaradas:** (1) los 9 "boss battles" se renderizan solo al desbloquear niveles por progreso real — su contenido se auditó vía capa de datos (tests) no vía DOM interactivo; (2) las respuestas correctas de actividades solo se ejercitaron con check vacío (feedback de error + pista), no resolviendo cada una de las 72 actividades; (3) pyspellchecker usa diccionarios generales: el diccionario ES/DE genera mucho falso positivo (palabras comunes marcadas) — solo se usó su señal EN, depurada a mano.

---

## VEREDICTO GLOBAL

La puerta de idioma está **sólida en la capa de datos** (los 77 tests pasan; el catálogo TERMS cubre todo el contenido traducible; el set INVARIANT congela solo códigos) pero el DOM real muestra **7 defectos genuinos**, de los cuales 2 son visibles por cualquier usuario que cambie de idioma.

---

## DEFECTOS REALES (con evidencia)

### D1 · CRÍTICO — Feedback de actividades congelado en el idioma del check
- **Qué:** al pulsar "Comprobar" en ES y cambiar a EN/DE, el feedback (`✗ Paso 1: esperaba "..." — correct: ...`) conserva TODO el texto en español: etiquetas ("Paso", "esperaba") y contenido (los pasos esperados).
- **Dónde:** `src/app.mjs:781` construye `message` y `details` (items/expected ya resueltos a strings en el locale del momento) y los guarda en `state.activityFeedback`; el render (línea 527/520) solo re-traduce el envoltorio (`actNotYet`, `actCorrectAnswer`), nunca `feedback.message` ni `d.item`/`d.expected` crudos.
- **Reproducción empírica:** check vacío en L8-01 (ES) → switch a EN → sigue "✗ Paso 1: esperaba «Selección de tecnología por moda...» — correct: Selección...". En DE: "richtig:" re-traducido pero el resto en ES.
- **Impacto:** cualquier usuario que revisa su error tras cambiar de idioma ve el feedback en el idioma anterior. En la captura de auditoría (una misma sesión es→en→de) esto produjo 5 líneas españolas dentro del EN ("Revisa los elementos marcados…", "✗ Paso 1: esperaba…" ×3) y 2 inglesas dentro del DE ("Review the marked items…", "✗ Step 2: expected…").
- **Fix propuesto:** validar y renderizar el feedback perezosamente (guardar solo el verdict + specs del activity en el estado, re-evaluar `validateActivityDetailed` en cada render con `state.locale`), o descartar `activityFeedback` en la acción `SET_LOCALE`.

### D2 · ALTO — Doble escape HTML en anchors y diagramas (solo EN/DE)
- **Qué:** los apóstrofes se ven como `&#39;` y las comillas como `&quot;` en pantalla: "Modules are a city&#39;s districts…", "…no longer &quot;available&quot; to others."
- **Dónde:** `src/app.mjs:441` `escapeHtml(local(an, …))` — `local()` (línea 156) ya aplica `escapeHtml(trNode(...))`. También líneas 194-195, 245-246 (labels de diagramas SVG) y 276 (title/aria-label del heatmap).
- **Evidencia:** 25 skills con entidades visibles en EN (L0-01, L0-04, L0-06, L1-06, L2-01, L2-08, L3-01..04, L3-08, L4-02/04/07/08, L5-01/03/06, L6-02, L7-01/06, L8-02/04/06/08).
- **Fix:** quitar el `escapeHtml` externo en esas 6 llamadas (dejar solo `local()`/`trText` ya escapado).

### D3 · ALTO — Etiquetas de war story duplicadas ("Resolución Resolución:")
- **Qué:** 3 textos fuente arrancan con su propia etiqueta y el render añade otra `<strong>`: "Causa raíz Causa raíz: …" / "Resolución Resolución: …" (ES), "Root cause Root cause:" (EN), "Ursache Ursache:" / "Lösung Lösung:" (DE).
- **Dónde:** `src/masterclass.mjs:35-36` y `src/masterclass-data-1.mjs:180` + `TERMS` (traducciones DE que heredan el prefijo). Render en `app.mjs:417-419`.
- **Impacto:** L0-01 (es/en/de) y L1-01 (es/de) muestran duplicado.
- **Fix:** quitar el prefijo del texto fuente (y de sus 3 entradas TERMS) o eliminario en render.

### D4 · MEDIO — Typos alemán: "teiligeliefert"
- `src/content.mjs:46` CASES SYN-CASE-03: `de: 'SYN-SO-0001 teiligeliefert. Was prüfen?'` → correcto: **teilgeliefert**. Visible en la vista Casos en DE.

### D5 · MEDIO — Comillas angulares «» dentro del inglés (61 líneas EN)
- 7 traducciones EN del catálogo TERMS usan «…» (convención española/francesa) p. ej. «efficient», «I can’t see it», «It opens» proves syntax. El inglés del app usa por otra parte apóstrofe curvo ’ y " " — las «» son consistencia interna rota del EN.
- **Fix:** sustituir «» por " " en los valores `en:` (7 entradas TERMS).

### D6 · MEDIO — Hueco del catálogo: 'OINV (facturas)'
- `src/masterclass-data-5.mjs:58` celda `'OINV (facturas)'` no está en TERMS (sus hermanas 'INV1 (líneas)' y 'OITM (artículos)' sí) → se muestra en español en EN/DE en el mockup del join de L6-07.
- **Fix:** añadir la entrada TERMS con en: 'OINV (invoices)' / de: 'OINV (Rechnungen)'.

### D7 · BAJO — Etiqueta+valor pegados en simulador (sin clase CSS)
- `.sbl-effect` (app.mjs:570) no existe en ningún CSS: `<span class="text-small">Saldo socio</span><strong>Sin efecto</strong>` quedan a 0px de separación ("Saldo socioSin efecto", "StockNinguno", "Cuenta bancariaMedio de pago" — en EN "Bank accountPayment means").
- **Evidencia:** getBoundingClientRect: labelRight === strongLeft.
- **Fix:** añadir `.sbl-effect { display:flex; flex-direction:column; gap:.25rem }` o similar.

### Observaciones no defecto (diseño intencional, verificar con Brenda)
- **INVARIANT con prosa alemana/española:** '465000 Währungsdiff', '473000 Skonti', '120000 Deudores', '400000 Ventas', '572000 Bancos'… — el plan de cuentas sintético (SKR03) se muestra igual en los 3 idiomas por diseño (los números de cuenta son la clave). "2 defectos", "4 visitas", "800 pedidos/mes", "Mermas 4%", "tasa A/C", "Codificar: 5d"… son celdas de datos del laboratorio ES congeladas igual en 3 idiomas: **decisión de producto** — si Brenda quiere traducirlas, hay que moverlas de INVARIANT a TERMS.
- **Cita literal FP 2405:** el bloque en inglés dentro de ES/DE es la cita textual de la fuente oficial (verificada 27-Ago) — correcto según política de evidencia del repo.
- **"SAP HANA versus Microsoft SQL":** "versus" es igual en EN; en ES usa "frente a" y en DE "gegenüber" — correcto.
- **Iconografía emoji (💡⚠️🎓⚙🔗🏆✓✗):** sistema visual deliberado, consistente en los 3 idiomas.
- **„…“ alemanas y ’ curvas EN:** tipografía correcta por idioma.
- **"symptom/Symptom" DE:** cognado real ES/EN/DE, no fuga.
- **"schiefging" (145x):** pretérito correcto de schiefgehen.
- **Truncado "Finanzas y con":** `.slice(0,14)` intencional del heatmap (app.mjs:276).
- **U+FE0F variation selector** tras ⚠/⚙/✓: cómo los navegadores renderizan emoji+texto; inofensivo.

## Tests sugeridos (para blindar estos 7 defectos)
1. `feedback-locale.test.mjs`: check → SET_LOCALE → el innerText del feedback no contiene regex español en EN/DE.
2. `double-escape.test.mjs`: ningún innerText de skill learn contiene `&#39;|&quot;|&amp;` en ningún idioma.
3. `war-labels.test.mjs`: los textos root/fix/sympt no arrancan por su propia etiqueta en ningún idioma.
4. `guillemets-en.test.mjs`: los valores `en:` de TERMS no contienen «».
5. Extender `browser-smoke-local.mjs` de 9 a 72 skills el escaneo de fugas.
