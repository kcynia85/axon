import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MetaAgentStudioSchema, type MetaAgentStudioData } from "../types/meta-agent-schema";

export const useMetaAgentForm = (initialData?: Partial<MetaAgentStudioData>) => {
    return useForm<MetaAgentStudioData>({
        resolver: zodResolver(MetaAgentStudioSchema),
        defaultValues: {
            meta_agent_system_prompt: initialData?.meta_agent_system_prompt ?? "",
            meta_agent_temperature: initialData?.meta_agent_temperature ?? 0.7,
            meta_agent_rag_enabled: initialData?.meta_agent_rag_enabled ?? true,
            llm_model_id: initialData?.llm_model_id ?? "",
        },
    });
};
