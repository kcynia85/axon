import { FormField } from "@/shared/ui/ui/Form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormPropertyTable } from "@/shared/ui/form/FormPropertyTable";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormSubheading } from "@/shared/ui/form/FormSubheading";
import type { FormPropertyTableItem } from "@/shared/types/form/FormPropertyTable.types";
import { CONTEXT_TYPES, ARTEFACT_TYPES } from "../../types/agent-studio.constants";
import type { InterfaceSectionProps } from "../../types/sections/interface.types";
import { useInterfaceSection } from "../../application/hooks/sections/useInterfaceSection";

export const InterfaceSection = (props: InterfaceSectionProps) => {
	const { control, syncDraft } = useInterfaceSection(props);

	return (
		<FormSection id="INTERFACE" number={5} title="Interface">
			<div className="space-y-12">
				<div className="space-y-4">
					<FormSubheading>Context</FormSubheading>
					<FormField
						control={control}
						name="data_interface.context"
						render={({ field }) => (
							<FormItemField>
								<FormPropertyTable
									items={(field.value || []) as FormPropertyTableItem[]}
									onChange={(val) => {
										field.onChange(val);
										syncDraft();
									}}
									onBlur={syncDraft}
									namePlaceholder="e.g. user_query"
									addPlaceholder="Add parameter..."
									typeOptions={CONTEXT_TYPES}
								/>
							</FormItemField>
						)}
					/>
				</div>

				<div className="space-y-4 pt-8">
					<FormSubheading>Artefacts</FormSubheading>
					<FormField
						control={control}
						name="data_interface.artefacts"
						render={({ field }) => (
							<FormItemField>
								<FormPropertyTable
									items={(field.value || []) as FormPropertyTableItem[]}
									onChange={(val) => {
										field.onChange(val);
										syncDraft();
									}}
									onBlur={syncDraft}
									namePlaceholder="e.g. final_report"
									addPlaceholder="Add artefact..."
									typeOptions={ARTEFACT_TYPES}
								/>
							</FormItemField>
						)}
					/>
				</div>
			</div>
		</FormSection>
	);
};
