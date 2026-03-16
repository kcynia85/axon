"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useAgentDraft } from "@/modules/agents/application/useAgentDraft";
import {
	type CreateAgentFormData,
	CreateAgentFormSchema,
} from "@/modules/agents/domain/agent.schema";
import { useCreateAgent, useUpdateAgent } from "@/modules/agents/infrastructure/useAgents";

/**
 * useAgentStudio handles the full-screen agent design logic.
 * Standard: 0% useEffect. persistence via useAgentDraft.
 */
export const useAgentStudio = (initialData?: Partial<CreateAgentFormData>, agentId?: string) => {
	const { workspace: workspaceId } = useParams<{ workspace: string }>();
	const router = useRouter();

	const { draft, saveDraft, clearDraft } = useAgentDraft(workspaceId);
	const { mutateAsync: createAgent, isPending: isCreating } = useCreateAgent();
	const { mutateAsync: updateAgent, isPending: isUpdating } = useUpdateAgent();

	const form = useForm<CreateAgentFormData>({
		resolver: zodResolver(CreateAgentFormSchema) as any,
		defaultValues: initialData || draft || {
			agent_name: "",
			agent_role_text: "",
			agent_goal: "",
			agent_backstory: "",
			guardrails: { instructions: [], constraints: [] },
			few_shot_examples: [],
			reflexion: false,
			temperature: 0.7,
			rag_enforcement: false,
			availability_workspace: [workspaceId],
			agent_keywords: [],
			native_skills: [],
			auto_start: false,
			grounded_mode: false,
			data_interface: { context: [], artefacts: [] },
		},
	});

	const handleExit = useCallback(() => {
		router.push(`/workspaces/${workspaceId}/agents`);
	}, [router, workspaceId]);

	const handleSubmit = async (data: CreateAgentFormData) => {
		try {
			if (agentId) {
				await updateAgent({ id: agentId, agent: data });
			} else {
				await createAgent(data);
			}
			clearDraft();
			handleExit();
		} catch (error) {
			console.error("Failed to save agent:", error);
		}
	};

	// Manual trigger for UI (e.g. onBlur of critical fields)
	const syncDraft = useCallback(() => {
		saveDraft(form.getValues());
	}, [form, saveDraft]);

	return {
		form,
		isCreating: isCreating || isUpdating,
		handleExit,
		handleSubmit,
		syncDraft,
	};
};
