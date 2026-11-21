---
description: Strict TypeScript conventions for the plain DOM Pomodoro application.
paths:
  - "src/**/*.ts"
---

# TypeScript and DOM conventions

1. Keep timer/state logic in `src/timer.ts`, DOM wiring in `src/main.ts`, and browser notification APIs in `src/notifications.ts`.
2. Follow strict checking, type-only imports, extensionless local imports, single quotes, and no semicolons. Respect `erasableSyntaxOnly`; use explicit fields rather than constructor parameter properties.
3. Use typed query helpers with a missing-element error. Do not hide errors behind `any`, non-null assertions, or unchecked casts.
4. Render dynamic strings with `textContent`, not untrusted `innerHTML`.
5. Keep state transitions in `PomodoroTimer`; publish snapshots so the UI cannot mutate its internal state.
6. Use a deadline (`deadlineMs - now()`) to catch up after delayed ticks, not `remainingMs -= 1000`. Type interval handles as `ReturnType<typeof setInterval> | null` and clear them on pause, reset, and completion.
7. Preserve duplicate-start protection, work-only counting, manual phase starts, and completion when pausing at zero.
8. Guard notification support and permission; request permission only from user interaction. Surface API errors through the existing visible status and console reporting.
9. Avoid frameworks, backend APIs, persistence, and new dependencies unless approved scope requires them.
