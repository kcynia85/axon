import { useFormContext } from "react-hook-form";
import { FormField } from "@/shared/ui/ui/Form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormCheckbox } from "@/shared/ui/form/FormCheckbox";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormSubheading } from "@/shared/ui/form/FormSubheading";
import { DEPLOYMENT_SCOPES } from "../../types/template-studio.constants";

export const AvailabilitySection = () => {
	const { control } = useFormContext();

	return (
		<FormSection 
			id="availability" 
			number={5} 
			title="Availability"
		>
			<div className="space-y-8">
				<FormField
					control={control}
					name="availability_workspace"
					render={({ field }) => {
						const currentWorkspace = field.value || [];
						const isGlobalSelected = currentWorkspace.includes("Global");

						return (
							<FormItemField>
								<div className="grid grid-cols-1 gap-4">
									{DEPLOYMENT_SCOPES.map((space) => {
										const isSelected = currentWorkspace.includes(space);
										const isDisabled = isGlobalSelected && space !== "Global";

										return (
											<FormCheckbox
												key={space}
												title={space}
												checked={isSelected}
												disabled={isDisabled}
												onChange={() => {
													let next: string[] = [];
													if (space === "Global") {
														next = isSelected ? [] : ["Global"];
													} else {
														next = isSelected
															? currentWorkspace.filter((s: string) => s !== space)
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
