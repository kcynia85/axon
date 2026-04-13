"use client";

import React, { useRef } from "react";
import { FormProvider } from "react-hook-form";
import { X, Plus, Wand2, RefreshCw, ChevronDown, Loader2, Upload } from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
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
import { FormTagInput } from "@/shared/ui/form/FormTagInput";
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
	vectorStores = [],
	isLoadingVectorStores,
	hubs = [],
	isLoadingHubs,
	isSimulating,
	onDataChange,
	onSave,
	onCancel,
	onAutoTag,
	onSelectFile,
	scrollToSection,
	setCanvasContainerReference,
}: KnowledgeStudioViewProps) => {

	const fileInputReference = useRef<HTMLInputElement>(null);
    const [isOver, setIsOver] = React.useState(false);
    const [isGlobalDragging, setIsGlobalDragging] = React.useState(false);

    // Global drag listener
    React.useEffect(() => {
        const onDragOver = (e: DragEvent) => {
            e.preventDefault();
            setIsGlobalDragging(true);
        };
        const onDragLeave = (e: DragEvent) => {
            e.preventDefault();
            setIsGlobalDragging(false);
        };
        const onDrop = (e: DragEvent) => {
            e.preventDefault();
            setIsGlobalDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                onSelectFile(e.dataTransfer.files[0]);
            }
        };

        window.addEventListener("dragover", onDragOver);
        window.addEventListener("dragleave", onDragLeave);
        window.addEventListener("drop", onDrop);

        return () => {
            window.removeEventListener("dragover", onDragOver);
            window.removeEventListener("dragleave", onDragLeave);
            window.removeEventListener("drop", onDrop);
        };
    }, [onSelectFile]);

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
                {isGlobalDragging && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm border-2 border-primary animate-in fade-in">
                        <div className="text-center">
                            <Upload className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce" />
                            <h2 className="text-2xl font-bold text-white uppercase tracking-widest font-mono">Upuść plik tutaj</h2>
                            <p className="text-zinc-400 mt-2">Prześlij zasób do bazy wiedzy</p>
                        </div>
                    </div>
                )}
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
							{data.id && <KnowledgeResourceStatusCard chunksCount={data.simulatedChunks.length} model={data.vectorStoreId || "Brak bazy wektorowej"} />}
							<RagDebugger 
								fileName={data.fileName} 
								strategy={data.chunkType} 
								chunks={data.simulatedChunks}
							/>
						</div>
					}
					canvas={
						<div className="px-16 pb-48 pt-20 w-full">
                            <DndContext collisionDetection={closestCenter}>
							{isSimulating && (
								<div className="fixed top-24 right-24 z-50 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center gap-3 shadow-2xl animate-in fade-in slide-in-from-top-4">
									<Loader2 className="w-4 h-4 animate-spin text-primary" />
									<span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white">Symulacja Chunków...</span>
								</div>
							)}
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
                                                <div 
                                                    className={cn(
                                                        "transition-all duration-300 rounded-xl border border-transparent",
                                                        isOver ? "bg-primary/10 border-primary/50 shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)] scale-[1.01]" : ""
                                                    )}
                                                    onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
                                                    onDragLeave={() => setIsOver(false)}
                                                    onDrop={(e) => {
                                                        e.preventDefault();
                                                        setIsOver(false);
                                                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                                            onSelectFile(e.dataTransfer.files[0]);
                                                        }
                                                    }}
                                                >
                                                    <FormSelectedFile
                                                        fileName={data.fileName}
                                                        fileSize={data.fileSize}
                                                        onRemove={() =>
                                                            onDataChange({ fileName: null, fileSize: null })
                                                        }
                                                    />
                                                </div>

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
											<FormFileUpload 
                                                onClick={triggerFileInput} 
                                                onDrop={(files) => onSelectFile(files[0])}
                                            />
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
													value={data.chunkTypeId}
													onChange={(value) => {
														const selected = strategyOptions.find(opt => opt.id === value);
														onDataChange({ 
															chunkTypeId: value as string,
															chunkType: selected?.name || "Brak nazwy"
														});
													}}
													placeholder={
														isLoadingStrategies
															? "Ładowanie strategii..."
															: "Wybierz strategię chunkingu..."
													}
													renderTrigger={(selected) => {
														const activeStrategy = strategyOptions.find(opt => opt.id === data.chunkTypeId);
														return (
															<div className="flex items-center gap-3 cursor-pointer group/trigger w-full border border-zinc-800 bg-zinc-900/50 p-4 rounded-xl hover:border-zinc-700 transition-colors">
																<div className="flex-1 text-left">
																	<div
																		className={cn(
																			"text-lg font-mono transition-colors",
																			activeStrategy
																			? "text-white"
																			: "text-zinc-600 group-hover/trigger:text-zinc-400",
																		)}
																	>
																	{isLoadingStrategies
																		? "Ładowanie..."
																		: activeStrategy
																		? activeStrategy.name
																		: "Wybierz strategię..."}
																	</div>
																	{activeStrategy &&
																		activeStrategy.subtitle && (
																			<div className="text-[12px] text-zinc-500 font-mono capitalize mt-0.5">
																			{activeStrategy.subtitle.toLowerCase()}
																			</div>
																		)}
																</div>
																{isLoadingStrategies ? (
																	<Loader2 className="w-5 h-5 animate-spin text-zinc-600" />
																) : (
																	<ChevronDown className="w-5 h-5 text-zinc-600 group-hover/trigger:text-zinc-400" />
																)}
															</div>
														);
													}}
												/>
											</FormItemField>
										</div>
									</div>
								</FormSection>

								{/* 4. Tagi */}
								<FormSection 
									id="METADATA" 
									number={4} 
									title="Tagi" 
									description="Dodaj tagi dla łatwiejszego wyszukiwania."
									variant="island"
								>
									<div className="space-y-6">
										<FormItemField>
											<FormTagInput 
												value={data.tags}
												onChange={(newTags) => {
													onDataChange({ tags: newTags });
													form.setValue("tags", newTags);
												}}
												placeholder="Wpisz tag i naciśnij Enter..."
											/>
										</FormItemField>
									</div>
								</FormSection>

								{/* 5. Baza Wektorowa */}
								<FormSection
									id="VECTOR_STORE"
									number={5}
									title="Baza Wektorowa"
									description="Wybierz bazę wektorową dla zasobu. Baza definiuje model embedujący."
									variant="island"
								>
									<div className="space-y-6">
										<FormItemField>
											<FormSelect
												options={(vectorStores || []).map((vs) => ({
													id: vs.id,
													name: vs.vector_database_name,
												}))}
												value={data.vectorStoreId}
												onChange={(value) => {
													onDataChange({ vectorStoreId: value as string });
												}}
												placeholder={
													isLoadingVectorStores
														? "Ładowanie baz wektorowych..."
														: "Wybierz bazę wektorową..."
												}
											/>
										</FormItemField>
									</div>
								</FormSection>

								{/* 6. Przypisanie do Hubów */}
								<FormSection
									id="HUBS"
									number={6}
									title="Przypisanie do Hubów"
									description="Przypisz zasób do odpowiednich hubów dla lepszej kategoryzacji."
									variant="island"
								>
									<div className="space-y-6">
										<FormItemField>
											<FormSelect
												options={(hubs || []).map((hub) => ({
													name: hub.hub_name,
													id: hub.id,
												}))}
												value={data.hubs}
												onChange={(value) => {
													onDataChange({ hubs: value as string[] });
												}}
												multiple
												placeholder={isLoadingHubs ? "Ładowanie hubów..." : "Wybierz Huby..."}
												searchPlaceholder="Szukaj hubów..."
											/>
										</FormItemField>
									</div>
								</FormSection>
							</form>
                            </DndContext>
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
