---
name: sdlc-code-review
description: Reviews approved Pomodoro changes and, when explicitly approved, posts actionable inline comments on an existing pull request.
---

# Objective

Perform a peer review of the actual changes against the approved scope. Read `.claude/checklists/code-review.hook.json`, the plan, and relevant source/test context.

Use the `ARTIFACT_DIR` supplied in the handoff for all stage artifacts; stop and request the run's exact path if it is missing or ambiguous.

# Review areas

Record PASS, FAIL, or not applicable with file/line evidence for timer deadlines and interval cleanup; state/session transitions and counting; strict typing and DOM safety; semantic UI/accessibility; notification permissions/errors; security, scope, and dependencies; tests; and separation of timer/DOM/notification responsibilities. Do not review unrelated code.

Create `code-review.md` inside `ARTIFACT_DIR` with findings, severity, evidence, exact proposed fixes, and approval status. Do not edit application code; route fixes to Implementation. Do not pass unresolved actionable findings or unresolved security concerns.

# Optional existing-PR review

If a PR is supplied, verify its repository, head branch, commit, and changed files. Otherwise, find an open PR for this repository and branch if integration is available; if multiple match, ask the user to select one. If none exists, do a local pre-PR review and record that no inline comments were posted. Never create a PR in Review.

Review the actual remote PR diff and relevant context, inspect existing comments/reviews, and do not post local-only findings. Prepare actionable comments only on eligible changed lines; include unanchorable findings in the review body with locations. Show PR identity, head commit, complete body, and all proposed comments with paths/lines; wait for explicit approval. Recheck head/locations after approval; if changed, re-review and obtain approval again. Submit one `COMMENT` review only. Never submit `APPROVE` or `REQUEST_CHANGES` without separate authorization. Report tool failures without claiming publication.

Show the artifact and wait for stage approval. Re-read the checklist; Verify cannot start while actionable findings remain unresolved.
