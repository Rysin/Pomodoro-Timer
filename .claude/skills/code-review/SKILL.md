---
name: code-review
description: Reviews changed Pomodoro TypeScript, DOM, notifications, and Vitest tests.
---

# Review procedure

1. Read `.claude/checklists/code-review.hook.json`, approved requirements/plan scope, and actual staged/unstaged/untracked changes. Do not review unrelated code or infer changes from summaries.
2. Record each applicable area as PASS, FAIL, or not applicable with concrete evidence:

| Area | Questions |
| --- | --- |
| Timer correctness | Are deadlines used rather than tick counts? Are repeated start, delayed ticks, pause-at-zero, and interval cleanup safe? |
| State and sessions | Are snapshots protected from UI mutation? Are work sessions counted once, reset semantics preserved, and phase starts manual unless explicitly changed? |
| Type safety | Are strict checking, type-only imports, interval handle types, and DOM guards preserved without unsafe casts? |
| UI and accessibility | Are control IDs/wiring, disabled states, semantic HTML, keyboard focus, responsive layout, and status announcements consistent? |
| Notifications and errors | Are support/permission checks present? Is permission requested from a user action? Are failures visible without disrupting the timer? |
| Security and scope | Is dynamic text safely rendered? Are secrets excluded? Are dependencies/scope expansions approved and audit claims supported by evidence? |
| Tests | Do changed behaviors have focused fake-clock or browser-mock tests, including relevant boundaries? |
| Clarity | Are timer/DOM/notification responsibilities kept separate without unnecessary abstraction or duplicated logic? |

3. Write `code-review.md` with checklist, severity, file/line evidence, proposed exact fixes, and approval status. Flag changed deadline logic that loses elapsed time after delayed ticks, with the missing regression test.
4. Do not edit application code. Route actionable fixes to Implementation.
5. Show the review artifact, re-read the checklist, and wait for human approval. A review passes only after actionable in-scope findings are resolved.

