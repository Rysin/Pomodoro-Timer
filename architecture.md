# Architecture — SCRUM-1

## Overview

Change only the existing primary Start/Resume control's fill to the approved Navy Blue `#000080`. Preserve its native button identity, structure, size, position, label, enabled/disabled behavior, and timer interactions. The application remains the existing Vite + strict TypeScript + plain-DOM app; no runtime architecture or application dependency changes are proposed.

Playwright is explicitly approved for AC-1, AC-2, and behavior-preservation AC-3 verification, strictly as test-only tooling. Keep its dependency, config, script, browser installation, and test files isolated from runtime code and the production bundle. Exact dependency version and install/lockfile changes are deferred to Implementation-stage approval.

## Components and responsibilities

| Component | Responsibility and proposed impact |
|---|---|
| `index.html` | Existing semantic `<button id="start" class="primary" type="button">`; retain structure and accessible name. No edit proposed. |
| `src/style.css` | Sole application implementation target: change the existing primary button's background and matching border from green to `#000080`. Preserve white text, layout, sizing, hover filter, disabled treatment, and visible focus outline. |
| `src/main.ts` | Continues rendering the existing Start/Resume labels and enabled/disabled state from timer status. No edit; no Playwright/runtime wiring. |
| `src/timer.ts` | Continues owning state snapshots, deadline-based countdown, interval lifecycle, pause/reset, and phase transitions. No edit. |
| `src/notifications.ts` | Continues owning browser capability checks, opt-in permission requests, and phase-completion notifications. No edit. |
| `tests/timer.test.ts`, `tests/notifications.test.ts` | Existing Vitest behavioral regression tests remain unchanged and continue to run. |
| `tests/start-button.pw.ts` (proposed) | Test-only Playwright browser cases for AC-1 through AC-3, using the existing app UI and a stubbed Notification API. |
| `playwright.config.ts` (proposed) | Playwright-only Chromium project, `*.pw.ts` test boundary, local Vite web server/base URL, and test output location. Does not alter Vite or Vitest configuration. |

## Data flow

```text
Existing timer state / deadline / interval (src/timer.ts; unchanged)
  -> src/main.ts renders current label and disabled state
  -> existing semantic #start.primary button in index.html
  -> src/style.css presents the button in #000080

Playwright (test-only)
  -> starts/reuses local Vite server
  -> drives the rendered UI and checks computed style / preserved behavior
  -> stubs Notification in-page; never invokes real browser permission UI

No new runtime data flow, persistence, network service, or user-facing behavior.
```

## Technology choices and browser-test proposal

- Runtime: existing CSS, TypeScript, Vite, plain DOM, and existing timer/notification boundaries only. No app dependency, framework, component, hook, API, or persistence changes.
- Browser verification: proposed development dependency `@playwright/test`, pinned to an exact version only after Implementation-stage compatibility review and explicit approval. It must not be added as a runtime dependency.
- Proposed test infrastructure:
  - `playwright.config.ts`: `testDir: './tests'`, `testMatch: '**/*.pw.ts'`, Chromium only; local `webServer` starts `npm run dev -- --host 127.0.0.1 --port 4173 --strictPort`, with `baseURL` set to `http://127.0.0.1:4173`. Configure list reporting and test output under `node_modules/.cache/` so no report artifacts or `.gitignore` edit are needed.
  - `tests/start-button.pw.ts`: Playwright tests only; use locators for `#start`, `#pause`, `#reset`, phase, clock, and count. Use Playwright's controllable page clock for phase completion instead of real 25-/5-minute waits. Install a test-only `Notification` stub before navigation to observe permission requests/notification construction without prompting the user.
  - `package.json`: add the test-only script `"test:pw": "playwright test"` and the approved `@playwright/test` dev dependency. Its matching lockfile change is expected only if approved and implemented later.
  - Proposed dependency installation after approval: `npm install --save-dev @playwright/test@<approved-exact-version>`. Proposed Chromium browser installation: `npx playwright install chromium`. Neither command is run in this Architecture stage.
- Vitest discovery boundary: installed Vitest 5.1.1 defines its default include as `**/*.{test,spec}.?(c|m)[jt]s?(x)` (`node_modules/vitest/dist/config.cjs`). `tests/start-button.pw.ts` does not match that pattern because `.pw.ts` is neither `.test.ts` nor `.spec.ts`. Therefore, with the current default discovery and no Vitest config override, Vitest will not collect the Playwright spec. Keep the `.pw.ts` suffix and do not broaden Vitest's include; Playwright separately selects `**/*.pw.ts`. If Vitest discovery is customized later, re-check the boundary.
- `npm run build` only type-checks `src` per project context; it is not evidence that Playwright test/config TypeScript was type-checked. Playwright execution provides browser behavior evidence, not a substitute for the existing Vitest suite.

### Browser verification mapping

| Criterion | Proposed browser check |
|---|---|
| AC-1 | On initial ready state, locate `#start.primary`; assert accessible button name `Start` and computed `background-color` equals `rgb(0, 0, 128)`. |
| AC-2 | Start then pause using the existing controls; assert the same `#start.primary` is enabled, named `Resume`, and still computes to `rgb(0, 0, 128)`. |
| AC-3 | Verify running disables Start and updates the countdown; pause/resume preserves remaining time; reset restores the current phase duration without clearing count; accelerated work completion advances to idle Break and increments count once; break completion returns to idle Work without incrementing count; next phases still require manual Start; reload resets the count. Exercise notification behavior only with a stub: no permission request on load or phase completion, and an explicit Enable notifications click calls only the stubbed request method. No actual permission dialog is allowed. |

## UI structure, styling, keyboard focus, and accessibility

