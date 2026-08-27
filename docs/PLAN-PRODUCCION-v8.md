# PLAN DE PRODUCCIÓN v8 — Learn-SapB1

**Propietaria:** Brenda · **Fecha de auditoría:** 2026-08-27 · **Sustituye a:** `docs/PLAN-MEJORA-v7.md` (2026-08-24)
**Alcance:** auditoría del plan anterior + plan ejecutable para dejar la aplicación lista para uso personal en producción.

## 0. Cómo leer este documento

Cada afirmación lleva su origen:

| Etiqueta | Significado |
|---|---|
| **Confirmado** | Ejecutado o leído en esta sesión. Se cita comando+salida, `archivo:línea`, o URL abierta. |
| **No verificado** | No pudo comprobarse contra fuente primaria en esta sesión. No se usa como base de ninguna decisión. |

Regla de este plan: **ningún ítem se marca hecho sin la salida real de su verificación.** Un test verde que no comprueba lo que dice comprobar no cuenta como evidencia.

---

## 1. Política de fuentes (obligatoria para todo cambio de contenido)

Jerarquía, de mayor a menor autoridad. Una fuente inferior **no** puede contradecir a una superior.

1. **`help.sap.com`** — guías de producto y referencias con número de versión y fecha. Autoridad máxima para comportamiento técnico, API y tablas.
2. **`learning.sap.com`** — cursos oficiales. Autoridad para *alcance curricular* y terminología de proceso. **No** es autoridad para detalles de parametrización que el curso no muestre.
3. **SAP Community** — solo entradas firmadas por empleados de SAP o SAP Mentors, y solo como apoyo o matiz. Nunca como única fuente de un dato duro.
4. **Foros y blogs de partners** — únicamente para detectar que existe un matiz que luego hay que confirmar en (1). **Nunca se cita como evidencia final.**

Tres reglas que se aplican a cada frase de contenido:

- **Sin fuente no se publica.** Si no hay (1) o (2) que lo respalde, el dato se elimina; no se suaviza.
- **Configuración no es estándar.** Todo comportamiento que dependa de versión, localización, tipo de documento o parametrización se escribe con su condición explícita. Prohibidas las absolutas (`siempre`, `nunca`, `automáticamente`, `obligatorio`) sobre comportamiento parametrizable.
- **Los números de cuenta son ejemplos.** Ningún número de cuenta se presenta como valor de SAP; se marca como ejemplo sintético dependiente de plan contable y localización.

### Fuentes abiertas y leídas en esta auditoría (Confirmado, 2026-08-27)

| Fuente | Título leído | Dato relevante |
|---|---|---|
| `learning.sap.com/courses/managing-logistics-in-sap-business-one` | Managing Logistics in SAP Business One | 7 unidades: exploración, compras, ventas, inventario, precios, producción y MRP, servicio |
| `learning.sap.com/courses/handling-accounting-in-sap-business-one` | Handling Accounting in SAP Business One | 7 unidades; objetivos incluyen asientos automáticos y manuales, plan de cuentas, plantillas y periódicos, conciliación interna y externa, asistente de pagos, activos fijos, contabilidad de costes y multidimensiones |
| `learning.sap.com/courses/implementing-sap-business-one` | Implementing SAP Business One | 3 unidades; objetivos incluyen autorizaciones generales y métodos de propiedad de datos, rangos de numeración y series automáticas, consultas SQL, alertas predefinidas y procesos de aprobación, y personalización de UDF, UDT, UDO y UDV |
| Guía oficial `Working_with_SAP_Business_One_Service_Layer.pdf` en `help.sap.com` (doc id `fc2f5477516c404c8bf9ad1315a17238`) | Working with SAP Business One Service Layer | **Document Version 1.28 – 2026-01-07**. Índice: §3.10 Batch Operations con subsección propia **Change Sets**; §3.8 con **Semantic Layer Basic Authentication** |
| `SDKHelp` en `help.sap.com` (doc id `089315d8d0f8475a9fc84fb919b501a3`) | SAP Business One SDK Help | Encabezado: **Database Tables (2870)** |

