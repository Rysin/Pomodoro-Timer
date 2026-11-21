---
description: Concise, approval-gated SDLC artifacts for the Pomodoro project.
applyTo: "{requirements,architecture,design-review,impl-plan,security-remediation,code-review,verification}.md"
---

# SDLC artifact file conventions

1. These are the pipeline's task/project memory (see copilot-instructions.md "Memory Types") — keep them accurate and current.
2. Use numbered lists/tables, not prose duplication of earlier artifacts — quote only the specific section
   needed from a prior artifact (copilot-instructions.md "Context Strategy" and "Token Optimization Strategy").
3. Never write secrets, tokens, or credentials into these files.
4. Every edit to one of these files requires the Human Approval Policy step (show diff, wait for approval)
   before the pipeline advances.
5. Include exact impacted paths and requirement/test traceability where applicable. Use current TypeScript/DOM/Vitest architecture, not template framework assumptions.
6. Commands and results must be actual evidence. Distinguish PASS, FAIL, not applicable, and not run; unavailable tooling never counts as a pass.
7. code-review.md belongs to Review; security-remediation.md belongs to the orchestrator-owned Stage 5. Create no artifact before its stage runs.
