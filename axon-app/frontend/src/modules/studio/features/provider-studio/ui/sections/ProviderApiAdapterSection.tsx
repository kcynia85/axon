import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { ProviderFormData } from "../../types/provider-schema";
import { Button } from "@/shared/ui/ui/Button";
import { Trash2, PlusCircle } from "lucide-react";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormTextField } from "@/shared/ui/form/FormTextField";

export const ProviderApiAdapterSection = () => {
	const { control, register, formState: { errors } } = useFormContext<ProviderFormData>();
	const { fields, append, remove } = useFieldArray({
		control,
		name: "api_adapter_mapping",
	});

	const addMapping = () => {
		append({ axon_key: "", provider_key: "" });
	};

	return (
		<FormSection 
			id="adapter" 
			number={5} 
			title="Mapowanie Kluczy API (Adapter)"
			description="Zdefiniuj w jaki sposób klucze z Axon mają być mapowane na klucze akceptowane przez API dostawcy."
			variant="island"
		>
			<div className="space-y-10 w-full">
				{fields.length > 0 ? (
					<div className="space-y-8">
						<div className="grid grid-cols-[1fr_1fr_48px] gap-8 px-0 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600">
							<div>Axon Key</div>
							<div>Provider API Key</div>
							<div></div>
						</div>
						{fields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-[1fr_1fr_48px] gap-8 items-start group">
								<FormItemField error={(errors.api_adapter_mapping as any)?.[index]?.axon_key?.message}>
									<FormTextField 
										{...register(`api_adapter_mapping.${index}.axon_key` as any)}
										placeholder="np. max_tokens"
										className="h-12"
									/>
								</FormItemField>
								<FormItemField error={(errors.api_adapter_mapping as any)?.[index]?.provider_key?.message}>
									<FormTextField 
										{...register(`api_adapter_mapping.${index}.provider_key` as any)}
										placeholder="np. max_completion_tokens"
										className="h-12"
									/>
								</FormItemField>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => remove(index)}
									className="text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all h-12 w-12"
								>
									<Trash2 className="w-5 h-5" />
								</Button>
							</div>
						))}
					</div>
				) : (
					<div className="p-16 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center space-y-6 bg-zinc-950/20">
						<p className="text-sm text-zinc-600 max-w-xs leading-relaxed">Nie zdefiniowano jeszcze żadnego mapowania kluczy dla tego adaptera.</p>
						<Button type="button" variant="secondary" onClick={addMapping} className="gap-2 px-8 h-12 rounded-2xl">
							<PlusCircle className="w-4 h-4" /> Dodaj Pierwsze Mapowanie
						</Button>
					</div>
				)}

				{fields.length > 0 && (
					<Button 
						type="button" 
						variant="ghost" 
						onClick={addMapping} 
						className="gap-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-2xl border border-white/5 px-8 h-12 transition-all mt-4"
					>
						<PlusCircle className="w-4 h-4" /> Dodaj Kolejne Mapowanie
					</Button>
				)}
			</div>
		</FormSection>
	);
};