Las cinco URLs registradas en `EVIDENCE` que corresponden a estas entradas **resuelven y su título coincide** con el registrado en `src/content/base.mjs`. **No verificado en esta sesión:** `EV-CRYSTAL` y `EV-SERVICE-LAYER` (*Service Layer API Reference*) — no se abrieron.

---

## 2. Veredicto sobre el plan v7

El plan v7 fue un buen diagnóstico **y está mayoritariamente obsoleto**: cinco de sus seis P0 ya se implementaron después de escribirlo. Ejecutar el v7 tal cual sería rehacer trabajo terminado.

### 2.1 Lo que el v7 pedía y ya está hecho (Confirmado por ejecución)

| Ítem v7 | Estado real | Evidencia |
|---|---|---|
| **P0-1** encuadre específico por skill | **Hecho** | `activityBrief()` en `src/activities.mjs:81`. Comprobado: **72 encuadres distintos de 72, 0 duplicados** |
| **P0-2** puente "práctica guiada" | **Hecho** | Tercer modo real: `skillMode: ['learn','guided','prove']` en `src/app.mjs:33`, `:60`, `:503`; botón en `:538` |
| **P0-3** feedback por elemento | **Hecho** | `validateActivityDetailed()` devuelve `details[]` por ítem con `expected`/`got`; `src/activities.mjs:179-199` |
| **P0-4** simulador con campos reales | **Hecho** | `SIMULATOR_FIELDS` trilingüe en `src/activities.mjs:49`. Comprobado: **0 actividades con opciones genéricas** (`Sin valor`, `Automático`, `Bloqueado`) |
| **P0-5** autodelato forense con `⚠` | **Hecho** | Comprobado: **0 etiquetas de evidencia contienen `⚠`** |
| **P0-6** cadena invertida en `consequence` | **Hecho** | Comprobado: **0 de 25** actividades tienen `tokens` igual a la cadena invertida |
| **P1-3** dominio honesto | **Hecho** | Test vivo: *"one correct answer cannot master a skill and mastery requires repeated verified retrieval"* |

### 2.2 Donde el v7 describía mal el código

- **P1-1, `config`.** El v7 dice «decoys siempre los mismos **4** genéricos». Son **2**, y no por diseño sino por el recorte `.slice(0,2)` en `src/activities.mjs:117`. El defecto es real; la descripción no.
- **Task 4 del plan de remediación** lista `src/operations-check.mjs` como archivo a modificar. Ese archivo **no lo importa nadie** (ver §3, D6). Editarlo no tiene ningún efecto sobre la aplicación.

### 2.3 El vacío estructural del v7

El v7 auditó los **motores** de actividad y no auditó la **cobertura de contenido**. Por eso no vio los dos defectos más graves que hoy están vivos: 27 skills sin ficha MASTERCLASS y 5 actividades de configuración reducidas a un solo paso. Ambos pasan la suite actual sin encender ninguna luz.

---

## 3. Estado real verificado hoy

```
Rama de trabajo   plan/production-personal-v8   (creada desde main, diff previo preservado)
npm test          59/59 PASS
npm run build     PASS  (fragment 1.258.999 B · standalone 1.259.595 B)
browser smoke     PASS  { views: 8, skills: 72, languageLeaks: {en:0, de:0}, errors: [] }
git diff --check  limpio
Curriculum        72 skills · 9 niveles · 12 casos · 6 incidentes · 9 bosses
DEEP              45 / 72   -> 27 huecos
Formatos          consequence 25 · bughunt 14 · config 14 · forensic 9 · journal 7 · simulator 3
```

### Defectos vivos, por severidad

**D1 · P0 — 27 de 72 skills no tienen ficha MASTERCLASS.**
`DEEP` tiene 45 entradas correctas. Faltan: `L0-01/02/03/07/08`, `L1-01/03/04/05/07/08`, `L2-03/06`, `L3-03/08`, `L4-03/05/06`, `L5-04`, `L6-04/06/07`, `L7-02/03/05`, `L8-03/05`.
Efecto: más de un tercio del curso abre sin ancla, ruta ni ejemplo trabajado. **Ningún test lo detecta** — de ahí que la suite esté verde con el contenido incompleto.

