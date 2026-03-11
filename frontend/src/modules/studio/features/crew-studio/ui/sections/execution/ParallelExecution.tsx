import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { useFormContext, Controller } from "react-hook-form";

interface Props {
	agents: { id: string; name: string; subtitle?: string }[];
}

/**
 * ParallelExecution: Simple list of agents working concurrently on the goal.
 */
export const ParallelExecution = ({ agents }: Props) => {
	const { control, formState: { errors } } = useFormContext();

	return (
		<div className="space-y-8">
			<FormItemField 
				label="Select Team Members"
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
							onChange={field.onChange}
							placeholder="Click to add agents to the parallel team..."
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
