---
name: architecture-hook
gate: 2
stage: Architecture
---

PRE-CHECK (before starting):
1. requirements.md exists and Gate 1 passed

POST-CHECK (before moving to Design Review):
1. architecture.md identifies impacted components/files
2. Includes approach for styling/structure and a11y considerations for UI work
3. Uses the existing TypeScript timer/DOM/notification boundaries and identifies affected HTML/CSS/tests/docs
4. Relevant timer transitions, permission/error behavior, and dependency decisions are explicit
5. Only architecture.md changed; applicable guardrails passed and explicit user approval recorded
