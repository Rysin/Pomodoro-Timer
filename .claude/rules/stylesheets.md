---
description: Responsive plain DOM Pomodoro styles and accessible interaction states.
paths:
  - "src/**/*.css"
---

# Stylesheet conventions

1. Use CSS custom properties (variables/tokens) for colors, spacing, and typography instead of hard-coded values.
2. Define `:hover`, `:active`, and `:focus-visible` states for all interactive elements.
3. Maintain sufficient contrast (WCAG AA) between text and background colors.
4. Do not remove or override the default focus outline without providing an equally visible replacement.
5. Reuse the selectors and layout in `src/style.css` and semantic structure in `index.html`; do not assume framework stylesheets exist.
6. Prefer existing variables where available; add variables for new repeated values without an unrelated full-file restyle.
7. Preserve disabled controls, readable timer digits, and the small-screen notification layout. Check narrow viewports without horizontal overflow.
