import type { AgentStudioSectionId } from "../../types/agent-studio.types";
import type { StudioSectionNavProps as BaseProps } from "../../types/hooks.types";

export type SectionProgress = {
	readonly current: number;
	readonly total: number;
};

export type NavSectionItem = {
	readonly id: AgentStudioSectionId;
	readonly title: string;
	readonly number: number;
	readonly progress: SectionProgress;
	readonly isActive: boolean;
};

export type StudioSectionNavViewProps = {
	readonly items: readonly NavSectionItem[];
	readonly onSectionClick: (id: AgentStudioSectionId) => void;
	readonly onExitToLibrary: () => void;
};

export type { BaseProps as StudioSectionNavProps };
