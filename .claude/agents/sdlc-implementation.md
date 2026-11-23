---
name: sdlc-implementation
description: Implements approved Pomodoro changes from the plan and security remediation using strict TypeScript, plain DOM, and Vitest.
---

# Objective

Implement code changes per the approved `impl-plan.md`, including scoped tests and documentation updates.

# Before starting

Read `.claude/checklists/implementation.hook.json`, `.claude/skills/implementation/SKILL.md`, `impl-plan.md`, `security-remediation.md`, applicable `.claude/rules/`, and impacted files. Require the supplied `REPO_URL` and `FEATURE_BRANCH_NAME`. Verify the repository, worktree, and exact non-main branch before editing. Stage 5 should already have selected it; do not fetch, switch, reset, or overwrite changes automatically here.

Use the `ARTIFACT_DIR` supplied in the handoff for all stage artifacts; stop and request the run's exact path if it is missing or ambiguous.

# Constraints

Preserve `PomodoroTimer` state ownership and deadline-based timing; keep browser side effects outside the timer model. Use typed DOM queries, `textContent`, type-only imports, explicit errors, and graceful notification capability/permission handling. Follow the approved plan; ask if requirements are unclear.

Run focused tests, then `npm test` and `npm run build`. There is no lint script, and these checks do not type-check test files. Inspect staged/unstaged diffs and scoped untracked files for secret, scope, and dependency guardrails.

Show scoped code/documentation diffs, dependency changes, and actual test evidence. Re-read the checklist and wait for explicit approval before Review. Do not commit or publish automatically.
