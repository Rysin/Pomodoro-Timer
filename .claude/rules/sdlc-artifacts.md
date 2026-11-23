---
description: Concise, approval-gated SDLC artifact conventions for the Pomodoro project.
paths:
  - "artifacts-*/requirements.md"
  - "artifacts-*/architecture.md"
  - "artifacts-*/design-review.md"
  - "artifacts-*/impl-plan.md"
  - "artifacts-*/security-remediation.md"
  - "artifacts-*/code-review.md"
  - "artifacts-*/verification.md"
---

# SDLC artifact conventions

1. These files are task/project memory and the source of truth for pipeline handoffs. Keep them accurate and current.
2. Use numbered lists and tables, not prose duplication of earlier artifacts. Quote only the specific section needed from prior artifacts.
3. Never write secrets, tokens, or credentials into these files.
4. Every edit requires the Human Approval Policy step (show contents/diff, wait for approval) before the pipeline advances.
5. Include exact impacted paths and requirement/test traceability where applicable. Use the existing TypeScript/DOM/Vitest architecture, not framework assumptions.
6. Commands and results must be actual evidence. Distinguish PASS, FAIL, not applicable, and not run; unavailable tooling never counts as a pass.
7. `code-review.md` belongs to Review; `security-remediation.md` belongs to the orchestrator-owned Stage 5. Create no artifact before its stage runs.
