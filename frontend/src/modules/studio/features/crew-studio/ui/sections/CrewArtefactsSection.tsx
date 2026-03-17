import { FormSection } from "@/shared/ui/form/FormSection";
import { FormPropertyTable } from "@/shared/ui/form/FormPropertyTable";
import { useFormContext, Controller } from "react-hook-form";

const DATA_TYPE_OPTIONS = [
	{ label: "Link", value: "string" as const },
	{ label: "File", value: "file" as const },
	{ label: "String", value: "string" as const },
];

interface Props {
	onSyncDraft: () => void;
}

/**
 * CrewArtefactsSection: Manages expected team artefacts.
 */
export const CrewArtefactsSection = ({ onSyncDraft }: Props) => {
	const { control } = useFormContext();

	return (
		<FormSection id="artefacts" number={5} title="Artefacts">
			<div className="space-y-6">
				<Controller
					control={control}
					name="artefacts"
					render={({ field }) => (
						<FormPropertyTable
							items={field.value || []}
							onChange={(val) => {
								field.onChange(val);
								onSyncDraft();
							}}
							onBlur={onSyncDraft}
							typeOptions={DATA_TYPE_OPTIONS}
							namePlaceholder="artefact name (e.g. synthesis.md)"
							addPlaceholder="+ Add Artefact"
						/>
					)}
				/>
			</div>
		</FormSection>
	);
};
