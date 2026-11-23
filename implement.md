# Implementation Plan - SCRUM-16: Add subtle button press animation and transitions

## 1. Overview
- **Jira:** SCRUM-16 https://sourabhdesai.atlassian.net/browse/SCRUM-16
- **Goal:** Add smooth hover transitions and a clear pressed (`:active`) feedback state for the Pomodoro control and notification buttons.
- **Business/UX value:** Improves perceived responsiveness and polish without changing any timer/notification functionality.
- **Estimated effort:** **S (0.5–1.0 hrs)** (CSS-only change + manual QA across states).

## 2. Current State Analysis
### Tech stack detected
- **Tooling:** Vite + TypeScript (from `src/main.ts` importing `./style.css`).
- **UI:** Vanilla HTML + DOM APIs (no React/Vue/etc.).
- **Styling:** Single global stylesheet `src/style.css`.

### Files inspected
- `src/style.css`
- `src/main.ts`
- `index.html`

### How styling is applied today
- Global element styles exist for `button`, `button:focus-visible`, and `button:disabled`.
- Buttons in the main UI are styled via:
  - `.controls button, .notifications button` base button UI
  - `.controls button.primary` for the primary action
  - `.controls button:not(:disabled):hover, .notifications button:not(:disabled):hover` for hover feedback

### Current visual behaviour
- Hover: enabled buttons dim slightly via `filter: brightness(.94)`.
- Focus: visible focus ring via `button:focus-visible { outline: 3px solid #d78058; outline-offset: 3px; }`.
- Disabled: reduced opacity and `cursor: not-allowed`.
- Missing today: **no transition** (hover is abrupt) and **no pressed state** (`:active`) feedback.

## 3. Detailed Changes (one sub-section PER FILE)

### 3.1 `src/style.css`  -  Change type: Modify
#### Purpose of change
- Add:
  1) smooth transitions to button visual properties
  2) a pressed (`:active`) state for enabled buttons
  3) guard rails so disabled buttons don’t animate

#### Exact elements/selectors/components affected
- Existing selector to extend: `.controls button, .notifications button`
- New selector to add: `.controls button:not(:disabled):active, .notifications button:not(:disabled):active`
- New selector to add: `.controls button:disabled, .notifications button:disabled` (overrides to prevent animation)

#### Exact property changes
- Add to `.controls button, .notifications button`:
  - `transition: transform 140ms ease, filter 140ms ease, background-color 140ms ease, border-color 140ms ease, color 140ms ease;`
  - `will-change: transform;`
- Add pressed feedback for enabled buttons:
  - `transform: translateY(1px) scale(0.98);`
  - `filter: brightness(.9);` (from no active filter -> brightness(.9))
- Ensure disabled buttons don’t animate:
  - `transition: none;`
  - `transform: none;`
  - `filter: none;`

#### **Before** (real code)
```css
button { font: inherit; cursor: pointer; }
button:focus-visible { outline: 3px solid #d78058; outline-offset: 3px; }
button:disabled { cursor: not-allowed; opacity: .48; }

.controls { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin: 30px 0 32px; }
.controls button, .notifications button { border: 1px solid #d9e0d9; border-radius: 10px; padding: 12px 22px; background: #fffefa; color: #314b3e; font-weight: 650; }
.controls button.primary { background: var(--primary-button-color); border-color: var(--primary-button-color); color: white; min-width: 110px; }
.controls button:not(:disabled):hover, .notifications button:not(:disabled):hover { filter: brightness(.94); }
```

