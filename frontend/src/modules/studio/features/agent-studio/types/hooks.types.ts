import type React from "react";
import type { AgentStudioSectionId } from "./agent-studio.types";

export type UseStudioShortcutsProps = {
	readonly onSave: () => void;
	readonly onEscape: () => void;
	readonly isActive: boolean;
};

export type UseStudioShortcutsReturn = {
	readonly handleKeyDown: (e: React.KeyboardEvent) => void;
};

export type SectionConfig = {
	readonly id: AgentStudioSectionId;
	readonly title: string;
	readonly number: number;
};

export type UseStudioScrollReturn = {
	readonly setCanvasRef: (node: HTMLDivElement | null) => void;
	readonly activeSection: AgentStudioSectionId;
	readonly scrollToSection: (id: AgentStudioSectionId) => void;
};
