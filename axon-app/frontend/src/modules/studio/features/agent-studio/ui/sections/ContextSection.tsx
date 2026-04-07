import { FormField } from "@/shared/ui/ui/Form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormPropertyTable } from "@/shared/ui/form/FormPropertyTable";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import type { FormPropertyTableItem } from "@/shared/types/form/FormPropertyTable.types";
import { CONTEXT_TYPES } from "../../types/agent-studio.constants";
import { useDataInterfaceSection } from "../../application/hooks/sections/useDataInterfaceSection";
import type { DataInterfaceSectionProps } from "../../types/sections/data-interface.types";

export type ContextSectionProps = DataInterfaceSectionProps;

export const ContextSection = (props: ContextSectionProps) => {
	const { control, syncDraft } = useDataInterfaceSection(props);

	return (
		<FormSection id="CONTEXT" number={5} title="Context" variant="island">
			<div className="space-y-4">
				<FormField
					control={control}
					name="data_interface.context"
					render={({ field }) => (
						<FormItemField>
							<FormPropertyTable
							        items={(field.value || []) as FormPropertyTableItem[]}
							        onChange={(value) => {
							                field.onChange(value);
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
		</FormSection>
	);
};