**D2 · P0 — 5 actividades de configuración son irresolubles como ejercicio.**
Longitudes de ruta medidas: `L3-07`, `L5-02`, `L5-04`, `L5-05`, `L5-06` -> **1 paso**. Con 2 decoys, el alumno elige 1 token entre 3 y acierta por eliminación. Otras 4 tienen 2 pasos (`L3-05`, `L5-03`, `L6-04`, `L6-05`).
Causa: `configSpec()` deriva la ruta partiendo `mc.cfg[0]` por `:` y `>` (`src/activities.mjs:108-118`); si ese texto no trae separadores, la "ruta" es una sola cadena.
El test `activities.test.mjs:8` solo verifica que cada paso de la ruta esté entre los tokens — una ruta de un paso lo cumple trivialmente. **Es el mismo defecto que el v7 corrigió en `simulator`, sin corregir en `config`.**

**D3 · P1 — Los decoys de `config` son 2 literales fijos para las 14 skills.**
Medido: `Gestión` ×14, `Informes` ×14. Se reconocen a la primera y dejan de discriminar.

**D4 · P1 — `consequence` tiene 3 señuelos para 25 skills.**
Pool global de 3 en `src/activities.mjs:157-162`, rotado por índice de skill módulo 3; reparto medido 8/10/7. El v7 pidió señuelos por skill; la implementación usó un pool global. El meta-patrón vuelve: tras tres skills el alumno conoce los tres señuelos.

**D5 · P1 — Distribución de formatos desequilibrada.** `consequence` cubre el 35 % del curso (25/72) y `simulator` el 4 % (3/72). El formato dominante es además el de señuelos más pobres (D4).

**D6 · P0 de higiene — `src/operations-check.mjs` es código muerto y peligroso.**
194 líneas. Búsqueda de importadores sobre `*.mjs`, `*.html` y `*.json` -> **cero**. Es una copia divergente y **peor** de `activities.mjs`: números de cuenta incrustados en español sin capa i18n, frente a la versión viva que usa claves (`JOURNAL_BLUEPRINTS` + `JOURNAL_TEXT`, `src/activities.mjs:34-47`). Contiene además un texto corrupto (`'Bewertet: Delegation interpretieren.'`) que no llega a la aplicación solo porque el archivo no se carga.
Riesgo concreto: quien lo edite creyendo que es el módulo vivo perderá el trabajo silenciosamente.

**D7 · P1 de honestidad — El README declara un número de tests falso.**
`README.md:65` y `README.md:127` dicen `56/56 PASS`. La suite ejecuta **59**. Es un claim comprobable en cinco segundos y desacredita el resto del documento.

**D8 — RESUELTO (Confirmado 2026-08-27): la afirmación `FP 2405` es correcta y se mantiene.**
Presente en `src/content.mjs:137`, `src/content/base.mjs:223`, `src/content/l78.mjs:102` y `:112`: «Desde FP 2405, OData v4 es el protocolo principal; v3 está deprecado».
**Verificado abriendo la fuente primaria** que la propia app cita en su registro (*Service Layer API Reference*, `help.sap.com`, doc id `056f69366b5345a386bb8149f1700c19`). Cita literal del documento:

> «As of SAP Business One FP 2405, OData Version 3 is deprecated and OData Version 4 is the primary protocol supported in Service Layer.»

El contenido de la aplicación es una traducción fiel de esa frase. **La instrucción del plan de remediación del 2026-08-24 (*«removal of the unsupported FP 2405 claim»*) era errónea: habría borrado un dato correcto.** No ejecutarla.
Acción única pendiente: añadir a la ficha de evidencia la cita textual y su URL, para que el dato quede trazable y nadie vuelva a proponer su borrado.

