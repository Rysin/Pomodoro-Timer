Copilot Instructions — Pomodoro Timer Agentic SDLC

## Project context

1. This is an existing Vite + strict TypeScript + plain DOM application, not a framework scaffold.
2. `src/timer.ts`: `PomodoroTimer`, typed state snapshots/subscriptions, deadline-based countdown, and interval lifecycle.
3. `src/main.ts`: typed DOM queries, rendering, controls, visibility refresh, and user-facing notification errors.
4. `src/notifications.ts`: browser capability checks, permission requests, and phase-completion notifications.
5. `index.html`: semantic page structure. `src/style.css`: responsive presentation.
6. `tests/timer.test.ts` and `tests/notifications.test.ts`: Vitest fake timers, controlled system time, and browser-global mocks.
7. `package.json`, `package-lock.json`, and `tsconfig.json`: tooling and strict type-check configuration. Do not change them without a scoped reason.
8. Preserve 25-minute work / 5-minute break durations, manual next-phase starts, and the counter incrementing only on work completion unless approved requirements explicitly change them.
9. Pause preserves remaining time; reset restores the current phase without clearing the count. Reload resets the count. Notifications are opt-in and only work while the page can run.
10. Compute remaining time from a deadline, not interval tick counts. Preserve `ReturnType<typeof setInterval> | null`, duplicate-start protection, cleanup, and pause-at-zero completion.
11. Follow existing extensionless imports, single-quoted TypeScript strings, no semicolons, type-only imports, and explicit DOM guards. Avoid `any`, unchecked assertions, and constructor parameter properties unsupported by `erasableSyntaxOnly`.
12. No framework, backend, database, persistence layer, or UI library is currently present. Do not introduce one unless approved requirements need it.

## Commands and evidence

| Purpose | Command |
| --- | --- |
| Local development | `npm run dev` |
| Targeted timer tests | `npm test -- tests/timer.test.ts` |
| Targeted notification tests | `npm test -- tests/notifications.test.ts` |
| All existing tests | `npm test` |
| Type-check application and build | `npm run build` |
| Preview production build | `npm run preview` |

1. Read `package.json` before running scripts; there is no lint script or browser automation dependency currently.
2. `npm run build` type-checks `src`, not `tests`, and Vitest execution is not a test-file type-check. Do not claim broader coverage.
3. Restore dependencies with `npm ci` only when needed and a lockfile exists. Dependency changes require explicit approval; do not add tooling just to satisfy a nonexistent script.
4. Use Windows PowerShell-compatible commands. Do not use shell `||` / `&&` branch fallbacks; issue branch switches separately and verify their result.
5. Record actual commands, outputs, and browser checks. Missing tools or denied permissions are limitations, not fabricated passes.

## Harness entry points

1. Start the full Jira-based workflow with `sdlc-orchestrator`; `.github/prompts/requirement.prompt.md` starts requirements only.
2. Agents define stage roles; skills define reusable procedures; scoped instructions apply to TypeScript, HTML, styles, tests, and SDLC artifacts.
3. Stage 5 is owned by the orchestrator using `.github/skills/security-remediation/SKILL.md` and its gate checklist. There is intentionally no separate security-remediation agent.
4. `.github/hooks/*.hook.md` are agent-read Markdown PRE/POST checklists, not executable hooks. This harness does not install runtime hook enforcement, CI, or Jira tooling. Agents must execute required checks and wait for approvals explicitly.
5. A direct, explicitly scoped maintenance request need not launch the Jira pipeline. Never infer approval for commits, pushes, dependencies, or PRs from permission to edit files.


Pipeline (must follow order):

1. Requirements

2. Architecture

3. Design Review

4. Implementation Planning

5. Security Remediation

6. Implementation

7. Review

8. Verify

9. PR


Staged Question Policy (MANDATORY):

1. At workflow start, ask ONLY for JIRA_STORY_URL.

