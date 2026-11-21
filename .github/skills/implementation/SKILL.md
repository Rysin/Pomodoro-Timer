---
name: implementation
description: Implement approved Pomodoro changes with strict TypeScript, plain DOM, and Vitest.
---

# Implementation procedure

1. Read `.github/hooks/checklists/implementation.hook.json`, impl-plan.md, security-remediation.md, applicable scoped instructions, and the impacted source/test files.
2. Require the supplied REPO_URL and FEATURE_BRANCH_NAME. Run `git status --short` and `git branch --show-current`; block if the branch differs or is main. Stage 5 should already have selected the branch; do not fetch/switch/reset automatically here.
3. Inspect `package.json` and `tsconfig.json`. Do not install dependencies unless missing packages block a required command or an approved manifest change needs installation.
4. Execute approved tasks in dependency order:
   - Keep countdown/state ownership in `PomodoroTimer` and browser side effects in the DOM/notification modules.
   - Preserve deadline-based elapsed time, interval cleanup, pause-at-zero, manual phase starts, and work-only counting unless approved requirements change them.
   - Use typed DOM queries, `textContent`, type-only imports, and explicit error reporting.
   - For example, derive remaining time with `Math.max(0, deadlineMs - now())`, not decrement-per-tick arithmetic.
   - Match existing HTML/CSS structure and visible focus. Add hover/active/disabled states for changed controls and variables for repeated style values.
5. Add focused tests for introduced/fixed behavior using existing Vitest fake timers and notification mocks. Run related selectors together; run `npm test` and `npm run build` before completing the stage. There is no lint script.
6. Inspect unstaged/staged diffs and scoped untracked files for secrets, scope, and dependency changes using the global guardrails. Do not treat keyword matches alone as proof of a secret.
7. Capture commands/results for the Verify handoff. Only the Verify stage writes verification.md.
8. Show all scoped diffs, disclose dependency changes, re-read the checklist, and wait for explicit approval before Review. Do not commit, publish, or silently guess unresolved behavior.

