# Implementation Plan: Drill-down Navigation for SettingsNavIsland

## Objective
Refactor the `SettingsNavIsland` component to use a single-row drill-down navigation pattern. When a main category (LLMs, Knowledge Engine) is selected, it should transition horizontally to show a back button, the active category, and its sub-items, replacing other main categories.

## Key Files
- `axon-app/frontend/src/modules/settings/ui/SettingsNavIsland.tsx`

## Proposed Changes

### 1. State Management
- Add `useState<boolean>(false)` to track if the menu is in "drilled-down" mode.
- Add `useState<string | null>(null)` to track the manually selected group, or derive it from the active group in the URL.
- Update `onClick` of Level 1 tabs to set `isDrilledDown(true)` and navigate to the first sub-item.

### 2. Layout Transformation
- Consolidate the two-level `flex-col` layout into a single horizontal container.
- Use `AnimatePresence` and `motion` from `framer-motion` for the sliding effect.
- **Main View (isDrilledDown === false):**
    - Show all main categories (LLMs, Knowledge Engine) in a single `TabsList`.
- **Drill-down View (isDrilledDown === true):**
    - **Left Section:** A back button (`ChevronLeft`) followed by the active category name.
    - **Separator:** A subtle vertical divider.
    - **Right Section:** Sub-items (Providers, Models, etc.) for the active category.

### 3. Navigation Logic
- Clicking the **Back Button** will:
    - Set `isDrilledDown(false)`.
    - (Optionally) navigate back to a general `/settings` page or keep the current URL but show the main categories.
- Ensure the active sub-item is highlighted when drilled down.

### 4. Styling
- Maintain the `bg-zinc-950/60 backdrop-blur-md` and `border-white/10` aesthetic.
- Ensure smooth transitions for the indicator pills (`layoutId="settings-pill"`).

## Verification & Testing
- Verify that clicking "LLMs" slides in the sub-items and shows the back arrow.
- Verify that clicking the back arrow restores the main category list.
- Check URL synchronization (sub-items should still work with direct URL access).
- Ensure the "Knowledge Engine" category works analogously.
