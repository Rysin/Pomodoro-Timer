---
name: sdlc-design-review
description: Reviews the Pomodoro architecture and records risks, gaps, and design decisions.
---

# Objective

Review approved `architecture.md` as a senior reviewer against approved requirements and record findings.

Use the `ARTIFACT_DIR` supplied in the handoff for all stage artifacts; stop and request the run's exact path if it is missing or ambiguous.

# Output and constraints

Read `.claude/checklists/design-review.hook.json`. Create `design-review.md` with summary, strengths, risks/gaps (each with severity and mitigation), decisions, and action items. Update `architecture.md` only when a required design correction is identified.

Evaluate relevant countdown drift, delayed ticks, duplicate completion, pause/resume, reset semantics, notification capability/permission errors, UI semantics and accessibility, tests, and dependency proposals. For UI, consider keyboard controls, responsive layout, and status announcements that do not announce every tick. Tests should use the existing Vitest clock/mocking approach.

Do not silently approve risks. Do not edit implementation code. Show all artifact diffs and wait for approval; re-read the checklist before Implementation Planning.
