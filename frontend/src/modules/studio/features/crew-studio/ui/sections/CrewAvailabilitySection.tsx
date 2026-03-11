import { FormField } from "@/shared/ui/ui/Form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormCheckbox } from "@/shared/ui/form/FormCheckbox";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormSubheading } from "@/shared/ui/form/FormSubheading";
import { useFormContext } from "react-hook-form";
import { DEPLOYMENT_SCOPES } from "../../../agent-studio/types/agent-studio.constants";

/**
 * CrewAvailabilitySection: Manages crew visibility across different areas of the platform.
 * Implemented according to the Agent Studio standard.
 */
export const CrewAvailabilitySection = () => {
	const { control } = useFormContext();

	return (
		<FormSection id="availability" number={6} title="Availability">
			<div className="space-y-8">
				<FormSubheading>Deployment Scope</FormSubheading>

				<FormField
					control={control}
					name="availability_workspace"
					render={({ field }) => {
						const currentWorkspace = field.value || [];
						const isGlobalSelected = currentWorkspace.includes(
							"Global Availability",
						);

						return (
							<FormItemField>
								<div className="grid grid-cols-1 gap-4 max-w-4xl">
									{DEPLOYMENT_SCOPES.map((space) => {
										const isSelected = currentWorkspace.includes(space);
										const isDisabled =
											isGlobalSelected && space !== "Global Availability";

										return (
											<FormCheckbox
												key={space}
												title={space}
												checked={isSelected}
												disabled={isDisabled}
												onChange={() => {
													let next: string[] = [];
													if (space === "Global Availability") {
														next = isSelected ? [] : ["Global Availability"];
													} else {
														next = isSelected
															? currentWorkspace.filter(
																	(s: string) => s !== space,
																)
															: [...currentWorkspace, space];
													}
													field.onChange(next);
												}}
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
