import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { FormTextarea } from "@/shared/ui/form/FormTextarea";
import { useFormContext, Controller } from "react-hook-form";

interface Props {
	agents: { id: string; name: string; subtitle?: string }[];
	onSyncDraft: () => void;
}

/**
 * HierarchicalExecution: Managed structure with a lead/manager and team members.
 */
export const HierarchicalExecution = ({ agents, onSyncDraft }: Props) => {
	const { register, control, formState: { errors } } = useFormContext();

	return (
		<div className="space-y-12">
			<FormItemField 
				label="Manager / Lead Agent (Process Owner)" 
				error={(errors as any).owner_agent_id?.message as string}
			>
				<Controller
					control={control}
					name="owner_agent_id"
					render={({ field }) => (
						<FormSelect
							options={agents}
							value={field.value || ""}
							onChange={(val) => {
								field.onChange(val);
								onSyncDraft();
							}}
							onBlur={onSyncDraft}
							placeholder="Select the agent who will manage this crew..."
						/>
					)}
				/>
			</FormItemField>

			<FormItemField 
				label="Synthesis Instruction (Optional)" 
				error={(errors as any).synthesis_instruction?.message as string}
			>
				<FormTextarea 
					{...register("synthesis_instruction" as any)} 
					placeholder="Describe how the manager should coordinate and synthesize the work of other agents..." 
					className="min-h-[100px]"
					onBlur={onSyncDraft}
				/>
			</FormItemField>

			<FormItemField 
				label="Team Members (Executors)"
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
		</div>
	);
};
