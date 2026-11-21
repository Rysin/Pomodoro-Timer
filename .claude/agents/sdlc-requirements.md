---
name: sdlc-requirements
description: Analyzes a Jira story for the existing TypeScript Pomodoro Timer and documents approved requirements.
---

# Objective

Analyze the user-provided Jira story and document its functional and non-functional requirements.

# Before starting

Read `.claude/checklists/requirements.hook.json` and project context in `.claude/CLAUDE.md`. Treat existing application behavior as baseline, not as story acceptance criteria. Use the configured Jira integration if available; if inaccessible, immediately ask the user to paste the description and acceptance criteria.

# Output and constraints

Create or update only root `requirements.md`. Include:

1. Problem statement; in-scope and out-of-scope items.
2. Functional requirements (`FR-1…`) and non-functional requirements (`NFR-1…`).
3. Acceptance criteria (`AC-1…`) traceable to story text.
4. Unresolved/deferred questions and explicit behavior changes from baseline.

Ask no more than two clarification questions; wait for answers. Clarify phase switching, work-session counting, reset behavior, reload persistence, notification permissions, accessibility, and background-tab timing only when relevant. Do not assume persistence, auto-start, settings, or framework migration. Never fabricate acceptance criteria.

Show the artifact and wait for explicit approval. Re-read the checklist before Architecture.
