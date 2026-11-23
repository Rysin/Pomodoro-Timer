# Implementation Plan - SCRUM-20: Add active/pressed states to timer buttons for clearer feedback

## 1. Overview
- **Jira:** SCRUM-20 — https://sourabhdesai.atlassian.net/browse/SCRUM-20
- **Goal:** Add a clear pressed/active visual state to the Pomodoro control buttons (Start/Resume, Pause, Reset) and the “Enable notifications” button, so users get immediate feedback that their press/click/tap was registered.
- **Business / UX value:** Improves perceived responsiveness and interaction clarity (especially for touch), while preserving existing functionality and accessible focus treatment.
- **Estimated effort:** **0.5–1 hour** (CSS-only).

## 2. Current State Analysis
### Tech stack detected
- **Vite + TypeScript** (evidenced by `src/main.ts` importing `./style.css`)
- **Vanilla HTML/CSS** (single `index.html`)
- Styling is done via **global CSS** in `src/style.css` (imported from TS entry).

### Files inspected (paths)
- `src/style.css`
- `index.html`
- `src/main.ts`

### How styling is applied today
- Global element styles: `button { font: inherit; cursor: pointer; }`, `button:focus-visible { outline: 3px solid #d78058; outline-offset: 3px; }`, `button:disabled { cursor: not-allowed; opacity: .48; }`
- Component-level button styles:
  - `.controls button, .notifications button { ... }`
  - `.controls button.primary { ... }`
  - Hover state only: `.controls button:not(:disabled):hover, .notifications button:not(:disabled):hover { filter: brightness(.94); }`
- **No explicit `:active` pressed styling** exists; users rely on browser default (minimal/varies by platform).

### Current visual behavior
- Buttons have consistent neutral styling, a navy primary variant for the main action, hover darkening, and an accessible `:focus-visible` outline.
- When pressing a button (mouse down / touch), there is **no intentional pressed feedback** (no transform, no additional darkening), beyond possible default UA effects.

## 3. Detailed Changes (one sub-section PER FILE)

### 3.1 `src/style.css`  -  Change type: Modify
- **Purpose of change**
  - Add a consistent **pressed (`:active`) state** to enabled buttons in `.controls` and `.notifications`.
  - Add a subtle **transition** so hover/active changes feel smoother.
  - Ensure **disabled buttons** do not show pressed styling.
  - Preserve **keyboard focus** (`:focus-visible`) visibility.

- **Exact elements/selectors/components affected**
  - Existing selectors (already in file):
    - `.controls button, .notifications button`
    - `.controls button.primary`
    - `.controls button:not(:disabled):hover, .notifications button:not(:disabled):hover`
  - New selectors to add:
    - `.controls button:not(:disabled):active, .notifications button:not(:disabled):active`
    - `.controls button.primary:not(:disabled):active`

- **Exact property changes**
  1) Add transition to `.controls button, .notifications button`:
     - `transition: filter 120ms ease, transform 120ms ease;` (**new**)

  2) Add pressed styling for enabled buttons:
     - `transform: translateY(1px);` (**new**)
     - `filter: brightness(.90);` (**new**) for non-primary buttons

  3) Slightly adjust pressed filter for primary button (to ensure perceptible change on dark background):
     - `filter: brightness(.92);` (**new**) for `.controls button.primary:not(:disabled):active`
     - Keep `transform: translateY(1px);`

- **Before** (real code)
```css
.controls { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin: 30px 0 32px; }
.controls button, .notifications button { border: 1px solid #d9e0d9; border-radius: 10px; padding: 12px 22px; background: #fffefa; color: #314b3e; font-weight: 650; }
.controls button.primary { background: var(--primary-button-color); border-color: var(--primary-button-color); color: white; min-width: 110px; }
.controls button:not(:disabled):hover, .notifications button:not(:disabled):hover { filter: brightness(.94); }
.session-count { border-top: 1px solid #efede6; margin: 0; padding-top: 24px; color: #69776f; font-size: .9rem; }
```

