import { FormField } from "@/shared/ui/ui/Form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormCheckbox } from "@/shared/ui/form/FormCheckbox";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { useFormContext } from "react-hook-form";
import type { AutomationFormData } from "../../types/automation-schema";

const DEPLOYMENT_SCOPES = [
	"Global Availability",
	"Product Management",
	"Discovery Hub",
	"Design System",
	"Delivery & CI/CD",
	"Growth & Market",
] as const;

/**
 * AutomationAvailabilitySection: Access control.
 * Matching Agent Studio & Crew Studio pattern: Vertical list of options.
 */
export const AutomationAvailabilitySection = () => {
	const { control } = useFormContext<AutomationFormData>();

	return (
		<FormSection
			id="availability"
			number={5}
			title="Availability"
			description="Configure access rights for this automation service."
		>
			<div className="space-y-12">
				<FormField
					control={control}
					name="availability"
					render={({ field, fieldState }) => {
						const selectedScopes = Array.isArray(field.value) ? field.value : [];
						const isGlobalSelected = selectedScopes.includes("Global Availability");

						const toggleScope = (scope: string) => {
							let next: string[] = [];
							if (scope === "Global Availability") {
								next = isGlobalSelected ? [] : ["Global Availability"];
							} else {
								next = selectedScopes.includes(scope)
									? selectedScopes.filter((id: string) => id !== scope)
									: [...selectedScopes, scope];
							}
							field.onChange(next);
						};

						return (
							<FormItemField error={fieldState.error?.message}>
								<div className="grid grid-cols-1 gap-4">
									{DEPLOYMENT_SCOPES.map((scope) => {
										const isSelected = selectedScopes.includes(scope);
										const isDisabled = isGlobalSelected && scope !== "Global Availability";

										return (
											<FormCheckbox
												key={scope}
												title={scope}
												checked={isSelected}
												disabled={isDisabled}
												onChange={() => toggleScope(scope)}
											/>
										);
									})}
								</div>
							</FormItemField>
						);
					}}
				/>
			</div>
		</FormSection>
	);
};
