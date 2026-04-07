import { useFormContext } from "react-hook-form";
import { FormField } from "@/shared/ui/ui/Form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormTextarea } from "@/shared/ui/form/FormTextarea";

interface Props {
	onSyncDraft: () => void;
}

export const InstructionSection = ({ onSyncDraft }: Props) => {
	const { control } = useFormContext();

	return (
		<FormSection 
		        id="actions" 
		        number={2} 
		        title="Actions & Instructions"
		        description="Define the workflow content using Markdown. Headers (#) and checklist items (- [ ]) will be automatically mapped to structured Actions and Subactions."
		        variant="island"
		>

			<div className="space-y-12">
				<div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
					<FormField
						control={control}
						name="markdown"
						render={({ field }) => (
							<FormItemField>
								<FormTextarea
									{...field}
									onBlur={onSyncDraft}
									placeholder="# Step 1: Research&#10;- [ ] Identify competitors&#10;- [ ] Analyze pricing"
									rows={16}
									className="bg-zinc-950 border-zinc-800 font-mono text-sm leading-relaxed"
								/>
							</FormItemField>
						)}
					/>
				</div>
			</div>
		</FormSection>
	);
};
