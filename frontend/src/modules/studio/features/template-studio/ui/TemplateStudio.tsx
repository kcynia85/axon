"use client";

import { X } from "lucide-react";
import * as React from "react";
import { FormProvider } from "react-hook-form";
import { StudioLayout } from "@/modules/studio/ui/layout/StudioLayout";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { Button } from "@/shared/ui/ui/Button";
import { useTemplateForm } from "../application/hooks/useTemplateForm";
import { useTemplateStudioView } from "../application/hooks/useTemplateStudioView";
import { StudioSectionNav } from "@/modules/studio/features/agent-studio/ui/components/StudioSectionNav";
import { DefinitionSection } from "./sections/DefinitionSection";
import { InstructionSection } from "./sections/InstructionSection";
import { ContextSection } from "./sections/ContextSection";
import { ArtefactsSection } from "./sections/ArtefactsSection";
import { AvailabilitySection } from "./sections/AvailabilitySection";
import { TemplateLivePoster } from "./components/TemplateLivePoster";
import type { TemplateStudioFormData } from "../types/template-studio.types";

interface TemplateStudioProps {
	onSave: (data: TemplateStudioFormData) => void;
	onCancel: () => void;
	initialData?: Partial<TemplateStudioFormData>;
	isEditing?: boolean;
}

/**
 * TemplateStudio: 3-column architecture for designing AXON Templates.
 */
export const TemplateStudio = ({ onSave, onCancel, initialData, isEditing }: TemplateStudioProps) => {
	const { form } = useTemplateForm(initialData);
	const {
		canvasRef,
		scrollToSection,
		navigationItems,
		activeSection,
	} = useTemplateStudioView();

	return (
		<FormProvider {...form}>
			<div className="h-full w-full outline-none" tabIndex={0}>
				<StudioLayout
					canvasRef={canvasRef}
					exitButton={
						<Button
							variant="ghost"
							size="sm"
							onClick={onCancel}
							className="hover:bg-zinc-900 gap-2 text-zinc-400 hover:text-white px-4 font-mono text-[10px] uppercase tracking-[0.2em] border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all"
						>
							<X className="w-4 h-4" /> Exit Studio
						</Button>
					}
					navigator={
						<StudioSectionNav
							sections={navigationItems as any}
							activeSection={activeSection}
							onSectionClick={scrollToSection}
							onExitToLibrary={onCancel}
						/>
					}
					canvas={
						<div className="px-24 pb-48">
							<form className="space-y-0" onSubmit={(e) => e.preventDefault()}>
								<DefinitionSection />
								<InstructionSection />
								<ContextSection />
								<ArtefactsSection />
								<AvailabilitySection />
							</form>
						</div>
					}
					poster={<TemplateLivePoster />}
					footer={
						<div className="flex items-center gap-4">
							<Button
								variant="ghost"
								size="sm"
								onClick={onCancel}
								className="hover:bg-zinc-900 h-9 font-mono text-base tracking-widest px-6 text-zinc-500 hover:text-white transition-all"
							>
								Cancel
							</Button>
							<ActionButton
								label={isEditing ? "Update Template" : "Save Template"}
								onClick={form.handleSubmit(onSave)}
							/>
						</div>
					}
				/>
			</div>
		</FormProvider>
	);
};
