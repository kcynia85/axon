import { useFormContext } from "react-hook-form";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";
import { BlueprintSection } from "@/modules/studio/ui/components/primitives/BlueprintSection";
import { PropertyTableInput } from "@/shared/ui/form/PropertyTableInput";
import type {
	PropertyTableItem,
	PropertyFieldType,
} from "@/shared/types/form/PropertyTableInput.types";
import { FormControl, FormField, FormItem } from "@/shared/ui/ui/Form";

export type InterfaceSectionProps = {
	readonly syncDraft: () => void;
};

const CONTEXT_TYPES: {
	readonly label: string;
	readonly value: PropertyFieldType;
}[] = [
	{ label: "STRING", value: "string" },
	{ label: "NUMBER", value: "number" },
	{ label: "BOOLEAN", value: "boolean" },
	{ label: "JSON", value: "json" },
];

const ARTEFACT_TYPES: {
	readonly label: string;
	readonly value: PropertyFieldType;
}[] = [
	{ label: "FILE", value: "file" },
	{ label: "MARKDOWN", value: "markdown" },
	{ label: "IMAGE", value: "image" },
	{ label: "STRUCTURED DATA", value: "json" },
];

export const InterfaceSection = ({ syncDraft }: InterfaceSectionProps) => {
	const form = useFormContext<CreateAgentFormData>();

	return (
		<BlueprintSection id="INTERFACE" number={5} title="Interface">
			<div className="space-y-12">
				<div className="space-y-4">
					<h3 className="text-lg font-mono text-zinc-500">Context</h3>
					<FormField
						control={form.control}
						name="data_interface.context"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<PropertyTableInput
										items={(field.value || []) as PropertyTableItem[]}
										onChange={(val) => {
											field.onChange(val);
											syncDraft();
										}}
										onBlur={syncDraft}
										namePlaceholder="e.g. user_query"
										addPlaceholder="Add parameter..."
										typeOptions={CONTEXT_TYPES}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>

				<div className="space-y-4 pt-8">
					<h3 className="text-lg font-mono text-zinc-500">Artefacts</h3>
					<FormField
						control={form.control}
						name="data_interface.artefacts"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<PropertyTableInput
										items={(field.value || []) as PropertyTableItem[]}
										onChange={(val) => {
											field.onChange(val);
											syncDraft();
										}}
										onBlur={syncDraft}
										namePlaceholder="e.g. final_report"
										addPlaceholder="Add artefact..."
										typeOptions={ARTEFACT_TYPES}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
			</div>
		</BlueprintSection>
	);
};
