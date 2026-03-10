import { FormField } from "@/shared/ui/ui/Form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormTextarea } from "@/shared/ui/form/FormTextarea";
import { FormDynamicList } from "@/shared/ui/form/FormDynamicList";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { FormCheckbox } from "@/shared/ui/form/FormCheckbox";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormSubheading } from "@/shared/ui/form/FormSubheading";
import { ALL_HUBS } from "../../types/agent-studio.constants";
import type { CognitionSectionProps } from "../../types/sections/cognition.types";
import { useCognitionSection } from "../../application/hooks/sections/useCognitionSection";

export const CognitionSection = (props: CognitionSectionProps) => {
	const { control, syncDraft } = useCognitionSection(props);

	return (
		<FormSection id="MEMORY" number={2} title="Cognition">
			<div className="space-y-12">
				<div className="space-y-2">
					<FormSubheading>Knowledge Hubs (RAG)</FormSubheading>
					<div className="w-full max-w-2xl">
						<FormField
							control={control}
							name="knowledge_hub_ids"
							render={({ field }) => (
								<FormItemField>
									<FormSelect
										multiple
										options={ALL_HUBS as any}
										value={field.value || []}
										onChange={(val) => {
											field.onChange(val);
											syncDraft();
										}}
										placeholder="Select Knowledge Sources..."
										searchPlaceholder="Search hubs..."
									/>
								</FormItemField>
							)}
						/>
					</div>
				</div>

				<div className="space-y-2">
					<FormSubheading>Guardrails</FormSubheading>
					<div className="space-y-16">
						<FormField
							control={control}
							name="guardrails.instructions"
							render={({ field }) => (
								<FormItemField label="Instructions">
									<FormDynamicList
										items={(field.value as string[]) || []}
										onChange={(val) => {
											field.onChange(val);
											syncDraft();
										}}
										onBlur={syncDraft}
										placeholder="Operational guideline..."
										addPlaceholder="Add new instruction..."
									/>
								</FormItemField>
							)}
						/>

						<FormField
							control={control}
							name="guardrails.constraints"
							render={({ field }) => (
								<FormItemField label="Constraints">
									<FormDynamicList
										items={(field.value as string[]) || []}
										onChange={(val) => {
											field.onChange(val);
											syncDraft();
										}}
										onBlur={syncDraft}
										placeholder="Hard limitation..."
										addPlaceholder="Add new constraint..."
									/>
								</FormItemField>
							)}
						/>
					</div>
				</div>

				<div className="space-y-8 pt-8">
					<FormField
						control={control}
						name="few_shot_examples"
						render={({ field }) => (
							<FormItemField label="Strategia Formatowania (Few Shot)">
								<FormTextarea
									placeholder="Input examples of desired output format... (e.g. User: Hello -> Agent: Greetings!)"
									className="min-h-[100px] leading-relaxed text-sm focus:placeholder:text-zinc-900 dark:focus:placeholder:text-white transition-opacity"
									{...field}
									value={Array.isArray(field.value) ? field.value.join("\n") : ""}
									onChange={(e) => field.onChange(e.target.value.split("\n"))}
									onBlur={syncDraft}
								/>
							</FormItemField>
						)}
					/>

					<FormField
						control={control}
						name="reflexion"
						render={({ field }) => (
							<FormItemField>
								<FormCheckbox
									title="Reflexion Mode"
									description="Agent will self-correct before responding"
									checked={!!field.value}
									onChange={(checked) => {
										field.onChange(checked);
										syncDraft();
									}}
								/>
							</FormItemField>
						)}
					/>
				</div>
			</div>
		</FormSection>
	);
};
