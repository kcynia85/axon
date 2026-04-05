"use client";

import React from "react";
import { FormProvider, type UseFormReturn } from "react-hook-form";
import { StudioLayout } from "@/modules/studio/ui/layout/StudioLayout";
import { Button } from "@/shared/ui/ui/Button";
import { X, Save } from "lucide-react";
import type { ChunkingStrategyStudioValues } from "../types/chunking-studio.types";
import { StrategyBasicSection } from "./sections/StrategyBasicSection";
import { StrategyParamsSection } from "./sections/StrategyParamsSection";
import { StrategySeparatorsSection } from "./sections/StrategySeparatorsSection";
import { ChunkingSimulatorPoster } from "./components/ChunkingSimulatorPoster";
import { GenericStudioSectionNav } from "@/modules/studio/ui/components/StudioSectionNav/GenericStudioSectionNav";
import { ActionButton } from "@/shared/ui/complex/ActionButton";

interface ChunkingStudioViewProps {
	readonly form: UseFormReturn<ChunkingStrategyStudioValues>;
	readonly activeSection: string;
	readonly isSaving?: boolean;
	readonly onSectionClick: (sectionIdentifier: string) => void;
	readonly onExit: () => void;
	readonly onSave: () => void;
	readonly onSyncDraft: () => void;
	readonly setCanvasContainerReference: (node: HTMLDivElement | null) => void;
}

export const ChunkingStudioView = ({
	form,
	activeSection,
	isSaving,
	onSectionClick,
	onExit,
	onSave,
	onSyncDraft,
	setCanvasContainerReference,
}: ChunkingStudioViewProps) => {
	const sections = [
		{ id: "basic", label: "Informacje" },
		{ id: "params", label: "Rozmiar" },
		{ id: "separators", label: "Separatory" },
	];

	const visibleSections = sections.filter((section) => {
		const rawMethod = form.watch("strategy_chunking_method");
		const method = rawMethod?.toLowerCase().replace(/_/g, "");
		if (section.id === "separators")
			return method === "recursivecharacter" || method === "character";
		return true;
	});

	return (
		<FormProvider {...form}>
			<div className="h-full w-full outline-none" tabIndex={0}>
				<StudioLayout
					studioLabel="Chunking"
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
							sections={visibleSections}
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
								<StrategyBasicSection onSyncDraft={onSyncDraft} />
								<StrategyParamsSection onSyncDraft={onSyncDraft} />
								<StrategySeparatorsSection onSyncDraft={onSyncDraft} />
							</form>
						</div>
					}
					poster={<ChunkingSimulatorPoster />}
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
								label={isSaving ? "Zapisywanie..." : "Zapisz Strategię"}
								icon={Save}
								onClick={onSave}
							/>
						</div>
					}
				/>
			</div>
		</FormProvider>
	);
};
