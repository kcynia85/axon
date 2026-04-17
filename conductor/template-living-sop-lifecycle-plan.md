# Plan: Living SOP Lifecycle - From Studio to Canvas

## Background & Motivation
Currently, Templates in Axon are treated as static instructional cards. To fulfill the vision of a **"Living SOP"**, we must transform the entire lifecycle of a Template. A methodology (e.g., Psyche Framework, OST, IA Audit) should not just be *described*; it should be an *interactive engine* that guides the user and AI through specific steps, enforces data requirements via ports, and maintains a specific behavioral "Mindset".

## Objective
Implement a unified lifecycle where:
1. **Template Studio** acts as a **Methodology IDE** to configure steps, ports, and psyche.
2. **Space Canvas** renders **Smart Nodes** that expose the Methods Bar and Visual Ports.
3. **Template Inspector** provides **Contextual Guidance** based on the active methodology step.

---

## Phase 1: Domain & Schema Evolution
Extend the core Template models to support behavioral logic.

### Changes:
- **`TemplateStudioSchema` (Frontend):**
    - Add `methodology_flow`: `Array<{ id: string, label: string, psyche_config: PsycheLevel, produces_artefact_id?: string }>`.
    - Add `psyche_config`: Global behavioral settings for the template.
- **`TemplateTable` (Backend):**
    - Add `methodology_flow` (JSONB) column.
    - Update `template_inputs` and `template_outputs` to support more metadata (e.g., `required_for_step_id`).

---

## Phase 2: Template Studio (The Methodology IDE)
Upgrade the Studio to allow authors to "program" the methodology.

### Changes:
- **New Section: "Methodology Flow":**
    - Interface to add/reorder steps (The future "Methods Bar").
    - Ability to link a step to an Output Artifact.
- **Enhanced "Context & Artefacts" Section:**
    - Define port types and "Data Requirements" (e.g., "Must be a valid JTBD map").
- **New Section: "AI Psyche & Mindset":**
    - Dropdown to select the Psyche Level (from the Psyche Framework).
    - Text area for "Methodology Guardrails" (What the AI must NEVER do).
- **`TemplateLivePoster` Update:**
    - Show a "Node Preview" that displays how the Ports and Methods Bar will look on the canvas.

---

## Phase 3: Space Canvas (The Living Node)
Transform the static node into a functional component.

### Changes:
- **`SpaceTemplateCanvasNode.tsx`:**
    - **Visual Ports:** Render `Handle` components for each `context` and `artefact` defined in the Studio.
    - **Methods Bar:** Render a mini-progress-rail at the top of the card showing the methodology steps.
    - **Status Indicators:** Visual feedback if "Context Requirements" are not met (Hydration check).
- **`useSpaceCanvasModificationOperations.ts`:**
    - Update node creation to ensure all `methodology_flow` data is correctly initialized.

---

## Phase 4: Runtime Interaction (The Interactive SOP)
Make the methodology "live" during execution.

### Changes:
- **`SpaceTemplateNodeInspector.tsx`:**
    - Update to show instructions specifically for the **Active Step**.
    - Link "Action" completion to "Artefact" generation.
- **AI Integration:**
    - Update the prompt generation logic to ingest the `psyche_config` and `guardrails` defined in the Studio.

---

## Verification & Testing
1. **Studio Test:** Create a "Psyche Flow Mapping" template in the Studio, configure 3 steps, and link them to 1 output artifact.
2. **Canvas Test:** Drag the new template onto the Space Canvas. Verify that the node shows 3 steps in its Methods Bar and has the correct number of ports.
3. **Inspector Test:** Select the node, click step 1, and verify the instructions match the Studio configuration.
