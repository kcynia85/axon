import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/ui/Badge";
import type { TagInputProps } from "@/shared/types/form/TagInput.types";
import { useTagInput } from "@/shared/hooks/form/useTagInput";

export const TagInput = (props: TagInputProps) => {
	const {
		inputValue,
		setInputValue,
		inputRef,
		handleKeyDown,
		handleBlur,
		removeTag,
		tags,
	} = useTagInput(props);

	const { placeholder = "Add tags...", className } = props;

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: forwards focus
		// biome-ignore lint/a11y/useKeyWithClickEvents: handled by inner input
		<div
			className={cn(
				"flex flex-wrap gap-3 p-5 min-h-[5rem] bg-zinc-50 dark:bg-black rounded-xl border border-zinc-200 dark:border-zinc-800 focus-within:border-zinc-900 dark:focus-within:border-zinc-200 transition-all cursor-text shadow-inner",
				className,
			)}
			onClick={() => inputRef.current?.focus()}
		>
			{tags.map((tag) => (
				<div key={tag} className="relative group">
					<Badge
						variant="secondary"
						className="bg-white dark:bg-zinc-100 text-zinc-900 dark:text-zinc-900 px-5 py-2 text-[12px] font-black border border-zinc-200 dark:border-zinc-300 flex items-center gap-3 rounded-full shadow-md hover:bg-zinc-50 dark:hover:bg-zinc-200 transition-all shrink-0 tracking-normal"
					>
						#{tag}
						<button
							type="button"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								removeTag(tag);
							}}
							className="p-1 -mr-1 hover:bg-black hover:text-white rounded-full transition-all flex items-center justify-center w-fit"
						>
							<X size={12} className="stroke-[3]" />
						</button>
					</Badge>
				</div>
			))}
			<input
				ref={inputRef}
				placeholder={tags.length === 0 ? placeholder : ""}
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyDown={handleKeyDown}
				onBlur={handleBlur}
				className="flex-1 min-w-[120px] bg-transparent border-none text-zinc-900 dark:text-white focus:ring-0 text-base font-bold p-0 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-700"
			/>
		</div>
	);
};
