"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateAgentFormSchema, CreateAgentFormData } from "@/modules/agents/domain/agent.schema";
import { useAgentDraft } from "@/modules/agents/application/useAgentDraft";
import { useCreateAgent } from "@/modules/agents/infrastructure/useAgents";
import { useParams, useRouter } from "next/navigation";

/**
 * useAgentStudio handles the full-screen agent design logic.
 * Standard: 0% useEffect. persistence via useAgentDraft.
 */
export const useAgentStudio = () => {
  const { workspace: workspaceId } = useParams<{ workspace: string }>();
  const router = useRouter();

  const { draft, saveDraft, clearDraft } = useAgentDraft(workspaceId);
  const { mutateAsync: createAgent, isPending: isCreating } = useCreateAgent();

  const form = useForm<CreateAgentFormData>({
    resolver: zodResolver(CreateAgentFormSchema),
    defaultValues: draft || {
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
      data_interface: { context: [], artefacts: [] }
    },
  });

  const handleExit = useCallback(() => {
    router.push(`/workspaces/${workspaceId}/agents`);
  }, [router, workspaceId]);

  const handleSubmit = async (data: CreateAgentFormData) => {
    try {
      await createAgent(data);
      clearDraft();
      handleExit();
    } catch (error) {
      console.error("Failed to create agent:", error);
    }
  };

  // Manual trigger for UI (e.g. onBlur of critical fields)
  const syncDraft = useCallback(() => {
    saveDraft(form.getValues());
  }, [form, saveDraft]);

  return {
    form,
    isCreating,
    handleExit,
    handleSubmit,
    syncDraft
  };
};
