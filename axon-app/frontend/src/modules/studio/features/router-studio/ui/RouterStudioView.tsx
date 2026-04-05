import React from "react";
import { FormProvider } from "react-hook-form";
import { StudioLayout } from "@/modules/studio/ui/layout/StudioLayout";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { Button } from "@/shared/ui/ui/Button";
import { X } from "lucide-react";
import type { RouterStudioViewProps } from "../types/router-studio.types";
import { RouterStudioSectionNav } from "./components/RouterStudioSectionNav";
import { RouterGeneralSection } from "./sections/RouterGeneralSection";
import { RouterPriorityChainSection } from "./sections/RouterPriorityChainSection";
import { RouterLivePoster } from "./components/RouterLivePoster";

export const RouterStudioView = ({
	form,
	navigationItems,
	activeSectionIdentifier,
	onSectionClick,
	onSave,
	onCancel,
	setCanvasContainerReference,
	isSaving,
}: RouterStudioViewProps) => {
	return (
		<FormProvider {...form}>
			<div className="h-full w-full outline-none" tabIndex={0}>
				<StudioLayout
					studioLabel="Router"
					canvasRef={setCanvasContainerReference as any}
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
						<RouterStudioSectionNav
							sections={navigationItems as any}
							activeSection={activeSectionIdentifier}
							onSectionClick={onSectionClick}
							onExitToLibrary={onCancel}
						/>
					}
					canvas={
						<div className="px-16 pb-48 pt-20 w-full">
							<form className="space-y-16 w-full" onSubmit={(formEvent) => formEvent.preventDefault()}>
								<RouterGeneralSection />
								<RouterPriorityChainSection />
							</form>
						</div>
					}
					poster={<RouterLivePoster />}
					footer={
						<div className="flex items-center gap-4">
							<Button
								variant="ghost"
								size="lg"
								onClick={onCancel}
								className="hover:bg-zinc-900 h-11 font-mono text-base tracking-widest px-6 text-zinc-500 hover:text-white transition-all"
							>
								Anuluj
							</Button>
							<ActionButton
								label="Zapisz Router"
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
