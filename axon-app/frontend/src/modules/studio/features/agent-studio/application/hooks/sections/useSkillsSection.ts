import { useFormContext } from "react-hook-form";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";
import type { SkillsSectionProps, SkillsSectionViewProps } from "../../../types/sections/skills.types";

export const useSkillsSection = ({ syncDraft }: SkillsSectionProps): SkillsSectionViewProps => {
	const form = useFormContext<CreateAgentFormData>();
	return {
		control: form.control,
		syncDraft,
	};
};
