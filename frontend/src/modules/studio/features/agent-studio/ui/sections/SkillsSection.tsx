import { Code, Database, Globe } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";
import { BlueprintSection } from "@/modules/studio/ui/components/primitives/BlueprintSection";
import { SelectableCard } from "@/shared/ui/form/SelectableCard";
import { Badge } from "@/shared/ui/ui/Badge";
import { FormControl, FormField, FormItem } from "@/shared/ui/ui/Form";

const NATIVE_SKILLS = [
	{ id: "web_search", name: "Web Search", icon: Globe },
	{ id: "code_interpreter", name: "Code Interpreter", icon: Code },
	{ id: "file_browser", name: "File Browser", icon: Database },
] as const;

const CUSTOM_FUNCTIONS = [
	{
		id: "lead_scoring",
		name: "lead_scoring",
		desc: "Oblicza potencjał leada...",
	},
	{
		id: "validate_nip_pl",
		name: "validate_nip_pl",
		desc: "Sprawdza sumę kontrolną...",
	},
] as const;

export type SkillsSectionProps = {
	readonly syncDraft: () => void;
};

export const SkillsSection = ({ syncDraft }: SkillsSectionProps) => {
	const form = useFormContext<CreateAgentFormData>();

	return (
		<BlueprintSection id="SKILLS" number={4} title="Skills">
			<div className="space-y-12 relative overflow-hidden">
				<div className="space-y-8 relative z-10">
					<div className="space-y-4">
						<h3 className="text-lg font-mono text-zinc-500">Native Skills</h3>
						<div className="grid grid-cols-1 gap-4">
							<FormField
								control={form.control}
								name="native_skills"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<div className="space-y-4">
												{NATIVE_SKILLS.map((skill) => {
													const current = field.value || [];
													const isChecked = current.includes(skill.id);
													return (
														<SelectableCard
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
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
					</div>
				</div>

				<div className="space-y-8 relative z-10">
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<h3 className="text-lg font-mono text-zinc-500">
								Custom Functions
							</h3>
							<Badge
								variant="outline"
								className="text-[12px] border-zinc-200 dark:border-zinc-800 text-zinc-500 shadow-none"
							>
								Internal
							</Badge>
						</div>
						<FormField
							control={form.control}
							name="custom_functions"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div className="space-y-3">
											{CUSTOM_FUNCTIONS.map((fn) => {
												const current = field.value || [];
												const isChecked = current.includes(fn.id);
												return (
													<SelectableCard
														key={fn.id}
														title={fn.name}
														description={fn.desc}
														checked={isChecked}
														onChange={() => {
															const next = isChecked
																? current.filter((s: string) => s !== fn.id)
																: [...current, fn.id];
															field.onChange(next);
															syncDraft();
														}}
													/>
												);
											})}
										</div>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
				</div>
			</div>
		</BlueprintSection>
	);
};
