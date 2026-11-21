# Stage 4 implementation plan — SCRUM-1

## Status, scope, and sequencing

- **Gate 3:** approved by the user on **2026-11-21**, as recorded in `design-review.md`.
- **Stage 4 status:** plan prepared; **explicit Stage 4 approval is pending**. Do not implement, install dependencies/browsers, commit, or advance to Stage 5 until approval. Re-read `.github/hooks/checklists/impl-plan.hook.json` before the orchestrator collects Stage 5 inputs.
- **Story scope:** change only the existing `#start.primary` Start/Resume fill and matching border from green to approved Navy Blue `#000080`; preserve existing control behavior. Add only the architecture-approved Playwright test infrastructure for AC-1–AC-3.
- There are **no timer/state, DOM wiring, or notification implementation changes** in the approved architecture. Therefore no state/timer task is inserted; the CSS change precedes browser verification, and test-only setup precedes Playwright execution. Do not broaden scope to `index.html`, `src/main.ts`, `src/timer.ts`, or `src/notifications.ts`.
- No lint script is available. Do not add a lint script or framework without a requirement.

## Dependency-ordered tasks

| Task | Depends on / sequencing | Exact impacted paths and planned work | Acceptance and evidence |
|---|---|---|---|
| **T-1 — approve and add test-only tooling** | Explicit implementation-stage approval is required before editing or installing. Propose and review an **exact `@playwright/test` version** for compatibility with the planned Playwright clock API. Approval of Playwright generally is not approval of a particular version or installation. | `package.json`: add `@playwright/test` only to `devDependencies` and add `"test:pw": "playwright test"`. `package-lock.json`: matching lockfile change only. Do not install or alter either file before version/change approval. | AC-1–AC-3 tooling prerequisite: verify dependency is development-only, script is present, and package/lock changes contain no unrelated dependency changes. No runtime import or production dependency is permitted. |
| **T-2 — apply the approved primary-button color** | T-1 approval boundary and explicit implementation authorization; independent of browser installation. | `src/style.css`: change only the existing `.controls button.primary` background and matching border to `#000080`. Preserve white text, dimensions, min-width, hover, disabled treatment, focus outline, and all other styles. | AC-1/AC-2: browser computed background is `rgb(0, 0, 128)` for Start and Resume. NFR-1/NFR-2: retain white label and visible keyboard focus. AC-3: no other app behavior/style changes in the diff. |
| **T-3 — configure isolated Playwright discovery** | T-1 (approved package/script); use the approved dependency's supported configuration. | `playwright.config.ts`: Chromium only; `testDir: './tests'`, `testMatch: '**/*.pw.ts'`, local Vite `webServer` at `127.0.0.1:4173` with `--strictPort`, base URL, and report/output under `node_modules/.cache/`. Do not add or change a Vitest config. | Playwright selects only `*.pw.ts` and starts/reuses the local app. Vitest 5.1.1 default include `**/*.{test,spec}.?(c|m)[jt]s?(x)` excludes `.pw.ts`; confirm `npm test` does not collect the Playwright file. No report/browser artifacts are added to source control. |
| **T-4 — implement story-based browser cases** | T-2 and T-3; install the matching Chromium browser only after dependency/version approval and installation authorization. | `tests/start-button.pw.ts`: implement the five cases listed below. Use Playwright's controllable page clock, installed **before navigation**, and a `Notification` stub installed before app scripts run. Never wait for real 25-/5-minute durations or invoke real permission UI. | AC-1–AC-3: named cases assert the existing UI, navy fill, state transitions and preserved behaviors without modifying app code. `npm run test:pw` should report five passing cases when implemented and configured successfully. |
| **T-5 — focused and full verification** | T-1 through T-4; approved package and Chromium setup complete. | No additional source path. Run the commands and manual checks below; inspect `src/style.css`, `tests/start-button.pw.ts`, `playwright.config.ts`, `package.json`, and `package-lock.json` diffs. | Capture actual outcomes; verify production output has no Playwright runtime dependency, and Vitest discovery remains isolated. `npm run build` does **not** type-check Playwright test/config TypeScript (`tsconfig.json` includes only `src`); do not report it as such. |

### Playwright test cases and AC mapping

All cases are in the single approved browser-test path, `tests/start-button.pw.ts`. Use accessible button names and assert computed colors as `rgb(0, 0, 128)`.

| Proposed test/scenario | AC | Assertions and relevant existing Vitest coverage |
|---|---|---|
| **Start color in ready state** | AC-1 | Navigate to initial ready page; `#start.primary` is the accessible button named “Start”, enabled, with navy computed background and border. No existing Vitest case asserts rendered CSS/DOM; `tests/timer.test.ts` and `tests/notifications.test.ts` provide no direct AC-1 coverage. |
| **Resume retains navy after pause** | AC-2 | Start and pause through UI; same button is enabled, named “Resume”, and retains navy background/border; resume returns to running. Existing `tests/timer.test.ts` case **“pauses, resumes, and resets the current phase without losing the count”** covers state preservation, not DOM label or style. |
| **Controls, reset, countdown, phase and count stay unchanged** | AC-3 | With clock installed before navigation: start and observe countdown/running disabled state; pause, advance clock and verify remaining display freezes; resume and verify it continues; reset and verify current phase duration is restored without clearing count. Advance the clock across the full 25-minute work phase and assert one idle Break and count `1`; manually start the 5-minute break, advance across its boundary and assert idle Work with count still `1`; verify next phase requires manual start. Reload and verify initial Work/count `0`. No real-duration waits. Existing `tests/timer.test.ts` cases **“pauses, resumes, and resets the current phase without losing the count”**, **“completes phases once and does not count breaks”**, and **“catches up after a delayed tick and completes instead of pausing at zero”** cover timer logic with fake timers/system time, not browser rendering. |
| **Notification behavior uses only a pre-navigation stub** | AC-3 | Add the stub before navigation; keep permission non-granted. Assert no request on load, timer start, or phase completion; clicking “Enable notifications” calls only the stub's request method. Assert no native permission prompt and never call browser permission-grant APIs. Existing `tests/notifications.test.ts` cases **“handles browsers without notification support”**, **“does not notify when permission is denied”**, and **“requests permission and notifies when granted”** use mocked APIs and cover unit paths, not the browser integration. |
| **Keyboard focus and narrow layout remain usable** | AC-3 / NFR-2 | Use keyboard navigation to focus and activate the primary button; verify the focus-visible outline remains distinguishable. At a narrow viewport (320px), verify controls wrap and there is no horizontal overflow. Existing Vitest cases do not cover layout or keyboard behavior. |

