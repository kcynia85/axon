import { useFormContext } from "react-hook-form";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";
import { BlueprintSection } from "@/modules/studio/ui/components/primitives/BlueprintSection";
import { StudioArea } from "@/modules/studio/ui/components/primitives/StudioArea";
import { DynamicListInput } from "@/shared/ui/form/DynamicListInput";
import { SearchableSelect } from "@/shared/ui/form/SearchableSelect";
import { SelectableCard } from "@/shared/ui/form/SelectableCard";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/shared/ui/ui/Form";
import { ALL_HUBS } from "../../types/agent-studio.types";

export type CognitionSectionProps = {
	readonly syncDraft: () => void;
};

export const CognitionSection = ({ syncDraft }: CognitionSectionProps) => {
	const form = useFormContext<CreateAgentFormData>();

	return (
		<BlueprintSection id="MEMORY" number={2} title="Cognition">
			<div className="space-y-12">
				<div className="space-y-2">
					<h3 className="text-lg font-mono text-zinc-500">
						Knowledge Hubs (RAG)
					</h3>
					<div className="w-full max-w-2xl">
						<FormField
							control={form.control}
							name="knowledge_hub_ids"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<SearchableSelect
											multiple
											options={ALL_HUBS}
											value={field.value || []}
											onChange={(val) => {
												field.onChange(val);
												syncDraft();
											}}
											placeholder="Select Knowledge Sources..."
											searchPlaceholder="Search hubs..."
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className="space-y-2">
					<h3 className="text-lg font-mono text-zinc-500">Guardrails</h3>
					<div className="space-y-16">
						<FormField
							control={form.control}
							name="guardrails.instructions"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-base font-mono text-primary flex items-center gap-2">
										Instructions
									</FormLabel>
									<FormControl>
										<DynamicListInput
											items={(field.value as string[]) || []}
											onChange={(val) => {
												field.onChange(val);
												syncDraft();
											}}
											onBlur={syncDraft}
											placeholder="Operational guideline..."
											addPlaceholder="Add new instruction..."
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="guardrails.constraints"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-base font-mono text-destructive flex items-center gap-2">
										Constraints
									</FormLabel>
									<FormControl>
										<DynamicListInput
											items={(field.value as string[]) || []}
											onChange={(val) => {
												field.onChange(val);
												syncDraft();
											}}
											onBlur={syncDraft}
											placeholder="Hard limitation..."
											addPlaceholder="Add new constraint..."
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className="space-y-8 pt-8">
					<FormField
						control={form.control}
						name="few_shot_examples"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-lg font-mono text-zinc-500 mb-4 block h4">
									Strategia Formatowania (Few Shot)
								</FormLabel>
								<FormControl>
									<StudioArea
										placeholder="Input examples of desired output format... (e.g. User: Hello -> Agent: Greetings!)"
										className="min-h-[100px] leading-relaxed text-sm focus:placeholder:text-zinc-900 dark:focus:placeholder:text-white transition-opacity"
										{...field}
										value={Array.isArray(field.value) ? field.value.join("\n") : ""}
										onChange={(e) => field.onChange(e.target.value.split("\n"))}
										onBlur={syncDraft}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="reflexion"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<SelectableCard
										title="Reflexion Mode"
										description="Agent will self-correct before responding"
										checked={!!field.value}
										onChange={(checked) => {
											field.onChange(checked);
											syncDraft();
										}}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
			</div>
		</BlueprintSection>
	);
};