- **After** (complete proposed code block)
```css
.controls { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin: 30px 0 32px; }
.controls button, .notifications button {
  border: 1px solid #d9e0d9;
  border-radius: 10px;
  padding: 12px 22px;
  background: #fffefa;
  color: #314b3e;
  font-weight: 650;
  transition: filter 120ms ease, transform 120ms ease;
}
.controls button.primary { background: var(--primary-button-color); border-color: var(--primary-button-color); color: white; min-width: 110px; }

.controls button:not(:disabled):hover,
.notifications button:not(:disabled):hover {
  filter: brightness(.94);
}

.controls button:not(:disabled):active,
.notifications button:not(:disabled):active {
  transform: translateY(1px);
  filter: brightness(.90);
}

.controls button.primary:not(:disabled):active {
  transform: translateY(1px);
  filter: brightness(.92);
}

.session-count { border-top: 1px solid #efede6; margin: 0; padding-top: 24px; color: #69776f; font-size: .9rem; }
```

- **Notes (side-effects, inheritance, specificity)**
  - `:active` styles are constrained with `:not(:disabled)` so disabled buttons don’t “press”.
  - The `.controls button.primary:not(:disabled):active` rule comes **after** the generic active rule to override the filter for the primary button.
  - `button:focus-visible` outline remains controlled by the global selector:
    - Existing: `button:focus-visible { outline: 3px solid #d78058; outline-offset: 3px; }`
    - New `transform` does not remove/override outline; outline will move with the element visually but remains visible.
  - Using `filter` avoids changing background/border colors (minimizes risk of breaking theme or contrast).

## 4. Design Tokens / Visual Specification
| Token | Value | Used in | Notes |
|------|-------|---------|------|
| `--primary-button-color` | `#000080` | `.controls button.primary` | Existing CSS variable for primary button background/border. |
| `--btn-transition` (inline value) | `filter 120ms ease, transform 120ms ease` | `.controls button, .notifications button` | New transition for hover/active feedback. (Not currently extracted as a CSS var.) |
| `--btn-hover-brightness` (inline value) | `brightness(.94)` | `:hover` | Existing hover darkening. |
| `--btn-active-brightness` (inline value) | `brightness(.90)` | `:active` | New pressed darkening for neutral buttons. |
| `--btn-active-brightness-primary` (inline value) | `brightness(.92)` | `.primary:active` | New pressed darkening tuned for dark primary background. |
| `--btn-active-translate-y` (inline value) | `translateY(1px)` | `:active` | New pressed “down” effect. |
| `--focus-outline-color` (inline value) | `#d78058` | `button:focus-visible` | Existing focus ring color; must remain visible. |

## 5. Step-by-Step Implementation Tasks
- [ ] Create/checkout branch `feature/SCRUM-20` from `main`.
- [ ] Update `src/style.css`:
  - [ ] Add `transition: filter 120ms ease, transform 120ms ease;` to `.controls button, .notifications button`.
  - [ ] Add pressed state rules for `.controls button:not(:disabled):active` and `.notifications button:not(:disabled):active` (translate + brightness).
  - [ ] Add override rule for `.controls button.primary:not(:disabled):active` with tuned brightness.
- [ ] Run the app locally and verify mouse, touch (emulation), and keyboard focus behavior.
- [ ] Quick regression check: Start/Pause/Reset still work and disabled states unaffected.

## 6. Acceptance Criteria Traceability
| AC # | Acceptance Criterion | Implemented by (file/section) | How to verify |
|------|----------------------|-------------------------------|--------------|
| 1 | Press-and-hold any enabled Start/Pause/Reset shows pressed state (darker + down 1px) until release | `src/style.css` §3.1 (`:active` rules) | Mouse down on each enabled control button; observe translate + brightness until mouseup. |
| 2 | Press-and-hold enabled “Enable notifications” shows same pressed state | `src/style.css` §3.1 (`.notifications button:not(:disabled):active`) | Mouse down on Enable notifications (when enabled); observe pressed styling until release. |
| 3 | Disabled buttons do not show pressed styling | `src/style.css` §3.1 (`:not(:disabled)` gating) | Ensure Start disabled while running; click/press it—no transform/extra darkening. |
| 4 | Keyboard focus outline remains clearly visible | Global `button:focus-visible` (existing) + `src/style.css` §3.1 (no override) | Tab to buttons; confirm outline visible. Press Space/Enter: outline should still be visible and not obscured. |
| 5 | Timer functionality unchanged | No TS/HTML changes planned; CSS-only update | Use Start/Pause/Reset and observe state changes + title updates work as before. |

