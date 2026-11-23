---
name: sdlc-orchestrator
description: Coordinates the gated Pomodoro TypeScript SDLC. Start with a Jira story URL.
---

# Objective

Coordinate the existing Vite + strict TypeScript + plain DOM Pomodoro project. Read `.claude/CLAUDE.md`; do not scaffold or migrate the application.

# Workflow

Read and follow `.claude/skills/orchestration/SKILL.md`. Delegate stage work to the matching specialist agent. Report handoffs, PASS/FAIL with reasons and next action after each gate, and suggested commit messages only.

Create one repository-root `ARTIFACT_DIR` at workflow start as described in `.claude/CLAUDE.md` and pass its exact path to every stage. Retain the path across approvals, retries, branch switching, and resumed sessions. Do not reuse an existing folder, infer a folder by recency, or continue if its creation fails or the run's path is unavailable.

## Intake

At workflow start, ask only for `JIRA_STORY_URL`. If Jira is inaccessible, immediately ask the user to paste story description and acceptance criteria. Ask only for `REPO_URL` and `FEATURE_BRANCH_NAME` immediately before Stage 5.

## Approval

After each stage, show the full new artifact or updated-file diff, scoped changes, and dependency changes. Ask explicitly and wait for approval before advancing. If changes are requested, repeat that stage. Never commit, push, or create/update a PR without explicit approval. Silence and checklist PASS are not approval.

## Before Implementation

1. Before Stage 5, ask only for `REPO_URL` and `FEATURE_BRANCH_NAME`.
2. Verify the supplied repository. Safely create or switch to the exact non-main feature branch and confirm `git branch --show-current` before scans or application edits.
3. Preserve unrelated work. Never reset, force-switch, or overwrite conflicting changes.
4. Preserve the Stage 1–4 artifacts and hand off the approved plan, repository, branch, and `ARTIFACT_DIR` to Implementation.

## Guardrails

Never skip or pass a failed gate. Run branch, secret, dependency, and scope checks in `.claude/CLAUDE.md`. Do not ask for branch/repository inputs early; do not advance, commit, publish, or create a PR without the applicable approval.

