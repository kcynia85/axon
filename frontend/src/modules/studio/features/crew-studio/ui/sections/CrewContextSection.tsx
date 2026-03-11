import { FormSection } from "@/shared/ui/form/FormSection";
import { FormSubheading } from "@/shared/ui/form/FormSubheading";
import { FormPropertyTable } from "@/shared/ui/form/FormPropertyTable";
import { useFormContext, Controller } from "react-hook-form";

const DATA_TYPE_OPTIONS = [
	{ label: "Link", value: "Link" },
	{ label: "File", value: "File" },
	{ label: "String", value: "String" },
];

/**
 * CrewContextSection: Manages team contexts and expected artefacts.
 */
export const CrewContextSection = () => {
	const { control } = useFormContext();

	return (
		<FormSection id="context-artefacts" number={4} title="Context & Artefacts">
			<div className="space-y-12">
				<div className="space-y-6">
					<FormSubheading>Context</FormSubheading>
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

				<div className="space-y-6">
					<FormSubheading>Artefact</FormSubheading>
					<Controller
						control={control}
						name="artefacts"
						render={({ field }) => (
							<FormPropertyTable
								items={field.value || []}
								onChange={field.onChange}
								onBlur={field.onBlur}
								typeOptions={DATA_TYPE_OPTIONS}
								namePlaceholder="artefact name (e.g. synthesis.md)"
								addPlaceholder="+ Add Artefact"
							/>
						)}
					/>
				</div>
			</div>
		</FormSection>
	);
};
