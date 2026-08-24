# Learn-SapB1 Full Remediation Design

## Goal

Convert the current public prototype into a reproducible, strictly localized and pedagogically usable SAP Business One learning application. The result must preserve the zero-runtime-dependency standalone build while making the public Pages entrypoint and the offline artifact execute the same source behavior.

## Scope

This remediation covers every confirmed finding from the 2026-08-24 live audit: non-portable tests and build flow; mixed ES/EN/DE output; brittle post-render locale patching; inaccessible diagnostic and review flows; broken mastery recording and fake safety gate; underspecified activities; misleading progress and career calculations; map focus/scroll; destructive reset; accessibility semantics; unsupported or over-absolute SAP claims; evidence traceability; and public/offline wording.

It does not attempt to validate every sentence of all 72 skills against a live SAP tenant. Product claims that depend on localization or configuration must be labelled as such, and the release must not claim claim-level validation where only course-level evidence exists.

## Architecture

1. `src/content/base.mjs` remains the UI dictionary and source registry. All visible interface strings move there and every key must exist in ES, EN and DE.
2. Authored lesson fields remain localized values. Rendering uses strict locale selection: a missing locale is a validation error, never a silent Spanish fallback. Extended masterclass sections render only data available in the selected locale; German uses its fully localized skill lesson instead of the legacy ES/EN-only masterclass payload.
3. `src/domain.mjs` owns durable learning state and pure progression rules. UI events dispatch one semantic action; assessment, safety and review invariants are enforced by the reducer rather than trusted from DOM flags.
4. `src/activities.mjs` owns explicit, solvable activity specifications. Each activity exposes scenario, task, expected evidence and safety question. Account numbers are synthetic examples, not universal SAP defaults.
5. `src/app.mjs` renders semantic navigation and preserves focus. Selecting a skill moves focus to a lesson region. Reset requires a confirmation state. Diagnostic and review are first-class views.
6. The build writes only repository-relative `dist/` artifacts. Tests calculate paths from `import.meta.url`; CI runs build before release tests and executes a portable browser smoke test.

## Invariants

- Selecting ES, EN or DE never renders interface prose from another language.
- A missing translation fails a deterministic locale-contract test.
- Guided practice never grants mastery. Prove mode requires both task correctness and an explicit safety decision.
- One success cannot master a skill; three successful retrievals must occur on distinct UTC dates.
- A map click exposes and focuses the selected lesson.
- Progress labels distinguish inventory counts from completed counts.
- All exact G/L account numbers are marked as synthetic examples and configuration/localization dependent.
- Public hosting is described as local processing without application telemetry; only the standalone artifact is described as offline.
- No test, build script or workflow contains machine-specific absolute paths.

## Release and rollback

Each block is a separate commit. The block is pushed only after unit/build checks and browser verification. GitHub Pages can be rolled back by moving `main` to the previous verified commit; localStorage schema remains backward-compatible and derived mastery is recomputed from valid evidence.

## Acceptance

- `node scripts/build.mjs && node --test test/*.test.mjs` exits 0 from a clean clone.
- The browser smoke script exits 0 using an auto-detected Chromium/Chrome binary.
- Live ES, EN and DE flows pass: Home → Map → select lesson → Guided → Prove → Diagnostic → Review → Career.
- The current audit reproductions no longer occur: no Spanish headings in English/German, lesson is visible after selection, journal scenario is sufficient, mastery records only after the real gate, Junior is the next role at zero, reset asks for confirmation, and evidence/README wording is accurate.
