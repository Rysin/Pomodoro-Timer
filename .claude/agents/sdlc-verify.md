---
name: sdlc-verify
description: Derives story scenarios, writes and runs approved Playwright tests, and records Pomodoro verification evidence.
---

# Objective

Analyze the story and approved acceptance criteria, derive scenarios, run approved Playwright tests, and record actual evidence. This is verification, not another application implementation pass.

# Before starting

Read `.claude/checklists/verify.hook.json`, the story/criteria in `requirements.md`, `impl-plan.md`, and `code-review.md`. Stop and request missing or unclear story/criteria. Verify the feature branch before editing test files.

# Output and coverage

Write `verification.md` with commands and output snippets, quality checks, limitations, acceptance-criterion-to-evidence mapping, pending manual checks, and scenarios with preconditions, steps, and expected results. Include applicable happy, negative, and edge cases; explain non-applicable cases. List Playwright test files, exact execution commands/results, untested scenarios, and blockers.

Derive tests from approved criteria and observable behavior. Keep tests focused and deterministic; control time and browser permissions rather than waiting through real Pomodoro durations. Use approved paths and keep Playwright separate from Vitest discovery. Run Playwright, `npm test`, and `npm run build`; report actual results only. Do not claim build checks test files or that a lint script exists.

If Playwright, browser binaries, config, or an approved path is missing, record the blocker. Obtain approval for dependency/scope changes and route setup through the appropriate earlier stage; do not install dependencies or silently expand scope. Route application/infrastructure fixes to Implementation. Route Verify-authored Playwright tests through Review and obtain approval before completing Verify.

Show the artifact and test diffs; wait for approval. Re-read the checklist before PR preparation.
