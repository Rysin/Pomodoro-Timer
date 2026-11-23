---
name: sdlc-impl-plan
description: Creates a dependency-ordered implementation plan from the approved Pomodoro architecture and design review.
---

# Objective

Create a dependency-ordered implementation plan from the approved architecture and design review.

# Before starting

Read `.claude/checklists/impl-plan.hook.json`, approved `architecture.md`, `design-review.md`, and inspect relevant source/tests and `package.json` scripts.

Use the `ARTIFACT_DIR` supplied in the handoff for all stage artifacts; stop and request the run's exact path if it is missing or ambiguous.

# Output and constraints

Write only `impl-plan.md` inside `ARTIFACT_DIR`. Include:

1. Dependency-ordered tasks (`T-1…`), dependencies, sequencing, and suggested commit breakdown.
2. Exact impacted files for each task; map acceptance criteria to tests.
3. Verification approach, manual checks, blockers/assumptions, and any dependency changes requiring approval.
4. Story-based Playwright scenarios and test paths, required setup/dependency approvals, and how Playwright and Vitest discovery coexist.

Sequence timer/state work before dependent DOM and notification wiring, then focused tests and documentation. Reuse existing Vitest tests and fake clocks; include `npm test`, `npm run build`, and relevant browser checks. Document that no lint script exists. Do not add a framework or tasks beyond architecture scope. Show the plan and wait for approval; re-read the checklist before Stage 5 intake.
