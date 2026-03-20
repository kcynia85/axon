import { useFormContext, useWatch } from "react-hook-form";
import type { CrewStudioFormData } from "../../types/crew-schema";
import type { CrewStudioSectionId } from "../../types/sections.constants";

export type SectionProgress = {
	readonly current: number;
	readonly total: number;
};

export type NavSectionItem = {
	readonly id: CrewStudioSectionId;
	readonly title: string;
	readonly number: number;
	readonly progress: SectionProgress;
	readonly isActive: boolean;
};

export type CrewStudioSectionNavProps = {
	readonly sections: readonly any[];
	readonly activeSection: CrewStudioSectionId;
	readonly onSectionClick: (id: CrewStudioSectionId) => void;
	readonly onExitToLibrary: () => void;
};

export const useCrewStudioSectionNav = ({
	sections,
	activeSection,
}: { sections: readonly any[], activeSection: CrewStudioSectionId }) => {
	const form = useFormContext<CrewStudioFormData>();
	const values = useWatch({ control: form.control });

	const getProgress = (id: CrewStudioSectionId): SectionProgress => {
		switch (id) {
			case "basic-info": {
				const fields = [
					values.crew_name,
					values.crew_description,
					(values.crew_keywords?.length || 0) > 0,
				];
				return { current: fields.filter(Boolean).length, total: 3 };
			}
			case "collaboration-type": {
				return { current: values.crew_process_type ? 1 : 0, total: 1 };
			}
			case "execution": {
				// Simplified progress for execution
				if (values.crew_process_type === "Hierarchical") {
					const fields = [values.owner_agent_id, (values.agent_member_ids?.length || 0) > 0];
					return { current: fields.filter(Boolean).length, total: 2 };
				}
				if (values.crew_process_type === "Parallel") {
					return { current: (values.agent_member_ids?.length || 0) > 0 ? 1 : 0, total: 1 };
				}
				if (values.crew_process_type === "Sequential") {
					return { current: (values.tasks?.length || 0) > 0 ? 1 : 0, total: 1 };
				}
				return { current: 0, total: 1 };
			}
			case "context": {
				return {
					current: (values.contexts?.length || 0) > 0 ? 1 : 0,
					total: 1,
				};
			}
			case "artefacts": {
				return {
					current: (values.artefacts?.length || 0) > 0 ? 1 : 0,
					total: 1,
				};
			}
			case "availability": {
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
