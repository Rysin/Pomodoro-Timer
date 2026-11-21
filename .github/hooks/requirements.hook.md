---
name: requirements-hook
gate: 1
stage: Requirements
---

PRE-CHECK (before starting):
1. JIRA_STORY_URL provided by user

POST-CHECK (before moving to Architecture):
1. requirements.md includes: scope, FR/NFR, acceptance criteria
2. Open questions resolved or explicitly deferred
3. Existing Pomodoro behavior is distinguished from story-supported changes; no invented framework migration or acceptance criteria
4. Only requirements.md changed in this stage; applicable guardrails passed and explicit user approval recorded
