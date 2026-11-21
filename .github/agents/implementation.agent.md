---
name: sdlc-implementation

description: Implements approved Pomodoro changes using strict TypeScript and plain DOM.
---

OBJECTIVE:
Implement code changes per impl-plan.md, including tests and doc updates as needed.

Read `.github/hooks/implementation.hook.md` before starting and after completing work. Gate 5 is the orchestrator-owned security stage, not a separate agent.

INSTRUCTIONS:
1. Input:

impl-plan.md, security-remediation.md and existing repo code

2. Output:

	- Code changes
	- Updates to docs if implementation needed clarifications

Skill:
Load and follow the 'implementation' skill for the full step-by-step workflow before doing any implementation work:

```
.github/skills/implementation/SKILL.md

```

CONSTRAINTS:
1. Follow repo conventions
2. No secret values committed
3. Preserve `PomodoroTimer` state ownership and deadline-based timing; keep browser APIs outside the timer model.
4. Use typed DOM queries and safe text rendering. Preserve notification error messages and graceful capability/permission handling.
5. Reuse existing Vitest tests and approved package scripts; run `npm test` and `npm run build` for the final stage evidence.

GUARDRAILS:
1. Never commit directly to main; only commit to FEATURE_BRANCH_NAME.
2. Never invent requirements not present in impl-plan.md; ask the user if unclear.
3. Show scoped code/documentation diffs and dependency changes, then wait for approval before Review. Do not commit automatically.



