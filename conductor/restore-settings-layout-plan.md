# Plan: Restore Settings Layout and Fix Drill-down Island Navigation

## Objective
Restore the base layout functionality for Settings to be consistent with the Resources module (Knowledge) and implement the requested "drill-down" behavior for the `SettingsNavIsland`.

## Key Changes

### 1. Base Layout (`axon-app/frontend/src/app/(main)/settings/layout.tsx`)
- Standardize padding top to `pt-[60px]` (matching `ResourcesLayout`).
- Remove the redundant `PageLayout` wrapper that was causing margin issues.
- Use a simple container for children.

### 2. Navigation Island (`axon-app/frontend/src/modules/settings/ui/SettingsNavIsland.tsx`)
- Refactor to a single-row horizontal drill-down.
- **Main State**: Shows main groups (`LLMs`, `Knowledge Engine`) as `TabsTrigger`s.
- **Drilled State**: Shows `[Back Arrow] [Active Group Label] [Separator] [Sub-item Triggers...]`.
- Use `Tabs` for all interactive elements to maintain focus and keyboard navigation.
- Use `framer-motion` for smooth horizontal transitions.
- Set all font sizes to `14px` and remove `uppercase`.

### 3. Providers Page (`axon-app/frontend/src/app/(main)/settings/llms/providers/page.tsx`)
- Re-implement using the `PageLayout` component for consistency with `Knowledge`.
- Remove all manual negative margins and custom layout hacks.
- Pass correct `title`, `description`, `breadcrumbs`, and `actions`.

### 4. Models Page (`axon-app/frontend/src/app/(main)/settings/llms/models/page.tsx`)
- (Optional but recommended) Standardize to use `PageLayout` as well.

## Verification
- Use Playwright to check alignment between `/resources/knowledge` and `/settings/llms/providers`.
- Verify the "drill-down" animation and interaction in the navigation island.
- Ensure no hydration errors or duplicate headers.
