# Requirements — SCRUM-1

## Story traceability

| Field | Value |
|---|---|
| Jira URL | https://sourabhdesai.atlassian.net/browse/SCRUM-1 |
| Summary | Change color for Start button to navy blue |
| Issue type | Task |
| Status | To Do |
| Project | Team Astro 1 |
| Source | Jira description and acceptance criteria retrieved from SCRUM-1 |

## Problem statement

The Pomodoro timer application currently displays the primary Start control in green. SCRUM-1 requires that existing control to use Navy Blue instead. The approved Design Review selected `#000080` as the exact color. Browser verification with Playwright is also approved, strictly as test-only tooling; it does not add runtime functionality or change application architecture.

## In scope

- Change the visual fill/color of the existing primary Start control to `#000080`.
- Apply the color to the same control when its existing label is either "Start" or "Resume".
- Preserve the button's existing size, position, label behavior, enabled/disabled behavior, and timer interactions.
- Add Playwright only for browser verification of AC-1, AC-2, and behavior-preservation AC-3. Permitted test-only changes are limited to development dependency, browser-test configuration, test script, and browser test files needed for this verification. Architecture/Plan will define exact paths.

## Out of scope

- Changing the color of Pause, Reset, Enable notifications, or any other UI control.
- Changing timer durations, phase switching, work-session counting, reset behavior, reload behavior, notification behavior, or persistence.
- Changing runtime application dependencies, production bundle dependencies, application architecture, framework, or user-facing behavior for Playwright.
- Defining or changing application layout, typography, or hover/focus animations beyond what is needed to implement the navy primary-button presentation.

## Existing behavior baseline

- The primary control is the button with ID `start` and class `primary` in `index.html`.
- `src/main.ts` labels the control "Start" in the ready state and "Resume" in the paused state.
- The control is disabled while the timer is running and enabled while ready or paused.
- Clicking Start/Resume invokes the existing timer `start()` behavior.
- The current primary-button fill is green (`#365f4c` in `src/style.css`).
- Preserve existing 25-minute work / 5-minute break durations, manual phase starts, work-only session counting, pause/reset/reload behavior, and opt-in notifications.
- Start/Pause/Reset behavior and timer phase/count semantics are unchanged by this story.

## Functional requirements

| ID | Requirement | Traceability |
|---|---|---|
| FR-1 | The primary Start control shall display with a Navy Blue (`#000080`) background instead of the existing green background. | SCRUM-1 summary, description, and AC; exact value selected in the approved Design Review. |
| FR-2 | When the same primary control displays "Resume" during the paused state, it shall retain the Navy Blue presentation. | Existing Start/Resume control identity plus FR-1; the story does not request changing control identity. |
| FR-3 | The color change shall not alter the control's existing enabled, disabled, Start, or Resume behavior. | Existing behavior baseline; no story-supported functional behavior change. |

## Non-functional requirements

| ID | Requirement | Traceability |
|---|---|---|
| NFR-1 | Navy Blue text contrast shall remain readable for the existing white button label. | Project accessibility conventions; approved Design Review records `#000080` and 16.01:1 contrast with white. |
| NFR-2 | The existing visible keyboard focus treatment shall remain available and distinct from the Navy Blue fill. | Project HTML/CSS accessibility conventions; no story-supported removal or redesign of focus behavior. |
| NFR-3 | Playwright is approved solely as test-only browser-verification tooling. Any resulting dependency/configuration/script/test files shall support AC verification only; Playwright must not be a runtime application dependency, affect the production bundle, introduce user-facing behavior, or change application architecture. Exact package/config/test paths remain for Architecture/Plan to define. | Explicit user direction: "Approved, use playwright"; bounded scope exception to the approved Design Review's prior recommendation against adding browser-test infrastructure. |

## Acceptance criteria

| ID | Criterion | Story support | Playwright verification mapping |
|---|---|---|---|
| AC-1 | The existing primary control (`#start.primary`) has a Navy Blue (`#000080`) background in the ready state when its label is "Start". | Directly supported by SCRUM-1 summary, description, and acceptance criterion; exact value selected in the approved Design Review. | Browser test checks Start label and computed background color (`rgb(0, 0, 128)`). |
| AC-2 | The same primary control retains the Navy Blue (`#000080`) background when paused and its existing label is "Resume". | Applies AC-1 to the same existing Start/Resume control; the Resume state itself is baseline behavior, not a new workflow. | Browser test reaches the existing paused/Resume state and checks its label and computed background color (`rgb(0, 0, 128)`). |
| AC-3 | Pause, Reset, session countdown, phase switching, work-session counting, notification behavior, and reload behavior remain unchanged by the color-only task. | Baseline preservation; no story text requests changes to these behaviors. | Playwright browser verification checks the relevant existing behavior remains unchanged; Architecture/Plan will define concrete browser test cases and safe handling of notifications without requesting real permission. |

## Traceability matrix

| Story text / decision | Requirement | Verification target |
|---|---|---|
| “Change the Start button color to Navy Blue.” | FR-1, NFR-1, AC-1 | Playwright browser check of ready-state `#start.primary` computed background. |
| “The button to update is the Start button.” | FR-1, FR-3, AC-1 | Playwright check targets only the existing `#start.primary` control. |
| Existing application behavior | FR-2, FR-3, AC-2, AC-3 | Playwright browser verification of Start/Resume appearance and preserved baseline behavior; exact test cases deferred to Architecture/Plan. |
| Approved Design Review decision | FR-1, NFR-1, AC-1, AC-2 | Use exact Navy Blue `#000080`; computed browser color expected as `rgb(0, 0, 128)`. |
| Explicit user direction: “Approved, use playwright.” | NFR-3, AC-1–AC-3 verification mapping | Playwright test-only tooling; no runtime app dependency, production bundle dependency, or architecture change. |

## Explicit behavior changes from baseline

1. The primary Start/Resume control's fill changes from green (`#365f4c`) to approved Navy Blue (`#000080`).
2. No timer, notification, persistence, or other user-facing behavior changes are supported by the story.
3. Playwright introduces only approved browser-verification tooling in test/development scope; it is not an application behavior change.

## Open questions and decisions

| Question/decision | Status | Resolution |
|---|---|---|
| Which exact Navy Blue value should be used? | Resolved | Approved Design Review selected `#000080`. |
| Should Start and Resume receive the change? | Resolved | They are the same existing primary control, so both states use the updated presentation. |
| Should the work/break phases, count, reset, reload, notifications, or persistence change? | Resolved | No; they remain baseline behavior and outside the story's functional scope. |
| May browser automation be added despite the prior Design Review recommendation? | Resolved by explicit user direction | "Approved, use playwright" approves a precise test-only scope exception for browser verification. No runtime dependency or app architecture change is approved. Exact package/config/script/test paths and case details are deferred to Architecture/Plan. |

