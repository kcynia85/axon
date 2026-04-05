"use client";

import React from "react";
import { FormProvider, type UseFormReturn } from "react-hook-form";
import { StudioLayout } from "@/modules/studio/ui/layout/StudioLayout";
import { Button } from "@/shared/ui/ui/Button";
import { X, HardDrive } from "lucide-react";
import type { EmbeddingModelStudioValues } from "../types/embedding-studio.types";
import { EmbeddingIdentitySection } from "./sections/EmbeddingIdentitySection";
import { EmbeddingParamsSection } from "./sections/EmbeddingParamsSection";
import { EmbeddingCostSection } from "./sections/EmbeddingCostSection";
import { GenericStudioSectionNav } from "@/modules/studio/ui/components/StudioSectionNav/GenericStudioSectionNav";
import { ActionButton } from "@/shared/ui/complex/ActionButton";

interface EmbeddingStudioViewProps {
	readonly form: UseFormReturn<EmbeddingModelStudioValues>;
	readonly activeSection: string;
	readonly isSaving?: boolean;
	readonly onSectionClick: (sectionIdentifier: string) => void;
	readonly onExit: () => void;
	readonly onSave: () => void;
	readonly onSyncDraft: () => void;
	readonly setCanvasContainerReference: (node: HTMLDivElement | null) => void;
}

export const EmbeddingStudioView = ({
	form,
	activeSection,
	isSaving,
	onSectionClick,
	onExit,
	onSave,
	onSyncDraft,
	setCanvasContainerReference,
}: EmbeddingStudioViewProps) => {
	const sections = [
		{ id: "identity", label: "Dostawca" },
		{ id: "technical", label: "Parametry" },
		{ id: "economy", label: "Ekonomia" },
	];

	return (
		<FormProvider {...form}>
			<div className="h-full w-full outline-none" tabIndex={0}>
				<StudioLayout
					studioLabel="Embedding"
					canvasRef={setCanvasContainerReference}
					exitButton={
						<Button
							variant="ghost"
							size="icon"
							onClick={onExit}
							className="hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all h-9 w-9"
						>
							<X className="w-4 h-4" />
						</Button>
					}
					navigator={
						<GenericStudioSectionNav
							sections={sections}
							activeSection={activeSection}
							onSectionClick={onSectionClick}
						/>
					}
					canvas={
						<div className="px-16 pb-48 pt-20 w-full">
							<form
								className="space-y-16 w-full"
								onSubmit={(formEvent) => formEvent.preventDefault()}
							>
								<EmbeddingIdentitySection onSyncDraft={onSyncDraft} />
								<EmbeddingParamsSection onSyncDraft={onSyncDraft} />
								<EmbeddingCostSection onSyncDraft={onSyncDraft} />
							</form>
						</div>
					}
					footer={
						<div className="flex items-center gap-4">
							<Button
								variant="ghost"
								size="lg"
								onClick={onExit}
								className="hover:bg-zinc-900 h-11 font-mono text-base tracking-widest px-6 text-zinc-500 hover:text-white transition-all"
							>
								Anuluj
							</Button>
							<ActionButton
								label={isSaving ? "Zapisywanie..." : "Zapisz Ustawienia"}
								icon={HardDrive}
								onClick={onSave}
							/>
						</div>
					}
				/>
			</div>
		</FormProvider>
	);
};

