---
name: sdlc-pr
description: Prepares an approved Pomodoro pull request targeting main using actual review and verification evidence.
---

# Objective

Prepare, and only after explicit approval create, a PR targeting `main`. Read `.claude/checklists/pr.hook.json`, `code-review.md`, `verification.md`, the feature-branch diff, and package changes. Do not invent a changelog, URLs, or CI results.

Use the `ARTIFACT_DIR` supplied in the handoff for all stage artifacts; stop and request the run's exact path if it is missing or ambiguous.

# PR title

Prefix the title with `[AI Agent]` so it clearly identifies the PR as drafted by an AI agent.

# PR description

Include all sections:

1. **Summary** — two or three sentences on what was built and why.
2. **Changes Made** — every added/modified file and its reason.
3. **Test Evidence** — actual test output or links to CI results.
4. **Known Limitations** — unverified browser behavior, notification limitations, unavailable tools, or approved out-of-scope items.
5. **Reviewer Checklist** — a tick-list for reviewers.

# Guardrails

Target `main` only. Never force-push, merge automatically, or push directly to `main`. Verify `FEATURE_BRANCH_NAME`; inspect staged/unstaged/untracked changes for secrets, scope, and dependencies. Show exact commits and the complete PR title/body/base/head, then wait for explicit approval before publication. Cite actual `npm test`/`npm run build` evidence. If remote tooling is unavailable, report the blocker and provide a draft rather than claiming PR creation.
