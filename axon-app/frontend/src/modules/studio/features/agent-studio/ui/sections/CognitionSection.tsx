import * as React from "react";
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

export const CognitionSection = React.memo((props: CognitionSectionProps) => {
	const { control, syncDraft } = useCognitionSection(props);

	return (
		<FormSection id="MEMORY" number={2} title="Cognition">
			<div className="space-y-12">
				<div className="space-y-6">
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
										onChange={(value) => {
											field.onChange(value);
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
					<div className="space-y-10">
						<FormField
							control={control}
							name="guardrails.instructions"
							render={({ field }) => (
								<FormItemField>
									<FormDynamicList
										items={(field.value as string[]) || []}
										onChange={(value) => {
											field.onChange(value);
											syncDraft();
										}}
										onBlur={syncDraft}
										placeholder="Operational guideline..."
										addPlaceholder="Add new instruction..."
										className="border-green-200 dark:border-green-900/30 text-green-600 dark:text-green-400 placeholder:text-green-500/50 dark:placeholder:text-green-500/30"
										plusClassName="text-green-500 hover:text-green-600"
									/>
								</FormItemField>
							)}
						/>

						<FormField
							control={control}
							name="guardrails.constraints"
							render={({ field }) => (
								<FormItemField>
									<FormDynamicList
										items={(field.value as string[]) || []}
										onChange={(value) => {
											field.onChange(value);
											syncDraft();
										}}
										onBlur={syncDraft}
										placeholder="Hard limitation..."
										addPlaceholder="Add new constraint..."
										className="dark:text-red-400 text-red-600 dark:border-red-900/30 placeholder:text-red-500/50 dark:placeholder:text-red-500/30"
										plusClassName="text-red-500 hover:text-red-600"
									/>
								</FormItemField>
							)}
						/>
					</div>
				</div>

				<div className="space-y-14 pt-8">
					<FormField
						control={control}
						name="few_shot_examples"
						render={({ field }) => (
							<FormItemField label="Strategia Formatowania (Few Shot)">
								<FormTextarea
									placeholder="Input examples of desired output format... (e.g. User: Hello -> Agent: Greetings!)"
									className="min-h-[100px] leading-relaxed text-sm focus:placeholder:text-zinc-900 dark:focus:placeholder:text-white transition-opacity"
									{...field}
									value={Array.isArray(field.value) ? field.value.map((v: any) => v.content || "").join("\n") : ""}
									onChange={(e) => {
										const lines = e.target.value.split("\n");
										field.onChange(lines.map(line => ({ content: line })));
									}}
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
});

CognitionSection.displayName = "CognitionSection";
