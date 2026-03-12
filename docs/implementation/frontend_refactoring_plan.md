# 🏗 Frontend Refactoring Plan

This document outlines the strategy for bringing the frontend codebase into alignment with the established coding standards managed via **Gemini Skills** (see `.gemini/skills/`).

## 📋 Objectives
- [x] Align with "Arrow functions only" rule.
- [x] Align with "Prefer type over interface" rule.
- [x] Align with "No classes" rule (for non-framework code).
- [x] Eliminate `any` usage across all modules.
- [x] Fix broken tests and ensure all pass.
- [x] Standardize UI component imports to `@/shared/ui/ui`.
- [x] Fix relative utility imports to `@/shared/lib/utils`.

## 🚀 Phases

### Phase 1: Syntax & Type Standardization (COMPLETED)
- [x] **Projects Module**: Refactored `browse-projects` and `project-details` features.
- [x] **Workspaces Module**: Refactored browser features (Patterns, Templates, Crews, Agents) and core UI sections.
- [x] **Inbox Module**: Refactored `InboxList`, `InboxDrawer`, and `InboxEmptyState`.
- [x] **Agents Module**: Refactor Chat Session components and types.
- [x] **Dashboard Module**: Refactor Dashboard views and prototype views.
- [x] **Knowledge Module**: Refactor DocsView and AssetCard.
- [x] **Resources Module**: Refactor InternalToolEditor and hooks.
- [x] **Tools Module**: Refactor ToolCatalog.
- [x] **Settings Module**: Refactor settings hooks to arrow functions.
- [x] **Shared Components**: Refactored `ResourceList`, `StatusBadge`, `FilterBar`, `Card`, `Tooltip`, `EmptyState`, `ModeToggle`.
- [x] **Layout Layer**: Refactored Page components, SidePeek, and UserNav.

### Phase 2: Architectural Integrity (COMPLETED)
- [x] **Refactor `AuthenticatedClient`**: Converted class to an object with exported arrow functions.
- [x] **Eliminate `any`**: Updated infrastructure APIs to use strong typing.
- [x] **Standardize imports**: Migrated all `@/components/ui` to `@/shared/ui/ui`.
- [x] **Fix Utility paths**: Migrated `@/lib/utils` to `@/shared/lib/utils`.

### Phase 3: Test Repair & Verification (COMPLETED)
- [x] **Projects Module**: Fixed and verified tests (ProjectCard, ProjectList).
- [x] **Verification**: All 16 tests passing across 6 test files.

## 🛠 Progress Tracker
- **Status:** COMPLETED.
- **Last Updated:** 2026-03-02
- [x] Phase 1: Global Syntax & Types standardization.
- [x] Phase 2: API Client & Import refactor.
- [x] Phase 3: Test verification.

## 🏁 Final Notes
The frontend codebase now strictly follows the "Arrow functions only", "Prefer type over interface", and "No classes" rules. Components use standard arrow functions with typed arguments instead of `React.FC`. UI components are consistently imported from `@/shared/ui/ui`.
