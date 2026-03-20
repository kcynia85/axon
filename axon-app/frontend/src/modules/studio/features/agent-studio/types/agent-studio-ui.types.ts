import { UseFormReturn } from "react-hook-form";
import { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";
import { AgentStudioSectionId } from "../../types/agent-studio.types";
import { SectionConfig } from "../../types/hooks.types";
import { StudioArchetype } from "@/modules/studio/types/discovery.types";

export type AgentStudioStep = "discovery" | "design";

export type AgentStudioViewProps = {
    readonly form: UseFormReturn<CreateAgentFormData>;
    readonly step: AgentStudioStep;
    readonly onSetStep: (step: AgentStudioStep) => void;
    readonly onExit: () => void;
    readonly onSave: () => void;
    readonly onSyncDraft: () => void;
    readonly onKeyDown: (keyboardEvent: React.KeyboardEvent) => void;
    readonly activeSectionIdentifier: AgentStudioSectionId;
    readonly onSectionClick: (sectionIdentifier: AgentStudioSectionId) => void;
    readonly onSelectEmpty: () => void;
    readonly onSelectArchetype: (archetype: StudioArchetype) => void;
    readonly renderIcon: (iconName: string | React.ElementType, size?: number, className?: string) => React.ReactNode;
    readonly sections: readonly SectionConfig[];
    readonly setCanvasContainerReference: (scrollContainerNode: HTMLDivElement | null) => void;
};
