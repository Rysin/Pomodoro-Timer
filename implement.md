# Implementation Plan - SCRUM-15: Add pressed/active states and subtle transitions to buttons

## 1. Overview
- **Jira:** SCRUM-15 https://sourabhdesai.atlassian.net/browse/SCRUM-15
- **Goal:** Add smooth hover transitions and a clear pressed (`:active`) visual state for the existing buttons (Start/Pause/Reset and Enable notifications) without changing any timer/notification functionality.
- **Business / UX value:** Improves perceived responsiveness and confidence that button presses are registered, while keeping keyboard focus visibility and disabled-state clarity.
- **Estimated effort:** ~0.5–1.0 hour (CSS-only change, low risk).

## 2. Current State Analysis
### Tech stack detected
- Vite + TypeScript front-end (based on `src/main.ts` importing `./style.css`).
- Styling is plain CSS in `src/style.css` (no CSS framework detected).

### Files inspected
- `src/style.css`
- `index.html`
- `src/main.ts`

### How styling is applied today
- Global button defaults:
  - `button { font: inherit; cursor: pointer; }`
  - `button:focus-visible { outline: 3px solid #d78058; outline-offset: 3px; }`
  - `button:disabled { cursor: not-allowed; opacity: .48; }`
- Button components:
  - `.controls button, .notifications button { ... }` sets border, radius, padding, background, color.
  - `.controls button.primary { ... }` sets primary background/border + white text.
  - Hover state exists only as an instantaneous filter:
    - `.controls button:not(:disabled):hover, .notifications button:not(:disabled):hover { filter: brightness(.94); }`
- No explicit `:active` pressed state.
- No transitions defined (hover change is instantaneous).

### Current visual behaviour
- Hover: slight darkening via `filter: brightness(.94)`.
- Disabled: lower opacity and not-allowed cursor.
- Focus (keyboard): a thick orange outline (`#d78058`) with offset.

## 3. Detailed Changes (one sub-section PER FILE)

### 3.1 `src/style.css`  -  Change type: Modify
#### Purpose of change
- Add smooth transitions for enabled buttons.
- Add a clear pressed state (`:active`) for enabled buttons (including the `.primary` button) using a small translate and a stronger brightness change.
- Ensure disabled buttons never animate into active/pressed state.
- Keep the existing `:focus-visible` outline intact and visible.

#### Exact elements/selectors/components affected
- `.controls button, .notifications button` (base styles)
- `.controls button:not(:disabled):hover, .notifications button:not(:disabled):hover` (hover)
- **New:** `.controls button:not(:disabled):active, .notifications button:not(:disabled):active` (pressed)
- **New:** `.controls button.primary:not(:disabled):active` (pressed primary override to ensure noticeable press)
- **New:** `.controls button:disabled, .notifications button:disabled` (disable transitions to avoid interaction animation)

#### Exact property changes
- Add transitions to base buttons:
  - `transition: transform 0.06s ease-out, filter 0.15s ease, box-shadow 0.15s ease;`
- Add pressed effect:
  - `transform: translateY(1px);`
  - `filter: brightness(.88);` (more pronounced than hover’s `.94`)
- Add optional subtle “lift” baseline shadow (very subtle) so the press reads visually:
  - `box-shadow: 0 1px 0 rgba(48, 68, 54, 0.10);` on default
  - On active: `box-shadow: 0 0 0 rgba(48, 68, 54, 0.00);`
- Ensure disabled does not animate:
  - `transition: none;` for `.controls button:disabled, .notifications button:disabled`

#### **Before** (real code)
```css
button { font: inherit; cursor: pointer; }
button:focus-visible { outline: 3px solid #d78058; outline-offset: 3px; }
button:disabled { cursor: not-allowed; opacity: .48; }

.controls button, .notifications button { border: 1px solid #d9e0d9; border-radius: 10px; padding: 12px 22px; background: #fffefa; color: #314b3e; font-weight: 650; }
.controls button.primary { background: var(--primary-button-color); border-color: var(--primary-button-color); color: white; min-width: 110px; }
.controls button:not(:disabled):hover, .notifications button:not(:disabled):hover { filter: brightness(.94); }
```

#### **After** (complete proposed code block)
```css
button { font: inherit; cursor: pointer; }
button:focus-visible { outline: 3px solid #d78058; outline-offset: 3px; }
button:disabled { cursor: not-allowed; opacity: .48; }

.controls button,
.notifications button {
  border: 1px solid #d9e0d9;
  border-radius: 10px;
  padding: 12px 22px;
  background: #fffefa;
  color: #314b3e;
  font-weight: 650;

  /* Interaction polish (enabled states) */
  box-shadow: 0 1px 0 rgba(48, 68, 54, 0.10);
  transition:
    transform 0.06s ease-out,
    filter 0.15s ease,
    box-shadow 0.15s ease;
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
  filter: brightness(.88);
  box-shadow: 0 0 0 rgba(48, 68, 54, 0);
}

/* Ensure disabled buttons do not animate into an active/pressed state */
.controls button:disabled,
.notifications button:disabled {
  transition: none;
}
```

#### Notes (side-effects, inheritance, specificity)
- `:active` uses `:not(:disabled)` to explicitly exclude disabled buttons from pressed styling.
- We do not touch `button:focus-visible`, so keyboard focus outline remains unchanged.
- Adding a subtle `box-shadow` to base buttons slightly changes their resting appearance; kept very light to avoid layout/visual shifts.
- Using `filter` avoids hardcoding new background colors and respects existing palette (including the CSS variable `--primary-button-color`).

