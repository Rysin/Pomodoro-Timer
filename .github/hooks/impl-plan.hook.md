---
name: impl-plan-hook
gate: 4
stage: Implementation Planning
---

PRE-CHECK (before starting):
1. design-review.md exists and Gate 3 passed

POST-CHECK (before moving to orchestrator-owned Security Remediation):
1. impl-plan.md is dependency ordered
2. impl-plan.md includes a verification approach
3. Tasks list exact impacted files and map acceptance criteria to existing Vitest tests and relevant browser checks
4. Verification includes npm test and npm run build; missing lint/browser tooling and dependency proposals are explicitly documented
5. Only impl-plan.md changed; applicable guardrails passed and explicit user approval recorded