- Keep the existing semantic `<button>` element, `id`, class, `type="button"`, DOM order, and visible Start/Resume labels; no structural or ARIA change is needed.
- Apply `#000080` only to `.controls button.primary` for both existing labels. Retain the matching border and white text. The approved white-on-navy contrast is 16.01:1, above WCAG AA's 4.5:1 normal-text threshold.
- Do not alter button dimensions, spacing, position, other controls, typography, or layout. Preserve the current enabled-button hover brightness filter, disabled opacity/cursor, and distinct `button:focus-visible` outline/offset; verify focus remains visible by keyboard in browser checks.
- Playwright checks should use accessible button names where appropriate and keyboard interaction for at least the focus/activation check; do not make focus styling dependent on mouse interaction.

## State transitions, deadlines, intervals, and phase completion

This color-only change introduces no state transitions, deadlines, intervals, or phase-completion events.

- Preserve the existing `src/timer.ts` ownership of deadline calculation, 250 ms interval creation/cleanup, duplicate-start protection, and pause-at-zero completion.
- Preserve `idle/ready -> running` on Start, `running -> paused` on Pause, `paused -> running` on Resume, and running phase completion to an idle next phase requiring manual Start.
- Preserve 25-minute work / 5-minute break durations, work-only count increments, pause/reset/reload behavior, and phase completion callbacks. Start remains disabled only while running.
- Notifications remain opt-in and tied to the existing phase-completion callback; no color update requests permission or changes notification behavior.

## Error handling and notification permission

- CSS color application adds no runtime operation or error path.
- Leave `src/main.ts` notification error reporting and `src/notifications.ts` capability/permission handling unchanged.
- Browser tests must replace/stub `Notification` before app initialization and assert behavior without invoking a real permission prompt. Stub failures should fail the browser test rather than alter application error behavior.
- Existing Vitest notification tests remain the unit-level evidence for unsupported, denied, and granted permission paths.

## Security considerations

- No new runtime input processing, network access, storage, permissions, executable code, or external assets.
- `@playwright/test` is test/development-only; verify its package placement and that production build output does not include it at Implementation/Review.
- Browser tests run against the local Vite server and must not request real notification permission or leave a browser permission state behind.
- Keep browser artifacts in ignored `node_modules/.cache/`; do not commit browser binaries, reports, traces, credentials, or secrets.

## Impacted files and scope

| Path | Stage / reason |
|---|---|
| `src/style.css` | Implementation impact: update only the existing primary button fill and matching border to `#000080`; retain other presentation rules. |
| `index.html` | No edit: existing semantic target already meets the requirement. |
| `src/main.ts` | No edit: label, enabled state, control wiring, and notification error boundary remain unchanged. |
| `src/timer.ts` | No edit: timer state, deadline, interval, and phase behavior remain unchanged. |
| `src/notifications.ts` | No edit: existing permission and notification behavior remains unchanged. |
| `tests/timer.test.ts` | No edit: run as existing timer regression coverage. |
| `tests/notifications.test.ts` | No edit: run as existing notification regression coverage. |
| `tests/start-button.pw.ts` | Proposed test-only file for AC-1/AC-2 rendered color and AC-3 browser-level preservation checks. |
| `playwright.config.ts` | Proposed test-only config defining Playwright discovery, Chromium, local server, and output boundary. |
| `package.json` | Proposed Implementation-stage test-only `@playwright/test` dev dependency and `test:pw` script; not changed at Architecture stage. |
| `package-lock.json` | Proposed only as the lockfile counterpart to an explicitly approved dependency change; not changed now. |
| `README.md` | No edit proposed: no user-facing behavior or usage changes. |
| `architecture.md` | This Stage 2 artifact; records approved scope, proposed verification, and exact future impact paths. |

## Error/risk notes and verification plan

| Risk | Mitigation / evidence planned for Implementation |
|---|---|
| Navy selector accidentally affects other controls or fails in Resume state | Scope CSS to the existing primary class; assert computed color for Start and Resume. |
| Browser tests alter timer semantics or require real-duration waits | Keep all app timer logic untouched; use Playwright's controllable page clock for accelerated completion and assert existing UI outcomes. |
| Native permission UI makes tests interactive or changes browser state | Install and verify a Notification stub before navigation; never grant/request real browser permissions. |
| Vitest collects Playwright tests | Retain `*.pw.ts`; Vitest 5.1.1 default include excludes this suffix. Do not broaden include. |
| Playwright package changes runtime output or adds unreviewed tooling | Add only as an approved exact-pinned dev dependency; inspect package/lock diffs and production build/bundle before approval. |

Planned verification after implementation: `npm test` (existing Vitest regression suite), `npm run build` (application type-check/build), `npx playwright install chromium` (first-time test browser setup), and `npm run test:pw` (AC-1/AC-2/AC-3 browser checks). Confirm `npm test` discovers only existing Vitest files and does not collect `*.pw.ts`; review the final dependency/lockfile diff and production bundle. No implementation or browser verification is claimed as completed by this architecture artifact.

## Assumptions and constraints

1. Approved scope is requirements FR-1–FR-3, NFR-1–NFR-3, and AC-1–AC-3. Navy Blue is exactly `#000080`.
2. The same existing Start/Resume control receives the color; no other control or behavior changes.
3. Keep runtime application architecture and dependencies unchanged. Playwright is explicitly approved only for browser tests.
4. Exact `@playwright/test` version, package/lockfile edits, test script, and browser installation are proposals for Implementation and still require that stage's explicit approval.
5. The proposed `.pw.ts` Vitest exclusion claim applies to the installed Vitest 5.1.1 default include and current absence of a Vitest config override; revalidate if either changes.
