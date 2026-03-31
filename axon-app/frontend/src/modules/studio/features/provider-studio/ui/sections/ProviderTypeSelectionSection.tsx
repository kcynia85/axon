import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { ProviderFormData, ProviderType } from "../../types/provider-schema";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormRadio } from "@/shared/ui/form/FormRadio";

const PROVIDER_TYPES: { id: ProviderType; title: string; description: string }[] = [
	{
		id: "cloud",
		title: "Cloud / SaaS",
		description: "Direct connection to provider API (OpenAI, Anthropic, Google).",
	},
	{
		id: "meta",
		title: "Meta-Provider",
		description: "Aggregators providing access to multiple models (OpenRouter, Together AI).",
	},
	{
		id: "local",
		title: "Local",
		description: "Local model instances running on your hardware (Ollama, LM Studio).",
	},
];

export const ProviderTypeSelectionSection = () => {
	const { setValue, control } = useFormContext<ProviderFormData>();
	const currentType = useWatch({ control, name: "provider_type" });

	const handleTypeChange = (type: ProviderType) => {
		setValue("provider_type", type);
	};

	return (
		<FormSection id="type-selection" number={2} title="Provider Type Selection" variant="island">
			<div className="grid grid-cols-1 gap-6">
				{PROVIDER_TYPES.map((type) => (
					<FormRadio
						key={type.id}
						title={type.title}
						description={type.description}
						checked={currentType === type.id}
						onChange={() => handleTypeChange(type.id)}
					/>
				))}
			</div>
		</FormSection>
	);
};
