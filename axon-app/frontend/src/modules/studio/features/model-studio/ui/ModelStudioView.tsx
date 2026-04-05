import React from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { StudioLayout } from "@/modules/studio/ui/layout/StudioLayout";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { Button } from "@/shared/ui/ui/Button";
import { X, Cpu } from "lucide-react";

import { ModelIdentitySection } from "./sections/ModelIdentitySection";
import { ModelParametersSection } from "./sections/ModelParametersSection";
import { ModelCustomParamsSection } from "./sections/ModelCustomParamsSection";
import { ModelSystemPromptSection } from "./sections/ModelSystemPromptSection";
import { ModelPricingSection } from "./sections/ModelPricingSection";
import { ModelStudioSectionNav } from "./components/ModelStudioSectionNav";
import { ModelSanityCheck } from "./components/ModelSanityCheck";
import type { ModelFormData } from "../types/model-schema";

interface Props {
	form: UseFormReturn<ModelFormData>;
	navigationItems: { id: string; label: string; number: number }[];
	activeSection: string;
	onSectionClick: (id: string) => void;
	onSave: () => void;
	onCancel: () => void;
	isSaving: boolean;
	modelId?: string;
	setCanvasContainerReference: (node: HTMLElement | null) => void;
}

export const ModelStudioView = ({
	form,
	navigationItems,
	activeSection,
	onSectionClick,
	onSave,
	onCancel,
	isSaving,
	modelId,
	setCanvasContainerReference,
}: Props) => {
	const modelName = form.watch("model_id");

	return (
		<FormProvider {...form}>
			<div className="h-full w-full outline-none" tabIndex={0}>
				<StudioLayout
					studioLabel="Model"
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
						<ModelStudioSectionNav 
                            sections={navigationItems}
                            activeSection={activeSection}
                            onSectionClick={onSectionClick}
                            onExitToLibrary={onCancel}
                        />
					}
					canvas={
						<div className="px-16 pb-48 pt-20 w-full">
							<form className="space-y-16 w-full" onSubmit={(formEvent) => formEvent.preventDefault()}>
								<ModelIdentitySection modelId={modelId} />
								<ModelParametersSection />
								<ModelCustomParamsSection />
								<ModelSystemPromptSection />
								<ModelPricingSection />
							</form>
						</div>
					}
					poster={
                        <div className="h-full overflow-y-auto custom-scrollbar w-[336px]">
                           <ModelSanityCheck modelId={modelId || ""} />
                        </div>
                    }
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
								label="Zapisz Model"
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