#### **After** (complete proposed code block)
```css
button { font: inherit; cursor: pointer; }
button:focus-visible { outline: 3px solid #d78058; outline-offset: 3px; }
button:disabled { cursor: not-allowed; opacity: .48; }

.controls { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin: 30px 0 32px; }
.controls button, .notifications button {
  border: 1px solid #d9e0d9;
  border-radius: 10px;
  padding: 12px 22px;
  background: #fffefa;
  color: #314b3e;
  font-weight: 650;
  transition:
    transform 140ms ease,
    filter 140ms ease,
    background-color 140ms ease,
    border-color 140ms ease,
    color 140ms ease;
  will-change: transform;
}
.controls button.primary { background: var(--primary-button-color); border-color: var(--primary-button-color); color: white; min-width: 110px; }
.controls button:not(:disabled):hover, .notifications button:not(:disabled):hover { filter: brightness(.94); }
.controls button:not(:disabled):active, .notifications button:not(:disabled):active {
  transform: translateY(1px) scale(0.98);
  filter: brightness(.9);
}
.controls button:disabled, .notifications button:disabled {
  transition: none;
  transform: none;
  filter: none;
}
```

#### Notes (side-effects, inheritance, specificity)
- `button:disabled` already applies globally; the additional `.controls button:disabled, .notifications button:disabled` is intentionally more specific so it can override hover/active transitions/filters.
- `:focus-visible` outline remains unchanged and should not be affected by `transform` (outline follows the transformed element). The outline offset remains 3px.
- `will-change: transform` is limited to these buttons only to avoid unnecessary memory use.

## 4. Design Tokens / Visual Specification
| Token | Value | Used in | Notes |
|---|---:|---|---|
| `--primary-button-color` | `#000080` | `.controls button.primary` | Existing token; unchanged |
| `--focus-outline-color` (implicit) | `#d78058` | `button:focus-visible` | Existing; unchanged |
| `--button-border` (implicit) | `#d9e0d9` | `.controls button, .notifications button` | Existing; unchanged |
| `--button-bg` (implicit) | `#fffefa` | `.controls button, .notifications button` | Existing; unchanged |
| `--button-text` (implicit) | `#314b3e` | `.controls button, .notifications button` | Existing; unchanged |
| `--button-radius` (implicit) | `10px` | `.controls button, .notifications button` | Existing; unchanged |
| `--button-transition-duration` (new) | `140ms` | transitions on buttons | New; provides smooth hover/active |
| `--button-transition-easing` (new) | `ease` | transitions on buttons | New |
| `--button-hover-brightness` (existing) | `brightness(.94)` | `:hover` | Existing; unchanged |
| `--button-active-brightness` (new) | `brightness(.9)` | `:active` | New; slightly stronger than hover |
| `--button-active-transform` (new) | `translateY(1px) scale(0.98)` | `:active` | New pressed feedback |

> Note: “tokens” marked as implicit are not CSS variables today; they document the existing literal values used in `src/style.css`.

## 5. Step-by-Step Implementation Tasks
- [ ] **Create branch** `feature/SCRUM-16` from `main` (if not already present).
- [ ] In `src/style.css`, update `.controls button, .notifications button` to include `transition` and `will-change: transform`.
- [ ] Add pressed state selector `.controls button:not(:disabled):active, .notifications button:not(:disabled):active` with `transform` + `filter`.
- [ ] Add disabled guard selector `.controls button:disabled, .notifications button:disabled` to remove transition/transform/filter.
- [ ] Run `npm test` / `npm run build` **if scripts exist** (verify build is unaffected).
- [ ] Manual QA per Testing Plan across enabled/disabled/keyboard focus states.

## 6. Acceptance Criteria Traceability
| AC # | Acceptance Criterion | Implemented by (file/section) | How to verify |
|---:|---|---|---|
| 1 | Hover animates smoothly for enabled buttons | `src/style.css` §3.1 (transition on button base selector) | Hover Start/Reset/Enable notifications and confirm smooth fade |
| 2 | Press-and-hold shows visible pressed state until release | `src/style.css` §3.1 (`:active` styles) | Mouse down / touch press and hold; see scale + brightness |
| 3 | Disabled buttons don’t animate on hover/click | `src/style.css` §3.1 (`:disabled` override + `:not(:disabled)` hover/active) | Ensure disabled Pause has no transform/filter; cursor/opacity unchanged |
| 4 | Keyboard focus outline remains clearly visible | `src/style.css` existing `button:focus-visible` + no conflicting rules | Tab through buttons; ensure outline visible while focused |
| 5 | Timer + notifications functionality unchanged | No JS changes; CSS-only | Start/Pause/Reset + enable notifications still behave the same |

