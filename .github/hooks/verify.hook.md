---
name: verify-hook
gate: 8
stage: Verify
---

PRE-CHECK (before starting):
1. Gate 7 passed (review issues addressed)

POST-CHECK (before moving to PR):
1. verification.md maps story acceptance criteria to scenarios, expected results, and actual test or manual evidence; happy paths and applicable negative and edge cases are covered, and non-applicable cases are explained
2. Scoped Playwright tests have been written and run successfully; exact commands and results are recorded. Missing tooling or unexecuted or failed required tests block the gate
3. npm test and npm run build results are recorded and passing; acceptance criteria map to actual evidence
4. Relevant manual/browser checks are distinguished from not-run checks; any unmet acceptance criterion blocks the gate
5. Only verification.md and approved, scoped Playwright test files changed in this stage; test changes were reviewed and approved, and application or infrastructure fixes were routed back
6. Applicable guardrails passed and explicit user approval recorded
