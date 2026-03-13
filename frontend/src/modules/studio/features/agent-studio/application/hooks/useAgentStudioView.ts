import { useState, useCallback } from "react";
import { useAgentStudio } from "../useAgentStudio";
import { useStudioShortcuts } from "./useStudioShortcuts";
import { AGENT_STUDIO_SECTIONS } from "../../types/sections.constants";
import type { StudioArchetype } from "@/modules/studio/types/discovery.types";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";
import { Shield, Code, Globe, Database, Zap, Search, Info } from "lucide-react";
import * as React from "react";

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

	const handleSelectEmpty = useCallback(() => {
		setStep("design");
	}, []);

	const handleSelectArchetype = useCallback((archetype: StudioArchetype) => {
		for (const [key, value] of Object.entries(archetype.config)) {
			form.setValue(key as keyof CreateAgentFormData, value);
		}
		setStep("design");
		syncDraft();
	}, [form, syncDraft]);

	const renderIcon = useCallback((IconName: string | React.ElementType, size?: number, className?: string) => {
		const icons: Record<string, React.ElementType> = {
			Shield,
			Code,
			Globe,
			Database,
			Zap,
			Search,
			Info,
		};
		const Comp = typeof IconName === "string" ? icons[IconName] : IconName;
		return Comp ? React.createElement(Comp, { size, className }) : null;
	}, []);

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
	};
};
