# Implementation Plan - SCRUM-21: Improve button hover/active states with subtle motion and depth

## 1. Overview
- **Jira:** SCRUM-21 — https://sourabhdesai.atlassian.net/browse/SCRUM-21
- **Goal:** Add smooth hover transitions and a clear pressed/active affordance to the timer control buttons (Start/Pause/Reset) and the “Enable notifications” button.
- **Business / UX value:** Improves perceived responsiveness and interaction confidence by giving consistent visual feedback on hover and press, while keeping existing focus-visible accessibility intact.
- **Estimated effort:** ~0.5–1 hour (CSS-only change + manual verification across breakpoints/browsers).

## 2. Current State Analysis
### Tech stack detected
- Vite + TypeScript frontend (plain DOM manipulation).
- Styling via a single global stylesheet imported from TS.
  - Confirmed in `src/main.ts`: `import './style.css'`.

### Files inspected
- `src/style.css`
- `src/main.ts`

### How styling is applied today
- Global CSS selectors in `src/style.css` (no CSS modules, no framework).
- Buttons share base styles via `button` and component styles via `.controls button` and `.notifications button`.

### Current visual behaviour (confirmed)
- Buttons have border, radius, background, and typography, but **no transition**.
- Hover state is implemented via brightness filter only.
- No dedicated pressed (`:active`) state.
- Focus-visible outline exists globally for all buttons and must not be overridden.

Relevant existing CSS (from `src/style.css`):
```css
button { font: inherit; cursor: pointer; }
button:focus-visible { outline: 3px solid #d78058; outline-offset: 3px; }
button:disabled { cursor: not-allowed; opacity: .48; }

.controls button, .notifications button { border: 1px solid #d9e0d9; border-radius: 10px; padding: 12px 22px; background: #fffefa; color: #314b3e; font-weight: 650; }
.controls button.primary { background: var(--primary-button-color); border-color: var(--primary-button-color); color: white; min-width: 110px; }
.controls button:not(:disabled):hover, .notifications button:not(:disabled):hover { filter: brightness(.94); }
```

## 3. Detailed Changes (one sub-section PER FILE)

### 3.1 `src/style.css`  -  Change type: Modify
#### Purpose of change
- Add smooth transitions for hover/active state changes.
- Add subtle default elevation (shadow) to increase affordance.
- Add pressed state on click/hold using transform + shadow reduction.
- Keep existing `button:focus-visible` outline fully intact (no override).

#### Exact elements/selectors/components affected
- `.controls button, .notifications button`
- `.controls button:not(:disabled):hover, .notifications button:not(:disabled):hover`
- **New:** `.controls button:not(:disabled):active, .notifications button:not(:disabled):active`

#### Exact property changes
1. On `.controls button, .notifications button`:
   - Add `transition: transform 120ms ease, box-shadow 120ms ease, filter 120ms ease;`
   - Add `box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04), 0 8px 20px rgba(48, 68, 54, 0.08);`

2. On existing hover selector:
   - Keep `filter: brightness(.94);` unchanged (but it will now animate smoothly due to transition).

3. Add new active selector:
   - `transform: translateY(1px);`
   - `box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04), 0 4px 12px rgba(48, 68, 54, 0.10);`
   - `filter: brightness(.92);`

No color changes are introduced for `.controls button.primary`; it retains current background and text colors to preserve contrast.

#### **Before** (real code block)
```css
.controls { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin: 30px 0 32px; }
.controls button, .notifications button { border: 1px solid #d9e0d9; border-radius: 10px; padding: 12px 22px; background: #fffefa; color: #314b3e; font-weight: 650; }
.controls button.primary { background: var(--primary-button-color); border-color: var(--primary-button-color); color: white; min-width: 110px; }
.controls button:not(:disabled):hover, .notifications button:not(:disabled):hover { filter: brightness(.94); }
.session-count { border-top: 1px solid #efede6; margin: 0; padding-top: 24px; color: #69776f; font-size: .9rem; }
```

