import React from "react";
import { useFormContext, useFieldArray, Controller, useWatch } from "react-hook-form";
import { PlusCircle, Trash2, Timer, ChevronDown } from "lucide-react";
import type { RouterFormData } from "../../types/router-schema";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { useLLMModels } from "@/modules/settings/application/useSettings";
import { Button } from "@/shared/ui/ui/Button";
import { cn } from "@/shared/lib/utils";
import { FormTextField } from "@/shared/ui/form/FormTextField";

export const RouterPriorityChainSection = () => {
	const { control, register, formState: { errors } } = useFormContext<RouterFormData>();
	const strategy = useWatch({ control, name: "strategy" })?.toLowerCase() || "fallback";
	const isFallback = strategy.includes("fallback");
	const { fields, append, remove } = useFieldArray({
		control,
		name: "priority_chain",
	});

	const { data: models, isLoading: isLoadingModels } = useLLMModels();

	const modelOptions = React.useMemo(() => {
		if (!models) return [];
		return models.map(m => ({
			id: m.id,
			name: m.model_display_name,
			subtitle: `${m.model_tier} • ${m.model_context_window.toLocaleString()} ctx`
		}));
	}, [models]);

	const addStep = () => {
		append({ model_id: "", override_params: false, error_timeout: 30 });
	};

	return (
		<FormSection id="priority-chain" number={2} title="Modele w Routerze" variant="island">
			<div className="space-y-12 max-w-4xl">
				<div className="space-y-6">
					{fields.map((field, index) => {
						const itemError = errors.priority_chain?.[index]?.model_id;

						return (
							<div
								key={field.id}
								className={cn(
									"p-8 rounded-[32px] border bg-zinc-950/20 group transition-all hover:border-zinc-800",
									itemError ? "border-red-500/50" : "border-zinc-900"
								)}
							>
								<div className="flex items-center justify-between mb-8">
									<div className="flex flex-col gap-1">
										<div className="flex items-center gap-4">
											{isFallback && (
												<>
													<div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-mono font-bold text-zinc-500">
														{index + 1}
													</div>
													<div className="h-px w-8 bg-zinc-900" />
												</>
											)}
											<Controller
												control={control}
												name={`priority_chain.${index}.model_id`}
												render={({ field: selectField }) => (
													<FormSelect
														options={modelOptions}
														value={selectField.value}
														onChange={selectField.onChange}
														placeholder={isLoadingModels ? "Ładowanie modeli..." : "Wybierz model..."}
														className="min-w-[500px]"
														renderTrigger={(selected) => {
															// Find model name in current options to ensure correctly mapped display
															const currentModel = modelOptions.find(opt => opt.id === selectField.value);
															return (
																<div className="flex items-center justify-between gap-3 cursor-pointer group/trigger min-w-[500px]">
																	<span className={cn(
																		"text-xl font-black uppercase tracking-tight transition-colors",
																		selectField.value ? "text-white" : "text-zinc-600 group-hover/trigger:text-zinc-400"
																	)}>
																		{currentModel ? currentModel.name : (isLoadingModels ? "Ładowanie..." : "Wybierz model")}
																	</span>
																	<ChevronDown className="w-5 h-5 text-zinc-600 group-hover/trigger:text-zinc-400 transition-transform group-data-[state=open]:rotate-180" />
																</div>
															);
														}}
													/>
												)}
											/>
										</div>
										{itemError && (
											<span className={cn(
												"text-[10px] text-red-500 font-mono uppercase tracking-widest animate-pulse",
												isFallback ? "pl-24" : "pl-0"
											)}>
												{itemError.message}
											</span>
										)}
									</div>

									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => remove(index)}
										className="text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all h-10 w-10 opacity-0 group-hover:opacity-100"
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>

								<div className="flex items-center gap-8">
									<div className="flex items-center gap-4 group/opt">
										<Timer className="w-4 h-4 text-zinc-600 group-hover/opt:text-zinc-400 transition-colors" />
										<div className="flex items-center gap-2">
											<span className="text-[14px] font-mono tracking-widest text-zinc-500">On Error / Timeout &gt;</span>
											<div className="w-16">
												<FormTextField
													type="number"
													{...register(`priority_chain.${index}.error_timeout`, { valueAsNumber: true })}
													className="h-8 p-0 px-2 text-xs text-center rounded-lg border-zinc-900 bg-transparent focus:border-primary transition-colors"
												/>
											</div>
											<span className="text-[14px] font-mono tracking-widest text-zinc-600">s</span>
										</div>
									</div>
								</div>
							</div>
						);
					})}

					{fields.length === 0 && (
						<div className="p-16 border-2 border-dashed border-zinc-900 rounded-[40px] flex flex-col items-center justify-center text-center space-y-6 bg-zinc-950/20">
							<p className="text-sm text-zinc-600 max-w-xs leading-relaxed">
								Łańcuch priorytetów jest pusty. Dodaj pierwszy krok, aby zdefiniować zachowanie routera.
							</p>
							<Button type="button" variant="secondary" onClick={addStep} className="gap-2 px-8 h-12 rounded-2xl">
								<PlusCircle className="w-4 h-4" /> Dodaj Pierwszy Krok
							</Button>
						</div>
					)}

					{fields.length > 0 && (
						<Button
							type="button"
							variant="ghost"
							onClick={addStep}
							className="gap-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-2xl border border-zinc-900 px-8 h-12 transition-all w-full md:w-auto"
						>
							<PlusCircle className="w-4 h-4" /> Dodaj Krok
						</Button>
					)}
				</div>
			</div>
		</FormSection>
	);
};
