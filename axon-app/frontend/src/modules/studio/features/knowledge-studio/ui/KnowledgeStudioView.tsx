"use client";

import React, { useRef } from "react";
import { FormProvider } from "react-hook-form";
import { X, Plus, Wand2, RefreshCw, ChevronDown, Loader2 } from "lucide-react";
import { StudioLayout } from "@/modules/studio/ui/layout/StudioLayout";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { Button } from "@/shared/ui/ui/Button";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormSubheading } from "@/shared/ui/form/FormSubheading";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { FormSelectedFile } from "@/shared/ui/form/FormSelectedFile";
import { KnowledgeStudioViewProps } from "../types/knowledge-studio.types";
import { KnowledgeStudioSectionNav } from "./KnowledgeStudioSectionNav";
import { RagDebugger } from "./RagDebugger";
import { KnowledgeResourceStatusCard } from "./KnowledgeResourceStatusCard";
import { FormFileUpload } from "@/shared/ui/form/FormFileUpload";
import { FormKeyValueTable } from "@/shared/ui/form/FormKeyValueTable";
import { cn } from "@/shared/lib/utils";

/**
 * KnowledgeStudioView: Pure view component for the knowledge design experience.
 * Adheres to Pure View principle.
 * Standard: Pure View pattern, 0% logic, 0% useEffect.
 */
