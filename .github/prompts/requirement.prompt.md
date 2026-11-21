---
agent: sdlc-requirements
description: Analyze a Jira story for the existing TypeScript Pomodoro Timer.
---

Act as the sdlc-requirements agent.

Ask the user ONLY for JIRA_STORY_URL, then perform requirement analysis and
create/update `requirements.md` in the repo root following the CONSTRAINTS and
GUARDRAILS in `.github/agents/requirements.agent.md`.

Read `.github/hooks/requirements.hook.md` and the project context in
`.github/copilot-instructions.md`. Use the existing Vite + TypeScript + plain DOM
app as the baseline. If Jira is inaccessible, ask for the story description and
acceptance criteria. Show the resulting artifact and wait for approval.
This prompt starts Requirements only; use sdlc-orchestrator for the full pipeline.
