# Learn-SapB1

<div align="center">

**Laboratorio interactivo trilingüe para dominar SAP Business One — desde cero hasta nivel avanzado, con IA y vibecoding.**

🇪🇸 [Español](#español) · 🇬🇧 [English](#english)

[![tests](https://img.shields.io/badge/tests-56%2F56%20PASS-brightgreen)](#verificación) [![offline](https://img.shields.io/badge/modo-100%25%20offline-blue)](#privacidad-y-modo-offline) [![tamaño](https://img.shields.io/badge/standalone-%3C1%2C5%20MiB-orange)](#cómo-usarla)

### ➡️ [**ABRIR LA APLICACIÓN**](https://brendars91.github.io/Learn-SapB1/)

[Handbuch der Belegkette](https://brendars91.github.io/Learn-SapB1/scroll/) · la portada larga: la cadena documental se arma mientras lees y el margen te escribe el libro mayor de tu visita

</div>

---

## Español

Herramienta de estudio **personal, offline y sin cuentas** para aprender SAP Business One con el rigor de un consultor senior: no memorizar pantallas, sino entender dependencias, razonar como un profesional y saber qué verificar antes de actuar.

### Cómo usarla

**Opción 1 (recomendada):** pulsa [**ABRIR LA APLICACIÓN**](https://brendars91.github.io/Learn-SapB1/) — funciona directamente en el navegador, sin instalación. La versión web usa los módulos de `src/` para que GitHub Pages siempre sirva la lógica actual.

**Opción 2 (offline):** descarga [`dist/SAP-Business-One-Mastery-Lab-Standalone.html`](dist/SAP-Business-One-Mastery-Lab-Standalone.html) y ábrelo con doble clic en cualquier navegador moderno. El standalone contiene contenido, estilos y lógica en un único archivo HTML y no requiere servidor, cuenta ni clave API.

### Qué contiene

| Módulo | Descripción |
|---|---|
| **Diagnóstico adaptativo** | 6 decisiones calibran tu punto de entrada entre 9 niveles |
| **72 competencias únicas** | 9 niveles × 8 skills, cada una con autoría propia: concepto, mentalidad, tips de experto, trampa típica de junior y checklist de verificación |
| **Modo Entender** | Cada skill abre con un **diagrama visual a medida** (cadena documental, cascada de precios, balance Debe/Haber…), mentalidad en una frase y tips de experto — entender antes de examinar |
| **Modo Demostrar** | Evaluación práctica con feedback por elemento y puerta de seguridad |
| **Caso Lab e Incident Room** | Casos e incidentes con razonamiento senior y análisis de distractores |
| **Explorador de cadena** | O2C / P2P / finanzas / integración: clic en cada documento y ve sus efectos en stock, contabilidad y saldo del socio |
| **Consola avanzada** | SQL, dashboards/KPI y vibecoding aplicado a SAP Business One |
| **Radar y heatmap** | Perfil de dominio en 4 dimensiones (conocimiento, aplicación, verificación, riesgo) y mapa de calor por nivel |
| **Registro de evidencia** | Fuentes oficiales SAP con fecha de verificación y aplicabilidad por versión |

### Idiomas

La interfaz permite **Español, English y Deutsch**. La versión web aplica una frontera de idioma estricta: al elegir un idioma no se reutilizan silenciosamente textos de otro idioma. Los mockups legacy cuyos campos aún no tienen una localización completa se ocultan en EN/DE antes que mostrar una mezcla de idiomas.

### El estándar de dominio (diseño pedagógico)

- **Dominio ≠ acierto único.** Se exigen umbrales distintos por dimensión: conocimiento y aplicación ≥ 80, verificación y riesgo ≥ 90.
- **Safety gate:** ninguna competencia se domina sin pasar la puerta de seguridad.
- **3 aciertos sostenidos** para dominar; un fallo reinicia la racha.
- **El error enseña:** el feedback identifica qué elemento falló y qué debía verificarse.

### Privacidad y modo offline

- Todos los datos de aprendizaje son sintéticos y marcados `SYN-*`.
- El progreso permanece en `localStorage` de tu navegador; la exportación contiene solo IDs, puntuaciones y fechas.
- El texto libre de trabajo no se persiste en la exportación de progreso.
- **Cero telemetría.** Los enlaces a fuentes oficiales solo se abren si los pulsas.

### Verificación local

```bash
npm run build                 →  reconstruye el standalone desde src/
npm test                      →  56/56 PASS
npm run test:browser:local    →  recorre las 8 vistas y 72 competencias × 3 modos en
                                 Chromium, en los tres idiomas
```

Incluye test **anti-plantilla** (falla si dos competencias comparten texto de evaluación) y
**puerta de idioma**: `i18n-coverage` falla si algún texto no tiene inglés o alemán, e
`i18n-render` falla si al elegir inglés o alemán se cuela una frase en español.

### Estructura del repositorio

```text
index.html                                      ← entrada de GitHub Pages
src/                                            ← contenido, dominio, UI y runtime trilingüe
dist/SAP-Business-One-Mastery-Lab-Standalone.html ← versión offline autocontenida
test/                                           ← pruebas de contenido, contratos y runtime
scripts/                                        ← build y controles de localización
```

### Fuentes

Todo el contenido técnico está anclado a documentación oficial SAP Business One 10.0 (verificable en la pestaña **Fuentes** de la aplicación): rutas de aprendizaje oficiales, SDK Help, Service Layer y Crystal Reports.

### Licencia y alcance

Herramienta educativa personal de [Brenda](https://github.com/brendars91). Datos 100% sintéticos (`SYN-*`). SAP Business One es una marca de SAP SE; este proyecto no está afiliado ni respaldado por SAP.

---

## English

A **personal, offline, account-free** study environment to master SAP Business One with a senior consultant's rigour: understand dependencies, reason professionally, and know what to verify before acting.

### How to use

**Option 1 (recommended):** click [**OPEN THE APP**](https://brendars91.github.io/Learn-SapB1/) — it runs directly in the browser. The web version loads the current modules from `src/`, so GitHub Pages is no longer tied to a stale generated `index.html` bundle.

**Option 2 (offline):** download [`dist/SAP-Business-One-Mastery-Lab-Standalone.html`](dist/SAP-Business-One-Mastery-Lab-Standalone.html) and double-click it. The standalone keeps content, styles and logic in one HTML file and requires no account or API key.

### What's inside

- **72 unique skills** across 9 levels
- **Understand mode** with visual explanations, expert tips, risks and verification steps
- **Practical assessment** with granular feedback and a safety gate
- **Case Lab & Incident Room** for senior reasoning
- **Chain explorer** for O2C / P2P / finance / integration effects
- **Advanced console** for SAP B1 SQL, management dashboards and applied vibecoding
- **Mastery radar & heatmap** across knowledge, application, verification and risk
- **Evidence registry** anchored to official SAP sources

### Languages

The application supports **Español, English and Deutsch**. The web runtime enforces a strict language boundary: selecting a language no longer silently falls back to another language. Legacy SAP B1 mock-ups that do not yet have a complete EN/DE field set are hidden rather than displayed with mixed-language labels.

### Privacy & offline

Synthetic-only learning data (`SYN-*`), progress stays in browser `localStorage`, exported progress contains no free-text working content, and there is no telemetry.

### Local verification

```bash
npm run build                 →  rebuilds the standalone from src/
npm test                      →  56/56 PASS
npm run test:browser:local    →  exercises the 8 views and 72 skills × 3 modes in
                                 Chromium, across the three languages
```

Includes an **anti-template test** (fails if two skills share assessment text) and a
**language gate**: `i18n-coverage` fails if any text lacks English or German, and
`i18n-render` fails if a Spanish sentence surfaces when English or German is selected.

### Sources

Technical content is anchored to official SAP Business One 10.0 documentation available from the application's **Sources** tab.

### License & scope

Personal educational tool by [Brenda](https://github.com/brendars91). 100% synthetic data. SAP Business One is a trademark of SAP SE; this project is not affiliated with or endorsed by SAP.
