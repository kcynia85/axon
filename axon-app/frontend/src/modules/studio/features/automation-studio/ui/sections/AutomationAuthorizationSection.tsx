import { FormField } from "@/shared/ui/ui/Form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { useFormContext } from "react-hook-form";
import type { AutomationFormData } from "../../types/automation-schema";

/**
 * AutomationAuthorizationSection: Configuration of access credentials and security.
 * Promoted to a separate section for better clarity.
 */
export const AutomationAuthorizationSection = () => {
	const { control } = useFormContext<AutomationFormData>();

	return (
		<FormSection
		        id="authorization"
		        number={3}
		        title="Authorization"
		        description="Configure access credentials and security"
		        variant="island"
		>

			<div className="space-y-12">
				<FormField
					control={control}
					name="connection.auth.type"
					render={({ field, fieldState }) => (
						<FormItemField label="Typ autoryzacji" error={fieldState.error?.message}>
							<FormSelect
								options={[
									{ id: "header", name: "Klucz w nagłówku (Header Auth)" },
									{ id: "bearer", name: "Bearer Token" },
									{ id: "none", name: "Brak" },
								]}
								value={field.value}
								onChange={field.onChange}
							/>
						</FormItemField>
					)}
				/>

				<FormField
					control={control}
					name="connection.auth.headerName"
					render={({ field, fieldState }) => (
						<FormItemField label="Nazwa Nagłówka" error={fieldState.error?.message}>
							<FormTextField {...field} placeholder="X-API-KEY" />
						</FormItemField>
					)}
				/>

				<FormField
					control={control}
					name="connection.auth.secret"
					render={({ field, fieldState }) => (
						<FormItemField label="Wartość (Sekret)" error={fieldState.error?.message}>
							<FormTextField
								{...field}
								type="password"
								placeholder="******"
							/>
						</FormItemField>
					)}
				/>
			</div>
		</FormSection>
	);
};
