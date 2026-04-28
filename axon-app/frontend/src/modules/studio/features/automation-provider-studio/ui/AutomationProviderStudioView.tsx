"use client";

import { X, Loader2 } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { StudioLayout } from "@/modules/studio/ui/layout/StudioLayout";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { Button } from "@/shared/ui/ui/Button";

import { AutomationProviderStudioViewProps } from "../types/automation-provider-studio.types";
import { AutomationProviderStudioSectionNav } from "./components/AutomationProviderStudioSectionNav";
import { useAutomationProviderStudioSectionNav } from "../application/hooks/useAutomationProviderStudioSectionNav";
import { IdentitySection } from "./sections/IdentitySection";
import { AuthSection } from "./sections/AuthSection";
import { AutomationConnectionTester } from "./components/AutomationConnectionTester";

/**
 * AutomationProviderStudioView: Pure presentation layer.
 * Zero useEffect, Zero business state.
 */
export function AutomationProviderStudioView({
	form,
	activeSectionIdentifier,
	onSectionClick,
	onCancel,
	onSave,
	setScrollContainer,
	isEditing,
	isSaving,
}: AutomationProviderStudioViewProps) {
	const { items: navigationItems } = useAutomationProviderStudioSectionNav({
		form,
		activeSection: activeSectionIdentifier,
	});

	return (
		<FormProvider {...form}>
			<div className="fixed inset-0 z-[200] h-screen w-screen bg-black outline-none" tabIndex={0}>
				<StudioLayout
					studioLabel="Automation Provider"
					canvasRef={setScrollContainer}
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
						<AutomationProviderStudioSectionNav
							items={navigationItems}
							activeSection={activeSectionIdentifier}
							onSectionClick={onSectionClick}
							onExitToLibrary={onCancel}
						/>
					}
					canvas={
						<div className="px-16 pb-48 pt-20 w-full">
							<form
								className="space-y-16 w-full"
								onSubmit={(e) => {
									e.preventDefault();
									onSave();
								}}
							>
								<IdentitySection />
								<AuthSection />
							</form>
						</div>
					}
					poster={<AutomationConnectionTester />}
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
							<Button
								size="lg"
								onClick={() => {
									console.log("Save button clicked!");
									onSave();
								}}
								disabled={isSaving}
								className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 font-bold"
							>
								{isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
								{isEditing ? "Zaktualizuj" : "Zapisz"}
							</Button>
						</div>
					}
				/>
			</div>
		</FormProvider>
	);
}

