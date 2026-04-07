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
import { FormLabel } from "@/shared/ui/ui/Form";
import { cn } from "@/shared/lib/utils";

const PROTOCOL_OPTIONS = [
	{ id: "openai", name: "OpenAI Compatible" },
	{ id: "anthropic", name: "Anthropic Claude" },
	{ id: "google", name: "Google Gemini (REST)" },
	{ id: "custom", name: "Custom / Agnostic" },
];

const SCRAPER_STRATEGY_OPTIONS = [
    { id: "auto", name: "Auto-detect" },
    { id: "litellm_fallback", name: "LiteLLM Registry (Fallback)" },
    { id: "openai_spa", name: "OpenAI (SPA)" },
    { id: "anthropic_table", name: "Table Scraping (Anthropic, DeepSeek, etc.)" }
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
			variant="island"
		>
			<div className="space-y-12 w-full">
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
						label="Unikalne ID Dostawcy"
						error={errors.provider_id?.message}
						hint="Techniczny identyfikator (openai, anthropic, ollama itp)."
					>
						<FormTextField
							{...register("provider_id")}
							placeholder="openai"
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
						hint="Bazowy adres API (bez końcówek /chat/completions itp)."
					>
						<FormTextField
							{...register("base_url")}
							placeholder="https://api.openai.com/v1"
						/>
					</FormItemField>

					<FormItemField
						label="Ścieżka Generowania (Inference Path)"
						error={errors.inference_path?.message}
						hint="Końcówka URL służąca do generowania treści (np. /chat/completions)."
					>
						<FormTextField
							{...register("inference_path")}
							placeholder="/chat/completions"
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

				{/* Custom Headers Management - Flat Panoramic style */}
				<div className="space-y-6 mt-10">
					<div className="flex items-center justify-between">
						<FormLabel className="text-lg font-mono text-zinc-200 block mb-0">
							Nagłówki Niestandardowe
						</FormLabel>
						<Button 
							type="button" 
							variant="ghost" 
							size="sm"
							onClick={() => append({ key: "", value: "" })}
							className="h-8 px-4 text-[10px] font-bold uppercase tracking-[0.15em] gap-2 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-white/5 rounded-lg transition-all"
						>
							<Plus className="w-3 h-3" /> Dodaj Nagłówek
						</Button>
					</div>

					<div className="space-y-4 pt-2">
						{fields.length === 0 && (
							<div className="text-center py-10 border border-dashed border-white/15 rounded-3xl bg-zinc-800/40">
								<p className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.1em]">Brak zdefiniowanych nagłówków dodatkowych</p>
							</div>
						)}
						{fields.map((field, index) => (
							<div key={field.id} className="flex gap-4 items-start animate-in fade-in slide-in-from-top-1 duration-200">
								<div className="flex-1">
									<FormTextField
										{...register(`custom_headers.${index}.key` as const)}
										placeholder="Nazwa (np. anthropic-version)"
										className="h-12"
									/>
								</div>
								<div className="flex-[1.5]">
									<FormTextField
										{...register(`custom_headers.${index}.value` as const)}
										placeholder="Wartość"
										className="h-12"
									/>
								</div>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => remove(index)}
									className="text-zinc-600 hover:text-red-500 hover:bg-red-500/10 h-12 w-12 shrink-0 rounded-lg"
								>
									<Trash2 className="w-5 h-5" />
								</Button>
							</div>
						))}
					</div>
				</div>

				{/* Advanced Configuration Combined */}
				<div className="pt-4">
					<NativeAccordion title="Zaawansowane">
						<div className="mt-8 space-y-20 pb-12">
							{/* Advanced Auth Group - Flat style */}
							<div className="space-y-0">
								<FormSubheading className="font-bold mb-2">
									Parametry Autoryzacji
								</FormSubheading>
								<div className="h-px bg-white/10 w-full mb-12" />
								
								<div className="grid grid-cols-1 gap-12">
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

							{/* Discovery & Model Mapping Group - Flat style */}
							<div className="space-y-0 pt-4">
								<FormSubheading className="font-bold mb-2">
									Discovery & Model Mapping (SSoT)
								</FormSubheading>
								<div className="h-px bg-white/10 w-full mb-12" />

								<div className="space-y-12">
									<div className="space-y-12">
										<FormItemField 
											label="Ścieżka do listy modeli" 
											error={errors.discovery_json_path?.message}
											hint="Klucz w JSON, pod którym znajduje się tablica modeli (np. 'data' dla OpenAI, 'models' dla Google)."
										>
											<FormTextField 
												{...register("discovery_json_path")}
												placeholder="data"
											/>
										</FormItemField>

										<FormItemField 
											label="Klucz ID modelu" 
											error={errors.discovery_id_key?.message}
											hint="Unikalny identyfikator (np. 'id', 'name')."
										>
											<FormTextField 
												{...register("discovery_id_key")}
												placeholder="id"
											/>
										</FormItemField>

										<FormItemField 
											label="Klucz Nazwy modelu" 
											error={errors.discovery_name_key?.message}
											hint="Nazwa wyświetlana (np. 'name', 'displayName')."
										>
											<FormTextField 
												{...register("discovery_name_key")}
												placeholder="name"
											/>
										</FormItemField>

										<FormItemField 
											label="Klucz Context Window" 
											error={errors.discovery_context_key?.message}
											hint="Limit tokenów (np. 'context_length', 'inputTokenLimit')."
										>
											<FormTextField 
												{...register("discovery_context_key")}
												placeholder="context_length"
											/>
										</FormItemField>
										<FormSubheading className="font-bold mb-2">
											Endpoint i mapowanie Cenników
										</FormSubheading>
										<div className="h-px bg-white/10 w-full mb-12" />
										

										<FormItemField 
											label="Pricing Endpoint URL (Opcjonalny)" 
											error={errors.discovery_pricing_endpoint?.message}
											hint="Pozostaw puste, jeśli endpoint modeli  URL + ścieżka do modeli) zawiera również informacje o cenach."
										>
											<FormTextField 
												{...register("discovery_pricing_endpoint")}
												placeholder="np. https://openrouter.ai/api/v1/models"
											/>
										</FormItemField>

										<div className="grid grid-cols-1 gap-6">
											<FormItemField 
												label="Klucz cennika Input" 
												error={errors.discovery_pricing_input_key?.message}
												hint="Np. 'pricing.prompt' lub 'pricing.input'"
											>
												<FormTextField 
													{...register("discovery_pricing_input_key")}
													placeholder="pricing.prompt"
												/>
											</FormItemField>

											<FormItemField 
												label="Klucz cennika Output" 
												error={errors.discovery_pricing_output_key?.message}
												hint="Np. 'pricing.completion' lub 'pricing.output'"
											>
												<FormTextField 
													{...register("discovery_pricing_output_key")}
													placeholder="pricing.completion"
												/>
											</FormItemField>
										</div>
									</div>

                                    {/* Algorithmic Scraping Configuration */}
									<div className="space-y-0 pt-4">
										<FormSubheading className="font-bold mb-2">
											Algorytmiczne Scrapowanie Cenników (Background Job)
										</FormSubheading>
										<div className="h-px bg-white/10 w-full mb-12" />
										
										<div className="space-y-12">
											<FormItemField 
												label="URL Strony Cennikowej" 
												error={errors.pricing_page_url?.message}
												hint="Strona internetowa z oficjalnym cennikiem (będzie skanowana algorytmicznie bez użycia modeli LLM)."
											>
												<FormTextField 
													{...register("pricing_page_url")}
													placeholder="np. https://openai.com/api/pricing/"
												/>
											</FormItemField>

											<FormItemField 
												label="Strategia Scrapera" 
												error={errors.pricing_scraper_strategy?.message}
												hint="Wybierz heurystykę odpowiednią do struktury strony z cennikiem."
											>
                                                <Controller
                                                    control={control}
                                                    name="pricing_scraper_strategy"
                                                    render={({ field }) => (
                                                        <FormSelect
                                                            options={SCRAPER_STRATEGY_OPTIONS}
                                                            value={field.value || "auto"}
                                                            onChange={field.onChange}
                                                        />
                                                    )}
                                                />
											</FormItemField>
										</div>
									</div>

									{/* Inference Response Mapping Group - Flat style */}
									<div className="space-y-0 pt-4">
										<FormSubheading className="font-bold mb-2">
											Inference Response Mapping
										</FormSubheading>
										<div className="h-px bg-white/10 w-full mb-12" />
										
										<div className="space-y-12">
											<FormItemField 
												label="Ścieżka do treści odpowiedzi" 
												error={errors.response_content_path?.message}
												hint="Kropkowa notacja ścieżki do tekstu (np. 'choices.0.message.content' dla OpenAI, 'content.0.text' dla Anthropic)."
											>
												<FormTextField 
													{...register("response_content_path")}
													placeholder="choices.0.message.content"
												/>
											</FormItemField>

											<FormItemField 
												label="Ścieżka do błędu" 
												error={errors.response_error_path?.message}
												hint="Skąd Axon ma pobrać opis błędu w przypadku niepowodzenia (np. 'error.message')."
											>
												<FormTextField 
													{...register("response_error_path")}
													placeholder="error.message"
												/>
											</FormItemField>
										</div>
									</div>
								</div>
							</div>
						</div>
					</NativeAccordion>
				</div>
			</div>
		</FormSection>
	);
};

