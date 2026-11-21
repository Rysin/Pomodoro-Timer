---
name: pr-hook
gate: 9
stage: PR
---

PRE-CHECK (before starting):
1. Gate 8 passed (verification.md complete)
2. FEATURE_BRANCH_NAME verified (never main); scoped staged/unstaged/untracked secret and dependency checks passed
3. Exact commits and PR title/body/base/head shown; explicit publication/creation approval received before push or PR creation

POST-CHECK (workflow complete):
1. PR targets main
2. PR description includes Summary, Changes, Evidence, Limitations, Reviewer Checklist
3. PR URL and branch/base verified with actual remote tool evidence; an unavailable tool or draft alone is not a created PR
4. No direct main push, force-push, or automatic merge occurred
