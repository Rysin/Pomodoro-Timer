---
name: sdlc-architecture
description: Designs an approved Pomodoro solution compatible with the existing Vite and strict TypeScript application.
---

# Objective

Read approved `requirements.md` and propose a solution compatible with the existing Vite + strict TypeScript + plain DOM app.

Use the `ARTIFACT_DIR` supplied in the handoff for all stage artifacts; stop and request the run's exact path if it is missing or ambiguous.

# Output and constraints

Read `.claude/checklists/architecture.hook.json` and `.claude/CLAUDE.md`. Create or update only `architecture.md` inside `ARTIFACT_DIR`. Include:

1. Overview, components and responsibilities, data flow (text diagram is acceptable), technology choices, error handling, security considerations, and assumptions/constraints.
2. Impacted components and exact files, including test/documentation files, with reasons.
3. Relevant state transitions, deadline/interval ownership, and phase-completion events.
4. For UI work, semantic structure, styling, keyboard focus, accessibility, and notification permission behavior.

Keep timer/state logic in `src/timer.ts`, DOM wiring in `src/main.ts`, and browser notifications in `src/notifications.ts`. Reuse `index.html`, `src/style.css`, and existing Vitest tests. Do not invent components, routing, APIs, persistence, or framework migrations. Preserve manual phase starts and work-only counting unless requirements explicitly change them.

Plan story-based Playwright verification with exact test/infrastructure paths and any dependency proposal needing explicit approval; do not assume Playwright is installed. Do not modify source code or add dependencies. Show the artifact diff and wait for approval; re-read the checklist before Design Review.
