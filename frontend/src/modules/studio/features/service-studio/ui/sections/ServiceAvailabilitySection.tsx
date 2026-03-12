import { useFormContext } from "react-hook-form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormCheckbox } from "@/shared/ui/form/FormCheckbox";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormField } from "@/shared/ui/ui/Form";
import type { ServiceStudioFormData } from "../../types/service-schema";

const DEPLOYMENT_SCOPES = [
	"Global Availability",
	"Product Management",
	"Discovery Hub",
	"Design System",
	"Delivery & CI/CD",
	"Growth & Market",
] as const;

export const ServiceAvailabilitySection = () => {
	const { control, formState: { errors } } = useFormContext<ServiceStudioFormData>();
	
	return (
		<FormSection
			id="availability"
			number={4}
			title="Dostępność"
			description="Configure access rights for this service integration."
		>
			<FormField
				control={control}
				name="availability"
				render={({ field }) => {
					const selectedDomains = field.value || [];
					const isGlobalSelected = selectedDomains.includes("Global Availability");

					const toggleDomain = (domainId: string) => {
						let next: string[] = [];
						if (domainId === "Global Availability") {
							next = isGlobalSelected ? [] : ["Global Availability"];
						} else {
							next = selectedDomains.includes(domainId)
								? selectedDomains.filter((id: string) => id !== domainId)
								: [...selectedDomains, domainId];
						}
						field.onChange(next);
					};

					return (
						<FormItemField error={errors.availability?.message}>
							<div className="grid grid-cols-1 gap-4">
								{DEPLOYMENT_SCOPES.map((domain) => {
									const isSelected = selectedDomains.includes(domain);
									const isDisabled = isGlobalSelected && domain !== "Global Availability";

									return (
										<FormCheckbox
											key={domain}
											title={domain}
											checked={isSelected}
											disabled={isDisabled}
											onChange={() => toggleDomain(domain)}
										/>
									);
								})}
							</div>
						</FormItemField>
					);
				}}
			/>
		</FormSection>
	);
};