## 4. Design Tokens / Visual Specification
| Token | Value | Used in | Notes |
|---|---:|---|---|
| `--primary-button-color` | `#000080` | `.controls button.primary` | Existing token; unchanged |
| Focus outline | `3px solid #d78058` | `button:focus-visible` | Existing; must remain |
| Button radius | `10px` | `.controls button, .notifications button` | Existing |
| Hover brightness | `brightness(.94)` | `:hover` | Existing behaviour; now animated |
| Active brightness | `brightness(.88)` | `:active` | New; more pronounced than hover |
| Pressed translate | `translateY(1px)` | `:active` | New; “pressed” feel |
| Resting shadow | `0 1px 0 rgba(48, 68, 54, 0.10)` | base buttons | New; subtle depth |
| Transition (transform) | `0.06s ease-out` | base buttons | New; quick press response |
| Transition (filter/shadow) | `0.15s ease` | base buttons | New; smooth hover/active |

## 5. Step-by-Step Implementation Tasks
- [ ] Create feature branch `feature/SCRUM-15` from `main` (if not already created).
- [ ] Update `src/style.css`: add transitions + subtle resting shadow to `.controls button, .notifications button`.
- [ ] Update `src/style.css`: add enabled `:active` pressed styles (translate + stronger brightness + shadow adjustment).
- [ ] Update `src/style.css`: ensure disabled buttons have `transition: none` and cannot show pressed state.
- [ ] Manual QA in browser(s): hover/press/focus/disabled interactions for all four buttons.
- [ ] (Optional) If Playwright tests exist for visuals, run `npm test` / `npx playwright test` to ensure no regressions.

## 6. Acceptance Criteria Traceability
| AC # | Acceptance Criterion | Implemented by (file/section) | How to verify |
|---:|---|---|---|
| 1 | Hover animates smoothly for enabled control + notifications buttons | `src/style.css` §3.1 (transition + `:hover`) | Hover each enabled button; observe smooth change instead of instant |
| 2 | Pressing shows clear active/pressed state (darken + 1px shift) | `src/style.css` §3.1 (`:active`) | Mouse-down/touch and hold; button shifts and darkens |
| 3 | Disabled buttons do not show pressed styling | `src/style.css` §3.1 (`:not(:disabled)` + disabled transition none) | Disable state in app; attempt click/press; no active style |
| 4 | Keyboard focus outline remains visible | `src/style.css` global `button:focus-visible` unchanged | Tab to buttons; ensure outline is still thick/orange |
| 5 | Timer behaviour unchanged | No JS changes | Start/Pause/Reset still work as before |

## 7. Testing Plan
### Manual test cases
1. **Hover transition**
   - Steps: Load app → hover Start/Reset/Enable notifications (enabled).
   - Expected: Hover darkening occurs smoothly (animated).
2. **Pressed state**
   - Steps: Mouse down on Start (or Reset) and hold.
   - Expected: Button moves down ~1px and darkens more than hover while held.
3. **Disabled press suppression**
   - Steps: Click Start → while running, Start becomes disabled → mouse down on Start.
   - Expected: No pressed translate/darken; stays disabled opacity.
   - Steps: When not running, Pause is disabled → mouse down Pause.
   - Expected: No pressed styling.
4. **Keyboard focus**
   - Steps: Use Tab to focus each button.
   - Expected: `3px` outline in `#d78058` remains visible; pressed styles only on actual activation.
5. **Regression check**
   - Steps: Run a short session: Start → Pause → Resume → Reset.
   - Expected: Timer logic unchanged; no console errors.

### Cross-browser
- Chrome, Firefox, Edge, Safari (latest): verify `:focus-visible`, transitions, and `filter` behave consistently.

### Responsive
- 360px, 768px, 1280px+: ensure pressed translate does not cause layout shift (it shouldn’t) and buttons still wrap in `.controls` properly.

### Accessibility
- Ensure focus remains visible (`button:focus-visible` unchanged).
- Ensure pressed/hover is not color-only meaning (it’s feedback, not state).
- Contrast: no text color changes; existing palette preserved.

### Automated tests
- If configured, run:
  - `npm ci`
  - `npm run build`
  - `npm run test` (if present)
  - `npx playwright test` (Playwright config exists: `playwright.config.ts`)

## 8. Risks & Mitigations
- **Risk:** `filter` affects the whole element (including text) which may slightly reduce contrast on active.
  - **Mitigation:** Keep brightness adjustments modest (`.94` hover, `.88` active) and verify contrast remains acceptable visually.
- **Risk:** Added shadow changes visual design slightly.
  - **Mitigation:** Shadow is subtle and removable; can be adjusted or removed if design feedback requests.

## 9. Rollback Plan
- Revert the commit that modifies `src/style.css` to restore previous hover-only behaviour.

## 10. Out of Scope
- Any changes to timer logic (`src/timer.ts`), notifications logic (`src/notifications.ts`), or button enable/disable rules.
- Any layout or copy changes.
- Any new components or redesign.

## 11. Definition of Done
- All acceptance criteria met.
- Buttons show smooth hover transitions and clear pressed feedback when enabled.
- Disabled buttons do not show pressed styling.
- Keyboard focus outline remains clearly visible.
- No functional regressions in Start/Pause/Reset/notifications.

## 12. Delivery Details
- **Branch:** feature/SCRUM-15
- **Base branch:** main
- **Commit message:** "SCRUM-15: Add implementation plan"
- **PR title (later):** "SCRUM-15: Add pressed/active states and transitions to buttons"
- **PR description outline (later):**
  - What: Add CSS transitions + `:active` pressed states for control and notifications buttons.
  - Why: Improve interaction feedback.
  - How tested: manual hover/press/keyboard focus + cross-browser smoke.
