---
name: accessibility-guardian
description: Use this skill to ensure the application follows WCAG 2.1 AA standards and project-specific accessibility guidelines.
---

# Accessibility Guardian Skill

This skill ensures that all UI components and content meet high accessibility standards.

## Goals
- Achieve WCAG 2.1 AA compliance.
- Ensure full keyboard navigability.
- Provide a great experience for screen reader users.
- Maintain visual clarity and sufficient contrast.

## Review Areas

### 1. Semantics & Structure
- Use landmark elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<footer>`.
- Logical heading hierarchy: `<h1>` (one per page) down to `<h6>`. Do not skip levels.
- Semantic lists: `<ul>`, `<ol>`, `<dl>`.

### 2. Forms
- Every input must have a visible, associated `<label>` using `for` and `id`.
- Use `aria-describedby` to link error messages or help text to inputs.
- Single-column layout for forms is preferred.
- High-contrast focus indicators.

### 3. Interaction
- **Visible Focus:** Never use `outline: none` unless replaced by a custom `:focus-visible` style.
- Descriptive link text: Avoid "click here" or "read more". Use destination-specific labels.
- Buttons vs. Links: Use `<button>` for actions, `<a>` for navigation.

### 4. Visuals & Contrast
- Contrast ratio: Min 4.5:1 for normal text, 3:1 for large text and UI components.
- Do not rely on color alone to convey information (e.g., use icons + text for errors).
- Avoid flashing content (> 3Hz).

### 5. Media
- Meaningful `alt` text for all images. `alt=""` for decorative ones.
- No autoplay for audio or video. Provide full playback controls.
- Captions for video and transcriptions for audio.

### 6. Data & Tables
- Use `<table>` only for tabular data, never for layout.
- Use `<caption>` for table titles.
- Use `<th>` with `scope="col"` or `scope="row"` for headers.

## Workflow
1. Analyze the UI component or page structure.
2. Check for semantic HTML usage.
3. Verify keyboard navigation and focus management.
4. Audit color contrast and visual clarity.
5. Ensure all media elements have accessible alternatives.

## Rules
- **Native First:** Prefer native HTML elements over ARIA roles where possible.
- **Label Everything:** Interactive elements without text must have `aria-label`.
- **Contrast is Key:** Follow WCAG 2.1 AA strictly.
