import React from "react";
import { useFormContext, useWatch, Controller } from "react-hook-form";
import { ProviderFormData } from "../../types/provider-schema";
import { cn } from "@/shared/lib/utils";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { FormRadio } from "@/shared/ui/form/FormRadio";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormSubheading } from "@/shared/ui/form/FormSubheading";
import type { FormSelectOption } from "@/shared/types/form/FormSelect.types";

const TOKENIZATION_OPTIONS = [
	{ id: "o200k_base", label: "OpenAI Modern (o200k_base)" },
	{ id: "cl100k_base", label: "OpenAI Classic (cl100k_base)" },
	{ id: "llama", label: "Llama / Mistral" },
	{ id: "legacy", label: "SentencePiece (Google/Legacy)" },
	{ id: "heuristic", label: "Heurystyka (Znak/4)" },
];

const BILLING_OPTIONS = [
	{ id: "zero_hardware", label: "Zero (Lokalny Sprzęt)", description: "Brak bezpośrednich kosztów API (tylko prąd i hardware)." },
	{ id: "manual_rate", label: "Manualna stawka", description: "Wprowadź własny cennik za 1M tokenów." },
];

export const ProviderTokenizationSection = () => {
	const { setValue, control } = useFormContext<ProviderFormData>();
	const values = useWatch({ control });

	const tokenizationOptions: FormSelectOption[] = TOKENIZATION_OPTIONS.map(opt => ({
		id: opt.id,
		name: opt.label
	}));

	return (
		<FormSection id="tokenization" number={3} title="Tokenization Strategy">
			<div className="space-y-12 max-w-3xl">
				{/* Tokenizer Strategy */}
				<div className="space-y-8">
					<FormSubheading>Strategia bazowa</FormSubheading>
					
					{values.provider_type === "meta" ? (
						<div className="space-y-10">
							<FormItemField
								label="System Status"
								hint="Dla Meta-Providerów Axon automatycznie wykrywa model i wybiera odpowiednią strategię. Możesz ustawić domyślny fallback poniżej."
							>
								<div className="flex items-center gap-3 p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl w-fit pr-8">
									<div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
									<span className="text-white font-bold font-mono text-[10px] tracking-[0.2em] uppercase">Auto-Detect Active</span>
								</div>
							</FormItemField>
							
							<FormItemField label="Fallback Strategy">
								<Controller
									control={control}
									name="tokenization_fallback"
									render={({ field }) => (
										<FormSelect
											options={tokenizationOptions.filter(opt => ["cl100k_base", "heuristic"].includes(opt.id))}
											value={field.value || ""}
											onChange={field.onChange}
											placeholder="Select fallback strategy..."
										/>
									)}
								/>
							</FormItemField>
						</div>
					) : (
						<FormItemField label="Tokenizer">
							<Controller
								control={control}
								name="tokenization_strategy"
								render={({ field }) => (
									<FormSelect
										options={tokenizationOptions}
										value={field.value || ""}
										onChange={field.onChange}
										placeholder="Select tokenization strategy..."
									/>
								)}
							/>
						</FormItemField>
					)}
				</div>

				{/* Local Billing Model */}
				{values.provider_type === "local" && (
					<div className="space-y-8 pt-6 border-t border-zinc-900">
						<FormSubheading>Model Rozliczeń</FormSubheading>
						<div className="grid grid-cols-1 gap-4">
							{BILLING_OPTIONS.map((opt) => (
								<FormRadio
									key={opt.id}
									title={opt.label}
									description={opt.description}
									checked={values.billing_model === opt.id}
									onChange={() => setValue("billing_model" as any, opt.id)}
								/>
							))}
						</div>
					</div>
				)}
			</div>
		</FormSection>
	);
};

