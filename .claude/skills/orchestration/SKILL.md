---
name: orchestration
description: Coordinates the approved TypeScript Pomodoro SDLC with explicit stage gates and human approvals.
---

# Intake and handoffs

1. Read `.claude/CLAUDE.md`. For the full pipeline, ask only for `JIRA_STORY_URL` at intake. If Jira cannot be read, immediately request pasted description and acceptance criteria.
2. Do not ask for `REPO_URL` or `FEATURE_BRANCH_NAME` until immediately before Stage 5.
3. Read each stage checklist before starting and before handing off. Checklists are guidance files, not automatically executed hooks.
4. At workflow start, create one repository-root `artifacts-<yyyy-mm-dd-hh-mm>` folder using local time and `Get-Date -Format 'yyyy-MM-dd-HH-mm'`. Use `New-Item -ItemType Directory -Path <path> -ErrorAction Stop` without `-Force`; if the path already exists or creation fails, stop and report the blocker. Record its repository-root-relative path as `ARTIFACT_DIR` and include it in every handoff. Reuse that exact path for the entire run, including retries, approvals, branch switching, and resumption; do not infer it from the newest folder. If the run's path is unavailable on resume, stop and ask for it.
5. All Markdown outputs in the table are inside `ARTIFACT_DIR`; source code, approved tests, and other non-artifact outputs remain at their approved paths. Create each Markdown artifact only when its stage runs. Preserve the Stage 1–4 drafts in this folder when safely switching to the feature branch.

| Gate | Owner | Checklist | Output |
| --- | --- | --- | --- |
| 1 | `sdlc-requirements` | `requirements.hook.json` | `requirements.md` |
| 2 | `sdlc-architecture` | `architecture.hook.json` | `architecture.md` |
| 3 | `sdlc-design-review` | `design-review.hook.json` | `design-review.md`; architecture update if needed |
| 4 | `sdlc-impl-plan` | `impl-plan.hook.json` | `impl-plan.md` |
| 5 | `sdlc-implementation` | `implementation.hook.json` | Scoped code, tests, docs |
| 6 | `sdlc-code-review` | `code-review.hook.json` | `code-review.md` |
| 7 | `sdlc-verify` | `verify.hook.json` | `verification.md`; approved scoped Playwright tests |
| 8 | `sdlc-pr` | `pr.hook.json` | Approved PR targeting `main` |

Checklist files live under `.claude/checklists/`.

# Approval cycle

1. Stage owners may draft only their permitted outputs. Stages 1–4 may write only designated uncommitted planning artifacts; no application edits or commits.
2. Run applicable guardrails and POST checks. Show the full new artifact or existing-file diff, scoped code changes, dependency changes, and evidence. Never expose suspected secret values.
3. Ask the user for explicit approval and stop. PASS is not approval; silence or unrelated replies do not authorize advancement.
4. Incorporate feedback within the same stage and repeat checks/approval. Route implementation fixes through Implementation and Review. Verify-authored Playwright tests need Review and approval before Verify completes.
5. After approval, report PASS/FAIL, reasons, and next action. Suggest commit messages only; commits/publication need separate approval.
6. A passing test suite without user approval leaves the stage pending.

# Implementation intake and publication

1. Immediately before Implementation, ask only for `REPO_URL` and `FEATURE_BRANCH_NAME`. Verify the repository and safely create/switch to that exact non-main branch, preserving existing work and the planning artifacts.
2. Hand off the approved plan, repository, branch, and `ARTIFACT_DIR` to Implementation.
3. Before publication, show exact commits and complete PR title/body/base/head; await explicit approval before push or PR creation. Never push to `main` or merge automatically.
4. If any capability/check is unavailable, record the blocker and stop rather than claiming success.
