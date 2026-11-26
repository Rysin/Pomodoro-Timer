---
name: code-review
description: Reviews changed Pomodoro TypeScript, DOM, notifications, and Vitest tests.
---

# Review procedure

Read and write stage Markdown artifacts in the `ARTIFACT_DIR` provided in the handoff; stop and request the run's exact path if it is missing or ambiguous.

1. Read `.claude/checklists/code-review.hook.json`, approved requirements/plan scope, and actual staged/unstaged/untracked changes. Do not review unrelated code or infer changes from summaries.
2. Review only changed, in-scope code. Record applicable areas as PASS, FAIL, or not applicable with concrete evidence:

| Area | Key questions |
| --- | --- |
| Timer and state behavior | Are deadlines, phase transitions, pause/reset semantics, and work-session counts correct? |
| DOM, accessibility, and notifications | Are controls wired and accessible, permission requested from a user action, and failures visible? |
| Scope and safety | Are changes within approved scope, dynamic text rendered safely, and dependencies or claims supported by approval/evidence? |
| Tests | Do focused tests cover changed behavior and relevant boundaries using the project's available test setup? |

## TypeScript-specific code quality checks

- Are types precise under strict TypeScript, using narrowing and explicit guards instead of `any`, unsafe assertions, or non-null assertions?
- Are nullable DOM elements, timer handles, and async/error paths handled explicitly, with lifecycle cleanup preserved?
- Are functions and types cohesive and easy to follow, without unnecessary casts, duplicated logic, or abstractions that obscure behavior?

## Playwright-specific code quality checks

- Do tests use stable, user-facing locators (such as roles and accessible names) rather than brittle selectors?
- Are tests deterministic and isolated, using auto-waiting assertions instead of fixed sleeps, and resetting state between cases?
- Do assertions verify meaningful user-visible outcomes and relevant boundary behavior without swallowing errors or weakening failures?

## Usual code smells: DRY, YAGNI, and KISS

Assess these principles against the changed code; report concrete issues, not stylistic preferences:

- **DRY:** flag duplicated behavior when it can drift or must be kept consistent; don't extract code solely to eliminate harmless repetition.
- **YAGNI:** flag speculative features, configuration, or abstractions that the approved scope does not need.
- **KISS:** flag avoidable complexity, deep nesting, redundant indirection, or error handling that hides failures when a simpler clear implementation fits.

3. Write `code-review.md` with checklist, severity, file/line evidence, proposed exact fixes, and approval status. Flag changed deadline logic that loses elapsed time after delayed ticks, with the missing regression test.
4. Do not edit application code. Route actionable fixes to Implementation.
5. Show the review artifact, re-read the checklist, and wait for human approval. A review passes only after actionable in-scope findings are resolved.

