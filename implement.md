# Implementation Plan - SCRUM-19: Improve button hover/active feedback and add subtle transitions

## 1. Overview
- **Jira:** SCRUM-19 https://sourabhdesai.atlassian.net/browse/SCRUM-19
- **Goal:** Improve perceived responsiveness of the timer control buttons by adding smooth hover transitions and a distinct pressed (`:active`) state, while preserving existing keyboard focus styling.
- **Business/UX value:** Clearer affordance reduces mis-click anxiety and makes the UI feel more polished without changing any timer behavior.
- **Estimated effort:** **S (0.5–1.0 hr)**, CSS-only.

## 2. Current State Analysis
### Tech stack detected
- Static HTML + TypeScript (Vite-style structure implied by `src/main.ts`) and a single global stylesheet `src/style.css`.
- Styling is plain CSS (no CSS-in-JS, no Tailwind).

### Files inspected
- `src/style.css`
- `index.html`

### How styling is applied today
- Global element rules exist for `button`, `button:focus-visible`, `button:disabled`.
- Button styles for the timer live in `src/style.css` via:
  - `.controls button, .notifications button` (base button styling)
  - `.controls button.primary` (primary button styling)
  - `.controls button:not(:disabled):hover, .notifications button:not(:disabled):hover` (hover styling)
- Current hover feedback is only `filter: brightness(.94)` and there is **no** explicit `:active` pressed state and **no** transition.

### Current visual behavior (confirmed)
From `src/style.css`:
- Enabled buttons:
  - Base background: `#fffefa`
  - Border: `1px solid #d9e0d9`
  - Border radius: `10px`
  - Hover: `filter: brightness(.94)` (abrupt)
- Primary button:
  - Background: `var(--primary-button-color)` where `--primary-button-color: #000080`
  - Text: `white`
- Keyboard focus:
  - `button:focus-visible { outline: 3px solid #d78058; outline-offset: 3px; }`
- Disabled:
  - `button:disabled { cursor: not-allowed; opacity: .48; }`

## 3. Detailed Changes (one sub-section PER FILE)

### 3.1 `src/style.css`  -  Change type: Modify
#### Purpose of change
- Add smooth transitions for enabled buttons in Controls and Notifications.
- Add a distinct pressed state (`:active`) for enabled buttons.
- Ensure disabled buttons do not animate and do not show hover/pressed styling.
- Preserve existing focus-visible outline unchanged.

#### Exact elements/selectors/components affected
- Base button styling:
  - `.controls button, .notifications button`
- Primary button styling:
  - `.controls button.primary`
- Hover styling:
  - `.controls button:not(:disabled):hover, .notifications button:not(:disabled):hover`
- Add new pressed styling:
  - `.controls button:not(:disabled):active, .notifications button:not(:disabled):active`
- Add disabled transition override:
  - `.controls button:disabled, .notifications button:disabled`

#### Exact property changes
1) Add transition to enabled buttons (base rule):
- Add:
  - `transition: transform 80ms ease, filter 120ms ease, box-shadow 120ms ease, background-color 120ms ease, border-color 120ms ease;`
  - `will-change: transform;` (small optimization; safe for buttons)

2) Add pressed state:
- New `:active` rule adds:
  - `transform: translateY(1px);`
  - `filter: brightness(.92);` (slightly stronger than hover `.94`)

3) Ensure disabled buttons don’t animate:
- New disabled rule adds:
  - `transition: none;`

4) Keep focus styling unchanged:
- No changes to `button:focus-visible`.

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
  transition:
    transform 80ms ease,
    filter 120ms ease,
    box-shadow 120ms ease,
    background-color 120ms ease,
    border-color 120ms ease;
  will-change: transform;
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
  filter: brightness(.92);
}

.controls button:disabled,
.notifications button:disabled {
  transition: none;
}
```

#### Notes (side-effects, inheritance, specificity)
- `:active` applies only while the pointer is pressed; keyboard “pressed” visual is not required by AC and focus-visible remains unchanged.
- Using `filter` affects the entire rendered button (including text). This is consistent with existing hover behavior.
- Adding `transition` to `.controls button, .notifications button` scopes changes to those sections only; other buttons (if any are added elsewhere later) won’t inherit the transition unless they match these selectors.
- Explicit `transition: none` for disabled buttons prevents animations when a button becomes disabled due to app state changes.

## 4. Design Tokens / Visual Specification
| Token | Value | Used in | Notes |
|---|---:|---|---|
| `--primary-button-color` | `#000080` | `.controls button.primary` | Existing token in `:root` |
| Button radius | `10px` | `.controls button`, `.notifications button` | Existing |
| Button border | `1px solid #d9e0d9` | Base buttons | Existing |
| Button bg | `#fffefa` | Base buttons | Existing |
| Button text | `#314b3e` | Base buttons | Existing |
| Hover brightness | `0.94` | `:hover` | Existing |
| Active brightness | `0.92` | `:active` | New; slightly stronger than hover |
| Active translate | `1px` | `:active` | New pressed affordance |
| Transition (transform) | `80ms ease` | Base buttons | New; quick press feedback |
| Transition (filter/bg/border/shadow) | `120ms ease` | Base buttons | New; smooth hover/active |
| Focus outline | `3px solid #d78058` | `button:focus-visible` | Must remain unchanged |

