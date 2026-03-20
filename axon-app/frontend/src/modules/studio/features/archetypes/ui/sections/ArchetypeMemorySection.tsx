import { FormSection } from "@/shared/ui/form/FormSection";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormDynamicList } from "@/shared/ui/form/FormDynamicList";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { FormSubheading } from "@/shared/ui/form/FormSubheading";
import { FormField } from "@/shared/ui/ui/Form";
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getAssets } from "@/modules/knowledge/features/browse-assets/infrastructure";
import type { ArchetypeFormValues } from "../../application/archetypeSchema";

interface ArchetypeMemorySectionProps {
	readonly syncDraft?: () => void;
}

export const ArchetypeMemorySection = ({ syncDraft }: ArchetypeMemorySectionProps) => {
	const { control } = useFormContext<ArchetypeFormValues>();

	const { data: assets = [] } = useQuery({
		queryKey: ["assets"],
		queryFn: async () => getAssets(),
	});

	const knowledgeHubOptions = assets.map(asset => ({ id: asset.id, name: asset.title }));

	return (
		<FormSection
			id="MEMORY"
			number={2}
			title="Cognition"
		>
			<div className="space-y-12">
				<div className="space-y-6">
					<FormSubheading>Knowledge Hubs (RAG)</FormSubheading>
					<div className="w-full max-w-2xl">
						<FormField
							name="knowledgeHubIds"
							control={control}
							render={({ field, fieldState }) => (
								<FormItemField error={fieldState.error?.message}>
									<FormSelect
										multiple
										value={field.value || []}
										onChange={(ids) => {
											field.onChange(ids);
											syncDraft?.();
										}}
										options={knowledgeHubOptions}
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
							name="instructions"
							control={control}
							render={({ field, fieldState }) => (
								<FormItemField error={fieldState.error?.message}>
									<FormDynamicList
										items={(field.value as string[]) || []}
										onChange={(items) => {
											field.onChange(items);
											syncDraft?.();
										}}
										placeholder="Operational guideline..."
										addPlaceholder="Add new instruction..."
										className="border-green-200 dark:border-green-900/30 text-green-600 dark:text-green-400 placeholder:text-green-500/50 dark:placeholder:text-green-500/30"
										plusClassName="text-green-500 hover:text-green-600"
									/>
								</FormItemField>
							)}
						/>

						<FormField
							name="constraints"
							control={control}
							render={({ field, fieldState }) => (
								<FormItemField error={fieldState.error?.message}>
									<FormDynamicList
										items={(field.value as string[]) || []}
										onChange={(items) => {
											field.onChange(items);
											syncDraft?.();
										}}
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
			</div>
		</FormSection>
	);
};
