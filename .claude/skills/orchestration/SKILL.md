---
name: orchestration
description: Coordinates the approved TypeScript Pomodoro SDLC with explicit stage gates and human approvals.
---

# Intake and handoffs

1. Read `.claude/CLAUDE.md`. For the full pipeline, ask only for `JIRA_STORY_URL` at intake. If Jira cannot be read, immediately request pasted description and acceptance criteria.
2. Do not ask for `REPO_URL` or `FEATURE_BRANCH_NAME` until immediately before Stage 5.
3. Read each stage checklist before starting and before handing off. Checklists are guidance files, not automatically executed hooks.

| Gate | Owner | Checklist | Output |
| --- | --- | --- | --- |
| 1 | `sdlc-requirements` | `requirements.hook.json` | `requirements.md` |
| 2 | `sdlc-architecture` | `architecture.hook.json` | `architecture.md` |
| 3 | `sdlc-design-review` | `design-review.hook.json` | `design-review.md`; architecture update if needed |
| 4 | `sdlc-impl-plan` | `impl-plan.hook.json` | `impl-plan.md` |
| 5 | Orchestrator using security-remediation skill | `security-remediation.hook.json` | `security-remediation.md`; approved scoped fixes |
| 6 | `sdlc-implementation` | `implementation.hook.json` | Scoped code, tests, docs |
| 7 | `sdlc-code-review` | `code-review.hook.json` | `code-review.md` |
| 8 | `sdlc-verify` | `verify.hook.json` | `verification.md`; approved scoped Playwright tests |
| 9 | `sdlc-pr` | `pr.hook.json` | Approved PR targeting `main` |

Checklist files live under `.claude/checklists/`.

# Approval cycle

1. Stage owners may draft only their permitted outputs. Stages 1–4 may write only designated uncommitted planning artifacts; no application edits or commits.
2. Run applicable guardrails and POST checks. Show the full new artifact or existing-file diff, scoped code changes, dependency changes, and evidence. Never expose suspected secret values.
3. Ask the user for explicit approval and stop. PASS is not approval; silence or unrelated replies do not authorize advancement.
4. Incorporate feedback within the same stage and repeat checks/approval. Route implementation fixes through Implementation and Review. Verify-authored Playwright tests need Review and approval before Verify completes.
5. After approval, report PASS/FAIL, reasons, and next action. Suggest commit messages only; commits/publication need separate approval.
6. A passing test suite without user approval leaves the stage pending.

# Stage 5 and publication

1. Ask only for `REPO_URL` and `FEATURE_BRANCH_NAME`. Verify the repository and safely create/switch to that exact non-main branch.
2. Read `.claude/skills/security-remediation/SKILL.md`, run its scoped checks, write the artifact, and await approval.
3. Before publication, show exact commits and complete PR title/body/base/head; await explicit approval before push or PR creation. Never push to `main` or merge automatically.
4. If any capability/check is unavailable, record the blocker and stop rather than claiming success.