These are proposed browser cases, not tests already implemented or run. The browser test must stub `Notification` before app initialization so it never prompts or changes browser permission state.

## Verification plan

### Commands after implementation and approvals

1. `npm test` — existing Vitest regression suite. Expect current baseline discovery to remain **2 Vitest files / 7 tests**, with no `.pw.ts` collection.
2. `npm run build` — existing `tsc && vite build`; check application compilation and production build. It does **not** type-check `playwright.config.ts` or `tests/start-button.pw.ts`, since `tsconfig.json` includes only `src`.
3. `npx playwright install chromium` — run **only after** the exact dependency version/change is approved and installed. This installs the browser matching the approved Playwright package; it is not part of this planning stage.
4. `npm run test:pw` — run the five planned Chromium cases against the local Vite server; expected successful summary is five passed. Record failures and do not claim a type-check from browser execution.
5. Inspect changed paths, `git diff --check`, Vitest discovery, package placement, and production `dist` output for unintended Playwright/runtime inclusion. Keep generated Playwright output under `node_modules/.cache/`.

### Manual browser and accessibility checks

- Check initial ready **Start**, running disabled Start / enabled Pause, paused **Resume**, and Reset; confirm only Start/Resume use navy and their label, enabled state, countdown, and other controls remain unchanged.
- Inspect computed background and border (`rgb(0, 0, 128)`), white text, hover brightness, disabled opacity/cursor, unchanged dimensions/position, and visible keyboard focus outline.
- At 320px width, verify control wrapping, layout, and absence of horizontal scrolling/overflow.
- Verify loading and using timer controls does not open a notification permission prompt. Do not click a native permission grant; automated permission checks use the stub only. If manually checking opt-in, use an isolated test profile and confirm the explicit action only; do not grant real permission.
- Manually review the existing timer/status and notification status behavior; no live-region or accessibility markup change is planned.

### Baseline evidence captured in this Stage 4 session (pre-change only)

- `npm test`: **PASS**, 2 files and 7 tests (Vitest 5.1.1; 199 ms).
- `npm run build`: **PASS**, `tsc && vite build`; Vite 8.3.8 generated the production output. This baseline does not verify the navy change or Playwright TS.
- Package inspection: scripts currently contain `test: "vitest run"` and no `test:pw`; installed top-level dev dependencies are TypeScript 7.0.2, Vite 8.3.8, Vitest 5.1.1. `npm ls @playwright/test playwright --all` reported `(empty)` (exit code 1, expected for absent packages). No install was run.
- Read-only discovery inspection found Vitest 5.1.1 default include `**/*.{test,spec}.?(c|m)[jt]s?(x)`, which does not match `.pw.ts`. The architecture's no-Vitest-config-override approach therefore keeps the runners separate.
- These are actual current-baseline results only. Post-change tests/build, Playwright execution, Chromium installation, manual browser/accessibility checks, and production-output verification remain **not run**.

## Suggested commit breakdown

1. `test: add approved Playwright setup` — `package.json`, `package-lock.json`, `playwright.config.ts`; only after exact-version/dependency approval.
2. `style: make Start and Resume navy blue` — `src/style.css` only.
3. `test: cover navy Start control in Playwright` — `tests/start-button.pw.ts` only.

Keep commits dependency-ordered and limited to these paths. No commit is authorized by this plan; do not stage or include pre-existing worktree changes. `README.md` and application source outside `src/style.css` remain unchanged because this story adds no user-facing behavior or runtime setup.

## Blockers, assumptions, and approval boundaries

- The architecture authorizes Playwright **only as test-only tooling** and specifies exactly `src/style.css`, `tests/start-button.pw.ts`, `playwright.config.ts`, `package.json`, and `package-lock.json` as implementation impact paths.
- The exact `@playwright/test` version is not selected here. At Implementation, propose and review one exact version for API/browser compatibility and obtain explicit approval before changing package files or installing it. A corresponding lockfile change and the `test:pw` script are likewise approval-gated.
- Install Chromium only after that approval and package installation. Do not download/install another browser, add a framework, add a Vitest override, or add unrelated dependencies.
- No `npm run lint` is available. Do not add a lint script or framework without a requirement.
- Browser test/config TypeScript is outside the current `tsconfig.json` include; `npm run build` cannot establish that it type-checks. Report this limitation plainly.
- No real timer waits or notification permission prompts. Use clock control and a pre-navigation Notification stub.
- This artifact is the only Stage 4 file to update. Stage 4 approval is requested below; stop here and wait.

## Stage 4 approval request

Please explicitly approve this implementation plan. No implementation, installation, commit, or stage advancement will occur before approval.
