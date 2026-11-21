# Pomodoro Timer Claude Code Harness

## Project context

1. This is an existing Vite + strict TypeScript + plain DOM application, not a framework scaffold.
2. `src/timer.ts` owns `PomodoroTimer`, typed state snapshots/subscriptions, deadline-based countdowns, and interval lifecycle.
3. `src/main.ts` owns typed DOM queries, rendering, controls, visibility refresh, and user-facing notification errors.
4. `src/notifications.ts` owns browser capability checks, permission requests, and phase-completion notifications.
5. `index.html` is the semantic page structure; `src/style.css` is the responsive presentation.
6. `tests/timer.test.ts` and `tests/notifications.test.ts` use Vitest fake timers, controlled system time, and browser-global mocks.
7. `package.json`, `package-lock.json`, and `tsconfig.json` define tooling and strict type-checking. Change them only for an approved, scoped reason.
8. Preserve 25-minute work / 5-minute break durations, manual next-phase starts, and incrementing the counter only on work completion unless approved requirements change them.
9. Pause preserves remaining time; reset restores the current phase without clearing the count. Reload resets the count. Notifications are opt-in and only work while the page can run.
10. Compute remaining time from a deadline, not interval tick counts. Preserve `ReturnType<typeof setInterval> | null`, duplicate-start protection, cleanup, and pause-at-zero completion.
11. Follow extensionless imports, single-quoted TypeScript strings, no semicolons, type-only imports, and explicit DOM guards. Avoid `any`, unchecked assertions, and constructor parameter properties unsupported by `erasableSyntaxOnly`.
12. There is no framework, backend, database, persistence layer, UI library, lint script, or browser automation dependency. Do not introduce one unless approved requirements need it.

## Commands and evidence

| Purpose | Command |
| --- | --- |
| Local development | `npm run dev` |
| Targeted timer tests | `npm test -- tests/timer.test.ts` |
| Targeted notification tests | `npm test -- tests/notifications.test.ts` |
| All existing tests | `npm test` |
| Type-check application and build | `npm run build` |
| Preview production build | `npm run preview` |

1. Read `package.json` before running scripts. There is no lint script or browser automation dependency currently.
2. `npm run build` type-checks `src`, not `tests`; Vitest execution is not a test-file type-check. Do not claim broader coverage.
3. Run `npm ci` only when dependencies need restoring and a lockfile exists. Dependency changes require explicit approval; do not add tooling just to satisfy a nonexistent script.
4. Use Windows PowerShell-compatible commands. Do not use shell `||` / `&&` branch fallbacks; issue branch switches separately and verify the result.
5. Record actual commands, outputs, and browser checks. Missing tools or denied permissions are limitations, not fabricated passes.

## Harness entry points and stage order

The full Jira workflow is coordinated by the `sdlc-orchestrator` agent. The `/requirements` skill starts Requirements only. Agents define stage roles; skills define reusable procedures; path-scoped rules apply to relevant files.

| Gate | Stage | Owner | Checklist | Output |
| --- | --- | --- | --- | --- |
| 1 | Requirements | `sdlc-requirements` | `.claude/checklists/requirements.hook.json` | `requirements.md` |
| 2 | Architecture | `sdlc-architecture` | `.claude/checklists/architecture.hook.json` | `architecture.md` |
| 3 | Design Review | `sdlc-design-review` | `.claude/checklists/design-review.hook.json` | `design-review.md`; `architecture.md` if needed |
| 4 | Implementation Planning | `sdlc-impl-plan` | `.claude/checklists/impl-plan.hook.json` | `impl-plan.md` |
| 5 | Security Remediation | Orchestrator using `.claude/skills/security-remediation/SKILL.md` | `.claude/checklists/security-remediation.hook.json` | `security-remediation.md`; approved scoped fixes |
| 6 | Implementation | `sdlc-implementation` | `.claude/checklists/implementation.hook.json` | Scoped code, tests, and docs |
| 7 | Review | `sdlc-code-review` | `.claude/checklists/code-review.hook.json` | `code-review.md` |
| 8 | Verify | `sdlc-verify` | `.claude/checklists/verify.hook.json` | `verification.md`; approved scoped Playwright tests |
| 9 | PR | `sdlc-pr` | `.claude/checklists/pr.hook.json` | Approved PR targeting `main` |

Stages must run in this order. A checklist PASS is not user approval. These JSON files are manually read gate checklists, not executable Claude Code hooks; this repository does not configure runtime hook enforcement, CI, or Jira tooling. If Claude integrations are unavailable, record the blocker rather than claiming success.

