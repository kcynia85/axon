import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { FormTextarea } from "@/shared/ui/form/FormTextarea";
import { Button } from "@/shared/ui/ui/Button";
import { Plus, Trash2 } from "lucide-react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";

interface Props {
	agents: { id: string; name: string; subtitle?: string }[];
}

/**
 * SequentialExecution: Manages a list of tasks executed in strict order.
 */
export const SequentialExecution = ({ agents }: Props) => {
	const { control, register, formState: { errors } } = useFormContext();
	const { fields, append, remove } = useFieldArray({
		control,
		name: "tasks",
	});

	return (
		<div className="space-y-12">
			<div className="space-y-8">
				{fields.map((field, index) => (
					<div 
						key={field.id} 
						className="p-8 rounded-3xl border border-zinc-800 bg-zinc-900/20 space-y-6 relative group transition-all hover:border-zinc-700"
					>
						<Button
							variant="ghost"
							size="icon"
							type="button"
							onClick={() => remove(index)}
							className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all text-zinc-500 hover:text-destructive hover:bg-destructive/10"
						>
							<Trash2 className="w-4 h-4" />
						</Button>

						<div className="flex items-center gap-4">
							<div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-mono text-[10px] font-bold text-zinc-500 border border-zinc-700">
								{index + 1}
							</div>
							<span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold">
								Step Definition / Task #{index + 1}
							</span>
						</div>

						<FormItemField 
							label="Task Description"
							error={(errors.tasks as any)?.[index]?.description?.message}
						>
							<FormTextarea 
								{...register(`tasks.${index}.description` as any)} 
								placeholder="What exactly should be performed in this step?" 
								className="min-h-[80px]"
							/>
						</FormItemField>

						<FormItemField 
							label="Executor (Specialist)"
							error={(errors.tasks as any)?.[index]?.specialist_id?.message}
						>
							<Controller
								control={control}
								name={`tasks.${index}.specialist_id` as any}
								render={({ field: selectField }) => (
									<FormSelect
										options={agents}
										value={selectField.value || ""}
										onChange={selectField.onChange}
										placeholder="Assign an agent to this task..."
									/>
								)}
							/>
						</FormItemField>
					</div>
				))}
			</div>

			<Button
				type="button"
				variant="ghost"
				onClick={() => append({ description: "", specialist_id: "" })}
				className="w-full h-16 rounded-3xl border-2 border-dashed border-zinc-800 hover:border-primary/50 hover:bg-primary/5 text-zinc-500 hover:text-primary gap-3 transition-all group"
			>
				<Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
				<span className="font-bold uppercase tracking-[0.2em] text-[10px]">Add Another Task to Sequence</span>
			</Button>
		</div>
	);
};
