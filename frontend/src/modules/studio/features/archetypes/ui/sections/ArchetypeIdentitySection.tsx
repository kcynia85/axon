import { FormSection } from "@/shared/ui/form/FormSection";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormTextarea } from "@/shared/ui/form/FormTextarea";
import { FormTagInput } from "@/shared/ui/form/FormTagInput";
import { FormField } from "@/shared/ui/ui/Form";
import { useFormContext } from "react-hook-form";
import type { ArchetypeFormValues } from "../../application/archetypeSchema";

export const ArchetypeIdentitySection = () => {
	const { control } = useFormContext<ArchetypeFormValues>();

	return (
		<FormSection id="IDENTITY" number={1} title="Identity">
			<div className="space-y-12">
				<FormField
					name="role"
					control={control}
					render={({ field, fieldState }) => (
						<FormItemField label="Rola" error={fieldState.error?.message}>
							<FormTextField 
								{...field} 
								placeholder="np. Senior Product Manager" 
								className="focus:placeholder:text-zinc-900 dark:focus:placeholder:text-white transition-colors"
								value={(field.value as string) || ""}
							/>
						</FormItemField>
					)}
				/>

				<FormField
					name="goal"
					control={control}
					render={({ field, fieldState }) => (
						<FormItemField label="Cel" error={fieldState.error?.message}>
							<FormTextField 
								{...field} 
								placeholder="Określ główny cel archetypu" 
								className="focus:placeholder:text-zinc-900 dark:focus:placeholder:text-white transition-colors"
								value={(field.value as string) || ""}
							/>
						</FormItemField>
					)}
				/>

				<FormField
					name="backstory"
					control={control}
					render={({ field, fieldState }) => (
						<FormItemField label="Backstory (Meta Prompt)" error={fieldState.error?.message}>
							<FormTextarea
								{...field}
								placeholder="Opisz pełną historię, kontekst i sposób działania..."
								className="min-h-[120px] leading-relaxed text-zinc-300 focus:text-white transition-opacity"
								value={(field.value as string) || ""}
							/>
						</FormItemField>
					)}
				/>

				<FormField
					name="keywords"
					control={control}
					render={({ field, fieldState }) => (
						<FormItemField label="Keywords" error={fieldState.error?.message}>
							<FormTagInput
								value={field.value || []}
								onChange={field.onChange}
								placeholder="Dodaj słowa kluczowe (enter aby zatwierdzić)..."
							/>
						</FormItemField>
					)}
				/>
			</div>
		</FormSection>
	);
};
