import * as React from "react";
import { FormField } from "@/shared/ui/ui/Form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { FormCheckbox } from "@/shared/ui/form/FormCheckbox";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormSubheading } from "@/shared/ui/form/FormSubheading";
import { FormSlider } from "@/shared/ui/form/FormSlider";
import { useLLMModels } from "@/modules/settings/application/useSettings";
import type { EngineSectionProps } from "../../types/sections/engine.types";
import { useEngineSection } from "../../application/hooks/sections/useEngineSection";

export const EngineSection = React.memo((props: EngineSectionProps) => {
	const { control, syncDraft } = useEngineSection(props);
	const { data: models, isLoading: isLoadingModels } = useLLMModels();

	const modelOptions = React.useMemo(() => {
		if (!models) return [];
		return models.map(m => ({
			id: m.id,
			name: m.model_display_name,
			subtitle: `${m.model_tier} • ${m.model_context_window.toLocaleString()} ctx`
		}));
	}, [models]);

	return (
		<FormSection id="ENGINE" number={3} title="Engine" variant="island">
			<div className="space-y-12 relative overflow-hidden">
				<div className="space-y-8 relative z-10">
					<div className="space-y-6">
						<FormSubheading>Model LLM</FormSubheading>
						<div className="w-full max-w-2xl">
							<FormField
								control={control}
								name="llm_model_id"
								render={({ field }) => (
									<FormItemField>
										<FormSelect
											options={modelOptions}
											value={field.value || ""}
											onChange={(val) => {
												field.onChange(val);
												syncDraft();
											}}
											placeholder={isLoadingModels ? "Loading models..." : "Select model..."}
											searchPlaceholder="Search model..."
										/>
									</FormItemField>
								)}
							/>
						</div>
					</div>

					<div className="space-y-0 pt-4">
						<FormField
							control={control}
							name="temperature"
							render={({ field }) => (
								<FormItemField label="Temperature">
									<FormSlider
										value={field.value ?? 0.7}
										onChange={(v) => {
											field.onChange(v);
											syncDraft();
										}}
										labelLeft="Deterministic"
										labelRight="Creative"
									/>
								</FormItemField>
							)}
						/>
					</div>
				</div>

				<div className="space-y-8 relative z-10 pt-10">
					<div className="space-y-4">
						<FormField
							control={control}
							name="grounded_mode"
							render={({ field }) => (
								<FormItemField>
									<FormCheckbox
										title="Grounded Mode"
										description="Strictly adhere to provided context sources"
										checked={!!field.value}
										onChange={(checked) => {
											field.onChange(checked);
											setTimeout(syncDraft, 0);
										}}
									/>
								</FormItemField>
							)}
						/>

						<FormField
							control={control}
							name="rag_enforcement"
							render={({ field }) => (
								<FormItemField>
									<FormCheckbox
										title="RAG Enforcement"
										description="Force retrieval for every response"
										checked={!!field.value}
										onChange={(checked) => {
											field.onChange(checked);
											setTimeout(syncDraft, 0);
										}}
									/>
								</FormItemField>
							)}
						/>
					</div>
				</div>
			</div>
		</FormSection>
	);
});

EngineSection.displayName = "EngineSection";
