---
name: security-remediation
description: Perform the orchestrator-owned scoped browser-app security stage before implementation.
---

# Stage 5 procedure

This skill is used by the orchestrator; no separate security-remediation agent is present.

1. Read `.github/hooks/security-remediation.hook.md`, approved impl-plan.md, and global guardrails. Require user-provided REPO_URL and FEATURE_BRANCH_NAME; never infer them.
2. Run `git remote -v`, `git status --short`, and `git branch --show-current`. Verify the requested repository matches the workspace remote; report a missing/mismatched remote as a blocker instead of cloning or replacing the workspace.
3. Validate the name with `git check-ref-format --branch "<FEATURE_BRANCH_NAME>"`; reject main. Inspect local/remote branch existence before selecting a branch:
   - Existing local branch: `git switch "<FEATURE_BRANCH_NAME>"`.
   - Known remote branch only: `git switch --track "origin/<FEATURE_BRANCH_NAME>"`.
   - New branch: `git switch -c "<FEATURE_BRANCH_NAME>"`.
   - Run the chosen switch as its own command and wait for success; then verify with `git branch --show-current`.
   - Fetch only when remote information is needed and permitted. Never use a shell fallback, force checkout, reset, or discard conflicting/unrelated work.
4. Check impacted TypeScript/HTML/browser paths for:
   - DOM XSS from untrusted `innerHTML`, `insertAdjacentHTML`, URL attributes, or dynamically loaded scripts.
   - Dynamic execution such as `eval()` / `Function()` and unsafe parsing of any newly introduced data.
   - Embedded credentials and environment values exposed in the Vite client bundle.
   - Notification permission misuse or unexpected side effects, where relevant.
   - Changed dependency risks with actual audit evidence when tooling/network access is available.
5. Search unstaged and staged diffs and scoped untracked files using the global secret pattern. A documented word such as `token` is not a leaked value; classify matches without recording sensitive values.
6. Fix only proven in-scope vulnerabilities using minimal alternatives. For example, prefer `textContent` for a user-provided label instead of interpolating it into `innerHTML`. Do not invent a backend, authentication layer, or unrelated security redesign.
7. Report out-of-scope findings and seek explicit approval before expanding impacted files. Unresolved in-scope vulnerabilities or unavailable required checks block the gate; never promise exhaustive vulnerability coverage.
8. Write security-remediation.md with inspected scope, commands/results, findings (CWE/OWASP reference when applicable), affected paths, fixes, verification, and limitations. If none were found, say none were found in the inspected scope; do not invent fixes.
9. Run relevant tests and `npm run build` for fixes. Inspect dependency/scope changes, show artifact and fix diffs, re-read the checklist, and wait for explicit approval before Implementation.
