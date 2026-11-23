# Implementation Plan - SCRUM-18: Add active/pressed button styling for timer controls

## 1. Overview
- **Jira:** SCRUM-18 https://sourabhdesai.atlassian.net/browse/SCRUM-18
- **Goal:** Add a clear CSS-only `:active` (pressed) interaction state for the timer control buttons (Start/Pause/Reset) and the notifications CTA button, without changing any existing behavior/logic.
- **Business / UX value:** Users get immediate visual feedback that a click/tap is registered (especially on touch devices), improving perceived responsiveness and reducing double-clicks.
- **Estimated effort:** **0.5–1 hour** (single CSS file change + verification).

## 2. Current State Analysis
### Tech stack detected
- Static web app with **TypeScript** (`src/*.ts`) + **CSS** (`src/style.css`) and `index.html`.
- Styling appears to be plain CSS (no Tailwind/Bootstrap/etc.).

### Files inspected
- `src/style.css`

### How styling is applied today
- Global element rules (e.g., `button`, `button:focus-visible`, `button:disabled`).
- Component-ish class rules for `.controls` and `.notifications` sections.

### Current visual behavior
- Buttons:
  - Have base styling via `.controls button, .notifications button`.
  - Have a **hover** effect via `filter: brightness(.94)` (only when not disabled).
  - Have a **focus-visible** outline via `button:focus-visible { outline: 3px solid #d78058; outline-offset: 3px; }`.
  - **No pressed/active state** exists (no `:active` selector currently).

## 3. Detailed Changes (one sub-section PER FILE)

### 3.1 `src/style.css`  -  Change type: Modify
- **Purpose of change**
  - Add smooth transitions and a visible pressed state (`:active`) for the timer and notifications buttons.
  - Ensure disabled buttons do not show pressed styling.
  - Preserve the existing `:focus-visible` outline behavior.

- **Exact elements/selectors/components affected**
  - `.controls button, .notifications button` (add transitions)
  - `.controls button:not(:disabled):active, .notifications button:not(:disabled):active` (new pressed styling)

- **Exact property changes**
  - Add to base button styles:
    - `transition: transform 80ms ease, filter 120ms ease;`
  - Add new pressed state styles:
    - `transform: translateY(1px);`
    - `filter: brightness(.90);`

- **Before** (real code)
```css
.controls { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin: 30px 0 32px; }
.controls button, .notifications button { border: 1px solid #d9e0d9; border-radius: 10px; padding: 12px 22px; background: #fffefa; color: #314b3e; font-weight: 650; }
.controls button.primary { background: var(--primary-button-color); border-color: var(--primary-button-color); color: white; min-width: 110px; }
.controls button:not(:disabled):hover, .notifications button:not(:disabled):hover { filter: brightness(.94); }
```

- **After** (complete proposed code block)
```css
.controls { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin: 30px 0 32px; }

.controls button,
.notifications button {
  border: 1px solid #d9e0d9;
  border-radius: 10px;
  padding: 12px 22px;
  background: #fffefa;
  color: #314b3e;
  font-weight: 650;
  transition: transform 80ms ease, filter 120ms ease;
}

.controls button.primary {
  background: var(--primary-button-color);
  border-color: var(--primary-button-color);
  color: white;
  min-width: 110px;
}

.controls button:not(:disabled):hover,
.notifications button:not(:disabled):hover {
  filter: brightness(.94);
}

.controls button:not(:disabled):active,
.notifications button:not(:disabled):active {
  transform: translateY(1px);
  filter: brightness(.90);
}
```

- **Notes (side-effects, inheritance, specificity)**
  - `:active` will apply while the mouse button is held down or during a tap on mobile.
  - `transform` creates a new stacking context; no layout shift should occur since transform doesn’t affect document flow.
  - The `filter` property is already used for hover, so the pressed state will simply override hover while active.
  - `button:focus-visible` outline is defined separately and remains untouched; the pressed state does not set `outline: none`.

## 4. Design Tokens / Visual Specification
| Token | Value | Used in | Notes |
|---|---:|---|---|
| `--pressed-translate-y` | `1px` | `.controls button:active`, `.notifications button:active` | Simulated pressed depth |
| `--pressed-brightness` | `0.90` | `filter: brightness(.90)` | Slightly darker than hover (`.94`) |
| `--btn-transition-transform` | `transform 80ms ease` | Base button styles | Snappy press/release |
| `--btn-transition-filter` | `filter 120ms ease` | Base button styles | Smooth brightness change |

> Note: These are **plan-level tokens** for documentation. We will **not** introduce new CSS variables unless requested; we’ll implement the literal values directly in `src/style.css` to keep scope minimal.