**D9 · P1 de rigor — Los números de cuenta se muestran sin advertencia, contra el invariante declarado.**
Los asientos usan `430000` Cliente, `800000` Ventas, `177600` IVA repercutido, `157600` IVA soportado, `120000` Banco, `160000` Proveedor, `622000` Amortización, `490000` Amortización acumulada (`src/activities.mjs:44-47`).
El propio documento de diseño exige en su lista de invariantes: *«All exact G/L account numbers are marked as synthetic examples and configuration/localization dependent»*. Búsqueda de marca sintética junto a cuentas en `base.mjs` -> **sin resultados**. El invariante está escrito y no implementado.

**D10 · P2 — Trazabilidad de evidencia gruesa.** `EV-LOGISTICS` respalda 32 de las 72 skills. Un único enlace a curso no permite comprobar una frase concreta. Además el índice del SDK dice hoy **2870** tablas: si el número se cita en algún sitio, debe ir con fecha.

---

## 4. Definición de "listo para producción personal"

El objetivo no es una app comercial. Es una herramienta de estudio en la que Brenda pueda **confiar sin verificar cada frase**. Cinco criterios, todos medibles:

1. **Nada incompleto a la vista.** Las 72 skills abren con contenido completo en los tres idiomas.
2. **Ninguna actividad se resuelve sin pensar.** Toda actividad tiene solución determinista y suficientes alternativas plausibles para que acertar implique razonar.
3. **Ninguna afirmación sin fuente.** Todo dato técnico o se ancla en (1)/(2) de la política, o se elimina. Lo dependiente de configuración lo dice.
4. **Los documentos dicen la verdad.** README y registro de evidencia coinciden con el comportamiento medido.
5. **La suite protege de verdad.** Cada defecto reparado deja atrás un test que falla si vuelve.

---

## 5. Ejecución

Cinco fases. Cada una es un commit propio y **no se cierra sin la salida real de sus verificaciones**. El orden es deliberado: primero se instalan los detectores, después se repara. Un test que se escribe después del fix no demuestra nada.

### Fase 1 — Red de seguridad y limpieza (bajo riesgo, desbloquea el resto)

1. Añadir `test/coverage.test.mjs`:
   - `DEEP` cubre las **72** skills. *Debe fallar hoy, señalando 27.*
   - Toda actividad `config` tiene al menos **3** pasos de ruta. *Debe fallar hoy, señalando 9.*
   - Ninguna actividad `simulator` ofrece opciones genéricas.
   - `forensic` no expone `⚠`; `consequence` no es la cadena invertida. *(Blindaje de lo ya reparado en el v7.)*
2. Ejecutar y **pegar en el commit la salida de los fallos**, con los identificadores concretos.
3. Borrar `src/operations-check.mjs` (D6) y añadir al test de portabilidad una regla que prohíba módulos huérfanos en `src/`.
4. Corregir `56/56` por el conteo real en `README.md:65` y `:127` (D7), y derivar la cifra del recuento de la suite en vez de escribirla a mano.

**Cierre de fase:** `npm test` en verde salvo los fallos *intencionados* de cobertura, cuya salida queda registrada. Build y smoke en verde.

### Fase 2 — Saneamiento factual — **COMPLETADA 2026-08-27** (commit siguiente a Fase 1)

Resultado: 4 hechos fijados en `test/content-facts.test.mjs`, un error factual real corregido
(atomicidad de `$batch`) y la advertencia de cuentas renderizada y verificada en los tres idiomas.
Detalle abajo; el texto original de la fase se conserva como referencia de lo planificado.

