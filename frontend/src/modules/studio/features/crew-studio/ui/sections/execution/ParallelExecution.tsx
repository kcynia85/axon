import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { useFormContext, Controller } from "react-hook-form";

interface Props {
	agents: { id: string; name: string; subtitle?: string }[];
	onSyncDraft: () => void;
}

/**
 * ParallelExecution: Standard team structure where multiple agents work together.
 */
export const ParallelExecution = ({ agents, onSyncDraft }: Props) => {
	const { control, formState: { errors } } = useFormContext();

	return (
		<div className="space-y-12">
			<FormItemField 
				label="Team Members (Agents)"
				error={errors.agent_member_ids?.message as string}
			>
				<Controller
					control={control}
					name="agent_member_ids"
					render={({ field }) => (
						<FormSelect
							multiple
							options={agents}
							value={field.value || []}
							onChange={(val) => {
								field.onChange(val);
								onSyncDraft();
							}}
							onBlur={onSyncDraft}
							placeholder="Select agents who will perform the tasks..."
						/>
					)}
				/>
			</FormItemField>
			
			<p className="text-sm text-zinc-500 font-mono italic">
				* In Parallel mode, all agents work independently and concurrently towards the main objective.
			</p>
		</div>
	);
};