## 5. Step-by-Step Implementation Tasks
- [ ] Create/checkout branch `feature/SCRUM-18` from `main`.
- [ ] Update `src/style.css`: add `transition` to `.controls button, .notifications button`.
- [ ] Update `src/style.css`: add `:not(:disabled):active` pressed styles (transform + brightness).
- [ ] Run/serve the app locally and verify pressed state with mouse and touch emulation.
- [ ] Verify `:focus-visible` outline still appears for keyboard users (Tab navigation).
- [ ] Commit changes (separate from this plan file; plan commit already exists).

## 6. Acceptance Criteria Traceability
| AC # | Acceptance Criterion | Implemented by (file/section) | How to verify |
|---:|---|---|---|
| 1 | Start button shows pressed state while click-and-hold | `src/style.css` §3.1 `:active` rule | Click and hold Start; see 1px down + darker until release |
| 2 | Pause + Reset buttons show same pressed state | `src/style.css` §3.1 `:active` rule | Click and hold Pause/Reset; same effect |
| 3 | Enable notifications button shows pressed state | `src/style.css` §3.1 affects `.notifications button` | Click and hold Enable notifications; same effect |
| 4 | Disabled buttons show no pressed styling | `src/style.css` §3.1 uses `:not(:disabled)` | Disable a button (existing app behavior) then click; no transform/brightness |
| 5 | Keyboard focus outline remains visible | Global `button:focus-visible` unchanged; no outline overrides | Tab to buttons; ensure 3px outline still visible |
| 6 | Timer functionality unchanged | CSS-only change | Start/pause/resume/reset; confirm timer and counts work as before |

## 7. Testing Plan
### Manual test cases
1. **Pressed state (mouse)**
   - Steps: Click and hold **Start**.
   - Expected: Button shifts down ~1px and darkens while held; returns on release.
2. **Pressed state (other controls)**
   - Steps: Click and hold **Pause**, then **Reset**.
   - Expected: Same pressed styling.
3. **Pressed state (notifications CTA)**
   - Steps: Click and hold **Enable notifications**.
   - Expected: Same pressed styling.
4. **Disabled behavior**
   - Steps: Put timer in a state where a control button is disabled (existing logic), then try to click it.
   - Expected: No pressed styling. Cursor remains `not-allowed`, opacity stays at `.48`.
5. **Keyboard focus**
   - Steps: Use Tab/Shift+Tab to focus buttons.
   - Expected: Existing orange outline appears and is not removed; still clearly visible.

### Cross-browser
- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

### Responsive
- 360px (mobile)
- 768px (tablet)
- 1280px+ (desktop)

### Accessibility
- WCAG 2.1 AA: no text contrast changes (only brightness during interaction).
- Visible focus: ensure `button:focus-visible` outline remains.
- Keyboard navigation: unchanged.
- No colour-only meaning: pressed state is supplemental feedback; no new meaning conveyed exclusively via color.

### Regression
- Ensure Pomodoro timer operations still work unchanged:
  - start → countdown updates
  - pause/resume behavior unchanged
  - reset returns to initial state
  - session count still increments as before

### Automated tests
- No automated UI tests detected in this story scope (Playwright config exists in repo, but no test updates required for CSS-only change unless snapshots exist).

## 8. Risks & Mitigations
- **Risk:** `transform` may slightly blur text on some devices during press.
  - **Mitigation:** Keep transform minimal (`translateY(1px)`) and short transition.
- **Risk:** Filter/transform transitions might feel sluggish.
  - **Mitigation:** Use short durations (80–120ms) and only two properties.

## 9. Rollback Plan
- Revert the commit that adds `transition` and `:active` rules in `src/style.css`.
- No data migrations or logic changes; rollback is safe and immediate.

## 10. Out of Scope
- Any changes to timer logic, button labels/copy, layout, notifications behavior.
- Adding new CSS variables / theming system.
- Adding sounds/haptics.

## 11. Definition of Done
- Pressed state works for Start/Pause/Reset and Enable notifications.
- Disabled buttons do not show pressed styling.
- Focus-visible outline remains clearly visible.
- No functional changes/regressions in timer behavior.
- `implement.md` exists on `feature/SCRUM-18` and matches this plan.

## 12. Delivery Details
- **Branch:** `feature/SCRUM-18`
- **Base branch:** `main`
- **Commit message (for plan):** `SCRUM-18: Add implementation plan`
- **Commit message (for implementation):** `SCRUM-18: Add pressed button styles`
- **PR title:** `SCRUM-18: Add pressed button styling`
- **PR description outline:**
  - What: Add `:active` pressed state + transitions for control/notification buttons
  - Why: Better interaction feedback
  - How tested: Manual checks (mouse/touch/keyboard), cross-browser smoke
  - Screenshots/GIF optional
