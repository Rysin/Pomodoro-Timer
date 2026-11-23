---
name: code-review
description: Review changed Pomodoro TypeScript, DOM, notifications, and Vitest tests.
---

# Review procedure

Read and write stage Markdown artifacts in the `ARTIFACT_DIR` provided in the handoff; stop and request the run's exact path if it is missing or ambiguous.

1. Read `.github/hooks/checklists/code-review.hook.json`, the approved requirements/plan scope, and actual staged/unstaged/untracked changes. Do not review unrelated code or infer changes from summaries.
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

3. Write code-review.md with a checklist, severity, file/line evidence, proposed exact fixes, and approval status. For example, flag a new decrement-per-tick countdown because delayed ticks lose elapsed time; identify the changed lines and missing regression case.
4. Do not edit application code. Route actionable fixes back to Implementation, then review the updated diff and evidence.
5. Show the review artifact, re-read the checklist, and wait for human approval. A review passes only after actionable in-scope findings are resolved.



