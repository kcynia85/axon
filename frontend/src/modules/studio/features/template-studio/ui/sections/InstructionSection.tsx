import { useFormContext } from "react-hook-form";
import { FormField } from "@/shared/ui/ui/Form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormTextarea } from "@/shared/ui/form/FormTextarea";

export const InstructionSection = () => {
	const { control } = useFormContext();

	return (
		<FormSection 
			id="actions" 
			number={2} 
			title="Actions"
			description="Define the workflow content using Markdown. Headers (#) and checklist items (- [ ]) will be automatically extracted to the preview card."
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
									placeholder="# Step 1: Research&#10;- [ ] Identify competitors&#10;- [ ] Analyze pricing"
									rows={12}
									className="font-mono text-sm leading-relaxed"
								/>
							</FormItemField>
						)}
					/>
				</div>
			</div>
		</FormSection>
	);
};