1. **D8 `FP 2405`: RESUELTO, no requiere cambio de contenido.** Verificado contra la *Service Layer API Reference* el 2026-08-27; el dato es correcto (cita literal en §3, D8). Única acción: añadir la cita textual y su URL a la ficha de evidencia. **No borrar la afirmación** — la instrucción previa que lo pedía era errónea.
2. **D9 cuentas:** marcar cada número como ejemplo sintético dependiente de plan contable y localización, en los tres idiomas, y añadir un test que falle si aparece un número de cuenta sin su marca.
3. **Barrido de absolutas — hecho, con un hallazgo factual nuevo.** El barrido de `siempre`, `nunca`,
   `automáticamente` y `obligatorio` mostró que la gran mayoría son distractores deliberados de
   evaluación o principios pedagógicos, no afirmaciones sobre el sistema: correctas, no se tocan.
   Pero apareció **un error factual real** en `SYN-SK-L7-07` (Sesiones y lotes), que afirmaba
   *«los lotes ($batch) agrupan operaciones atómicas»*.

   Verificado contra el PDF oficial 1.28, §3.9.3 y §3.9.4, con dos citas literales:

   > «The service processes the requests within a batch request sequentially.»
   > «A change set is an atomic unit of works. It means that any failed sub request in a change set
   > will cause the whole change set to be rolled back. Change sets must not contain any GET
   > requests or other change sets.»

   Corregido en concepto, mentalidad, práctica, verificación, riesgo, tips, diagrama y análisis de
   distractores, en ES/EN/DE. Se añadió además la regla real que faltaba: un change set **no admite
   GET ni change sets anidados**. Y se rebajó un absoluto propio (*«la única causa»* pasó a *«la
   causa más frecuente»*).
4. Añadir `test/content-facts.test.mjs` que fije los hechos ya verificados y falle si se degradan.

**Cierre de fase (verificado 2026-08-27):**

```
npm test                    75 tests · 70 pass · 5 fail (solo detectores D1-D5)
npm run build               PASS  fragment 1261942 B / standalone 1262538 B
npm run test:browser:local  views 8 · skills 72 · languageLeaks 0/0 · errors []
render en navegador         aviso de cuentas correcto en ES/EN/DE · cita literal visible · 0 pageerrors
```

Durante la fase, la puerta de idioma detectó 4 regresiones que yo mismo había introducido al
corregir el contenido: campos nuevos sin traducción DE/EN. Las tres cadenas afectadas se
tradujeron de verdad. La cuarta era distinta: el campo `quote` es una **cita textual** en inglés y
traducirla la convertiría en paráfrasis, destruyendo su valor probatorio — se declaró estructural
en `test/i18n-coverage.test.mjs` con el motivo escrito en el código.

Lección para las fases siguientes: cada corrección de contenido debe nacer con sus tres idiomas.

### Fase 3 — Reparar las actividades rotas — **COMPLETADA 2026-08-27**

Resultado: D2, D3, D4 y D5 en verde **por reparación**, ningún umbral tocado. Aparecieron además
dos defectos que la auditoría no había visto, ambos corregidos (ver «Hallazgos nuevos» al final
de la fase). Solo queda D1, que es la Fase 4.

1. **D2:** para las 9 skills con ruta corta, definir la ruta de menú completa como dato explícito por skill —no derivada de partir una cadena—, verificada contra el curso oficial correspondiente. Mínimo 3 niveles.
2. **D3:** decoys de `config` extraídos de rutas reales adyacentes del mismo nivel, distintos entre skills.
3. **D4:** señuelo propio por skill en `consequence`, plausible en su dominio y falso por una razón explicable. Retirar el pool global de 3.
4. **D5:** rebalancear formatos de modo que ninguno pase del 25 % del curso, aprovechando que `simulator` ya tiene el andamiaje trilingüe para crecer.

**Hallazgos nuevos de esta fase (no estaban en la auditoría)**

1. **El `cfg` de 5 skills no contenía una ruta de menú, contenía prosa.** El generador partía esa
   prosa por `>` y `:`, así que la «ruta» era una frase entera: `['Usuarios se crean por grupo con
   perfil heredado…']`. No era una ruta corta, era que no había ruta. Por eso se sustituyó el
   derivado por un mapa explícito `CONFIG_ROUTES` de 14 entradas en ES/EN/DE.

2. **El defecto P0-6 seguía vivo en la capa de presentación.** `src/app.mjs:487` hacía
   `const tokens = [...activity.chain].reverse()`: descartaba los tokens barajados y los señuelos
   que la capa de datos ya producía correctamente, y pintaba la cadena exacta en orden inverso. El
   ejercicio se resolvía leyendo los botones de derecha a izquierda. El v7 dio este defecto por
   corregido porque solo miró los datos; el test de cobertura tampoco lo veía porque comprobaba
   `getActivity()`, no el render. Corregido y verificado en navegador: 5 tokens barajados con
   señuelo, no 3 invertidos.

