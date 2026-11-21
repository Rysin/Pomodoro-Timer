---
name: sdlc-verify

description: Derives story scenarios, writes and runs Playwright tests, and verifies Pomodoro changes.
---


OBJECTIVE:

Analyze the story and approved acceptance criteria, derive test scenarios, write and run Playwright tests, and record verification evidence.

Read `.github/hooks/verify.hook.md`, the story description and approved acceptance criteria in requirements.md, impl-plan.md, and code-review.md. If the story or criteria are unavailable or unclear, stop and request the missing information. This is verification, not another application implementation pass.


INSTRUCTIONS:

Output:

Write verification.md file in root repo with:

1. Commands executed
2. Results (paste output snippets)
3. Document quality checks
4. Remaining limitations
5. Acceptance-criterion-to-evidence mapping and explicit human/manual checks still pending
6. Happy-path scenarios and applicable negative and edge-case scenarios, with preconditions, steps, expected results, and links to tests or manual evidence. Explain when negative or edge cases are not applicable.
7. Playwright test files, exact execution commands and results, and any untested scenarios or blockers

STORY AND PLAYWRIGHT COVERAGE:

1. Analyze the story's changes and map each acceptance criterion to observable behavior and scenarios. Cover happy paths for the affected workflows and identify relevant negative and boundary cases without inventing requirements.
2. Write focused, deterministic Playwright tests for applicable browser scenarios, covering happy paths and applicable negative and edge cases. Assert user-observable behavior; use controlled time and browser permissions where needed rather than waiting for real Pomodoro durations.
3. Use the approved test paths and existing tooling. Keep Playwright tests separate from Vitest discovery, and run both suites to verify they coexist. Record which scenarios require manual checks or cannot be automated and why.
4. Run the Playwright tests against the changed application and map actual results to the scenarios and acceptance criteria. A test that was not run or failed is not evidence of a pass.
5. If Playwright, browser binaries, configuration, or an approved test path is missing, record the blocker. Obtain explicit approval for dependency or scope changes and route setup or scope changes through the appropriate earlier stages before proceeding; do not install dependencies or silently expand scope.

PROJECT CHECKS:

1. Run the relevant existing tests, then `npm test` and `npm run build` for final evidence. Do not claim that the build type-checks tests or that a lint script exists.
2. Use Vitest fake timers/system time for countdown accuracy, pause/resume, reset, delayed ticks, work-only counting, and one-time completion where impacted.
3. Check relevant UI behavior in a browser: controls, phase/count display, keyboard focus, small viewport, and notification denied/unsupported/granted cases when available.
4. Record environment/tool limitations, including notification restrictions and wall-clock changes. Never wait real 25-minute sessions to test logic.

GUARDRAILS:

1. Never report a check as passed without actual command output as evidence.
2. Do not silently skip failing checks; record them under remaining limitations.
3. Edit only verification.md and approved, scoped Playwright test files. Verify the feature branch before editing test files. Route application fixes, test infrastructure changes, and failures back to Implementation/Review with evidence; do not patch application code here.
4. Route new or changed Playwright tests through Review and obtain its approval before completing Verify; re-run affected checks after changes.
5. Show the verification artifact and test diffs, and wait for approval. Re-read the checklist before PR preparation.
