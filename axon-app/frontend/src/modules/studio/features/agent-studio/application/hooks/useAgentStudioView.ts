import { useState, useCallback } from "react";
import { useAgentStudio } from "../useAgentStudio";
import { useStudioShortcuts } from "./useStudioShortcuts";
import { AGENT_STUDIO_SECTIONS, AgentStudioSectionId } from "../../types/sections.constants";
import type { StudioArchetype } from "@/modules/studio/types/discovery.types";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";
import { Shield, Code, Globe, Database, Zap, Search, Info } from "lucide-react";
import * as React from "react";
import { useStudioScrollSpy } from "@/modules/studio/application/hooks/useStudioScrollSpy";

const AGENT_STUDIO_SECTION_IDENTIFIERS: readonly AgentStudioSectionId[] = [
    "IDENTITY",
    "MEMORY",
    "ENGINE",
    "SKILLS",
    "CONTEXT",
    "ARTEFACTS",
    "AVAILABILITY"
];

/**
 * useAgentStudioView: Orchestrates the high-level steps and interactions of Agent Studio.
 * Standard: 0% co-located UI, 0% useEffect.
 */
export const useAgentStudioView = (initialData?: Partial<CreateAgentFormData>, agentId?: string) => {
	const { form, handleExit, handleSubmit, syncDraft } = useAgentStudio(initialData, agentId);
	const [step, setStep] = useState<"discovery" | "design">(initialData ? "design" : "discovery");

	const isDesignStep = step === "design";

	const { handleKeyDown } = useStudioShortcuts({
		onSave: syncDraft,
		onEscape: () => {
			if (isDesignStep && !initialData) setStep("discovery");
		},
		isActive: isDesignStep,
	});

    const { 
        activeSectionIdentifier: activeSection, 
        setCanvasContainerReference: setCanvasRef, 
        scrollToSectionIdentifier: scrollToSection 
    } = useStudioScrollSpy<AgentStudioSectionId>(
        AGENT_STUDIO_SECTION_IDENTIFIERS,
        "IDENTITY"
    );

	const handleSelectEmpty = () => {
		setStep("design");
	};

	const handleSelectArchetype = (archetype: StudioArchetype) => {
		for (const [key, value] of Object.entries(archetype.config)) {
			form.setValue(key as keyof CreateAgentFormData, value as any);
		}
		setStep("design");
		syncDraft();
	};

	const renderIcon = (IconName: string | React.ElementType, size?: number, className?: string) => {
		const icons: Record<string, React.ElementType> = {
			Shield,
			Code,
			Globe,
			Database,
			Zap,
			Search,
			Info,
		};
		const Component = typeof IconName === "string" ? icons[IconName] : IconName;
		return Component ? React.createElement(Component, { size, className }) : null;
	};

	return {
		form,
		step,
		setStep,
		isDesignStep,
		handleExit,
		handleSubmit,
		syncDraft,
		handleKeyDown,
		handleSelectEmpty,
		handleSelectArchetype,
		renderIcon,
		sections: AGENT_STUDIO_SECTIONS,
        setCanvasRef,
        activeSection,
        scrollToSection,
	};
};
