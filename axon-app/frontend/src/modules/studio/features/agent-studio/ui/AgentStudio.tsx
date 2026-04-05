"use client";

import React from "react";
import { useAgentStudioView } from "../application/hooks/useAgentStudioView";
import { AgentStudioView } from "./AgentStudioView";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";

interface AgentStudioProps {
	readonly initialData?: Partial<CreateAgentFormData>;
	readonly agentId?: string;
}

/**
 * AgentStudio: Container component for the agent design experience.
 * Standard: Container pattern, 0% UI declaration.
 */
export const AgentStudio = ({ initialData, agentId }: AgentStudioProps = {}) => {
	const {
		form,
		step,
		setStep,
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
		sections,
	} = useAgentStudioView(initialData, agentId);

	const handleSave = form.handleSubmit(handleSubmit as any);

	return (
		<AgentStudioView 
			form={form}
			step={step}
			onSetStep={setStep}
			onExit={handleExit}
			onSave={handleSave}
			onSyncDraft={syncDraft}
			onKeyDown={handleKeyDown}
			activeSectionIdentifier={activeSection as any}
			onSectionClick={scrollToSection}
			onSelectEmpty={handleSelectEmpty}
			onSelectArchetype={handleSelectArchetype}
			renderIcon={renderIcon}
			sections={sections}
			setCanvasContainerReference={setCanvasRef}
			isEditing={!!agentId}
		/>
	);
};
