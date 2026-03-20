import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { FormTextarea } from "@/shared/ui/form/FormTextarea";
import { Button } from "@/shared/ui/ui/Button";
import { Plus, Trash2 } from "lucide-react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";

interface Props {
	agents: { id: string; name: string; subtitle?: string; avatarUrl?: string }[];
	onSyncDraft: () => void;
}

/**
 * SequentialExecution: Strictly ordered sequence of tasks.
 * Refactored to use Controller for stable field binding and single column layout.
 */
export const SequentialExecution = ({ agents, onSyncDraft }: Props) => {
	const { register, control, formState: { errors } } = useFormContext();
	const { fields, append, remove } = useFieldArray({
		control,
		name: "tasks",
	});

	return (
		<div className="space-y-8">
			<div className="space-y-6">
				{fields.map((field, index) => (
					<div 
						key={field.id}
						className="relative group p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 transition-all animate-in fade-in slide-in-from-top-2 duration-300"
					>
						{/* Step Number */}
						<div className="absolute -left-4 top-8 w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-2xl z-10 group-hover:border-primary/50 transition-colors">
							<span className="font-mono text-xs font-bold text-primary">{String(index + 1).padStart(2, '0')}</span>
						</div>

						<div className="space-y-8">
							{/* Specialist Selection */}
							<FormItemField 
								label="Specialist" 
								error={(errors as any).tasks?.[index]?.specialist_id?.message}
							>
								<Controller
									control={control}
									name={`tasks.${index}.specialist_id` as any}
									render={({ field: selectField }) => (
										<FormSelect
											options={agents}
											value={selectField.value || ""}
											onChange={(val) => {
												selectField.onChange(val);
												onSyncDraft();
											}}
											onBlur={() => {
												selectField.onBlur();
												onSyncDraft();
											}}
											placeholder="Who performs this?"
										/>
									)}
								/>
							</FormItemField>

							{/* Task Instruction */}
							<FormItemField 
								label="Task Instruction"
								error={(errors as any).tasks?.[index]?.description?.message}
							>
								<FormTextarea 
									{...register(`tasks.${index}.description` as any)}
									placeholder="What exactly should be done in this step?"
									className="min-h-[100px]"
									onBlur={onSyncDraft}
								/>
							</FormItemField>

							{/* Actions */}
							<div className="flex justify-end border-t border-zinc-800/50 pt-4">
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => {
										remove(index);
										onSyncDraft();
									}}
									className="text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-colors gap-2 font-mono text-[10px] uppercase tracking-widest"
								>
									<Trash2 className="w-3.5 h-3.5" />
									Remove Step
								</Button>
							</div>
						</div>
					</div>
				))}
			</div>

			<Button
				type="button"
				variant="outline"
				onClick={() => {
					append({ description: "", specialist_id: "" });
					onSyncDraft();
				}}
				className="w-full h-16 rounded-2xl border-2 border-dashed border-zinc-800 hover:border-zinc-700 bg-transparent text-zinc-500 hover:text-white transition-all flex items-center justify-center gap-3 group"
			>
				<Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
				<span className="font-bold uppercase tracking-[0.2em] text-[10px]">Add Another Task to Sequence</span>
			</Button>
		</div>
	);
};
