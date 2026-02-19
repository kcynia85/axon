# 🎨 Space Canvas UX Specification

> **Based on Sketch:** `docs/product/sketches/IMG_20260219_171725877.jpg`
> **Date:** 2026-02-19
> **Status:** Draft / Spec

## 1. Overview
The **Space Canvas** is the primary "Workspaces-first" interface for Axon vNext. It provides a visual, infinite canvas environment where users can organize their thoughts, agents, and artifacts across different domains (Workspaces).

## 2. Layout Structure

The interface is composed of a central infinite canvas overlaid by floating "Dynamic Island" style panels.

### 2.1. Global Header
*   **Location:** Top bar (or floating top-left/right).
*   **Elements:**
    *   **H1 Space Name:** Editable title of the current space.
    *   **Linked Project:** Indicator of which Project this space belongs to (e.g., `Linked: Project name`).
    *   **User Profile:** `Login Name` (Top Right).

### 2.2. Left Sidebar (Float) - "The Toolbox"
*   **Style:** Floating panel (Level 1), "Dynamic Island" behavior (likely collapsible or responsive).
*   **Content:** List of available **Workspaces** (Domains) to drag/drop or filter the view.
    *   `PRODUCT MANAGEMENT`
    *   `DISCOVERY`
    *   `DESIGN`
    *   `DELIVERY`
    *   `GROWTH & MARKET`
    *   `CORE COMPONENTS`
    *   `NOTE` (Sticky notes / annotations)

### 2.3. Center Region - "The Canvas"
*   **Behavior:** Infinite pan & zoom.
*   **Elements:**
    *   **Zones:** Large, dashed containers representing specific Workspaces (e.g., a "DISCOVERY" zone, a "DESIGN" zone).
    *   **Nodes:** Individual items within zones (Agents, Artifacts, Thoughts).
    *   **Connections:** Lines connecting Nodes or Zones to visualize flows and dependencies.
*   **Interactions:**
    *   Drag & Drop from Left Sidebar to create new Zones/Nodes.
    *   Connect Nodes with wires.
    *   Pan/Zoom (Controls in Bottom Right `[+] [-]`).

### 2.4. Right Sidebar (Float) - "The Inspector"
*   **Style:** Floating panel, "Dynamic Island" behavior.
*   **Context:** Updates based on selection (Node or Zone).
*   **Sections:**
    *   **LIVE THOUGHT...**: Streaming output or active agent status.
    *   **CONTEXT**: Metadata, inputs, or history relevant to the selection.
    *   **ARTEFACT**: Preview or link to the generated artifact (Document, Code, Image).

## 3. Visual Style
*   **Aesthetic:** Clean, wireframe-like, "Notion-like" simplicity but with spatial organization.
*   **Dynamic Islands:** Floating UI elements that detach from the edges, giving a modern, app-like feel.

## 4. Navigation & URL Structure
*   ` /spaces/:id` - Standard view.
*   ` /spaces/:id?node=:nodeId` - Deep link with Inspector open for specific node.
*   ` /spaces/:id#zone-:workspace` - View focused/scrolled to a specific Zone.
