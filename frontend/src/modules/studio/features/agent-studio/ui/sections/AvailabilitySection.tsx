import { FormField } from "@/shared/ui/ui/Form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormCheckbox } from "@/shared/ui/form/FormCheckbox";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormSubheading } from "@/shared/ui/form/FormSubheading";
import { DEPLOYMENT_SCOPES } from "../../types/agent-studio.constants";
import type { AvailabilitySectionProps } from "../../types/sections/availability.types";
import { useAvailabilitySection } from "../../application/hooks/sections/useAvailabilitySection";

export const AvailabilitySection = (props: AvailabilitySectionProps) => {
	const { control, syncDraft } = useAvailabilitySection(props);

	return (
		<FormSection id="AVAILABILITY" number={6} title="Availability">
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
								<div className="grid grid-cols-1 gap-4">
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
													syncDraft();
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
