import { FormSection } from "@/shared/ui/form/FormSection";
import { FormPropertyTable } from "@/shared/ui/form/FormPropertyTable";
import { useFormContext, Controller } from "react-hook-form";

const DATA_TYPE_OPTIONS = [
	{ label: "Link", value: "string" as const },
	{ label: "File", value: "file" as const },
	{ label: "String", value: "string" as const },
];

/**
 * CrewContextSection: Manages team contexts.
 */
export const CrewContextSection = () => {
	const { control } = useFormContext();

	return (
		<FormSection id="context" number={4} title="Context">
			<div className="space-y-6">
				<Controller
					control={control}
					name="contexts"
					render={({ field }) => (
						<FormPropertyTable
							items={field.value || []}
							onChange={field.onChange}
							onBlur={field.onBlur}
							typeOptions={DATA_TYPE_OPTIONS}
							namePlaceholder="context name (e.g. competitors_list)"
							addPlaceholder="+ Add Context"
						/>
					)}
				/>
			</div>
		</FormSection>
	);
};
