---
name: orchestration
description: Coordinate the approved TypeScript Pomodoro SDLC with explicit stage gates.
---

# Intake and handoffs

1. Read project context in `.github/copilot-instructions.md`. For the full pipeline, ask only for JIRA_STORY_URL at intake. If Jira cannot be read, immediately request pasted description and acceptance criteria.
2. Do not ask for REPO_URL or FEATURE_BRANCH_NAME until immediately before Stage 5.
3. Read each stage's JSON checklist before starting and before handing off. These are guidance files, not automatically executed hooks.

| Gate | Owner | Checklist | Output |
| --- | --- | --- | --- |
| 1 | sdlc-requirements | requirements.hook.json | requirements.md |
| 2 | sdlc-architecture | architecture.hook.json | architecture.md |
| 3 | sdlc-design-review | design-review.hook.json | design-review.md; architecture.md if needed |
| 4 | sdlc-impl-plan | impl-plan.hook.json | impl-plan.md |
| 5 | Orchestrator using security-remediation skill | security-remediation.hook.json | security-remediation.md; approved scoped fixes |
| 6 | sdlc-implementation | implementation.hook.json | Scoped code, tests, and docs |
| 7 | sdlc-code-review | code-review.hook.json | code-review.md |
| 8 | sdlc-verify | verify.hook.json | verification.md; approved scoped Playwright tests |
| 9 | sdlc-pr | pr.hook.json | Approved PR targeting main |

Checklist paths are under `.github/hooks/checklists/`. There is intentionally no security-remediation agent; do not create or delegate to one.

# Approval cycle

1. Stage owners may draft only permitted outputs. Stages 1-4 can write their uncommitted planning artifacts before branch intake; they cannot edit application code or commit.
2. Execute applicable guardrail and POST checks. Show full new artifact contents or existing-file diffs, scoped code changes, dependency changes, and evidence. Never expose suspected secret values.
3. Ask for explicit approval using the host's question tool when available, then stop. PASS is not approval; silence or unrelated replies do not authorize advancement.
4. Incorporate feedback in the same stage and repeat checks/approval. Route implementation fixes through Implementation and Review; never conceal them in Verify. Route Playwright tests written in Verify through Review and obtain approval before completing Verify.
5. After approval, report stage/gate PASS or FAIL, reasons, and the next action. Suggest commit messages only; actual commits/publication need their own approval.
6. Example: Gate 6 with passing tests but no user approval stays pending; do not invoke Review.

# Stage 5 and publication

1. Ask only for REPO_URL and FEATURE_BRANCH_NAME. Verify the supplied repository and safely create/switch to that non-main branch.
2. Load the security-remediation skill, perform the scoped checks, write its artifact, and await approval like any other stage.
3. Before publication, show exact commits and the PR title/body/base/head; wait for explicit approval before push or PR creation. Never publish directly to main or merge automatically.
4. If any capability or check is unavailable, record the blocker and stop rather than claiming success.

