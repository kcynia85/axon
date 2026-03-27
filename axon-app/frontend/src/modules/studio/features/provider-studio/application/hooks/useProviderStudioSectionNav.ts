import { UseFormReturn, useWatch } from "react-hook-form";
import type { ProviderFormData } from "../../types/provider-schema";
import type { ProviderStudioSectionId } from "../../types/sections.constants";

export type SectionProgress = {
	readonly current: number;
	readonly total: number;
};

export type NavSectionItem = {
	readonly id: ProviderStudioSectionId;
	readonly title: string;
	readonly number: number;
	readonly progress: SectionProgress;
	readonly isActive: boolean;
};

export const useProviderStudioSectionNav = ({
	sections,
	activeSection,
	form,
}: { 
	sections: readonly any[], 
	activeSection: ProviderStudioSectionId,
	form: UseFormReturn<ProviderFormData>
}) => {
	const values = useWatch({ control: form.control });

	const getProgress = (id: ProviderStudioSectionId): SectionProgress => {
		switch (id) {
			case "type-selection": {
				return { current: values.provider_type ? 1 : 0, total: 1 };
			}
			case "auth": {
				const baseFields = [
					values.display_name,
					values.provider_id,
					values.base_url,
				];
				
				if (values.provider_type === "cloud" || values.provider_type === "meta") {
					baseFields.push(values.api_key);
				}

				return { 
					current: baseFields.filter(Boolean).length, 
					total: baseFields.length 
				};
			}
			case "tokenization": {
				const current = values.provider_type === "meta" 
					? (values.tokenization_fallback ? 1 : 0)
					: (values.tokenization_strategy ? 1 : 0);
				return { current, total: 1 };
			}
			case "schema": {
				return { current: values.json_schema_mapping ? 1 : 0, total: 1 };
			}
			case "adapter": {
				return { current: (values.api_adapter_mapping?.length || 0) > 0 ? 1 : 0, total: 1 };
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
