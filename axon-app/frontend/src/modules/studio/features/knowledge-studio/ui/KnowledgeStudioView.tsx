"use client";

import React from "react";
import { FormProvider } from "react-hook-form";
import { X, RefreshCw, Plus, Loader2, Upload } from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { StudioLayout } from "@/modules/studio/ui/layout/StudioLayout";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { Button } from "@/shared/ui/ui/Button";
import { KnowledgeStudioViewProps } from "../types/knowledge-studio.types";
import { KnowledgeStudioSectionNav } from "./KnowledgeStudioSectionNav";
import { ResourceFileInfoCard } from "./ResourceFileInfoCard";
import { KnowledgeResourceStatusCard } from "./KnowledgeResourceStatusCard";
import { KnowledgeResourceForm } from "./KnowledgeResourceForm";
import { cn } from "@/shared/lib/utils";

/**
 * KnowledgeStudioView: Pure presentation component for the Knowledge Design experience.
 * Standard: Pure View pattern, 0% logic, 0% useEffect.
 * Global Drag & Drop is handled via container props instead of window listeners.
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
    isSaving,
    isGlobalDragging,
    isLocalFileOver,
    strategyOptions,
    selectedHubNames,
	onDataChange,
	onSave,
	onCancel,
	onAutoTag,
	onSelectFile,
	scrollToSection,
	setCanvasContainerReference,
    setIsGlobalDragging,
    setIsLocalFileOver,
}: KnowledgeStudioViewProps & {
    isSaving: boolean;
    isGlobalDragging: boolean;
    isLocalFileOver: boolean;
    strategyOptions: any[];
    selectedHubNames: string[];
    setIsGlobalDragging: (isDragging: boolean) => void;
    setIsLocalFileOver: (isOver: boolean) => void;
}) => {

	return (
		<FormProvider {...form}>
			<div 
                className="h-full w-full outline-none relative" 
                tabIndex={0}
                onDragOver={(event) => {
                    event.preventDefault();
                    setIsGlobalDragging(true);
                }}
            >
                {/* Global Drag Overlay */}
                {isGlobalDragging && (
                    <div 
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm border-2 border-primary animate-in fade-in"
                        onDragLeave={() => setIsGlobalDragging(false)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                            event.preventDefault();
                            setIsGlobalDragging(false);
                            if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
                                onSelectFile(event.dataTransfer.files[0]);
                            }
                        }}
                    >
                        <div className="text-center pointer-events-none">
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
							{data.id && (
                                <KnowledgeResourceStatusCard 
                                    chunksCount={data.simulatedChunks.length} 
                                    model={data.vectorStoreId || "Brak bazy wektorowej"} 
                                />
                            )}
							<ResourceFileInfoCard 
								fileName={data.fileName} 
								fileSize={data.fileSize}
								tokenCount={data.tokenCount}
								estimatedCost={data.estimatedCost}
								selectedHubs={selectedHubNames}
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
								<KnowledgeResourceForm 
                                    data={data}
                                    isLoadingStrategies={isLoadingStrategies}
                                    strategyOptions={strategyOptions}
                                    isLoadingVectorStores={isLoadingVectorStores}
                                    vectorStores={vectorStores}
                                    isLoadingHubs={isLoadingHubs}
                                    hubs={hubs}
                                    isLocalFileOver={isLocalFileOver}
                                    onSelectFile={onSelectFile}
                                    onDataChange={onDataChange}
                                    onAutoTag={onAutoTag}
                                    setIsLocalFileOver={setIsLocalFileOver}
                                />
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
                                loading={isSaving}
							/>
						</div>
					}
				/>
			</div>
		</FormProvider>
	);
};
