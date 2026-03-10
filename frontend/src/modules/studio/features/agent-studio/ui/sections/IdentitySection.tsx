import { useFormContext } from "react-hook-form";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";
import { BlueprintSection } from "@/modules/studio/ui/components/primitives/BlueprintSection";
import { StudioField } from "@/modules/studio/ui/components/primitives/StudioField";
import { StudioArea } from "@/modules/studio/ui/components/primitives/StudioArea";
import { TagInput } from "@/shared/ui/form/TagInput";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/shared/ui/ui/Form";
import { AvatarGallerySlider } from "../AvatarGallerySlider";

export type IdentitySectionProps = {
	readonly syncDraft: () => void;
};

export const IdentitySection = ({ syncDraft }: IdentitySectionProps) => {
	const form = useFormContext<CreateAgentFormData>();

	return (
		<BlueprintSection id="IDENTITY" number={1} title="Identity">
			<div>
				<div className="border-zinc-900">
					<FormField
						control={form.control}
						name="agent_visual_url"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<AvatarGallerySlider
										value={field.value}
										onChange={(url) => {
											field.onChange(url);
											syncDraft();
										}}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>

				<div className="space-y-12 pt-4">
					<FormField
						control={form.control}
						name="agent_name"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-lg font-mono text-zinc-500 block h4">
									Agent Name
								</FormLabel>
								<FormControl>
									<StudioField
										placeholder="Name your agent..."
										className="focus:placeholder:text-zinc-900 dark:focus:placeholder:text-white transition-colors"
										{...field}
										value={field.value || ""}
										onBlur={syncDraft}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="agent_role_text"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-lg font-mono text-zinc-500 block h4">
									Role
								</FormLabel>
								<FormControl>
									<StudioField
										placeholder="What is the role of this agent?"
										className="text-base text-zinc-300 focus:text-white transition-colors"
										{...field}
										value={field.value || ""}
										onBlur={syncDraft}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="agent_goal"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-lg font-mono text-zinc-500 block h4">
									Goal
								</FormLabel>
								<FormControl>
									<StudioArea
										placeholder="What is the primary objective?"
										className="min-h-[120px] leading-relaxed text-zinc-300 focus:text-white transition-opacity"
										{...field}
										value={field.value || ""}
										onBlur={syncDraft}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="agent_backstory"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-lg font-mono text-zinc-500 block h4">
									Backstory
								</FormLabel>
								<FormControl>
									<StudioArea
										placeholder="Define the backstory and context of this cognitive entity..."
										className="min-h-[150px] leading-relaxed text-zinc-300 focus:text-white transition-opacity"
										{...field}
										value={field.value || ""}
										onBlur={syncDraft}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="agent_keywords"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-lg font-mono text-zinc-500 block h4">
									Keywords
								</FormLabel>
								<FormControl>
									<TagInput
										value={field.value || []}
										onChange={(val) => {
											field.onChange(val);
											syncDraft();
										}}
										onBlur={syncDraft}
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
