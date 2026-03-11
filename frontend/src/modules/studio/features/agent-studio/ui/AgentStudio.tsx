"use client";

import { X } from "lucide-react";
import * as React from "react";
import { FormProvider } from "react-hook-form";
import { ARCHETYPES } from "@/modules/agents/domain/archetypes";
import { StudioDiscovery } from "@/modules/studio/ui/components/StudioDiscovery";
import { StudioLayout } from "@/modules/studio/ui/layout/StudioLayout";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { Button } from "@/shared/ui/ui/Button";
import { useAgentStudioView } from "../application/hooks/useAgentStudioView";
import { StudioSectionNav } from "./components/StudioSectionNav";
import { IdentitySection } from "./sections/IdentitySection";
import { CognitionSection } from "./sections/CognitionSection";
import { EngineSection } from "./sections/EngineSection";
import { SkillsSection } from "./sections/SkillsSection";
import { ContextSection } from "./sections/ContextSection";
import { ArtefactsSection } from "./sections/ArtefactsSection";
import { AvailabilitySection } from "./sections/AvailabilitySection";
import { ConnectedLivePoster } from "./ConnectedLivePoster";

/**
 * AgentStudio: Pure view component for the agent design experience.
 */
export const AgentStudio = () => {
	const {
		form,
		step,
		setStep,
		handleExit,
		handleSubmit,
		syncDraft,
		handleKeyDown,
		setCanvasRef,
		activeSection,
		scrollToSection,
		handleSelectEmpty,
		handleSelectArchetype,
		renderIcon,
		sections,
	} = useAgentStudioView();

	if (step === "discovery") {
		return (
			<StudioDiscovery
				title="Agent Studio"
				emptyLabel="Start Blank"
				emptySublabel="Design your cognitive agent from the ground up"
				libraryLabel="Browse Library"
				librarySublabel="Import an existing agent from your organization"
				archetypes={ARCHETYPES}
				categories={["Product", "Technical", "Creative", "Research"]}
				onSelectEmpty={handleSelectEmpty}
				onSelectArchetype={handleSelectArchetype}
				onExit={handleExit}
				renderIcon={renderIcon}
			/>
		);
	}

	return (
		<FormProvider {...form}>
			<div
				onKeyDown={handleKeyDown}
				className="outline-none h-full w-full"
				// biome-ignore lint/a11y/noNoninteractiveTabindex: needs focus for studio shortcuts
				tabIndex={0}
			>
				<StudioLayout
					canvasRef={setCanvasRef}
					exitButton={
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setStep("discovery")}
							className="hover:bg-zinc-900 gap-2 text-zinc-400 hover:text-white px-4 font-mono text-[10px] uppercase tracking-[0.2em] border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all"
						>
							<X className="w-4 h-4" /> Exit Studio
						</Button>
					}
					navigator={
						<StudioSectionNav
							sections={sections}
							activeSection={activeSection}
							onSectionClick={scrollToSection}
							onExitToLibrary={() => setStep("discovery")}
						/>
					}
					canvas={
						<div className="px-24 pb-48">
							<form className="space-y-0" onSubmit={(e) => e.preventDefault()}>
								<IdentitySection syncDraft={syncDraft} />
								<CognitionSection syncDraft={syncDraft} />
								<EngineSection syncDraft={syncDraft} />
								<SkillsSection syncDraft={syncDraft} />
								<ContextSection syncDraft={syncDraft} />
								<ArtefactsSection syncDraft={syncDraft} />
								<AvailabilitySection syncDraft={syncDraft} />
							</form>
						</div>
					}
					poster={<ConnectedLivePoster />}
					footer={
						<div className="flex items-center gap-4">
							<Button
								variant="ghost"
								size="sm"
								onClick={handleExit}
								className="hover:bg-zinc-900 h-9 font-mono text-base tracking-widest px-6 text-zinc-500 hover:text-white transition-all"
							>
								Anuluj
							</Button>
							<ActionButton
								label="Zapisz Agenta"
								onClick={form.handleSubmit(handleSubmit)}
							/>
						</div>
					}
				/>
			</div>
		</FormProvider>
	);
};
