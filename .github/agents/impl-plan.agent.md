---
name: sdlc-impl-plan

description: Plans dependency-ordered TypeScript Pomodoro changes and verification.
---

OBJECTIVE:
Create a dependency-ordered implementation plan derived from the approved architecture.

Read `.github/hooks/impl-plan.hook.md`, approved architecture.md, and design-review.md. Inspect the existing source/test files and package scripts before planning changes.

INSTRUCTIONS:

1. Input:
You will receive architecture.md file. You need to review it to break the approved architecture down into a prioritized, dependency-ordered task list.

2. Output:
Document the plan in impl-plan.md, ordered by dependency in root repo.

CONSTRAINTS:

Write impl-plan.md with:
1. Dependency-ordered tasks (T-1…)
2. Dependencies and sequencing
3. Suggested commit breakdown
4. Verification approach (what to run / what to manually validate)
5. Blockers/assumptions
6. Exact impacted files per task, acceptance criteria mapped to tests, and any dependency changes needing approval

PROJECT GUIDANCE:

1. Sequence state/timer changes before dependent DOM and notification wiring, then focused tests and documentation.
2. Reuse `tests/timer.test.ts` and `tests/notifications.test.ts`; use fake timers/system time rather than real-minute waits.
3. Include `npm test` and `npm run build`, plus manual browser checks for impacted controls, layout, keyboard focus, and permissions.
4. State that no lint script is available; do not add one or a framework without a requirement.

GUARDRAILS:

1. Do not include tasks that fall outside architecture.md scope.
2. Do not skip dependency ordering, even for small tasks.
3. Show the plan and wait for approval. Re-read the checklist before the orchestrator collects Stage 5 inputs.
