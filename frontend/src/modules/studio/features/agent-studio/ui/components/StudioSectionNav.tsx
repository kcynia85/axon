import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/ui/Button";
import { Library as LibraryIcon } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";
import type {
	StudioSectionNavProps,
	AgentStudioSectionId,
} from "../../types/hooks.types";
import { ProgressTrack } from "@/modules/studio/ui/components/primitives/ProgressTrack";

export const StudioSectionNav = ({
	sections,
	activeSection,
	onSectionClick,
	onExitToLibrary,
}: StudioSectionNavProps) => {
	const form = useFormContext<CreateAgentFormData>();
	const values = useWatch({ control: form.control });

	const getProgress = (id: AgentStudioSectionId) => {
		switch (id) {
			case "IDENTITY": {
				const idFields = [
					values.agent_name,
					values.agent_role_text,
					values.agent_goal,
					values.agent_backstory,
					(values.agent_keywords?.length || 0) > 0,
				];
				return { current: idFields.filter(Boolean).length, total: 5 };
			}
			case "MEMORY": {
				const memFields = [
					(values.knowledge_hub_ids?.length || 0) > 0,
					(values.guardrails?.instructions?.length || 0) > 0,
					(values.few_shot_examples?.length || 0) > 0,
					values.reflexion,
				];
				return { current: memFields.filter(Boolean).length, total: 4 };
			}
			case "ENGINE": {
				const engineFields = [values.llm_model_id];
				return { current: engineFields.filter(Boolean).length, total: 1 };
			}
			case "SKILLS": {
				const skillsFields = [(values.native_skills?.length || 0) > 0];
				return { current: skillsFields.filter(Boolean).length, total: 1 };
			}
			case "INTERFACE": {
				const intFields = [
					(values.data_interface?.context?.length || 0) > 0,
					(values.data_interface?.artefacts?.length || 0) > 0,
				];
				return { current: intFields.filter(Boolean).length, total: 2 };
			}
			case "AVAILABILITY": {
				return {
					current: (values.availability_workspace?.length || 0) > 0 ? 1 : 0,
					total: 1,
				};
			}
			default:
				return { current: 0, total: 0 };
		}
	};

	return (
		<nav aria-label="Navigator">
			<ul className="space-y-8">
				{sections.map((section) => {
					const { current, total } = getProgress(section.id);
					const isActive = activeSection === section.id;
					return (
						<li key={section.id}>
							<button
								type="button"
								onClick={() => onSectionClick(section.id)}
								className={cn(
									"group block w-full text-left space-y-2 transition-all outline-none",
									isActive ? "opacity-100 scale-[1.02]" : "opacity-40 hover:opacity-60",
								)}
							>
								<div className="flex items-center justify-between">
									<span
										className={cn(
											"font-mono text-[10px] font-bold tracking-tighter transition-colors",
											isActive ? "text-white" : "text-zinc-500",
										)}
									>
										0{section.number}
									</span>
									{total > 0 && (
										<span
											className={cn(
												"font-mono text-[8px] transition-colors",
												isActive ? "text-white/80" : "text-zinc-500",
											)}
										>
											{current}/{total}
										</span>
									)}
								</div>
								<div
									className={cn(
										"text-sm font-bold uppercase tracking-[0.2em] transition-colors",
										isActive ? "text-white" : "text-zinc-400",
									)}
								>
									{section.title}
								</div>
								<ProgressTrack current={current} total={total} isActive={isActive} />
							</button>
						</li>
					);
				})}
			</ul>
			<div className="mt-24 pb-24 pt-8 border-t border-zinc-900 shrink-0">
				<Button
					variant="ghost"
					className="w-full justify-start text-zinc-600 hover:text-white hover:bg-zinc-900 gap-4 group"
					onClick={onExitToLibrary}
				>
					<LibraryIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
					<span className="text-[10px] font-mono tracking-widest text-zinc-500">
						Library
					</span>
				</Button>
			</div>
		</nav>
	);
};