A direct, explicitly scoped maintenance request need not launch the Jira pipeline. Never infer approval for commits, pushes, dependencies, or PRs from permission to edit files.

## Staged questions

1. At workflow start, ask only for `JIRA_STORY_URL`.
2. Do not ask for `REPO_URL` or `FEATURE_BRANCH_NAME` until immediately before Stage 5.
3. At that point, ask only for `REPO_URL` and `FEATURE_BRANCH_NAME`.
4. If Jira content is inaccessible, immediately ask the user to paste the story description and acceptance criteria.
5. Fail closed on ambiguity. Never invent story criteria, a repository URL, or a feature branch.

## Human approval policy

1. Before advancing past any stage, show the full contents of a newly created artifact or the diff of an updated file, relevant scoped code changes, and dependency changes. Before publication, show exact commits and the complete PR title/body/base/head.
2. Ask for explicit approval and wait. Never invoke the next stage, commit, push, or create/update a PR without that stage's explicit approval.
3. If the user requests changes, redo that same stage and repeat its approval gate.
4. Silence, unrelated replies, and automated gate PASS results are not approval.
5. Commits, pushes, and PR actions each require their own applicable approval. Never commit directly to `main`.

## Branch, scope, dependency, and secret guardrails

These are mandatory for the Jira pipeline. Before every application/configuration edit in the pipeline and before every commit, run `git branch --show-current`; it must equal the user-provided `FEATURE_BRANCH_NAME` and must not be `main`. Stages 1–4 may draft only their designated, uncommitted planning artifacts. Stage 5 safely creates or switches to the exact feature branch before scoped scans or fixes; preserve unrelated work and never reset, force-switch, or overwrite conflicting changes.

Publish only `FEATURE_BRANCH_NAME` and create a PR targeting `main`; never push directly to `main`. Only stage-owned artifacts may change. Application/configuration edits must be listed in `architecture.md` and `impl-plan.md`; document proposed scope expansions and obtain explicit approval before editing. Any new dependency requires explicit user approval in that stage.

Before every commit, and during Security Remediation, Implementation, and PR, inspect staged/unstaged diffs and scoped untracked files for `api[_-]?key|secret|password|token|BEGIN (RSA|PRIVATE) KEY` (case-insensitive). Classify every match privately: legitimate names and pattern documentation are not secrets; suspected values block the gate. Never copy suspected values into artifacts or logs.

Use PowerShell and the exact approved impacted paths. Example checks (replace placeholders with the actual user-provided branch and approved paths):

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
$impacted = @('src\timer.ts') # Replace with the exact approved paths.
$untracked = git ls-files --others --exclude-standard -- $impacted
if ($LASTEXITCODE -ne 0) { throw 'Untracked file listing failed' }
foreach ($file in $untracked) {
  Select-String -LiteralPath $file -Pattern $pattern -ErrorAction Stop |
    Select-Object Path, LineNumber
}
```

Confirm every command succeeded; an empty result after a failed command is not a pass. Review both staged and unstaged diffs. A failed guardrail blocks the stage like a failed checklist.

## Stage artifacts

Create these root-level files only when their owning stage runs:

1. `requirements.md`
2. `architecture.md`
3. `design-review.md`
4. `impl-plan.md`
5. `security-remediation.md`
6. `code-review.md` (Review stage)
7. `verification.md`

Checklist POST checks are the acceptance contract for each gate. The owning agent must read its role, relevant checklist, and required prior artifacts before starting and before advancing. Record PASS/FAIL, reasons, evidence, and the next action. Use actual outputs; distinguish pass, fail, not applicable, and not run.

## Workflow, conflicts, and context

1. Resolve instruction conflicts in this order: explicit current user request; relevant stage checklist; stage agent; loaded skill; this file; matching path-scoped rule. A checklist defines the gate bar.
2. Before a substantial stage, identify its objective, constraints, gate, and next action. Read only the required artifacts and expand investigation when needed.
3. Carry handoffs with the approved scope and decisions, stage/gate state, evidence and limitations, unresolved findings, and next action. Re-read authoritative artifacts if a handoff conflicts.
4. Artifacts are task-specific project memory and the source of truth for stage handoffs. Do not assume filesystem memory paths or write sensitive information.
5. Keep stable instructions separate from changing task evidence. Prompt caching is runtime-dependent; do not claim cache hits or token savings without measurements.
6. Keep artifacts concise, use numbered lists/tables, and avoid re-pasting prior artifacts. At approval gates, always show the complete required new artifact or existing-file diff.
7. One stage = one artifact responsibility. Acceptance criteria are checkable contracts; ask only for information needed at the current stage.