export const KnowledgeStudioView = ({
	data,
	form,
	activeSection,
	strategies = [],
	isLoadingStrategies,
	onDataChange,
	onSave,
	onCancel,
	onAutoTag,
	onSelectFile,
	scrollToSection,
	setCanvasContainerReference,
}: KnowledgeStudioViewProps) => {

	const fileInputReference = useRef<HTMLInputElement>(null);

	const strategyOptions = strategies.map((strategy) => ({
		id: strategy.id,
		name: strategy.strategy_name,
		subtitle: strategy.strategy_chunking_method,
	}));

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			onSelectFile(file);
			// Reset input value to allow re-selection
			event.target.value = "";
		}
	};

	const triggerFileInput = () => {
		fileInputReference.current?.click();
	};

	return (
		<FormProvider {...form}>
			<div className="h-full w-full outline-none" tabIndex={0}>
				<StudioLayout
					canvasRef={setCanvasContainerReference}
					studioLabel="Resource"
					exitButton={
						<Button
							variant="ghost"
							size="icon"
							onClick={onCancel}
							className="hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all h-9 w-9"
						>
							<X className="w-4 h-4" />
						</Button>
					}
					navigator={
						<KnowledgeStudioSectionNav
							activeSection={activeSection}
							onSectionClick={scrollToSection}
							data={data}
						/>
					}
					poster={
						<div className="space-y-8 w-full">
							{data.id && <KnowledgeResourceStatusCard chunksCount={4} />}
							<RagDebugger fileName={data.fileName} strategy={data.chunkType} />
						</div>
					}
					canvas={
						<div className="px-16 pb-48 pt-20 w-full">
							<form
								className="space-y-16 w-full"
								onSubmit={(event) => event.preventDefault()}
							>
								{/* 1. Wybierz Zasób */}
								<FormSection id="RESOURCE" number={1} title="Wybierz Zasób" variant="island">
									<div className="space-y-6">
										<input
											type="file"
											ref={fileInputReference}
											onChange={handleFileChange}
											accept=".md,.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/markdown"
											className="hidden"
										/>

										{data.fileName ? (
											<div className="space-y-6">
												<FormSelectedFile
													fileName={data.fileName}
													fileSize={data.fileSize}
													onRemove={() =>
														onDataChange({ fileName: null, fileSize: null })
													}
												/>

												<div className="flex gap-4">
													<Button
														type="button"
														variant="secondary"
														size="sm"
														onClick={triggerFileInput}
														className="font-mono uppercase tracking-[0.2em] text-[10px] h-10 px-6 transition-all"
													>
														Zmień
													</Button>
													<Button
														type="button"
														variant="ghost"
														size="sm"
														onClick={() => {}}
														className="text-zinc-500 hover:text-white hover:bg-zinc-900 font-mono uppercase tracking-[0.2em] text-[10px] px-6 h-10 rounded-xl border border-transparent hover:border-zinc-800 transition-all"
													>
														Podgląd
													</Button>
												</div>
											</div>
										) : (
											<FormFileUpload onClick={triggerFileInput} />
										)}
									</div>
								</FormSection>

								{/* 2. Metadane (JSONB) */}
								<FormSection id="METADATA" number={2} title="Metadane (JSONB)" variant="island">
									<div className="space-y-8">
										<Button
											type="button"
											onClick={onAutoTag}
											variant="secondary"
											size="sm"
											className="gap-2 h-10 px-6 rounded-xl font-mono uppercase tracking-[0.2em] text-[10px] transition-all"
										>
											<Wand2 className="w-3.5 h-3.5" />
											Auto-Taguj (AI)
										</Button>

										<FormKeyValueTable
											items={data.metadata}
											onChange={(newMetadata) =>
												onDataChange({ metadata: newMetadata })
											}
											keyPlaceholder="key"
											valuePlaceholder="value"
											addPlaceholder="+ Dodaj Pole"
										/>
									</div>
								</FormSection>

								{/* 3. Strategia Przetwarzania */}
								<FormSection
									id="STRATEGY"
									number={3}
									title="Strategia Przetwarzania"
									description="Wybierz typ przetwarzania zasobu."
									variant="island"
								>
									<div className="space-y-12">
										<div className="space-y-6">
											<FormSubheading>Chunk Types</FormSubheading>
											<FormItemField>
												<FormSelect
													options={strategyOptions}
													value={data.chunkType}
													onChange={(value) => {
														const selected = strategyOptions.find(
															(option) => option.id === value,
														);
														const newValue =
															(selected?.name as string) || (value as string);
														onDataChange({ chunkType: newValue });
													}}
													placeholder={
														isLoadingStrategies
															? "Ładowanie strategii..."
															: "Wybierz strategię chunkingu..."
													}
													renderTrigger={(selected) => (
														<div className="flex items-center gap-3 cursor-pointer group/trigger w-full border border-zinc-800 bg-zinc-900/50 p-4 rounded-xl hover:border-zinc-700 transition-colors">
															<div className="flex-1 text-left">
																<div
																	className={cn(
																		"text-lg font-mono transition-colors",
																		selected.length > 0
																		? "text-white"
																		: "text-zinc-600 group-hover/trigger:text-zinc-400",
																	)}
																>
																{isLoadingStrategies
																	? "Ładowanie..."
																	: selected.length > 0
																	? selected[0].name
																	: "Wybierz strategię..."}
																</div>
																{selected.length > 0 &&
																	selected[0].subtitle && (
																		<div className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mt-0.5">
																		{selected[0].subtitle}
																		</div>
																	)}
															</div>
															{isLoadingStrategies ? (
																<Loader2 className="w-5 h-5 animate-spin text-zinc-600" />
															) : (
																<ChevronDown className="w-5 h-5 text-zinc-600 group-hover/trigger:text-zinc-400" />
															)}
														</div>
													)}
												/>
											</FormItemField>
										</div>
									</div>
								</FormSection>

								{/* 4. Przypisanie do Hubów */}
								<FormSection
									id="HUBS"
									number={4}
									title="Przypisanie do Hubów"
									description="Przypisz zasób do odpowiednich hubów dla lepszej kategoryzacji."
									variant="island"
								>
									<div className="space-y-6">
										<FormItemField>
											<FormSelect
												options={[
													{ name: "Delivery", id: "delivery" },
													{ name: "Research", id: "research" },
													{ name: "Internal Wiki", id: "internal-wiki" },
													{ name: "Onboarding", id: "onboarding" },
												]}
												value={data.hubs}
												onChange={(value) => {
													onDataChange({ hubs: value as string[] });
												}}
												multiple
												placeholder="Wybierz Huby..."
												searchPlaceholder="Szukaj hubów..."
											/>
										</FormItemField>
									</div>
								</FormSection>
							</form>
						</div>
					}

					footer={
						<div className="flex items-center gap-4 justify-end w-full">
							<Button
								type="button"
								variant="ghost"
								size="lg"
								onClick={onCancel}
								className="hover:bg-zinc-900 h-11 font-mono text-base tracking-widest px-6 text-zinc-500 hover:text-white transition-all"
							>
								Anuluj
							</Button>
							<ActionButton
								label={data.id ? "Re-indeksuj" : "Zapisz i Indeksuj"}
								icon={data.id ? RefreshCw : Plus}
								onClick={onSave}
							/>
						</div>
					}
				/>
			</div>
		</FormProvider>
	);
};
