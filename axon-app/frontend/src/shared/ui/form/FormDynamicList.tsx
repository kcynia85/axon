import { Plus, Trash2 } from "lucide-react";
import type { KeyboardEvent } from "react";
import { Button } from "@/shared/ui/ui/Button";
import { Input } from "@/shared/ui/ui/Input";
import type { FormDynamicListProps } from "@/shared/types/form/FormDynamicList.types";
import { useFormDynamicList } from "@/shared/hooks/form/useFormDynamicList";
import { cn } from "@/shared/lib/utils";

export const FormDynamicList = (props: FormDynamicListProps) => {
	const {
		inputValue,
		setInputValue,
		handleAdd,
		handleRemove,
		handleChange,
	} = useFormDynamicList(props);

	const {
		items,
		onBlur,
		placeholder = "Item...",
		addPlaceholder = "Add new item...",
		className,
		plusClassName,
	} = props;

	return (
		<div className="space-y-3">
			{items.map((item, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: item order implies key here
				<div key={`${item}-${index}`} className="flex gap-2 group">
					<Input
						value={item}
						onChange={(e) => handleChange(index, e.target.value)}
						onBlur={onBlur}
						placeholder={placeholder}
						className={cn(
							"bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-200 transition-all text-base h-14 rounded-xl outline-none shadow-inner text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-700 px-6",
							className
						)}
					/>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => handleRemove(index)}
						className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-destructive hover:bg-destructive/10 shrink-0 transition-all h-14 w-14 rounded-xl border border-transparent hover:border-destructive/20"
					>
						<Trash2 className="w-5 h-5" />
					</Button>
				</div>
			))}
			<div className="flex gap-2 group">
				<div className="relative flex-1">
					<button
						type="button"
						onClick={handleAdd}
						className={cn(
							"absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary transition-colors z-10 p-1",
							plusClassName
						)}
					>
						<Plus className="w-5 h-5" />
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
						className={cn(
							"bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-200 transition-all text-base h-14 rounded-xl outline-none shadow-inner text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-700 pl-12 pr-6",
							className
						)}
					/>
				</div>
				<div className="w-14" />
			</div>
		</div>
	);
};