## 7. Testing Plan
### Manual test cases
1) **Pressed state: Start**
   - Steps: Load page. Mouse down on **Start** and hold.
   - Expected: Button darkens and moves down by 1px while held; returns on release.

2) **Pressed state: Pause (enabled only while running)**
   - Steps: Click Start. Mouse down on **Pause** and hold.
   - Expected: Same pressed feedback while held.

3) **Pressed state: Reset**
   - Steps: With timer in any state, mouse down on **Reset** and hold.
   - Expected: Same pressed feedback while held.

4) **Pressed state: Enable notifications**
   - Steps: If notifications permission is `default`, mouse down on **Enable notifications** and hold.
   - Expected: Same pressed feedback while held.

5) **Disabled does not press**
   - Steps: Click Start (Start becomes disabled). Press and hold Start.
   - Expected: No pressed styling (no translate, no additional darkening).

6) **Keyboard focus visibility**
   - Steps: Use Tab to focus each button.
   - Expected: Orange outline (`3px solid #d78058`) is clearly visible.
   - Steps: Press Space/Enter.
   - Expected: Action triggers; focus outline remains visible (not removed by active styles).

### Cross-browser
- Test latest: **Chrome, Firefox, Edge, Safari**.

### Responsive
- Verify at widths: **360px**, **768px**, **1280px+**.
- Expected: No layout shifts; only button interaction feedback changes.

### Accessibility
- WCAG 2.1 AA considerations:
  - Contrast: No text color changes; only filter darkening. Ensure text remains readable.
  - Visible focus: `button:focus-visible` outline remains.
  - Keyboard navigation: Tab order unchanged; active state should not be the only indicator of focus.
  - No color-only meaning: Pressed state includes both darkening and **positional shift**.

### Regression
- Confirm Pomodoro timer operations remain unchanged:
  - Start/Resume toggling
  - Pause only when running
  - Reset functionality
  - Document title updating
  - Notification permission flow unchanged

### Automated tests
- No test framework usage is evident in inspected files for UI states; if Playwright tests exist later, no snapshots should be required for this CSS-only change. (ASSUMPTION: no snapshot tests currently fail.)

## 8. Risks & Mitigations
- **Risk:** `filter` can affect subpixel rendering and may slightly change perceived text anti-aliasing.
  - **Mitigation:** Keep effect subtle and limited to active/hover; avoid changing font styles.
- **Risk:** `transform` can create a new stacking context and may affect outline rendering in some browsers.
  - **Mitigation:** Use minimal `translateY(1px)`; verify `:focus-visible` outline in Safari/Firefox.
- **Risk:** Primary button pressed state may be too subtle on dark navy.
  - **Mitigation:** Use separate brightness for `.primary:active` and verify visually.

## 9. Rollback Plan
- Revert the commit that adds `:active` and `transition` styles in `src/style.css`.
- Alternatively, remove only the newly added blocks:
  - `transition` line
  - `:active` rules

## 10. Out of Scope
- Any changes to timer logic in `src/main.ts`, `src/timer.ts`.
- Any HTML structure/layout changes.
- Any changes to notification behavior or copy.
- Adding additional button variants beyond pressed/transition states.

## 11. Definition of Done
- `src/style.css` includes pressed/active styling and transitions as specified.
- Pressed state appears for enabled buttons only.
- Disabled buttons show no pressed styling.
- Keyboard focus outline remains clearly visible.
- Timer and notification logic behaves exactly as before.
- `implement.md` exists on `feature/SCRUM-20` documenting the plan.

## 12. Delivery Details
- **Branch:** `feature/SCRUM-20`
- **Base branch:** `main`
- **Commit message:** `SCRUM-20: Add implementation plan`
- **PR title (later):** `SCRUM-20: Add pressed/active button states`
- **PR description outline (later):**
  - Summary of CSS-only update adding `:active` + transitions
  - Screenshots/GIF optional (pressed state)
  - Verification steps (mouse/touch/keyboard)
  - Note: no functional changes
