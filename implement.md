# Implementation Plan - SCRUM-17: Add active/pressed button styling for timer controls

## 1. Overview
- **Jira:** SCRUM-17 — https://sourabhdesai.atlassian.net/browse/SCRUM-17
- **Goal:** Add clear, consistent **pressed (:active)** visual feedback and a short **transition (≤150ms)** to the timer control buttons (Start/Pause/Reset) and the “Enable notifications” button.
- **Business/UX value:** Improves perceived responsiveness and interaction affordance (especially on touch), reducing “did it click?” uncertainty while keeping keyboard focus indications intact.
- **Estimated effort:** **0.5–1 hour** (single CSS-only change + manual verification).

## 2. Current State Analysis
### Tech stack detected
- **Vite + TypeScript** front-end (based on `src/main.ts` importing `./style.css`).
- Styling is plain **global CSS** in `src/style.css`.

### Files inspected (paths)
- `src/style.css`
- `index.html`
- `src/main.ts`

### How styling is applied today
- `src/main.ts` imports `./style.css`, so styles are bundled and applied globally.
- Button styles are primarily defined via:
  - `button { font: inherit; cursor: pointer; }`
  - `button:focus-visible { outline: 3px solid #d78058; outline-offset: 3px; }`
  - `button:disabled { cursor: not-allowed; opacity: .48; }`
  - `.controls button, .notifications button { ... }`
  - Hover feedback exists via `filter: brightness(.94)`.
- **No `:active` styling exists currently**, and there is **no `transition`** for hover/press changes.

### Current visual behaviour
- Hovering a non-disabled button slightly darkens it (via `filter: brightness(.94)`).
- Keyboard focus is clearly indicated by a **3px orange outline**.
- Clicking/pressing buttons does not have a distinct pressed/active visual state.

## 3. Detailed Changes (one sub-section PER FILE)

### 3.1 `src/style.css`  -  Change type: Modify
#### Purpose of change
- Add:
  - A short transition (≤150ms) for interactive button feedback.
  - A consistent pressed-state style on `:active` for both control and notification buttons.
- Ensure the existing `:focus-visible` outline remains visible and unchanged.

#### Exact elements/selectors/components affected
- Add transition to:
  - `.controls button, .notifications button`
- Add pressed state to:
  - `.controls button:not(:disabled):active, .notifications button:not(:disabled):active`

#### Exact property changes
- **Add transition**
  - `transition: transform 120ms ease, filter 120ms ease, background-color 120ms ease, border-color 120ms ease;`
- **Add pressed state**
  - `transform: translateY(1px) scale(0.99);`
  - `filter: brightness(.90);`

#### Before (real code)
```css
.controls button, .notifications button { border: 1px solid #d9e0d9; border-radius: 10px; padding: 12px 22px; background: #fffefa; color: #314b3e; font-weight: 650; }
.controls button.primary { background: var(--primary-button-color); border-color: var(--primary-button-color); color: white; min-width: 110px; }
.controls button:not(:disabled):hover, .notifications button:not(:disabled):hover { filter: brightness(.94); }
```

#### After (complete proposed code block)
```css
.controls button, .notifications button {
  border: 1px solid #d9e0d9;
  border-radius: 10px;
  padding: 12px 22px;
  background: #fffefa;
  color: #314b3e;
  font-weight: 650;
  transition:
    transform 120ms ease,
    filter 120ms ease,
    background-color 120ms ease,
    border-color 120ms ease;
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
  transform: translateY(1px) scale(0.99);
  filter: brightness(.90);
}
```

#### Notes (side-effects, inheritance, specificity)
- `transform` creates a stacking context for the pressed button only; this is typically harmless for simple layouts.
- `filter` is already used for hover; keeping it for active ensures consistent behaviour across both button groups.
- `:focus-visible` remains defined at the `button:focus-visible` level and is **not removed**. Since we’re not changing `outline` or using `box-shadow` overlays, the focus ring should remain clearly visible.
- `:active` will apply while the button is pressed (mouse down/touch). On some mobile browsers, `:active` requires the element to be “clickable” (it is) and may behave differently depending on default settings; this is acceptable and expected.

## 4. Design Tokens / Visual Specification
| Token | Value | Used in | Notes |
|---|---:|---|---|
| `--primary-button-color` | `#000080` | `.controls button.primary` | Existing token for Start/Resume primary button |
| Focus outline color | `#d78058` | `button:focus-visible` | Must remain unchanged for keyboard users |
| Button bg (default) | `#fffefa` | `.controls button, .notifications button` | Existing background |
| Button border (default) | `#d9e0d9` | `.controls button, .notifications button` | Existing border |
| Hover brightness | `brightness(.94)` | `:hover` | Existing hover feedback |
| Active brightness | `brightness(.90)` | `:active` | New; slightly stronger than hover |
| Active transform | `translateY(1px) scale(0.99)` | `:active` | New pressed effect |
| Transition duration | `120ms` | Buttons | New; meets ≤150ms AC |
| Transition easing | `ease` | Buttons | New; consistent with simple interaction feedback |

