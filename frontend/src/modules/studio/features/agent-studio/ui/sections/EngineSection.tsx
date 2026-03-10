import { useFormContext } from "react-hook-form";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";
import { BlueprintSection } from "@/modules/studio/ui/components/primitives/BlueprintSection";
import { SearchableSelect } from "@/shared/ui/form/SearchableSelect";
import { SelectableCard } from "@/shared/ui/form/SelectableCard";
import { Slider } from "@/shared/ui/ui/Slider";
import { FormControl, FormField, FormItem } from "@/shared/ui/ui/Form";
import { ALL_MODELS } from "../../types/agent-studio.types";

export type EngineSectionProps = {
	readonly syncDraft: () => void;
};

export const EngineSection = ({ syncDraft }: EngineSectionProps) => {
	const form = useFormContext<CreateAgentFormData>();

	return (
		<BlueprintSection id="ENGINE" number={3} title="Engine">
			<div className="space-y-12 relative overflow-hidden">
				<div className="space-y-8 relative z-10">
					<div className="space-y-4">
						<h3 className="text-lg font-mono text-zinc-500">Model LLM</h3>
						<div className="w-full max-w-2xl">
							<FormField
								control={form.control}
								name="llm_model_id"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<SearchableSelect
												options={ALL_MODELS}
												value={field.value || ""}
												onChange={(val) => {
													field.onChange(val);
													syncDraft();
												}}
												placeholder="Select model..."
												searchPlaceholder="Search model..."
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
					</div>

					<div className="space-y-0 pt-4">
						<FormField
							control={form.control}
							name="temperature"
							render={({ field }) => (
								<FormItem>
									<div className="space-y-2">
										<h3 className="text-lg font-mono text-zinc-500">
											Temperature
										</h3>
										<div className="flex justify-center">
											<span className="text-4xl font-black font-mono text-primary">
												{field.value ?? 0.7}
											</span>
										</div>
									</div>
									<FormControl>
										<div className="py-0">
											<Slider
												min={0}
												max={1}
												step={0.01}
												value={[field.value ?? 0.7]}
												onValueChange={(v) => {
													field.onChange(v[0]);
													syncDraft();
												}}
												className="py-4 cursor-pointer"
											/>
										</div>
									</FormControl>
									<div className="flex justify-between text-sm font-mono tracking-widest text-zinc-500 -mt-2">
										<span>Deterministic</span>
										<span>Creative</span>
									</div>
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className="space-y-8 relative z-10">
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="grounded_mode"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<SelectableCard
											title="Grounded Mode"
											description="Strictly adhere to provided context sources"
											checked={!!field.value}
											onChange={(checked) => {
												field.onChange(checked);
												setTimeout(syncDraft, 0);
											}}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="rag_enforcement"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<SelectableCard
											title="RAG Enforcement"
											description="Force retrieval for every response"
											checked={!!field.value}
											onChange={(checked) => {
												field.onChange(checked);
												setTimeout(syncDraft, 0);
											}}
										/>
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
