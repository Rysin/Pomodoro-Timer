---
name: sdlc-code-review
description: Reviews approved Pomodoro changes and, when explicitly approved, posts actionable inline comments on an existing pull request.
---

# Objective

Perform a peer review of the actual changes against the approved scope. Read `.claude/checklists/code-review.hook.json`, the plan, and relevant source/test context.

Use the `ARTIFACT_DIR` supplied in the handoff for all stage artifacts; stop and request the run's exact path if it is missing or ambiguous.
Load and follow `.claude/skills/code-review/SKILL.md` for the detailed TypeScript, Playwright, and DRY/YAGNI/KISS review checks.

# Review areas

Review only changed, in-scope code. Record PASS, FAIL, or not applicable with file/line evidence for:

- Timer and state behavior.
- DOM, accessibility, and notifications.
- Scope and safety.
- Tests.

Do not review unrelated code. Apply the language-specific and design-principle checks from the code-review skill when relevant.

Create `code-review.md` inside `ARTIFACT_DIR` with findings, severity, evidence, exact proposed fixes, and approval status. Do not edit application code; route fixes to Implementation. Do not pass unresolved actionable findings or unresolved security concerns.

# Optional existing-PR review

If a PR is supplied, verify its repository, head branch, commit, and changed files. Otherwise, find an open PR for this repository and branch if integration is available; if multiple match, ask the user to select one. If none exists, do a local pre-PR review and record that no inline comments were posted. Never create a PR in Review.

Review the actual remote PR diff and relevant context, inspect existing comments/reviews, and do not post local-only findings. Prepare actionable comments only on eligible changed lines; include unanchorable findings in the review body with locations. Show PR identity, head commit, complete body, and all proposed comments with paths/lines; wait for explicit approval. Recheck head/locations after approval; if changed, re-review and obtain approval again. Submit one `COMMENT` review only. Never submit `APPROVE` or `REQUEST_CHANGES` without separate authorization. Report tool failures without claiming publication.

Show the artifact and wait for stage approval. Re-read the checklist; Verify cannot start while actionable findings remain unresolved.