## 5. Step-by-Step Implementation Tasks
- [ ] Create/checkout `feature/SCRUM-17` from `main`.
- [ ] Update `src/style.css`: add button transitions for `.controls button, .notifications button`.
- [ ] Update `src/style.css`: add `:active` pressed-state styles for both button groups.
- [ ] Manually verify in browser: hover, active press-and-hold, keyboard focus-visible outline.
- [ ] Confirm no functional regression: Start/Pause/Reset and notifications still operate as before.

## 6. Acceptance Criteria Traceability
| AC # | Acceptance Criterion | Implemented by (file/section) | How to verify |
|---:|---|---|---|
| 1 | Press and hold Start/Pause/Reset shows pressed effect | `src/style.css` §3.1 (`.controls button:not(:disabled):active`) | Mouse down / touch and hold each control button; observe translate/scale + darker appearance |
| 2 | Press and hold “Enable notifications” shows same pressed effect | `src/style.css` §3.1 (`.notifications button:not(:disabled):active`) | Mouse down / touch and hold Enable notifications; observe same effect |
| 3 | Hover/active changes animate smoothly (≤150ms) | `src/style.css` §3.1 (`transition: ... 120ms ...`) | Hover in/out and press/release; confirm smooth animation |
| 4 | Keyboard focus outline remains visible and not removed/obscured | `src/style.css` (existing `button:focus-visible`) + §3.1 notes | Tab to buttons; confirm orange outline remains clear while not pressed |
| 5 | No functional regression in timer behaviour and enable/disable logic | No JS changes; verify manually | Start/Pause/Reset and observe expected state/disabled changes |

## 7. Testing Plan
### Manual test cases
1. **Pressed state on controls**
   - Steps: Load app → mouse down and hold **Start** → release.
   - Expected: While held, button darkens (`brightness(.90)`) and shifts down slightly (`translateY(1px) scale(0.99)`), then returns smoothly on release.
2. **Pressed state on Pause/Reset**
   - Steps: Start timer → mouse down and hold **Pause** then **Reset**.
   - Expected: Same pressed effect; Reset remains available and visually responds.
3. **Pressed state on notifications button**
   - Steps: Mouse down and hold **Enable notifications**.
   - Expected: Same pressed effect.
4. **Transition timing**
   - Steps: Hover in/out repeatedly; click repeatedly.
   - Expected: No jarring instant changes; transition feels ~120ms.
5. **Keyboard focus-visible**
   - Steps: Use Tab/Shift+Tab to focus Start/Pause/Reset/Enable notifications.
   - Expected: Orange outline remains visible and not removed.

### Cross-browser
- Test latest: **Chrome, Firefox, Edge, Safari**.

### Responsive
- Verify at widths: **360px**, **768px**, **1280px+**.

### Accessibility
- Confirm focus indicator remains visible (no removal).
- Ensure interaction state is not color-only: pressed state includes **movement (transform)** in addition to brightness.
- Contrast: no changes to text colors; ensure existing contrast remains.

### Regression
- Timer operations still work unchanged (Start → running disables Start, enables Pause; Reset works; title updates).

### Automated tests
- None detected in repo for CSS interactions; no snapshot updates expected.

## 8. Risks & Mitigations
- **Risk:** `transform` could cause subtle layout/anti-alias changes.
  - **Mitigation:** Use small transform values; limited to active state only.
- **Risk:** Some mobile browsers handle `:active` inconsistently.
  - **Mitigation:** This is a progressive enhancement; hover remains and click still functions.

## 9. Rollback Plan
- Revert commit that modifies `src/style.css` (remove transition and `:active` block), restoring previous hover-only behaviour.

## 10. Out of Scope
- Any changes to timer logic (`src/timer.ts`), notification logic (`src/notifications.ts`), markup structure, copy text, or layout.
- Adding new UI components, icons, or additional states beyond hover/focus/active.

## 11. Definition of Done
- All acceptance criteria met.
- Pressed and hover states animate smoothly within ≤150ms.
- Focus-visible outline remains clearly visible for keyboard navigation.
- No JS/functional regressions observed.
- `implement.md` exists on `feature/SCRUM-17` and matches this plan.

## 12. Delivery Details
- **Branch:** `feature/SCRUM-17`
- **Base branch:** `main`
- **Commit message:** `SCRUM-17: Add implementation plan`
- **PR title (later):** `SCRUM-17: Add pressed/active button styling for timer controls`
- **PR description outline (later):**
  - What: Add transitions + :active pressed styling for `.controls button` and `.notifications button`.
  - Why: Better interaction feedback.
  - How to test: Steps for press-and-hold, keyboard focus, no timer regression.
