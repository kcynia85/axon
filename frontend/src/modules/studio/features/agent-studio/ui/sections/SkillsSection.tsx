import { FormField } from "@/shared/ui/ui/Form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormCheckbox } from "@/shared/ui/form/FormCheckbox";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormSubheading } from "@/shared/ui/form/FormSubheading";
import { Badge } from "@/shared/ui/ui/Badge";
import { NATIVE_SKILLS, CUSTOM_FUNCTIONS } from "../../types/agent-studio.constants";
import type { SkillsSectionProps } from "../../types/sections/skills.types";
import { useSkillsSection } from "../../application/hooks/sections/useSkillsSection";

export const SkillsSection = (props: SkillsSectionProps) => {
	const { control, syncDraft } = useSkillsSection(props);

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
							render={({ field }) => (
								<FormItemField>
									<div className="space-y-3">
										{CUSTOM_FUNCTIONS.map((fn) => {
											const current = field.value || [];
											const isChecked = current.includes(fn.id);
											return (
												<FormCheckbox
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
								</FormItemField>
							)}
						/>
					</div>
				</div>
			</div>
		</FormSection>
	);
};