3. **El test de simulador era demasiado débil.** Al mover skills a ese formato, dos cayeron al
   fallback genérico con opciones tipo «No comprobar» frente a frases largas. Se endureció el
   contrato: prohíbe esos literales y además exige que las opciones tengan longitudes comparables
   (ratio < 4), porque una opción larga entre opciones cortas se acierta por forma. El test
   endurecido destapó un tercer caso preexistente en `L0-03/de` (`FIFO` de 4 caracteres frente a
   `Gleitender Durchschnitt` de 23), corregido nombrando los métodos completos.

**Cierre de fase (verificado 2026-08-27):**

```
npm test                    75 tests · 74 pass · 1 fail (solo D1, Fase 4)
npm run build               PASS  fragment 1271484 B / standalone 1272080 B
npm run test:browser:local  views 8 · skills 72 · languageLeaks 0/0 · errors []
```

Resuelto a mano en navegador, con los tokens reales leídos del DOM:

```
L5-04 config       6 tokens · ruta de 4 pasos + 2 señuelos de otro nivel
L3-07 config       5 tokens · ruta de 3 pasos + señuelos de BOM (nivel adyacente)
L1-06 config       6 tokens · ruta de 4 pasos + Períodos contables / Detalles de la empresa
L8-01 consequence  5 tokens barajados, ya no la cadena invertida
L0-05 consequence  5 tokens barajados con señuelo de configuración real
L8-05 simulator    3 campos × 4 opciones de negocio plausibles
pageerrors         0
```

**Procedencia de las rutas de menú.** Las rutas de los cursos oficiales de SAP viven dentro de las
imágenes de los slides («choose the path shown in the slide»), no en texto extraíble; del curso
*Implementing SAP Business One* solo se obtuvo en texto `Reports > Query Generator`. Las rutas de
`CONFIG_ROUTES` se anclaron por tanto en el **árbol de menús del cliente Desktop observado
directamente en un sistema real con localización alemana** (dos pasadas de navegación de solo
lectura, 2026-08-04), más los nombres de módulo confirmados en los objetivos de los cursos. Queda
declarado en el código que los nombres dependen de versión y localización.

### Fase 4 — Completar las 27 fichas MASTERCLASS — **COMPLETADA 2026-08-27**

Resultado: **72/72 fichas completas, ninguna vacía**, con ancla, ruta y ejemplo trabajado.
Se trabajó por grupos y se ejecutó la suite completa entre cada uno:

```
L0        5 fichas  27 -> 22 huecos   suite: solo cobertura en rojo
L1        6 fichas  22 -> 16 huecos   suite: solo cobertura en rojo
L2-L3     4 fichas  16 -> 12 huecos   suite: solo cobertura en rojo
L4        3 fichas  12 ->  9 huecos   suite: solo cobertura en rojo
L5-L6     4 fichas   9 ->  5 huecos   suite: solo cobertura en rojo
L7-L8     5 fichas   5 ->  0 huecos   suite: 75/75 PASS
```

Se añadieron traducciones EN/DE al catálogo después de cada grupo y la puerta i18n se ejecutó
antes de continuar. La cobertura terminó verde sin bajar ningún umbral.

El bloque de mayor volumen y el de mayor riesgo de invención. Por eso va después de que los detectores existan.

1. Agrupar los 27 huecos por dominio: modelo mental (L0), datos maestros (L1), logística (L2/L3), finanzas (L4), implementación (L5), web y reporting (L6), técnico (L7), IA (L8).
2. Por grupo, **abrir la unidad del curso oficial que le corresponde** y redactar sobre lo que la fuente sostiene. Cada ficha: ancla, ruta y ejemplo trabajado, en ES/EN/DE.
3. **Regla dura:** si una ficha no puede anclarse en (1) o (2) de la política, **el hueco se queda vacío y se documenta**. Es preferible a rellenarlo con una plausibilidad.
4. Recuperar el contenido huérfano retirado de `DEEP` en el trabajo anterior y decidir por pieza: reasignar, convertir en caso del laboratorio, o descartar. Convertir exige redactar distractores razonados — es autoría nueva y se verifica como tal.
5. Ejecutar tras cada grupo: cobertura, i18n, anti-plantilla, build.

