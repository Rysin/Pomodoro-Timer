---
name: verify-hook
gate: 8
stage: Verify
---

PRE-CHECK (before starting):
1. Gate 7 passed (review issues addressed)

POST-CHECK (before moving to PR):
1. verification.md includes evidence (commands + outputs and/or manual checklist)
2. npm test and npm run build results are recorded and passing; acceptance criteria map to actual evidence
3. Relevant manual/browser checks are distinguished from not-run checks; any unmet acceptance criterion blocks the gate
4. Only verification.md changed in this stage; failures were routed back, not patched silently
5. Applicable guardrails passed and explicit user approval recorded
