import { useState, useCallback } from "react";
import { useAgentStudio } from "../useAgentStudio";
import { useStudioShortcuts } from "./useStudioShortcuts";
import { useStudioScroll } from "./useStudioScroll";
import { AGENT_STUDIO_SECTIONS } from "../../types/sections.constants";
import type { StudioArchetype } from "@/modules/studio/types/discovery.types";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";
import { Shield, Code, Globe, Database, Zap, Search, Info } from "lucide-react";
import type React from "react";

export const useAgentStudioView = () => {
	const { form, handleExit, handleSubmit, syncDraft } = useAgentStudio();
	const [step, setStep] = useState<"discovery" | "design">("discovery");

	const isDesignStep = step === "design";

	const { handleKeyDown } = useStudioShortcuts({
		onSave: syncDraft,
		onEscape: () => {
			if (isDesignStep) setStep("discovery");
		},
		isActive: isDesignStep,
	});

	const { setCanvasRef, activeSection, scrollToSection } = useStudioScroll(
		AGENT_STUDIO_SECTIONS,
		isDesignStep,
	);

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
		// @ts-ignore - dynamic icon rendering
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
		setCanvasRef,
		activeSection,
		scrollToSection,
		handleSelectEmpty,
		handleSelectArchetype,
		renderIcon,
		sections: AGENT_STUDIO_SECTIONS,
	};
};
