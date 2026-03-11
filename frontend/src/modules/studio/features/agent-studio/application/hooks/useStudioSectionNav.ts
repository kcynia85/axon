import { useFormContext, useWatch } from "react-hook-form";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";
import type { AgentStudioSectionId } from "../../types/agent-studio.types";
import type {
	StudioSectionNavProps,
	NavSectionItem,
	SectionProgress,
} from "./StudioSectionNav.types";

export const useStudioSectionNav = ({
	sections,
	activeSection,
}: StudioSectionNavProps) => {
	const form = useFormContext<CreateAgentFormData>();
	const values = useWatch({ control: form.control });

	const getProgress = (id: AgentStudioSectionId): SectionProgress => {
		switch (id) {
			case "IDENTITY": {
				const idFields = [
					values.agent_name,
					values.agent_role_text,
					values.agent_goal,
					values.agent_backstory,
					(values.agent_keywords?.length || 0) > 0,
				];
				return { current: idFields.filter(Boolean).length, total: 5 };
			}
			case "MEMORY": {
				const memFields = [
					(values.knowledge_hub_ids?.length || 0) > 0,
					(values.guardrails?.instructions?.length || 0) > 0,
					(values.few_shot_examples?.length || 0) > 0,
					values.reflexion,
				];
				return { current: memFields.filter(Boolean).length, total: 4 };
			}
			case "ENGINE": {
				const engineFields = [values.llm_model_id];
				return { current: engineFields.filter(Boolean).length, total: 1 };
			}
			case "SKILLS": {
				const skillsFields = [(values.native_skills?.length || 0) > 0];
				return { current: skillsFields.filter(Boolean).length, total: 1 };
			}
			case "CONTEXT": {
				return {
					current: (values.data_interface?.context?.length || 0) > 0 ? 1 : 0,
					total: 1,
				};
			}
			case "ARTEFACTS": {
				return {
					current: (values.data_interface?.artefacts?.length || 0) > 0 ? 1 : 0,
					total: 1,
				};
			}
			case "AVAILABILITY": {
				return {
					current: (values.availability_workspace?.length || 0) > 0 ? 1 : 0,
					total: 1,
				};
			}
			default:
				return { current: 0, total: 0 };
		}
	};

	const items: readonly NavSectionItem[] = sections.map((section) => ({
		...section,
		progress: getProgress(section.id),
		isActive: activeSection === section.id,
	}));

	return {
		items,
	};
};