#### **After** (complete proposed code block)
```css
.controls { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin: 30px 0 32px; }
.controls button, .notifications button {
  border: 1px solid #d9e0d9;
  border-radius: 10px;
  padding: 12px 22px;
  background: #fffefa;
  color: #314b3e;
  font-weight: 650;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04), 0 8px 20px rgba(48, 68, 54, 0.08);
  transition: transform 120ms ease, box-shadow 120ms ease, filter 120ms ease;
}
.controls button.primary { background: var(--primary-button-color); border-color: var(--primary-button-color); color: white; min-width: 110px; }
.controls button:not(:disabled):hover, .notifications button:not(:disabled):hover { filter: brightness(.94); }
.controls button:not(:disabled):active, .notifications button:not(:disabled):active {
  transform: translateY(1px);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04), 0 4px 12px rgba(48, 68, 54, 0.10);
  filter: brightness(.92);
}
.session-count { border-top: 1px solid #efede6; margin: 0; padding-top: 24px; color: #69776f; font-size: .9rem; }
```

#### Notes (side-effects, inheritance, specificity)
- The new `box-shadow` applies to both normal and primary buttons because `.controls button.primary` currently only sets background/border/text/min-width. This is intended to keep elevation consistent across variants.
- `:active` will not apply to disabled buttons due to `:not(:disabled)`.
- The global `button:focus-visible` outline remains unchanged and unaffected because we are not touching `outline` properties on these selectors.
- `transform` may create a new stacking context; given the layout is simple and buttons are not overlapping, this should be safe.

## 4. Design Tokens / Visual Specification
| Token | Value | Used in | Notes |
|---|---:|---|---|
| Button radius | `10px` | `.controls button`, `.notifications button` | Existing |
| Button bg (default) | `#fffefa` | `.controls button`, `.notifications button` | Existing |
| Button text (default) | `#314b3e` | `.controls button`, `.notifications button` | Existing |
| Primary button bg/border | `var(--primary-button-color)` (currently `#000080`) | `.controls button.primary` | Existing, maintain contrast |
| Focus outline | `3px solid #d78058` | `button:focus-visible` | Existing, must remain |
| Hover filter | `brightness(.94)` | `:hover` | Existing, now transitions |
| Active filter | `brightness(.92)` | `:active` | New, subtle pressed feel |
| Default elevation shadow | `0 1px 0 rgba(0,0,0,.04), 0 8px 20px rgba(48,68,54,.08)` | Buttons base | New, subtle depth |
| Pressed shadow | `0 1px 0 rgba(0,0,0,.04), 0 4px 12px rgba(48,68,54,.10)` | Buttons `:active` | New, reduced elevation |
| Motion | `transform 120ms ease, box-shadow 120ms ease, filter 120ms ease` | Buttons base | New, avoids abrupt changes |
| Press distance | `translateY(1px)` | Buttons `:active` | New |

## 5. Step-by-Step Implementation Tasks
- [ ] Create feature branch `feature/SCRUM-21` from `main`.
- [ ] Update `src/style.css`: add `box-shadow` + `transition` to `.controls button, .notifications button`.
- [ ] Update `src/style.css`: add `:active` pressed styles for enabled buttons.
- [ ] Manually verify focus-visible outline still appears (keyboard Tab).
- [ ] Manually verify Start/Pause/Reset and Enable notifications hover/pressed states.
- [ ] Verify disabled buttons do not animate/press and still show `cursor: not-allowed; opacity: .48;`.
- [ ] Run/preview app and ensure timer behavior is unchanged (start/pause/resume/reset).

