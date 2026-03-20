import { FormField } from "@/shared/ui/ui/Form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormTextarea } from "@/shared/ui/form/FormTextarea";
import { FormTagInput } from "@/shared/ui/form/FormTagInput";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { AvatarGallerySlider } from "../AvatarGallerySlider";
import type { IdentitySectionProps } from "../../types/sections/identity.types";
import { useIdentitySection } from "../../application/hooks/sections/useIdentitySection";
import { IDENTITY_FIELDS } from "../../types/agent-studio.constants";

export const IdentitySection = (props: IdentitySectionProps) => {
	const { control, syncDraft } = useIdentitySection(props);

	return (
		<FormSection id="IDENTITY" number={1} title="Identity">
			<div className="space-y-12">
				<FormField
					control={control}
					name="agent_visual_url"
					render={({ field }) => (
						<FormItemField>
							<AvatarGallerySlider
								value={field.value}
								onChange={(url) => {
									field.onChange(url);
									syncDraft();
								}}
							/>
						</FormItemField>
					)}
				/>

				{IDENTITY_FIELDS.map(({ name, label, placeholder, type }) => (
					<FormField
						key={name}
						control={control}
						name={name}
						render={({ field, fieldState }) => (
							<FormItemField label={label} error={fieldState.error?.message}>
								{type === "text" ? (
									<FormTextField
										{...field}
										placeholder={placeholder}
										className="focus:placeholder:text-zinc-900 dark:focus:placeholder:text-white transition-colors"
										value={(field.value as string) || ""}
										onBlur={syncDraft}
									/>
								) : (
									<FormTextarea
										{...field}
										placeholder={placeholder}
										className="min-h-[120px] leading-relaxed text-zinc-300 focus:text-white transition-opacity"
										value={(field.value as string) || ""}
										onBlur={syncDraft}
									/>
								)}
							</FormItemField>
						)}
					/>
				))}

				<FormField
					control={control}
					name="agent_keywords"
					render={({ field }) => (
						<FormItemField label="Keywords">
							<FormTagInput
								value={field.value || []}
								onChange={(val) => {
									field.onChange(val);
									syncDraft();
								}}
								onBlur={syncDraft}
							/>
						</FormItemField>
					)}
				/>
			</div>
		</FormSection>
	);
};
