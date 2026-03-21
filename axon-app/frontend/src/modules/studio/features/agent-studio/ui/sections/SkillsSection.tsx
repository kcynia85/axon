import * as React from "react";
import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { FormField } from "@/shared/ui/ui/Form";
import { useWatch, useFormContext } from "react-hook-form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormCheckbox } from "@/shared/ui/form/FormCheckbox";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormSubheading } from "@/shared/ui/form/FormSubheading";
import { Badge } from "@/shared/ui/ui/Badge";
import { NATIVE_SKILLS } from "../../types/agent-studio.constants";
import type { SkillsSectionProps } from "../../types/sections/skills.types";
import { useSkillsSection } from "../../application/hooks/sections/useSkillsSection";
import { InternalSkillsModal } from "../components/InternalSkillsModal";
import { useInternalTools } from "@/modules/resources/application/useInternalTools";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";

export const SkillsSection = React.memo((props: SkillsSectionProps) => {
	const { control, syncDraft } = useSkillsSection(props);
	const { setValue, getValues } = useFormContext<CreateAgentFormData>();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { data: internalTools = [] } = useInternalTools();

	const availableSkills = React.useMemo(() => internalTools.map(tool => {
		const cleanDesc = (tool.tool_description || "").split("Args:")[0].trim();
		const truncatedDesc = cleanDesc.length > 50 ? `${cleanDesc.substring(0, 50)}...` : cleanDesc;
		
		return {
			id: tool.tool_function_name,
			uuid: tool.id, // Keep UUID for hydration matching
			name: tool.tool_display_name,
			desc: truncatedDesc,
			category: tool.tool_category,
			keywords: tool.tool_keywords || [],
			raw_tool: tool
		};
	}), [internalTools]);

	const currentCustomFunctions = useWatch({ control, name: "custom_functions" }) || [];

	const syncDataInterface = useCallback((nextFunctions: string[]) => {
		const currentContext = getValues("data_interface.context") || [];
		const currentArtefacts = getValues("data_interface.artefacts") || [];
		
		// 1. Identify tools to add (nextFunctions can contain names OR UUIDs)
		const addedTools = internalTools.filter(t => 
			nextFunctions.includes(t.tool_function_name) || nextFunctions.includes(t.id)
		);
		
		// 2. Map tool inputs to context
		let newContext = [...currentContext];
		let newInputSchema: Record<string, string> = {};
		
		addedTools.forEach(tool => {
			const properties = tool.tool_input_schema?.properties || {};
			const required = tool.tool_input_schema?.required || [];
			
			Object.entries(properties).forEach(([name, schema]: [string, any]) => {
				const fieldType = schema.type || "string";
				newInputSchema[name] = fieldType; // Sync to flat schema
				
				if (!newContext.find(c => c.name === name)) {
					newContext.push({
						name,
						field_type: fieldType,
						is_required: required.includes(name),
						value: null
					});
				}
			});
		});

		// 3. Map tool outputs to artefacts
		let newArtefacts = [...currentArtefacts];
		let newOutputSchema: Record<string, string> = {};
		
		addedTools.forEach(tool => {
			const name = `${tool.tool_function_name}_output`;
			newOutputSchema[name] = "json"; // Sync to flat schema
			
			if (!newArtefacts.find(a => a.name === name)) {
				newArtefacts.push({
					name,
					field_type: "json",
					is_required: true,
					value: null
				});
			}
		});

		// 4. Update both data sources only if changed
		const hasContextChanged = JSON.stringify(newContext) !== JSON.stringify(currentContext);
		const hasArtefactsChanged = JSON.stringify(newArtefacts) !== JSON.stringify(currentArtefacts);
		
		if (hasContextChanged) {
			setValue("data_interface.context", newContext);
			setValue("input_schema", newInputSchema);
		}
		if (hasArtefactsChanged) {
			setValue("data_interface.artefacts", newArtefacts);
			setValue("output_schema", newOutputSchema);
		}
	}, [internalTools, getValues, setValue]);

	// Filter functions (match by function_name OR uuid)
	const addedFunctions = React.useMemo(() => availableSkills.filter((fn) => 
		currentCustomFunctions.includes(fn.id) || currentCustomFunctions.includes(fn.uuid)
	), [availableSkills, currentCustomFunctions]);

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
							<FormSubheading>Tools</FormSubheading>
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

								return (
									<FormItemField>
										<div className="space-y-3">
											{addedFunctions.map((fn) => (
												<FormCheckbox
													key={fn.id}
													title={fn.name}
													description={fn.desc}
													tags={fn.keywords?.filter(tag => tag !== "python" && tag !== "synced")}
													checked={true}
													hideCheckbox={true}
													onChange={() => {
														const next = current.filter((s: string) => s !== fn.id);
														field.onChange(next);
														syncDataInterface(next); // Sync when removed
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
												onOpenChange={setIsModalOpen}
												addedFunctionIds={currentCustomFunctions}
												onAddFunction={(functionId) => {
													if (!current.includes(functionId)) {
														const next = [...current, functionId];
														field.onChange(next);
														syncDataInterface(next); // Sync when added
														syncDraft();
													}
												}}
												onRemoveFunction={(functionId) => {
													const next = current.filter((s: string) => s !== functionId);
													field.onChange(next);
													syncDataInterface(next); // Sync when removed
													syncDraft();
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
});

SkillsSection.displayName = "SkillsSection";
