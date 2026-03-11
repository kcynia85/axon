import { Plus, Trash2 } from "lucide-react";
import type { KeyboardEvent } from "react";
import { Button } from "@/shared/ui/ui/Button";
import { Checkbox } from "@/shared/ui/ui/Checkbox";
import { Input } from "@/shared/ui/ui/Input";
import type { FormPropertyTableProps } from "@/shared/types/form/FormPropertyTable.types";
import { useFormPropertyTable } from "@/shared/hooks/form/useFormPropertyTable";

export const FormPropertyTable = (props: FormPropertyTableProps) => {
	const {
		inputValue,
		setInputValue,
		handleAdd,
		handleRemove,
		handleItemChange,
	} = useFormPropertyTable(props);

	const {
		items,
		onBlur,
		namePlaceholder = "e.g. parameter_name",
		addPlaceholder = "Add item...",
		typeOptions,
	} = props;

	const checkboxClass =
		"w-5 h-5 border-2 border-zinc-300 dark:border-zinc-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-black transition-all shadow-none shrink-0 rounded-md pointer-events-none";

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-[1fr_150px_100px_50px] gap-4 px-4 text-[12px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
				<span>Name</span>
				<span>Type/Format</span>
				<span className="text-center">Req.</span>
				<span></span>
			</div>

			{items.map((item, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: items might not have stable ids
				<div
					key={`${item.name}-${index}`}
					className="grid grid-cols-[1fr_150px_100px_50px] gap-4 items-center p-4 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl group hover:border-zinc-900 dark:hover:border-zinc-600 transition-all focus-within:border-zinc-900 dark:focus-within:border-zinc-200 shadow-inner"
				>
					<Input
						value={item.name}
						onChange={(e) => handleItemChange(index, { name: e.target.value })}
						onBlur={onBlur}
						placeholder={namePlaceholder}
						className="bg-transparent border-none focus:ring-0 h-8 text-sm font-bold p-0 placeholder:text-zinc-400 dark:placeholder:text-zinc-700 shadow-none outline-none text-zinc-900 dark:text-white"
					/>
					<select
						value={item.field_type}
						onChange={(e) => {
							handleItemChange(index, {
								field_type: e.target.value as any,
							});
							onBlur?.();
						}}
						className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-[10px] h-8 px-2 focus:border-zinc-900 dark:focus:border-zinc-200 outline-none transition-colors appearance-none font-mono text-zinc-900 dark:text-white shadow-sm"
					>
						{typeOptions.map((opt) => (
							<option key={opt.value} value={opt.value}>
								{opt.label}
							</option>
						))}
					</select>
					<button
						type="button"
						className="flex justify-center cursor-pointer p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
						onClick={() => {
							handleItemChange(index, { is_required: !item.is_required });
							onBlur?.();
						}}
					>
						<Checkbox checked={item.is_required} className={checkboxClass} />
					</button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => handleRemove(index)}
						className="text-zinc-400 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
					>
						<Trash2 className="w-4 h-4" />
					</Button>
				</div>
			))}

			<div className="grid grid-cols-[1fr_150px_100px_50px] gap-4 items-center p-4 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl group hover:border-zinc-900 dark:hover:border-zinc-600 transition-all focus-within:border-zinc-900 dark:focus-within:border-zinc-200 shadow-inner">
				<div className="relative">
					<button
						type="button"
						onClick={handleAdd}
						className="absolute left-1 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-primary transition-colors z-10 p-1"
					>
						<Plus className="w-4 h-4" />
					</button>
					<Input
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
							if (e.key === "Enter") {
								e.preventDefault();
								handleAdd();
							}
						}}
						placeholder={addPlaceholder}
						className="bg-transparent border-none focus:ring-0 h-8 text-sm font-bold p-0 pl-14 placeholder:text-zinc-400 dark:placeholder:text-zinc-700 shadow-none outline-none text-zinc-900 dark:text-white"
					/>
				</div>
				<div />
				<div />
				<div />
			</div>
		</div>
	);
};