2. Do not ask for REPO_URL or FEATURE_BRANCH_NAME until just before Security Remediation begins.

3. At that point, ask ONLY for REPO_URL and FEATURE_BRANCH_NAME (no other questions).

4. If Jira content is inaccessible, immediately ask the user to paste story description + acceptance criteria.



Human Approval Policy (MANDATORY):

1. Before advancing past ANY stage, show the user the full content/diff of any file created or updated in that stage, any commit(s) about to be pushed, and/or any PR about to be created/updated.

2. Explicitly ask for approval (e.g. "Do you approve these changes to proceed?") and WAIT; never invoke the next stage, run `git push`, or create/update a PR without explicit user approval of that stage's output.

3. If the user requests changes, redo that same stage with the feedback and repeat the approval step until approved.

4. This human approval gate applies at every stage, in addition to (not instead of) the automated hook gate checks below. Never treat silence, an unrelated reply, or an automated gate PASS as approval.



Guardrail Enforcement (MANDATORY):

1. Guardrails must be verified with explicit commands/checks, not left to agent judgement alone:

   - Branch safety: before every application/configuration edit in the pipeline and before every commit, run `git branch --show-current`; it must equal the user-provided FEATURE_BRANCH_NAME and never `main`.
   - Stages 1-4 may draft only their designated, uncommitted planning artifacts before branch intake at Stage 5. No application changes or commits are allowed then. Stage 5 moves those drafts to FEATURE_BRANCH_NAME before remediation.
   - No direct pushes or commits to main: publish only FEATURE_BRANCH_NAME and create a PR targeting main. Never use a direct main push as a substitute for a PR.
   - Secret scan: inspect unstaged and staged diffs plus scoped untracked files for `api[_-]?key|secret|password|token|BEGIN (RSA|PRIVATE) KEY` (case-insensitive) before every commit, in Security Remediation, Implementation, and PR. Review every match: legitimate names/pattern documentation are not secrets, but suspected values block the gate until resolved. Never paste suspected values into artifacts.
   - Dependency guardrail: diff `package.json`/lockfiles; any new dependency requires explicit user approval in that stage's approval step.
   - Scope guardrail: stage artifacts are allowed only for their owning stage. Application/configuration edits must be listed as impacted in architecture.md/impl-plan.md. Proposed scope expansions require a documented reason and explicit approval before editing.

2. A guardrail FAIL blocks the stage gate exactly like a hook POST-CHECK failure.

### Guardrail command examples (PowerShell)

Run checks explicitly and retain their results. Replace `$impacted` with the
approved exact paths from the current plan. Do not log matching secret values.

```powershell
$branch = git branch --show-current
if ($LASTEXITCODE -ne 0 -or $branch -eq 'main' -or $branch -ne $FEATURE_BRANCH_NAME) {
  throw 'Feature branch verification failed'
}
git status --short
git --no-pager diff --name-only
git --no-pager diff --cached --name-only
git --no-pager diff -- package.json package-lock.json
git --no-pager diff --cached -- package.json package-lock.json

$pattern = 'api[_-]?key|secret|password|token|BEGIN (RSA|PRIVATE) KEY'
$unstaged = git --no-pager diff
if ($LASTEXITCODE -ne 0) { throw 'Unstaged diff scan failed' }
$staged = git --no-pager diff --cached
if ($LASTEXITCODE -ne 0) { throw 'Staged diff scan failed' }
$diff = @($unstaged) + @($staged)
$diff | Select-String -Pattern $pattern | Select-Object LineNumber
$impacted = @('src\timer.ts') # Replace with the approved impacted paths.
$untracked = git ls-files --others --exclude-standard -- $impacted
if ($LASTEXITCODE -ne 0) { throw 'Untracked file listing failed' }
foreach ($file in $untracked) {
  Select-String -LiteralPath $file -Pattern $pattern -ErrorAction Stop |
    Select-Object Path, LineNumber
}
```

