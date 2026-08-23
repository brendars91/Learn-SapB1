# Learn-SapB1

<div align="center">

**Laboratorio interactivo trilingüe para dominar SAP Business One — desde cero hasta nivel avanzado, con IA y vibecoding.**

🇪🇸 [Español](#español) · 🇬🇧 [English](#english)

[![tests](https://img.shields.io/badge/tests-38%2F38%20PASS-brightgreen)](#verificación) [![offline](https://img.shields.io/badge/modo-100%25%20offline-blue)](#privacidad-y-modo-offline) [![tamaño](https://img.shields.io/badge/archivo-%3C1%20MiB-orange)](#cómo-usarla)

### ➡️ [**ABRIR LA APLICACIÓN**](https://brendars91.github.io/Learn-SapB1/)

</div>

---

## Español

Herramienta de estudio **personal, offline y sin cuentas** para aprender SAP Business One con el rigor de un consultor senior: no memorizar pantallas, sino entender dependencias, razonar como un profesional y saber qué verificar antes de actuar.

### Cómo usarla

**Opción 1 (recomendada):** pulsa [**ABRIR LA APLICACIÓN**](https://brendars91.github.io/Learn-SapB1/) — funciona directamente en el navegador, sin instalación.

**Opción 2:** descarga [`index.html`](index.html) y ábrelo con doble clic en cualquier navegador moderno. Todo el contenido, estilos y lógica viven dentro del único archivo HTML (<1 MiB). No requiere servidor, cuenta, clave API ni conexión.

### Qué contiene

| Módulo | Descripción |
|---|---|
| **Diagnóstico adaptativo** | 6 decisiones calibran tu punto de entrada entre 9 niveles |
| **72 competencias únicas** | 9 niveles × 8 skills, cada una con autoría propia: concepto, mentalidad, tips de experto, trampa típica de junior y checklist de verificación |
| **Modo Entender** | Cada skill abre con un **diagrama visual a medida** (cadena documental, cascada de precios, balance Debe/Haber…), mentalidad en una frase y tips de experto — entender antes de examinar |
| **Modo Demostrar** | Evaluación en 3 pasos: decide → comprométete con el *principio* que justifica → razonamiento senior paso a paso + por qué falla cada opción incorrecta |
| **Caso Lab e Incident Room** | 12 casos + 6 incidentes con razonamiento senior y análisis de distractores |
| **Explorador de cadena** | O2C / P2P / finanzas / integración: clic en cada documento y ve sus **3 efectos** (stock, contabilidad, saldo del socio) |
| **Lab de IA y contexto** | Constructor del contrato de contexto con puntuación en vivo y escáner de privacidad local |
| **9 niveles de IA y vibecoding** | Desde triaje de casos de IA hasta defensa anti prompt-injection y automatización con puerta humana |
| **Radar y heatmap** | Perfil de dominio en 4 dimensiones (conocimiento, aplicación, verificación, riesgo) y mapa de calor por nivel |
| **Repaso espaciado** | Cola de recuperación con repetición [1, 3, 7, 14] días |
| **Registro de evidencia** | 7 fuentes oficiales SAP con fecha de verificación y aplicabilidad por versión |

### El estándar de dominio (diseño pedagógico)

- **Dominio ≠ acierto único.** Se exigen umbrales distintos por dimensión: conocimiento y aplicación ≥ 80, verificación y riesgo ≥ 90.
- **Safety gate:** ninguna competencia se domina sin pasar la puerta de seguridad (la respuesta "segura pero incompleta" no domina).
- **3 aciertos sostenidos** para dominar; un fallo reinicia la racha.
- **El error enseña:** cada opción incorrecta tiene su propia explicación de por qué falla.

### Privacidad y modo offline

- Todos los datos de aprendizaje son sintéticos y marcados `SYN-*`.
- El progreso permanece en `localStorage` de tu navegador; la exportación contiene solo IDs, puntuaciones y fechas — nada personal.
- El texto del Lab de IA es solo de sesión: nunca se persiste ni se exporta.
- **Cero telemetría, cero peticiones de red.** Los enlaces a fuentes oficiales solo se abren si los pulsas.

### Verificación

```
node --test test/*.test.mjs   →  38/38 PASS
node scripts/build.mjs        →  reconstruye el standalone desde src/
```

Incluye test **anti-plantilla**: falla si dos competencias vuelven a compartir texto de evaluación (garantiza autoría única por skill).

### Estructura del repositorio

```
SAP-Business-One-Mastery-Lab-Standalone.html  ← la aplicación (ábrelo y listo)
src/            contenido (72 skills autorados), dominio, UI, estilos
test/           38 tests: contenido, contratos, runtime, unicidad
scripts/        build del standalone
```

### Fuentes

Todo el contenido técnico está anclado a documentación oficial SAP Business One 10.0 (verificable en la pestaña **Fuentes** de la aplicación): rutas de aprendizaje oficiales de logística/contabilidad/implementación, SDK Help, Service Layer (guía 1.28, OData v4 primario desde FP 2405) y Crystal Reports.

### Licencia y alcance

Herramienta educativa personal de [Brenda](https://github.com/brendars91). Datos 100% sintéticos (`SYN-*`). SAP Business One es una marca de SAP SE; este proyecto no está afiliado ni respaldado por SAP.

---

## English

A **personal, offline, account-free** study environment to master SAP Business One with a senior consultant's rigour: not memorising screens, but understanding dependencies, reasoning like a professional, and knowing what to verify before acting.

### How to use

**Option 1 (recommended):** click [**OPEN THE APP**](https://brendars91.github.io/Learn-SapB1/) — runs straight in the browser.

**Option 2:** download [`index.html`](index.html) and double-click it. Everything lives in a single <1 MiB HTML file: no server, account, API key, or network needed.

### What's inside

- **Adaptive diagnostic** — 6 decisions calibrate your entry point across 9 levels
- **72 unique skills** — each hand-authored: concept, mindset, expert tips, junior trap, verification checklist, custom SVG diagram
- **Understand mode** — learn visually before any test
- **Prove mode** — 3-step assessment: decide → commit to the *principle* → senior reasoning + why each wrong option fails
- **Case Lab & Incident Room** — 12 cases + 6 incidents with senior reasoning and distractor analysis
- **Chain explorer** — O2C / P2P / finance / integration: click any document to see its **3 effects** (stock, accounting, partner balance)
- **AI & Context Lab** — context-contract builder with live scoring and local privacy scanner
- **9 levels of AI & vibecoding** — from AI opportunity triage to prompt-injection defence and human-gated automation
- **Mastery radar & heatmap** — 4-dimension profile (knowledge, application, verification, risk)
- **Spaced repetition** — [1, 3, 7, 14]-day retrieval queue
- **Evidence registry** — 7 official SAP sources with verification dates and version applicability

### Mastery standard

Mastery ≠ one right answer. Dimension thresholds: knowledge/application ≥ 80, verification/risk ≥ 90; a safety gate must pass; 3 sustained correct answers required. Every wrong option explains why it fails.

### Privacy & offline

Synthetic-only data (`SYN-*`), progress stays in your browser's `localStorage`, exports contain no personal data, prompt-lab text is session-only. Zero telemetry, zero network requests.

### Verification

```
node --test test/*.test.mjs   →  38/38 PASS
node scripts/build.mjs        →  rebuilds the standalone from src/
```

Includes an **anti-template test**: fails if two skills ever share assessment text again.

### Sources

All technical content is anchored to official SAP Business One 10.0 documentation (see the **Sources** tab in the app).

### License & scope

Personal educational tool by [Brenda](https://github.com/brendars91). 100% synthetic data. SAP Business One is a trademark of SAP SE; this project is not affiliated with or endorsed by SAP.
