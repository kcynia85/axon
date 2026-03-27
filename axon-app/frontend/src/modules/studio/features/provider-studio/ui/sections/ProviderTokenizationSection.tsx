import React from "react";
import { useFormContext, useWatch, Controller } from "react-hook-form";
import { ProviderFormData } from "../../types/provider-schema";
import { cn } from "@/shared/lib/utils";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { FormRadio } from "@/shared/ui/form/FormRadio";
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
				<div className="space-y-6">
					<h4 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Strategia bazowa</h4>
					{values.provider_type === "meta" ? (
						<div className="p-8 bg-zinc-950/50 border border-zinc-900 rounded-3xl space-y-6">
							<div className="space-y-4">
								<div className="flex items-center gap-3">
									<div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
									<span className="text-white font-bold">Auto-Detect</span>
								</div>
								<p className="text-sm text-zinc-500 max-w-lg">
									Dla Meta-Providerów Axon automatycznie wykrywa model i wybiera odpowiednią strategię. Możesz ustawić domyślny fallback poniżej.
								</p>
							</div>
							
							<div className="space-y-4 pt-2">
								<h5 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Fallback Strategy</h5>
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
							</div>
						</div>
					) : (
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
					)}
				</div>

				{/* Local Billing Model */}
				{values.provider_type === "local" && (
					<div className="space-y-6 pt-6 border-t border-zinc-900">
						<h4 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Model Rozliczeń</h4>
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