**Fuentes abiertas y usadas en la fase**

- SAP Learning: *Exploring Master Data and Documents* — maestros, marketing documents,
  Relationship Map y Reference Document.
- SAP Learning: *Creating Customers* — tipos de socio, condiciones de pago, crédito y listas.
- SAP Learning: *Working with Units of Measure* — tres UoM, factores y bloqueo con documentos abiertos.
- SAP Learning: *Managing Warehouses* / *Exploring Bin Locations* — drop ship, hasta 4 subniveles,
  código `05-A1-S2-L1`.
- SAP Learning: *Managing Pricelists* — lista base, factor y simulación del asistente.
- SAP Learning: *Exploring CRM* — actividades, calendario y tareas fuera del calendario.
- SAP Learning: *Implementing the Service Process* — fichas de equipo, series y garantía.
- SAP Learning: *Exploring the Chart of Accounts* / *Handling Payments* — determinación por niveles,
  conciliación, 4 medios de pago y cuentas puente.
- SAP Learning: *Managing Users and User Groups* / *Creating Queries* — 5 tipos de grupo y
  prohibición explícita de insert/update/delete con query tools.
- SAP SDK Help — **2870 tablas**, secciones DI API y UI API.
- OWASP Top 10 for LLM Applications 2026 — **LLM01 Prompt Injection** y **LLM02 Insecure Output Handling**.

**Hallazgos nuevos de la fase**

1. La app decía *Goods Receipt Clearing Account*, pero la lección oficial de compras llama el
   campo **Allocation Account** y explica que su saldo total representa las entradas abiertas no
   copiadas a factura. Corregido en `L2-02`, con condición de inventario permanente.
2. `content.mjs` no guarda alemán dentro de `DEEP`: la traducción se resuelve mediante el catálogo
   `TERMS`. Se creó `scripts/add-terms.cjs`, idempotente y con validación EN/DE, y se usó después de
   cada grupo.
3. La etiqueta `anchorLabel` existía traducida en ES/EN/DE pero nunca se renderizaba. El contenido
   estaba presente; la interfaz omitía el título «El ancla». Conectado y verificado en navegador.
4. El primer test visual falló falsamente por `text-transform: uppercase`: `innerText` devolvía
   `EL ANCLA`. Se reemplazó por un test estructural de `.sbl-anchor/.sbl-path/.sbl-example`.
5. Se añadieron dos contratos permanentes: las 72 skills deben renderizar las tres piezas en los
   tres idiomas, y la UI de `consequence` debe consumir **los tokens de `getActivity()`**, incluidos
   los señuelos, para que nunca vuelva la grieta datos/render.

**Cierre de fase (verificado 2026-08-27):**

```
npm test                    77/77 PASS
npm run build               PASS
npm run test:browser:local  8 vistas · 72 skills · fugas EN/DE 0/0 · errors []
Playwright dirigido         10 fichas nuevas × 3 idiomas · 0 problemas · 0 pageerrors
```

D1 cerrado: 72/72, anti-duplicado verde, ninguna ficha vacía.

### Fase 5 — Certificación y publicación

1. `npm test`, `npm run build`, `npm run test:browser:local` — las tres salidas pegadas en el cierre.
2. Recorrido manual completo en ES, EN y DE: inicio, mapa, entender, guiado, demostrar, casos, cadena, consola, fuentes.
3. Revisión adversarial en contexto limpio sobre el diff acumulado. Quien hizo el trabajo no lo aprueba.
4. Actualizar README con cifras medidas y declarar el alcance de verificación con honestidad: qué se comprobó contra fuente oficial y qué no.
5. PR, merge, borrado de rama. Confirmar la publicación en la URL en vivo.

**Criterio de rechazo:** si en el paso 3 aparece un dato sin fuente, la fase no se cierra. No se publica con salvedades.

---

## 6. Riesgos

