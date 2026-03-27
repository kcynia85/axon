import { UseFormReturn, useWatch } from "react-hook-form";
import type { RouterFormData } from "../../types/router-schema";
import type { RouterSectionIdentifier } from "../../types/router.constants";

export type SectionProgress = {
	readonly current: number;
	readonly total: number;
};

export type NavSectionItem = {
	readonly id: RouterSectionIdentifier;
	readonly label: string;
	readonly number: number;
	readonly progress: SectionProgress;
	readonly isActive: boolean;
};

export const useRouterStudioSectionNav = ({
	sections,
	activeSection,
	form,
}: { 
	sections: readonly any[], 
	activeSection: RouterSectionIdentifier,
	form: UseFormReturn<RouterFormData>
}) => {
	const values = useWatch({ control: form.control });

	const getProgress = (id: RouterSectionIdentifier): SectionProgress => {
		switch (id) {
			case "general": {
				const fields = [values.name, values.strategy];
				return { 
					current: fields.filter(Boolean).length, 
					total: fields.length 
				};
			}
			case "priority-chain": {
				return { 
					current: (values.priority_chain?.length || 0) > 0 ? 1 : 0, 
					total: 1 
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
