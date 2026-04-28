import { useFormContext } from "react-hook-form";
import { FormField } from "@/shared/ui/ui/Form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { AutomationProviderFormData } from "../../types/automation-provider-schema";

export function AuthSection() {
	const { control } = useFormContext<AutomationProviderFormData>();

	return (
		<FormSection
			id="auth"
			number={2}
			title="Autoryzacja"
			description="Skonfiguruj połączenie z serwerem automatyzacji."
			variant="island"
		>
			<div className="space-y-8">
				<FormField
					control={control}
					name="base_url"
					render={({ field, fieldState }) => (
						<FormItemField label="Bazowy Adres URL (Opcjonalnie)" error={fieldState.error?.message}>
							<FormTextField {...field} placeholder="np. https://n8n.mojadomena.pl" />
						</FormItemField>
					)}
				/>

				<FormField
					control={control}
					name="auth_type"
					render={({ field, fieldState }) => (
						<FormItemField label="Typ autoryzacji" error={fieldState.error?.message}>
							<FormSelect
								options={[
									{ id: "HEADER", name: "Klucz w nagłówku (Header Auth)" },
									{ id: "BEARER", name: "Bearer Token" },
									{ id: "NONE", name: "Brak autoryzacji" },
								]}
								value={field.value}
								onChange={field.onChange}
							/>
						</FormItemField>
					)}
				/>

				<FormField
					control={control}
					name="auth_header_name"
					render={({ field, fieldState }) => (
						<FormItemField label="Nazwa nagłówka" error={fieldState.error?.message}>
							<FormTextField {...field} placeholder="Authorization" />
						</FormItemField>
					)}
				/>

				<FormField
					control={control}
					name="auth_secret"
					render={({ field, fieldState }) => (
						<FormItemField label="Wartość sekretu (Token/Klucz)" error={fieldState.error?.message}>
							<FormTextField {...field} type="password" placeholder="••••••••" />
						</FormItemField>
					)}
				/>
			</div>
		</FormSection>
	);
}