## 5. Step-by-Step Implementation Tasks
- [ ] **(1 commit)** Update `src/style.css`: add transitions to `.controls button, .notifications button`.
- [ ] **(1 commit)** Update `src/style.css`: add `:active` pressed state for enabled buttons.
- [ ] **(1 commit)** Update `src/style.css`: ensure disabled buttons have `transition: none` and confirm `:hover/:active` don’t apply due to `:not(:disabled)`.
- [ ] **(1 commit)** Manual verification across breakpoints/browsers (no code change).

## 6. Acceptance Criteria Traceability
| AC # | Acceptance Criterion | Implemented by (file/section) | How to verify |
|---:|---|---|---|
| 1 | Hover animates smoothly via transition | `src/style.css` §3.1 base button rule + hover rule | Hover Start/Pause/Reset/Enable notifications; observe smooth change rather than abrupt |
| 2 | Pressed state distinct from hover | `src/style.css` §3.1 `:active` rule | Mouse down on enabled buttons; observe 1px down + slightly darker than hover |
| 3 | Focus outline remains present | No change; verify `button:focus-visible` unchanged in `src/style.css` | Tab to buttons; ensure orange outline visible and not overridden |
| 4 | Disabled buttons show no hover/pressed and remain disabled | `src/style.css` §3.1 `:not(:disabled)` guards + disabled `transition: none` | Ensure disabled buttons don’t darken or move on hover/press; cursor/opacity unchanged |
| 5 | Timer behavior unchanged | CSS-only change in `src/style.css` | Run Start/Pause/Reset through work/break; behavior unchanged |

## 7. Testing Plan
### Manual test cases
1) **Hover transition (enabled buttons)**
   - Steps: Load app → hover Start, Pause (when enabled), Reset, Enable notifications.
   - Expected: Brightness changes smoothly (animated), not instant.

2) **Pressed state (enabled buttons)**
   - Steps: Mouse down on Start / Reset / Enable notifications.
   - Expected: Button moves down ~1px and darkens slightly more than hover; returns on mouse up.

3) **Keyboard focus**
   - Steps: Use Tab / Shift+Tab to navigate to each button.
   - Expected: Focus-visible outline `3px solid #d78058` remains clearly visible; not clipped.

4) **Disabled behavior**
   - Steps: Identify a disabled state (e.g., Pause when timer not running) → hover/click/press.
   - Expected: No hover darkening, no translate movement, cursor not-allowed, opacity ~0.48.

5) **Regression: timer operations**
   - Steps: Start → Pause → Start → Reset; allow session to end if feasible.
   - Expected: Timer logic and phase switching unchanged.

### Cross-browser
- Chrome, Firefox, Edge, Safari (latest): verify hover/active transitions and focus-visible.

### Responsive
- 360px, 768px, 1280px+: verify no layout shift; button press translate does not break alignment.

### Accessibility
- WCAG 2.1 AA contrast: unchanged colors for text; ensure hover/active don’t reduce readability.
- Visible focus: confirm focus outline unchanged.
- Keyboard navigation: unchanged.
- No colour-only meaning: changes are purely affordance; no state communicated solely by color.

### Automated tests
- No test framework changes required for CSS-only update (no snapshots observed in repo).

## 8. Risks & Mitigations
- **Risk:** `filter: brightness()` affects text and may reduce contrast slightly during hover/active.
  - **Mitigation:** Keep brightness change subtle (`.94` existing, `.92` active). Verify readability.
- **Risk:** `transform: translateY(1px)` could cause perceived jitter in tightly packed layouts.
  - **Mitigation:** Translate only the button itself; verify in `.controls` flex layout doesn’t shift neighbors (transform does not affect layout).

## 9. Rollback Plan
- Revert commit(s) affecting `src/style.css` (or remove added transition/active/disabled rules) to return to previous abrupt hover-only behavior.

## 10. Out of Scope
- Any changes to timer logic (`src/timer.ts`), DOM wiring (`src/main.ts`), notifications (`src/notifications.ts`), copy, layout/HTML structure.
- Adding new components or redesigning overall look-and-feel beyond button interaction states.

## 11. Definition of Done
- All acceptance criteria met.
- Hover transitions are smooth on enabled buttons.
- Pressed state present and distinct.
- Focus-visible outline unchanged.
- Disabled buttons do not animate or show hover/pressed styling.
- No functional changes to timer behavior.

## 12. Delivery Details
- **Branch:** `feature/SCRUM-19`
- **Base branch:** `main`
- **Commit message:** `SCRUM-19: Add implementation plan`
- **PR title:** `SCRUM-19: Improve button hover/active feedback and add subtle transitions`
- **PR description outline:**
  - Summary of CSS-only interaction improvements
  - Screenshots/GIF (optional) showing hover vs active
  - Verification checklist for ACs (hover transition, pressed state, focus-visible, disabled)
  - Note: no logic changes
