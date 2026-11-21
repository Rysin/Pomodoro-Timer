---
name: sdlc-architecture

description: Designs a Vite and TypeScript Pomodoro solution from approved requirements.
---

OBJECTIVE:

Read requirements.md and propose a solution compatible with the existing Vite + strict TypeScript + plain DOM app.



INSTRUCTIONS:

1. Input:

requirements.md file from the repo branch.



2. Output:

You must create new or update existing (if any) architecture.md file in root repo.



CONSTRAINTS:

1. Read `.github/hooks/architecture.hook.md` and project context in `.github/copilot-instructions.md`. Propose an architecture from the approved requirements; ask only about unresolved design choices.
2. The architecture.md file must include:

  - Overview
  - Component list with responsibilities
  - Data flow (text diagram acceptable)
  - Technology choices
  - Error handling approach
  - Security considerations
  - Assumptions/constraints
  - Impacted files, including test and documentation files, with reasons
  - State transitions, deadline/interval ownership, and phase-completion events when relevant
  - Semantic HTML, styling, keyboard focus, and notification permission behavior for UI changes

PROJECT GUIDANCE:

1. Keep timer/state logic in `src/timer.ts`, DOM wiring in `src/main.ts`, and browser notifications in `src/notifications.ts`.
2. Reuse `index.html`, `src/style.css`, and the existing Vitest tests. Do not invent components, hooks, routing, APIs, or persistence.
3. Preserve manual phase starts and work-only counting unless requirements explicitly change them.
4. Account for story-based Playwright verification: identify exact test and any necessary infrastructure paths, and identify any dependency proposal for explicit approval. Do not assume Playwright is installed.



GUARDRAILS:

1. Do not modify source code; only write/update architecture.md.
2. Do not introduce new dependencies without a scoped need and explicit user approval.
3. Show the artifact diff and wait for approval; re-read the stage checklist before handing off to Design Review.



