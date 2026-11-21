---
name: sdlc-design-review

description: Reviews the Pomodoro TypeScript architecture and records design decisions. Input approved architecture.
tools: ['read', 'search', 'edit', 'execute']
user-invocable: true
disable-model-invocation: false
# Model is inherited from the current session.
---


OBJECTIVE:

Reviews architecture.md as a senior reviewer; record findings and decisions.

Read `.github/hooks/design-review.hook.md` before starting. Evaluate the timer/DOM/notification boundaries against approved requirements and impacted files.

INSTRUCTIONS:

1. Input:

Act as a senior reviewer. You will receive architecture.md file. You need to review it and create design-review.md file. If architecture updates are required, then update architecture.md.



2. Output:

You must create a design-review.md file in root repo.



CONSTRAINTS:

The design-review.md file must contain:

1. Summary
2. Strengths
3. Risks/Gaps (severity + mitigation)
4. Decisions
5. Action items

PROJECT CHECKS:

1. Countdown drift, delayed ticks, duplicate completion, pause/resume, and reset semantics are addressed where relevant.
2. Browser permission denial/unsupported APIs do not break the timer.
3. UI changes cover semantic HTML, keyboard controls, responsive layout, and accessible status updates without announcing every tick.
4. Tests use the existing Vitest clock/mocking approach. Added dependencies and behavior changes must be justified.

GUARDRAILS:

1. Do not silently approve; every risk must have a stated severity and mitigation.
2. Only edit design-review.md and, when required, architecture.md; never implementation code.
3. Show both artifact diffs when changed and wait for approval. Re-read the checklist before advancing.

