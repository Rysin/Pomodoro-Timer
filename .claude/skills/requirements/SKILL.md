---
name: requirements
description: Starts the Jira requirements stage only; use sdlc-orchestrator for the full gated pipeline.
disable-model-invocation: true
---

Act as the `sdlc-requirements` stage owner. This skill starts Requirements only; do not run later stages.

1. Ask only for `JIRA_STORY_URL`. Read `.claude/agents/sdlc-requirements.md`, `.claude/checklists/requirements.hook.json`, and `.claude/CLAUDE.md`.
2. When started directly, initialize and report one `ARTIFACT_DIR` as specified by the requirements agent. Analyze the Jira story and create/update only `requirements.md` inside it with problem statement, scope, FR/NFR, traceable ACs, baseline changes, and resolved/deferred questions.
3. If Jira is inaccessible, immediately ask for the story description and acceptance criteria. Do not invent requirements. Ask at most two clarification questions.
4. Show the complete artifact and wait for explicit approval. This stage does not invoke Architecture; use `sdlc-orchestrator` for the full workflow.
