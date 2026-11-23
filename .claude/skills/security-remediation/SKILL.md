---
name: security-remediation
description: Performs the orchestrator-owned, scoped security remediation gate on the approved feature branch.
---

# Security Remediation procedure (Gate 5)

Read and write stage Markdown artifacts in the `ARTIFACT_DIR` supplied for this run; stop and request the run's exact path if it is missing or ambiguous.

1. Read `.claude/checklists/security-remediation.hook.json`, approved `architecture.md` and `impl-plan.md`, project guardrails in `.claude/CLAUDE.md`, and existing scoped code.
2. Collect only `REPO_URL` and `FEATURE_BRANCH_NAME` at this point in the pipeline. Verify the supplied repository. Safely create or switch to the exact requested branch and run `git branch --show-current` before any scoped scan or edit. It must equal the supplied branch and must not be `main`.
3. Preserve unrelated work. Do not reset, force-switch, overwrite conflicts, commit, or expand scope without explicit approval.
4. Inspect the approved impacted files for relevant security risks, especially safe dynamic DOM rendering, browser permission/error handling, dependency changes, and any scoped client-bundle concerns in the plan. Run required scoped checks and capture actual results. Do not turn this stage into an unrelated broad audit.
5. Inspect staged/unstaged diffs and approved scoped untracked files for `api[_-]?key|secret|password|token|BEGIN (RSA|PRIVATE) KEY` (case-insensitive). Classify matches privately; never expose suspected values. Legitimate names/documented patterns are not secrets; unresolved suspected values block the gate.
6. Compare package manifests/lockfiles and identify all dependency changes. Any new/changed dependency requires explicit approval; do not install unapproved dependencies.
7. Fix only vulnerabilities within approved scope. For out-of-scope risks, record a concise description without secret values and seek explicit scope approval before changes. If a necessary check is unavailable, report it as blocked/not run, not passed.
8. Create/update only `security-remediation.md` inside `ARTIFACT_DIR` and approved scoped fixes. Document checks, findings, fixes, residual/out-of-scope risks, dependencies, and evidence without sensitive values.
9. Show the artifact and all scoped fixes/diffs. Run POST checks, ask for explicit approval, and wait before Implementation. Do not claim gate completion or advance without approval.