1. Compare changed/untracked paths to the approved scope; include the permitted stage artifact.
2. Classify all scan matches privately. Unresolved suspected secrets, command failures, and unapproved dependency/scope changes block the gate.
3. Review diffs from both working tree and index before every commit. Confirm every command succeeded; do not infer success from an empty result after a failed command.



Inputs:

1. JIRA_STORY_URL (required; asked at start)

2. REPO_URL (required; asked right before Security Remediation)

3. FEATURE_BRANCH_NAME (required; asked right before Security Remediation)

4. PR_TARGET_BRANCH: main (fixed)



Artifact files (repo root; create only when the stage runs):

1. requirements.md

2. architecture.md

3. design-review.md

4. impl-plan.md

5. security-remediation.md

6. verification.md

7. code-review.md (Review stage)



Branching rule (MANDATORY):

1. Use FEATURE_BRANCH_NAME exactly as provided by the user.

2. Create/switch to FEATURE_BRANCH_NAME before any code changes.

3. If branch exists, switch to it.

4. Never commit directly to main.

5. The orchestrator-owned Security Remediation stage enforces this rule first: create/switch to FEATURE_BRANCH_NAME and verify it before scanning or fixing anything. Preserve unrelated work; never reset, force-switch, or overwrite conflicting changes.



Stage Gates (Hooks):

Each gate's PRE/POST checks are captured as a Markdown checklist under .github/hooks/<stage>.hook.md. Agents must read the matching checklist before starting a stage and before advancing to the next one. Every POST-CHECK also requires applicable guardrail checks and explicit human approval. These files do not execute automatically.

Gate 1 — Requirements Complete

1. requirements.md includes: scope, FR/NFR, acceptance criteria

2. open questions resolved or explicitly deferred



Gate 2 — Architecture Ready

1. architecture.md identifies impacted components/files

2. includes approach for styling/structure and a11y considerations for UI work



Gate 3 — Design Reviewed

1. design-review.md includes risks/gaps + decisions

2. architecture.md updated if required



Gate 4 — Plan Approved

1. impl-plan.md is dependency ordered

2. includes verification approach



Gate 5 — Security Remediation Complete

1. FEATURE_BRANCH_NAME checked out (created if it did not exist; never main)

2. security-remediation.md documents vulnerabilities found and fixes applied

3. no unresolved vulnerabilities remain in scope



Gate 6 — Implementation Done

1. changes implemented on FEATURE\_BRANCH\_NAME

2. available scripts (build/test/lint) run if present; otherwise documented



Gate 7 — Review Passed

1. code review checklist completed and any issues addressed



Gate 8 — Verify Passed

1. verification.md includes evidence (commands + outputs and/or manual checklist)



Gate 9 — PR Ready

1. PR targets main

2. PR description includes Summary, Changes, Evidence, Limitations, Reviewer Checklist



Shared skills / expectations:

1. Ask clarifying questions early (Requirements stage)

2. Keep changes minimal and consistent with repo conventions

3. For UI: prefer CSS variables/tokens; implement hover/active/focus; maintain visible keyboard focus; consider contrast

4. Avoid introducing new dependencies unless required

5. No secrets in code or markdown



Custom Instructions:

1. Scoped `.instructions.md` files live under `.github/instructions/` and apply via their `applyTo` glob (TypeScript source, HTML, stylesheets, tests, and root SDLC artifact files).

2. Scoped instructions refine but never override this file for files outside their glob — see Skills vs Instructions below for precedence when guidance conflicts.



Skills vs Instructions — Precedence & Conflict Resolution:

When skills, hooks, agents, and instructions conflict, resolve in this order (highest wins):

1. Explicit user instruction in the current turn — always wins.

2. Stage hook file (`.github/hooks/*.hook.md`) — gate-specific PRE/POST checks.

3. Agent definition (`.github/agents/*.agent.md`) — stage role and objective.

4. Skill file (`SKILL.md` under `.github/skills/<name>/`) — reusable "how to do the work" procedure a stage loads.

