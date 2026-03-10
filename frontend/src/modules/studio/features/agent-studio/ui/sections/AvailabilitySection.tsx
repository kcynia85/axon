import { useFormContext } from "react-hook-form";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";
import { BlueprintSection } from "@/modules/studio/ui/components/primitives/BlueprintSection";
import { SelectableCard } from "@/shared/ui/form/SelectableCard";
import { FormControl, FormField, FormItem } from "@/shared/ui/ui/Form";

const DEPLOYMENT_SCOPES = [
	"Global Availability",
	"Product Management",
	"Discovery Hub",
	"Design System",
	"Delivery & CI/CD",
	"Growth & Market",
] as const;

export type AvailabilitySectionProps = {
	readonly syncDraft: () => void;
};

export const AvailabilitySection = ({
	syncDraft,
}: AvailabilitySectionProps) => {
	const form = useFormContext<CreateAgentFormData>();

	return (
		<BlueprintSection id="AVAILABILITY" number={6} title="Availability">
			<div className="space-y-8">
				<div className="flex items-center gap-4">
					<h3 className="text-lg font-mono text-zinc-500">Deployment Scope</h3>
				</div>

				<FormField
					control={form.control}
					name="availability_workspace"
					render={({ field }) => {
						const currentWorkspace = field.value || [];
						const isGlobalSelected = currentWorkspace.includes(
							"Global Availability",
						);

						return (
							<FormItem>
								<FormControl>
									<div className="grid grid-cols-1 gap-4">
										{DEPLOYMENT_SCOPES.map((space) => {
											const isSelected = currentWorkspace.includes(space);
											const isDisabled =
												isGlobalSelected && space !== "Global Availability";

											return (
												<SelectableCard
													key={space}
													title={space}
													checked={isSelected}
													disabled={isDisabled}
													onChange={() => {
														let next: string[] = [];
														if (space === "Global Availability") {
															next = isSelected ? [] : ["Global Availability"];
														} else {
															next = isSelected
																? currentWorkspace.filter(
																		(s: string) => s !== space,
																	)
																: [...currentWorkspace, space];
														}
														field.onChange(next);
														syncDraft();
													}}
												/>
											);
										})}
									</div>
								</FormControl>
							</FormItem>
						);
					}}
				/>
			</div>
		</BlueprintSection>
	);
};
