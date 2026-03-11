import { FormProvider } from "react-hook-form";
import { useCrewForm } from "../application/useCrewForm";
import { CrewBasicInfoSection } from "./sections/CrewBasicInfoSection";
import { CrewTypeSelectionSection } from "./sections/CrewTypeSelectionSection";
import { CrewExecutionSection } from "./sections/CrewExecutionSection";
import { CrewContextSection } from "./sections/CrewContextSection";
import { CrewArtefactsSection } from "./sections/CrewArtefactsSection";
import { CrewAvailabilitySection } from "./sections/CrewAvailabilitySection";
import { CrewLiveGraphContainer } from "./components/CrewLiveGraphContainer";
import { StudioLayout } from "@/modules/studio/ui/layout/StudioLayout";
import { CrewStudioSectionNav } from "./components/CrewStudioSectionNav";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { Button } from "@/shared/ui/ui/Button";
import { X } from "lucide-react";
import { type CrewStudioFormData } from "../types/crew-schema";
import { CREW_STUDIO_SECTIONS, type CrewStudioSectionId } from "../types/sections.constants";
import { useState, useRef, useCallback, useMemo } from "react";
import { useWatch } from "react-hook-form";

interface Props {
	availableAgents: { id: string; name: string; subtitle?: string; avatarUrl?: string }[];
	onSave: (data: CrewStudioFormData) => void;
	onCancel: () => void;
	initialData?: Partial<CrewStudioFormData>;
}

/**
 * CrewStudio: Final 3-column architecture following the AXON Studio standard.
 */
export const CrewStudio = ({ availableAgents, onSave, onCancel, initialData }: Props) => {
	const { form, estimatedCost, handleTypeChange } = useCrewForm(initialData);
	const [activeSection, setActiveSection] = useState<CrewStudioSectionId>("basic-info");
	const canvasRef = useRef<HTMLDivElement>(null);

	const currentType = useWatch({
		control: form.control,
		name: "crew_process_type",
	});

	// Scroll logic identical to Agent Studio
	const scrollToSection = useCallback((sectionId: string) => {
		const element = document.getElementById(sectionId);
		if (element && canvasRef.current) {
			element.scrollIntoView({ behavior: "smooth", block: "start" });
			setActiveSection(sectionId as CrewStudioSectionId);
		}
	}, []);

	// Navigation items with dynamic titles based on type
	const navigationItems = useMemo(() => {
		return CREW_STUDIO_SECTIONS.map(section => {
			let title = section.title;
			
			if (section.id === "execution") {
				if (currentType === "Hierarchical") title = "Lead & Team";
				if (currentType === "Parallel") title = "Team Members (Agents)";
				if (currentType === "Sequential") title = "Sequence of Tasks";
			}

			return {
				...section,
				title,
			};
		});
	}, [currentType]);

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
						<CrewStudioSectionNav
							sections={navigationItems as any}
							activeSection={activeSection}
							onSectionClick={scrollToSection}
							onExitToLibrary={onCancel}
						/>
					}
					canvas={
						<div className="px-24 pb-48">
							<form className="space-y-0" onSubmit={(e) => e.preventDefault()}>
								<CrewBasicInfoSection />
								<CrewTypeSelectionSection onTypeChange={handleTypeChange} />
								<CrewExecutionSection availableAgents={availableAgents} />
								<CrewContextSection />
								<CrewArtefactsSection />
								<CrewAvailabilitySection />
							</form>
						</div>
					}
					poster={<CrewLiveGraphContainer availableAgents={availableAgents} />}
					footer={
						<div className="flex items-center gap-4">
							<div className="flex flex-col items-end mr-8">
								<span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Estimated Cost</span>
								<span className="text-xl font-black text-primary font-mono">${estimatedCost.toFixed(2)}</span>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={onCancel}
								className="hover:bg-zinc-900 h-9 font-mono text-base tracking-widest px-6 text-zinc-500 hover:text-white transition-all"
							>
								Cancel
							</Button>
							<ActionButton
								label="Save Team"
								onClick={form.handleSubmit(onSave)}
							/>
						</div>
					}
				/>
			</div>
		</FormProvider>
	);
};
