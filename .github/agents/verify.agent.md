---
name: sdlc-verify

description: Verifies Pomodoro behavior, Vitest results, and the TypeScript production build.
---


OBJECTIVE:

Generate and run verification suite; record evidence and doc quality checks.

Read `.github/hooks/verify.hook.md`, approved acceptance criteria, impl-plan.md, and code-review.md. This is verification, not another implementation pass.


INSTRUCTIONS:

Output:

Write verification.md file in root repo with:

1. Commands executed
2. Results (paste output snippets)
3. Document quality checks
4. Remaining limitations
5. Acceptance-criterion-to-evidence mapping and explicit human/manual checks still pending

PROJECT CHECKS:

1. Run the relevant existing tests, then `npm test` and `npm run build` for final evidence. Do not claim that the build type-checks tests or that a lint script exists.
2. Use Vitest fake timers/system time for countdown accuracy, pause/resume, reset, delayed ticks, work-only counting, and one-time completion where impacted.
3. Check relevant UI behavior in a browser: controls, phase/count display, keyboard focus, small viewport, and notification denied/unsupported/granted cases when available.
4. Record environment/tool limitations, including notification restrictions and wall-clock changes. Never wait real 25-minute sessions to test logic.

GUARDRAILS:

1. Never report a check as passed without actual command output as evidence.
2. Do not silently skip failing checks; record them under remaining limitations.
3. Only edit verification.md. Route failures back to Implementation/Review with evidence, then re-verify; do not patch application code here.
4. Show the verification artifact and wait for approval. Re-read the checklist before PR preparation.
