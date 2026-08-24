# Learn-SapB1 Full Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repair every confirmed audit finding and publish a verified strict-localization learning flow.

**Architecture:** Strict locale data and pure domain rules replace DOM text patching and UI-trusted flags. Activities become explicit learning specifications, while build/tests use repository-relative paths and the same modular source for Pages and standalone output.

**Tech Stack:** HTML5, CSS, JavaScript ES modules, Node.js built-in test runner, GitHub Pages/Actions, Chrome DevTools smoke automation.

**Spec:** `docs/superpowers/specs/2026-08-24-full-remediation-design.md`

## Global Constraints

- No runtime dependency or API key.
- ES/EN/DE interface prose must never mix.
- All data remains synthetic.
- SAP configuration-dependent behavior must be labelled, not universalized.
- Every production behavior change begins with a failing test.
- Every block ends with build, tests and browser verification before publication.

---

### Task 1: Reproducible build, tests and CI

**Files:** `package.json`, `.github/workflows/verify-build.yml`, `scripts/build.mjs`, `test/*.test.mjs`, `test/browser-smoke-local.mjs`

**Interfaces:** Tests resolve repository files with `new URL('../path', import.meta.url)`. `npm test` runs build first, unit/contract tests second; `npm run test:browser:local` auto-detects a browser binary.

- [ ] Add a failing portability contract that rejects `/tmp/b1lab` and `/home/ubuntu` in test/build/workflow files.
- [ ] Run it and confirm failure names the existing absolute paths.
- [ ] Replace absolute paths with URL-relative paths and align build output with `dist/`.
- [ ] Change scripts/workflow order to build before release tests and include browser smoke.
- [ ] Run build and all tests; commit the block.

### Task 2: Strict ES/EN/DE rendering

**Files:** `src/content/base.mjs`, `src/content.mjs`, `src/app.mjs`, `src/advanced.mjs`, `src/career.mjs`, `src/runtime-strict.mjs`, `index.html`, `test/locale-contract.test.mjs`, `README.md`

**Interfaces:** `local(value, locale, context)` returns only `value[locale]` and throws on missing authored locale. `t(state,key)` is the only UI-label lookup. German extended learning renders localized skill fields without legacy masterclass fallback.

- [ ] Add failing rendered-output tests for representative Home, Map, Learn, Guided, Prove, Career and Advanced views in EN/DE.
- [ ] Add a failing recursive locale completeness test for visible data.
- [ ] Move hard-coded UI headings/actions to the dictionary and remove silent Spanish fallback.
- [ ] Remove `runtime-strict.mjs` from the Pages entrypoint and make source rendering correct on first render and navigation.
- [ ] Correct literal entity escaping and public/offline wording.
- [ ] Build, run tests, open each locale in browser and commit.

### Task 3: Real diagnostic, assessment, safety and review rules

**Files:** `src/domain.mjs`, `src/app.mjs`, `src/content/base.mjs`, `test/domain.test.mjs`, `test/app-contract.test.mjs`

**Interfaces:** `ANSWER_ACTIVITY` records task correctness; `ANSWER_SAFETY` evaluates a separate safety prompt; `ASSESS_SKILL` accepts domain-generated evidence only. Retrieval successes require distinct UTC dates. `diagnostic` and `review` are routable views.

- [ ] Add failing reducer/UI tests for diagnostic access, assessment recording order, safety failure, distinct-day streaks and review navigation.
- [ ] Implement explicit diagnostic entry and review navigation.
- [ ] Split activity correctness from safety-gate evaluation; remove DOM-controlled safety flags.
- [ ] Enforce spaced successes in the reducer and prevent unearned practice scores.
- [ ] Run tests, exercise the complete flow in browser and commit.

### Task 4: Solvable activities and corrected SAP content

**Files:** `src/activities.mjs`, `src/operations-check.mjs`, `src/app.mjs`, `src/content/deep.mjs`, `src/content/base.mjs`, `src/content/l34.mjs`, `src/content/l78.mjs`, `test/activities.test.mjs`, `test/content-facts.test.mjs`

**Interfaces:** Every activity has localized `scenario`, `task`, `evaluated`, `hint`, `resolution`, `safetyPrompt` and `safetyOptions`. Journal validation normalizes locale number formats. Evidence entries expose precise `section`/`note` metadata where verified.

- [ ] Add failing tests proving the journal scenario includes amount/tax context, equivalent numeric formats validate, forensic answers are not visually disclosed and simulator options are business values.
- [ ] Add failing fact contracts for control accounts, configurable G/L examples and removal of the unsupported FP 2405 claim.
- [ ] Implement explicit activity blueprints and granular feedback.
- [ ] Correct the Business Partner/control-account explanation and label account determination/localization dependencies.
- [ ] Replace absolute heuristics with configurable guidance and narrow promotional evidence claims.
- [ ] Run tests, solve representative activities in all languages in browser and commit.

### Task 5: Map, progress, career and accessibility

**Files:** `src/app.mjs`, `src/domain.mjs`, `src/career.mjs`, `src/styles.css`, `src/content/base.mjs`, `test/app-contract.test.mjs`, `test/domain.test.mjs`

**Interfaces:** Skill selection renders `#selected-lesson` with `tabindex=-1` and a post-render focus/scroll request. Completion labels use mastered/total. `nextCareerRole()` returns the lowest unmet threshold. Reset is a two-step state transition.

- [ ] Add failing tests for Junior as next role, non-duplicated track percentages, honest level counts, focus target, tab semantics and reset confirmation.
- [ ] Implement a two-column map/lesson layout at desktop and stacked focused lesson at mobile.
- [ ] Make the global track filter authoritative and use `aria-current`, `role=tab`, `aria-selected` and stable focus restoration.
- [ ] Correct career/KPI wording and calculations; add reset confirmation/cancel.
- [ ] Run tests, navigate by mouse and keyboard in browser at desktop/mobile widths and commit.

### Task 6: Final release gate and publication

**Files:** `README.md`, `dist/*`, generated verification evidence only when appropriate.

**Interfaces:** The same commit builds modular Pages and standalone output. README claims match tested behavior.

- [ ] Run the full clean verification command and inspect the generated diff.
- [ ] Scan for secrets, hard-coded machine paths, mixed-language blockers and incomplete markers.
- [ ] Publish the verified commits to `main` and wait for Pages deployment.
- [ ] Repeat the complete live browser journey in ES, EN and DE.
- [ ] Record final commit SHA, workflow result, live URL and remaining explicitly non-verified content scope.
