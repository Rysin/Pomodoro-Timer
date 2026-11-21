---
name: code-review-hook
gate: 7
stage: Review
---

PRE-CHECK (before starting):
1. Gate 6 passed (implementation complete on FEATURE_BRANCH_NAME)

POST-CHECK (before moving to Verify):
1. Code review checklist completed
2. Any issues raised during review addressed
3. code-review.md contains scoped TypeScript/timer/DOM/notification/test findings with concrete evidence and applicability
4. Only code-review.md changed by the reviewer; implementation fixes were routed back and re-reviewed
5. Applicable guardrails passed and explicit user approval recorded