5. This file (`copilot-instructions.md`) — global defaults.

6. Scoped `.instructions.md` files (`applyTo` glob-scoped) — apply only within their glob; they refine, but never override, the global defaults above for files outside their scope.

Activation rules: the owning agent must read its role and Markdown gate checklist explicitly; those checklists do not run themselves. Skills are only active when loaded; scoped instructions apply to matching files through `applyTo` in supporting hosts. If a skill and a checklist disagree, the checklist defines the pass/fail bar.



Context Strategy ("Lost in the Middle"):

1. Before a substantial task or stage, identify the current objective, constraints, and next action. For long pipeline responses, anchor the stage, gate, and pending decision at the beginning and end.

2. Read only the files and sections needed for the current decision, including every required stage hook, agent, skill, and approval evidence. Use targeted searches and bounded reads; expand when necessary to verify behavior or resolve ambiguity.

3. Before a handoff or context compaction, carry forward a concise state: objective, current stage and gate, exact approved scope and decisions, relevant paths and acceptance criteria, verification evidence and limitations, unresolved findings, and the next action or pending approval. Reference source artifacts so details can be rechecked.

4. Distinguish approved, pending, failed, and not-run items; never infer approval from a summary. Re-read the authoritative artifact or user decision if the handoff is incomplete or conflicts with the source.

5. Summarize earlier material and quote only the needed sections, but always show the complete required new artifact, existing-file diff, and other approval payloads at the gate. Context optimization never replaces required checks or human approval.



Prompt Caching Policy:

1. Keep stable instructions separate from changing task evidence where the host permits. Prompt caching is runtime-dependent; do not claim cache hits or token savings without measurements.

2. When constructing handoffs, put the objective and governing constraints first, then relevant evidence and the next action. Do not assume control over the host's internal prompt layout or compaction.

3. Avoid re-pasting whole artifact files turn over turn — reference the file path and only quote the delta.



Memory Types:

| Memory type | Scope | Where it lives | What goes in it |
|---|---|---|---|
| User memory | Cross-workspace, persistent | Host-provided memory, when available | Durable, non-sensitive workflow preferences |
| Session memory | Current conversation only | Host session state | In-progress stage notes, pending approvals |
| Repository memory | This repo, persistent | Host repository memory or these instructions | Verified commands and repo conventions |
| Task/project memory | This pipeline run | Root artifact files (`requirements.md` ... `verification.md`) | The SDLC state itself — source of truth for stage handoffs |

Rule: use available repository memory and these project instructions before asking about known conventions. Do not assume filesystem memory paths exist or store sensitive/task-specific data in persistent memory.



Token Optimization Strategy:

1. Staged questions (already enforced): only ask for inputs needed by the current stage.

2. Concise artifacts: artifact files use numbered lists/tables, not prose duplication of prior artifacts.

3. Context pruning: when loading a prior artifact for a later stage, extract only the section required instead of the full file.

4. Diff-first: when showing changes for approval, show diffs rather than full file contents once a file already exists.

5. Budget guardrail: if a single stage's context (artifacts + hook + agent + skill) would require quoting more than ~2 full artifact files, summarize the older one instead of quoting it in full.



Prompt Engineering Standards:

1. Decomposition: one stage = one file = one responsibility (agent defines role, hook defines gate, skill defines procedure).

2. Explicit constraints over implicit ones: guardrails and gates are written as checkable statements ("X exists", "Y equals Z"), not vague guidance.

3. Staged/progressive disclosure: ask only for what's needed now (Staged Question Policy).

4. Acceptance criteria as contracts: every stage's POST-CHECK is the acceptance criteria for that stage's output — treat it as a pass/fail contract, not a suggestion.

5. Few-shot via artifacts: later stages read earlier artifacts as grounding context instead of re-deriving requirements from scratch.

6. Fail closed: on ambiguity, stop and ask rather than assuming — never silently invent REPO_URL, branch names, or scope.

