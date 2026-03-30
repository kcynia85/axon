import React, { useState } from "react";
import { useFormContext, useWatch, Controller, useFieldArray } from "react-hook-form";
import { ProviderFormData } from "../../types/provider-schema";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormSubheading } from "@/shared/ui/form/FormSubheading";
import { FormRadio } from "@/shared/ui/form/FormRadio";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { NativeAccordion } from "@/shared/ui/ui/NativeAccordion";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";

const PROTOCOL_OPTIONS = [
	{ id: "openai", name: "OpenAI Compatible" },
	{ id: "anthropic", name: "Anthropic Claude" },
	{ id: "google", name: "Google Gemini (REST)" },
	{ id: "custom", name: "Custom / Agnostic" },
];

interface ProviderAuthSectionProps {
	providerId?: string;
}

export const ProviderAuthSection = ({ providerId }: ProviderAuthSectionProps) => {
	const { register, control, formState: { errors } } = useFormContext<ProviderFormData>();
	const providerType = useWatch({ control, name: "provider_type" });
	const [showPassword, setShowPassword] = useState(false);

	const { fields, append, remove } = useFieldArray({
		control,
		name: "custom_headers"
	});

	return (
		<FormSection 
			id="auth" 
			number={1} 
			title="Auth & Connection"
		>
			<div className="space-y-12 max-w-2xl">
				{/* Basic Info */}
				<div className="grid grid-cols-1 gap-10">
					<FormItemField
						label="Nazwa wyświetlana"
						error={errors.display_name?.message}
						hint="Przyjazna nazwa widoczna w systemie."
					>
						<FormTextField
							{...register("display_name")}
							placeholder="np. OpenAI"
						/>
					</FormItemField>

					<FormItemField
						label="Protokół Komunikacji"
						hint="Format zapytań i odpowiedzi używany przez dostawcę."
					>
						<Controller
							control={control}
							name="protocol"
							render={({ field }) => (
								<FormSelect
									options={PROTOCOL_OPTIONS}
									value={field.value || "openai"}
									onChange={field.onChange}
								/>
							)}
						/>
					</FormItemField>

					<FormItemField
						label="Base URL (Endpoint)"
						error={errors.base_url?.message}
						hint="Adres serwera API."
					>
						<FormTextField
							{...register("base_url")}
							placeholder="https://api.openai.com/v1"
						/>
					</FormItemField>
				</div>

				{/* API Key */}
				<FormItemField
					label={providerType === "local" ? "Klucz API (Opcjonalny)" : "Klucz API (Globalny)"}
					error={errors.api_key?.message}
					hint={providerType === "local" ? "Pozostaw puste dla braku autoryzacji." : "Klucz używany do wszystkich połączeń."}
				>
					<div className="relative">
						<FormTextField
							{...register("api_key")}
							type={showPassword ? "text" : "password"}
							placeholder={providerType === "local" ? "Brak klucza (domyślnie)" : "sk-..."}
							className="pr-12"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
						>
							{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
						</button>
					</div>
				</FormItemField>

				{/* Custom Headers Management */}
				<div className="p-8 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-8">
					<div className="flex items-center justify-between">
						<FormSubheading>Nagłówki Niestandardowe</FormSubheading>
						<Button 
							type="button" 
							variant="outline" 
							size="sm"
							onClick={() => append({ key: "", value: "" })}
							className="h-8 text-[10px] font-bold uppercase tracking-widest gap-2"
						>
							<Plus className="w-3 h-3" /> Dodaj Nagłówek
						</Button>
					</div>

					<div className="space-y-4">
						{fields.length === 0 && (
							<div className="text-center py-6 border border-dashed border-zinc-800 rounded-2xl">
								<p className="text-[10px] text-zinc-500 font-mono uppercase tracking-tight">Brak dodatkowych nagłówków</p>
							</div>
						)}
						{fields.map((field, index) => (
							<div key={field.id} className="flex gap-3 items-start animate-in fade-in slide-in-from-top-1 duration-200">
								<div className="flex-1">
									<FormTextField
										{...register(`custom_headers.${index}.key` as const)}
										placeholder="Nazwa (np. anthropic-version)"
										className="bg-zinc-900/50 border-zinc-800"
									/>
								</div>
								<div className="flex-[1.5]">
									<FormTextField
										{...register(`custom_headers.${index}.value` as const)}
										placeholder="Wartość"
										className="bg-zinc-900/50 border-zinc-800"
									/>
								</div>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => remove(index)}
									className="text-zinc-500 hover:text-red-500 mt-1 h-10 w-10 shrink-0"
								>
									<Trash2 className="w-4 h-4" />
								</Button>
							</div>
						))}
					</div>
				</div>

				{/* Technical ID (moved down) */}
				<FormItemField
					label="Unikalne ID Dostawcy"
					error={errors.provider_id?.message}
					hint="Techniczny identyfikator (openai, anthropic, ollama itp)."
				>
					<FormTextField
						{...register("provider_id")}
						placeholder="openai"
					/>
				</FormItemField>

				{/* Advanced Auth Config Toggle */}
				<div className="pt-4">
					<NativeAccordion title="Zaawansowana Autoryzacja (SSoT)">
						<div className="mt-8 space-y-10">
							<div className="grid grid-cols-1 gap-8">
								<FormItemField
									label="Nazwa nagłówka Auth"
									error={errors.auth_header_name?.message}
									hint="Nagłówek przesyłający klucz (np. Authorization, x-api-key)."
								>
									<FormTextField
										{...register("auth_header_name")}
										placeholder="Authorization"
									/>
								</FormItemField>

								<FormItemField
									label="Prefix wartości nagłówka"
									error={errors.auth_header_prefix?.message}
									hint="Prefix przed kluczem (np. 'Bearer ' - pamiętaj o spacji!)."
								>
									<FormTextField
										{...register("auth_header_prefix")}
										placeholder="Bearer "
									/>
								</FormItemField>

								<FormItemField
									label="Miejsce wstrzyknięcia klucza"
									error={errors.api_key_placement?.message}
									hint="Gdzie Axon powinien umieścić klucz API."
								>
									<Controller
										control={control}
										name="api_key_placement"
										render={({ field }) => (
											<div className="grid grid-cols-1 gap-4">
												<FormRadio
													title="NAGŁÓWEK (HTTP Header)"
													checked={field.value === "header"}
													onChange={() => field.onChange("header")}
												/>
												<FormRadio
													title="URL (Query Params)"
													checked={field.value === "query"}
													onChange={() => field.onChange("query")}
												/>
											</div>
										)}
									/>
								</FormItemField>
							</div>
						</div>
					</NativeAccordion>
				</div>
			</div>
		</FormSection>
	);
};
