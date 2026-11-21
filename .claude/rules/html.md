---
description: Semantic HTML and accessible controls for the Pomodoro page.
paths:
  - "index.html"
---

# HTML conventions

1. Keep the existing semantic main, labeled regions, button types, and IDs used by typed DOM queries in `src/main.ts` consistent.
2. Use native buttons with disabled states and visible keyboard focus; do not replace controls with clickable generic elements.
3. Preserve `role="timer"` and polite status/notification announcements. Do not announce every countdown tick.
4. Keep the responsive viewport and meaningful page title. Do not add inline event handlers, scripts from third parties, or dynamic untrusted HTML.