## 7. Testing Plan
### Manual test cases
1. **Hover transition (enabled)**
   - Steps: Load app → hover **Start**, **Reset**, **Enable notifications**.
   - Expected: brightness change animates smoothly; no jank.
2. **Pressed state (enabled)**
   - Steps: Mouse down on **Start** and hold.
   - Expected: button visibly “presses” (translate + slight scale + darker) while held; returns on release.
3. **Disabled state guard**
   - Steps: On initial load, **Pause** is disabled → hover and click.
   - Expected: opacity/cursor remain; no transform/filter animation; no pressed effect.
4. **Keyboard focus visibility**
   - Steps: Use Tab to focus buttons.
   - Expected: 3px orange outline remains visible; not removed or hidden by transforms.
5. **Regression: timer operations**
   - Steps: Start → Pause → Resume (Start becomes Resume) → Reset.
   - Expected: state changes still correct; no console errors.
6. **Regression: notifications**
   - Steps: Click Enable notifications (in a browser that supports it).
   - Expected: Permission flow unchanged; button may disable based on permission; styles still correct.

### Cross-browser
- Chrome, Firefox, Edge, Safari (latest): verify hover/active/focus styles render correctly.

### Responsive
- 360px: buttons wrap in `.controls` still behave; press animation doesn’t cause layout shift.
- 768px and 1280px+: same behavior.

### Accessibility
- Ensure **WCAG 2.1 AA contrast** remains acceptable (no color changes other than filter dimming).
- Visible focus indicator is preserved.
- Keyboard navigation unchanged.
- No information conveyed by color alone (feedback is supplemental).

### Automated tests
- No test framework detected in inspected files. If Playwright is configured (`playwright.config.ts` exists), ensure no visual regression snapshots are required. (ASSUMPTION: no snapshot tests are currently present.)

## 8. Risks & Mitigations
- **Risk:** `filter` + `transform` on active could feel too strong on low-end devices.
  - **Mitigation:** Keep duration short (140ms) and scale minimal (0.98). If needed, adjust brightness from `.9` → `.92`.
- **Risk:** Active transform could visually misalign in tight layouts.
  - **Mitigation:** Use very small translateY (1px) and verify at 360px.

## 9. Rollback Plan
- Revert the commit that modifies `src/style.css` (or remove the added transition/active/disabled override blocks) to return to the prior instant hover behavior.

## 10. Out of Scope
- Any changes to timer logic (`src/timer.ts`), notifications logic (`src/notifications.ts`), or DOM structure (`index.html`).
- Adding new themes, settings, or redesigning button styles beyond subtle interaction feedback.

## 11. Definition of Done
- All acceptance criteria met.
- Hover and pressed interactions are visible and smooth for enabled buttons.
- Disabled buttons remain non-interactive visually.
- Focus outline remains clearly visible.
- No functional regressions in timer/notifications.

## 12. Delivery Details
- **Branch:** `feature/SCRUM-16`
- **Base branch:** `main`
- **Commit message:** `SCRUM-16: Add implementation plan`
- **PR title (later):** `SCRUM-16: Add subtle button press animation and transitions`
- **PR description outline (later):**
  - What: Add CSS transitions and `:active` pressed feedback to control/notification buttons.
  - Why: Improve interaction responsiveness/polish.
  - How to test: Hover/press enabled buttons; confirm disabled and focus behaviors.
  - Screenshots/GIF: optional (hover/press demo).
