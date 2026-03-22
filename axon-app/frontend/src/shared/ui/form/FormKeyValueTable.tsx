import { Plus, Trash2 } from "lucide-react";
import type { KeyboardEvent } from "react";
import { useState } from "react";
import { Button } from "@/shared/ui/ui/Button";
import { Input } from "@/shared/ui/ui/Input";
import type { FormKeyValueTableProps, FormKeyValueItem } from "@/shared/types/form/FormKeyValueTable.types";

export const FormKeyValueTable = ({
	items,
	onChange,
	onBlur,
	keyPlaceholder = "key",
	valuePlaceholder = "value",
	addPlaceholder = "Add metadata...",
}: FormKeyValueTableProps) => {
	const [newKey, setNewKey] = useState("");

	const handleAdd = () => {
		const val = newKey.trim();
		if (val) {
			onChange([
				...items,
				{ 
					id: crypto.randomUUID(),
					key: val, 
					value: "" 
				},
			]);
			setNewKey("");
			onBlur?.();
		}
	};

	const handleRemove = (index: number) => {
		const next = [...items];
		next.splice(index, 1);
		onChange(next);
		onBlur?.();
	};

	const handleItemChange = (
		index: number,
		changes: Partial<FormKeyValueItem>,
	) => {
		const next = [...items];
		next[index] = { ...next[index], ...changes };
		onChange(next);
	};

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-[1fr_1fr_50px] gap-4 px-4 text-[12px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
				<span>Key</span>
				<span>Value</span>
				<span></span>
			</div>

			{items.map((item, index) => (
				<div
					key={item.id}
					className="grid grid-cols-[1fr_1fr_50px] gap-4 items-center p-4 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl group hover:border-zinc-900 dark:hover:border-zinc-600 transition-all focus-within:border-zinc-900 dark:focus-within:border-zinc-200 shadow-inner"
				>
					<Input
						value={item.key}
						onChange={(e) => handleItemChange(index, { key: e.target.value })}
						onBlur={onBlur}
						placeholder={keyPlaceholder}
						className="bg-transparent border-none focus:ring-0 h-8 text-sm font-mono p-0 placeholder:text-zinc-400 dark:placeholder:text-zinc-700 shadow-none outline-none text-zinc-900 dark:text-white"
					/>
					<Input
						value={item.value}
						onChange={(e) => handleItemChange(index, { value: e.target.value })}
						onBlur={onBlur}
						placeholder={valuePlaceholder}
						className="bg-transparent border-none focus:ring-0 h-8 text-sm font-mono p-0 placeholder:text-zinc-400 dark:placeholder:text-zinc-700 shadow-none outline-none text-zinc-500 focus:text-zinc-900 dark:focus:text-white"
					/>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => handleRemove(index)}
						className="text-zinc-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
					>
						<Trash2 className="w-4 h-4" />
					</Button>
				</div>
			))}

			<div className="grid grid-cols-[1fr_1fr_50px] gap-4 items-center p-4 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl group hover:border-zinc-900 dark:hover:border-zinc-600 transition-all focus-within:border-zinc-900 dark:focus-within:border-zinc-200 shadow-inner">
				<div className="relative col-span-2">
					<button
						type="button"
						onClick={handleAdd}
						className="absolute left-1 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-primary transition-colors z-10 p-1"
					>
						<Plus className="w-4 h-4" />
					</button>
					<Input
						value={newKey}
						onChange={(e) => setNewKey(e.target.value)}
						onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
							if (e.key === "Enter") {
								e.preventDefault();
								handleAdd();
							}
						}}
						placeholder={addPlaceholder}
						className="bg-transparent border-none focus:ring-0 h-8 text-sm font-mono p-0 pl-14 placeholder:text-zinc-400 dark:placeholder:text-zinc-700 shadow-none outline-none text-zinc-900 dark:text-white"
					/>
				</div>
				<div />
			</div>
		</div>
	);
};
