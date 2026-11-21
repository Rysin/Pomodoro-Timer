---
description: Focused Vitest tests for timer transitions and browser notifications.
applyTo: "tests/**/*.ts"
---

# Test conventions

1. Extend existing timer and notification test files for related behavior; avoid unnecessary new test infrastructure.
2. Use `vi.useFakeTimers()`, `vi.setSystemTime()`, and `vi.advanceTimersByTime()` instead of real waits. Restore real timers after each test.
3. Use clock jumps plus `refresh()` or `pause()` to exercise delayed ticks and zero-boundary completion.
4. Stub browser APIs with `vi.stubGlobal()` and call `vi.unstubAllGlobals()` after tests. Cover only affected permission/capability/error cases.
5. Verify observable transitions and side effects, not private fields or copied implementation logic. Include focused cases that fail without the fix.
6. Vitest runs these tests in its existing environment; a real DOM is not installed. Do not add a DOM or browser dependency without explicit approval.