| Riesgo | Por qué importa | Cómo se contiene |
|---|---|---|
| **Rellenar los 27 huecos con contenido plausible** | Es el fallo más probable y el más caro: una ficha inventada envenena el estudio y no la detecta ningún test | Fuente obligatoria por ficha; hueco vacío documentado es un resultado aceptable |
| **Aflojar un umbral para poner el test en verde** | Convierte la red de seguridad en decoración | Los umbrales de Fase 1 son contrato; bajarlos exige justificación escrita en el commit |
| **Editar el archivo muerto** | Trabajo perdido en silencio | Se borra en Fase 1, antes de tocar contenido |
| **Borrar `FP 2405` por error** | Un plan previo ordenó eliminarlo; el dato está **confirmado** por fuente oficial. Ejecutar esa orden destruiría contenido correcto | Cita literal registrada en §3 D8; test de hechos en Fase 2 que falla si alguien lo elimina |
| **Rehacer los P0 del v7** | Cinco de seis ya están hechos | §2.1 es la referencia; este plan sustituye al v7 |

---

## 7. Lo que está bien y no se toca

Dicho con la misma exigencia que los defectos: la base es sólida.

- **Arquitectura i18n.** Frontera estricta de idioma con dos puertas reales (`i18n-coverage`, `i18n-render`) y smoke de navegador que mide fugas: 0 en EN y DE. Es el mejor componente del repositorio.
- **Modelo de dominio.** El dominio se gana con umbrales por dimensión, puerta de seguridad y recuperaciones en días distintos. Un acierto no domina. Está en el reducer, no en el DOM.
- **Motor `journal`.** Datos curados, cuadre real, validación por lado e importe, y textos por clave i18n. Es el patrón a imitar en el resto.
- **Los tres modos.** `learn`, `guided` y `prove`, con el guiado sin conceder dominio. Exactamente el andamiaje que el v7 pedía.
- **Portabilidad.** Sin rutas absolutas, sin dependencias en runtime, sin clave de API. El standalone sigue siendo un único archivo.
- **Currículum L0 a L8.** El orden funcional es coherente. No se reordena.

---

## 8. Trazabilidad de esta auditoría

Ejecutado en `/home/ubuntu/Learn-SapB1-repo`, rama `plan/production-personal-v8`, 2026-08-27:

```
npm test                                  -> 59/59 PASS
npm run build                             -> PASS
npm run test:browser:local                -> views 8 · skills 72 · languageLeaks 0/0 · errors []
git diff --check                          -> limpio
Object.keys(DEEP).length                  -> 45   (27 ausentes, enumerados)
ACTIVITY_COUNTS                           -> consequence 25 · bughunt 14 · config 14 · forensic 9 · journal 7 · simulator 3
config route lengths                      -> 5 con 1 paso · 4 con 2 pasos
config decoys                             -> Gestión x14 · Informes x14
consequence decoys distintos              -> 3 (8/10/7)
briefs distintos                          -> 72/72 · 0 duplicados
forensic con warning visible              -> 0
consequence igual a cadena invertida      -> 0/25
simulator con opciones genéricas          -> 0
importadores de operations-check.mjs      -> 0
ocurrencias de FP 2405 en src/            -> 4
56/56 en README.md                        -> líneas 65 y 127
web_extract sobre 5 URLs oficiales        -> las 5 resuelven; títulos y versiones en §1
sitio publicado (raíz)                    -> HTTP 200 · landing · 0 errores de consola · 0 peticiones fallidas
sitio publicado (/lab/)                   -> HTTP 200 · 8 vistas con contenido · 72 skills en el mapa · 0 errores
los 7 enlaces del registro de fuentes     -> HTTP 200 los 7, comprobados en vivo
FP 2405 en Service Layer API Reference    -> CONFIRMADO por cita literal
```

**No verificado en esta sesión, declarado:** el contenido *sustantivo* de las 72 skills frente a un tenant SAP real (auditoría frase por frase); y el contenido interno de `EV-CRYSTAL` más allá de que la URL resuelve con HTTP 200. Esto último queda fuera de alcance por diseño y así debe declararse en el README.
