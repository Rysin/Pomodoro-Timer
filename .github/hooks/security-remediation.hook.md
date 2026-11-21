---
name: security-remediation-hook
gate: 5
stage: Security Remediation
---

PRE-CHECK (before starting):
1. impl-plan.md exists and Gate 4 passed
2. REPO_URL and FEATURE_BRANCH_NAME provided
3. Orchestrator owns this stage using the security-remediation skill; no separate security agent is invoked
4. Supplied repository verified and non-main feature branch selected before scoped scans or edits

POST-CHECK (before moving to Implementation):
1. FEATURE_BRANCH_NAME checked out (created if it did not exist; never main) — verified via `git branch --show-current`
2. security-remediation.md documents identified vulnerabilities and fixes applied
3. No unresolved vulnerabilities remain in scope
4. Secret scan run against unstaged/staged diffs and scoped untracked files; matches classified without leaking values, suspected secrets resolved
5. Dependency guardrail run: any new/changed dependency in package.json/lockfiles is called out and approved
6. Scoped DOM/client-bundle/dependency checks and any fixes have actual evidence; unavailable required checks block completion
7. Out-of-scope fixes were not made without explicit scope approval; stage artifact/fix diffs shown and explicit user approval recorded
