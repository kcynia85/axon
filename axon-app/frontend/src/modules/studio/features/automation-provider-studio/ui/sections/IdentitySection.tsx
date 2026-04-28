import { useFormContext } from "react-hook-form";
import { FormField } from "@/shared/ui/ui/Form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { AutomationProviderFormData } from "../../types/automation-provider-schema";

export function IdentitySection() {
	const { control } = useFormContext<AutomationProviderFormData>();

	return (
		<FormSection
			id="identity"
			number={1}
			title="Tożsamość Dostawcy"
			description="Podaj nazwę i wybierz platformę automatyzacji."
			variant="island"
		>
			<div className="space-y-8">
				<FormField
					control={control}
					name="platform"
					render={({ field, fieldState }) => (
						<FormItemField label="Platforma" error={fieldState.error?.message}>
							<FormSelect
								options={[
									{ id: "N8N", name: "n8n" },
									{ id: "MAKE", name: "Make" },
									{ id: "ZAPIER", name: "Zapier" },
									{ id: "CUSTOM", name: "Niestandardowa (Webhook)" },
								]}
								value={field.value}
								onChange={field.onChange}
							/>
						</FormItemField>
					)}
				/>
			</div>
		</FormSection>
	);
}