## 6. Acceptance Criteria Traceability
| AC # | Acceptance Criterion | Implemented by (file/section) | How to verify |
|---:|---|---|---|
| 1 | Hover shows subtle visual change with smooth transition | `src/style.css` §3.1 (transition + existing hover filter) | Hover over Start/Pause/Reset and Enable notifications; observe smooth brightness change |
| 2 | Active/pressed appears pressed until release | `src/style.css` §3.1 (`:active` transform + shadow) | Click-and-hold on enabled buttons; observe translateY + reduced shadow; release returns |
| 3 | Focus-visible outline remains clearly visible | `src/style.css` global `button:focus-visible` unchanged; §3.1 does not override outline | Tab to buttons; ensure 3px #d78058 outline visible |
| 4 | Text remains legible; contrast not reduced | No color changes; only shadows/filters/transform | Visually confirm text readability on default + primary buttons; ensure filters are subtle |
| 5 | Timer behavior unchanged | CSS-only change; no JS edits | Start/pause/resume/reset flows still operate as before |

## 7. Testing Plan
### Manual test cases
1. **Hover transition (controls):**
   - Steps: Load app → move mouse over Start, Pause, Reset.
   - Expected: Button brightness changes smoothly (no abrupt snap).

2. **Pressed state (controls):**
   - Steps: Click and hold Start (when enabled).
   - Expected: Button moves down 1px and shadow reduces until mouse release.

3. **Notifications button hover/pressed:**
   - Steps: Hover and click-hold “Enable notifications” (when enabled).
   - Expected: Same hover + pressed affordance.

4. **Disabled behavior:**
   - Steps: Start timer (Start becomes disabled, Pause enabled) → attempt to click-hold Start.
   - Expected: No pressed visual state on disabled button; cursor not-allowed; opacity remains.

5. **Keyboard focus:**
   - Steps: Use Tab/Shift+Tab to focus buttons.
   - Expected: Existing 3px `#d78058` outline appears and remains visible.

6. **Regression timer operations:**
   - Steps: Start → Pause → Resume → Reset.
   - Expected: Timer state and button enable/disable logic unchanged.

### Cross-browser
- Chrome (latest), Firefox (latest), Edge (latest), Safari (latest).

### Responsive
- 360px: Buttons wrap correctly in `.controls` with no overlap.
- 768px: Normal layout.
- 1280px+: No unexpected scaling/visual artifacts.

### Accessibility
- WCAG 2.1 AA:
  - Contrast: no new text colors introduced; brightness filter remains subtle.
  - Focus visible: confirm outline remains.
  - Keyboard navigation: Tab order unchanged.
  - No color-only meaning: changes are affordances only.

### Automated tests
- No test framework changes planned (no evidence of unit tests in repo; Playwright config exists but story is visual-only). If Playwright snapshots exist (ASSUMPTION: none), update accordingly.

## 8. Risks & Mitigations
- **Risk:** Added shadow changes the visual hierarchy more than desired.
  - **Mitigation:** Keep shadows subtle (low alpha) and only on buttons; adjust alpha if design feedback requests.
- **Risk:** `filter` affects perceived contrast slightly on hover/active.
  - **Mitigation:** Use conservative brightness values `.94` and `.92`; verify readability on primary button.

## 9. Rollback Plan
- Revert commit that modifies `src/style.css` (or remove the added `box-shadow`, `transition`, and `:active` block).

## 10. Out of Scope
- Timer logic changes (`src/timer.ts`) and button enable/disable rules.
- HTML structure or copy changes.
- Color redesign or theming.

## 11. Definition of Done
- All ACs met and verified manually.
- Focus-visible outline unchanged and visible.
- No regressions in timer behavior.
- Code style matches existing CSS formatting.

## 12. Delivery Details
- **Branch:** feature/SCRUM-21
- **Base branch:** main
- **Commit message:** `SCRUM-21: Improve button hover/active states`
- **PR title:** `SCRUM-21: Improve button hover/active states with subtle motion and depth`
- **PR description outline:**
  - Summary of visual changes (transition, shadow, pressed state)
  - Screenshots/GIF optional
  - Verification steps (hover/active/focus-visible)
  - Note: no behavior changes
