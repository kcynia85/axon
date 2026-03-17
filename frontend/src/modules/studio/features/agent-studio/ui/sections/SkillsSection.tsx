import { useState } from "react";
import { Plus } from "lucide-react";
import { FormField } from "@/shared/ui/ui/Form";
import { useWatch } from "react-hook-form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormCheckbox } from "@/shared/ui/form/FormCheckbox";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormSubheading } from "@/shared/ui/form/FormSubheading";
import { Badge } from "@/shared/ui/ui/Badge";
import { NATIVE_SKILLS } from "../../types/agent-studio.constants";
import type { SkillsSectionProps } from "../../types/sections/skills.types";
import { useSkillsSection } from "../../application/hooks/sections/useSkillsSection";
import { InternalSkillsModal } from "../components/InternalSkillsModal";
import { useInternalSkillsModal } from "../../application/hooks/sections/useInternalSkillsModal";
import { useInternalTools } from "@/modules/resources/application/useInternalTools";

export const SkillsSection = (props: SkillsSectionProps) => {
	const { control, syncDraft } = useSkillsSection(props);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { data: internalTools = [] } = useInternalTools();

	const availableSkills = internalTools.map(tool => ({
		id: tool.tool_function_name,
		name: tool.tool_display_name,
		desc: tool.tool_description,
		category: tool.tool_category
	}));

	const currentCustomFunctions = useWatch({ control, name: "custom_functions" }) || [];
	const modalProps = useInternalSkillsModal(
		isModalOpen,
		setIsModalOpen,
		availableSkills,
		currentCustomFunctions
	);

	return (
		<FormSection id="SKILLS" number={4} title="Skills">
			<div className="space-y-12 relative overflow-hidden">
				<div className="space-y-8 relative z-10">
					<div className="space-y-4">
						<FormSubheading>Native Skills</FormSubheading>
						<div className="grid grid-cols-1 gap-4">
							<FormField
								control={control}
								name="native_skills"
								render={({ field }) => (
									<FormItemField>
										<div className="space-y-4">
											{NATIVE_SKILLS.map((skill) => {
												const current = field.value || [];
												const isChecked = current.includes(skill.id);
												return (
													<FormCheckbox
														key={skill.id}
														title={skill.name}
														icon={skill.icon}
														checked={isChecked}
														onChange={() => {
															const next = isChecked
																? current.filter((s: string) => s !== skill.id)
																: [...current, skill.id];
															field.onChange(next);
															syncDraft();
														}}
													/>
												);
											})}
										</div>
									</FormItemField>
								)}
							/>
						</div>
					</div>
				</div>

				<div className="space-y-8 relative z-10">
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<FormSubheading>Custom Functions</FormSubheading>
							<Badge
								variant="outline"
								className="text-[12px] border-zinc-200 dark:border-zinc-800 text-zinc-500 shadow-none"
							>
								Internal
							</Badge>
						</div>
						<FormField
							control={control}
							name="custom_functions"
							render={({ field }) => {
								const current = field.value || [];
								const addedFunctions = availableSkills.filter((fn) => current.includes(fn.id));

								return (
									<FormItemField>
										<div className="space-y-3">
											{addedFunctions.map((fn) => (
												<FormCheckbox
													key={fn.id}
													title={fn.name}
													description={fn.desc}
													checked={true}
													onChange={() => {
														const next = current.filter((s: string) => s !== fn.id);
														field.onChange(next);
														syncDraft();
													}}
												/>
											))}

											<button
												type="button"
												onClick={() => setIsModalOpen(true)}
												className="w-full text-left p-6 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-all flex items-center justify-center gap-2 group shadow-sm outline-none cursor-pointer"
											>
												<Plus className="text-zinc-400 group-hover:text-zinc-600 transition-colors w-5 h-5" />
												<span className="font-bold text-zinc-500 group-hover:text-zinc-700 transition-colors text-base">
													Select from library (Internal Skills)
												</span>
											</button>

											<InternalSkillsModal
												isOpen={isModalOpen}
												onOpenChange={modalProps.handleOpenChange}
												searchQuery={modalProps.searchQuery}
												onSearchChange={modalProps.setSearchQuery}
												filterGroups={modalProps.filterGroups}
												onApplyFilters={modalProps.handleApplyFilters}
												onClearFilters={modalProps.handleClearFilters}
												skills={modalProps.filteredSkills}
												onAddFunction={(functionId) => {
													if (!current.includes(functionId)) {
														field.onChange([...current, functionId]);
														syncDraft();
													}
												}}
											/>
										</div>
									</FormItemField>
								);
							}}
						/>
					</div>
				</div>
			</div>
		</FormSection>
	);
};
