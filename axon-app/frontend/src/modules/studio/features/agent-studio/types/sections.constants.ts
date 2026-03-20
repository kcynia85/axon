import type { SectionConfig } from "./hooks.types";
import type { AgentStudioSectionId } from "./agent-studio.types";

export type { AgentStudioSectionId };

export const AGENT_STUDIO_SECTIONS: readonly SectionConfig[] = [
	{ id: "IDENTITY", title: "Identity", number: 1 },
	{ id: "MEMORY", title: "Cognition", number: 2 },
	{ id: "ENGINE", title: "Engine", number: 3 },
	{ id: "SKILLS", title: "Skills", number: 4 },
	{ id: "CONTEXT", title: "Context", number: 5 },
	{ id: "ARTEFACTS", title: "Artefacts", number: 6 },
	{ id: "AVAILABILITY", title: "Availability", number: 7 },
];
