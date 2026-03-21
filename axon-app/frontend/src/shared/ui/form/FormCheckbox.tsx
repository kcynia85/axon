import { cn } from "@/shared/lib/utils";
import { Checkbox } from "@/shared/ui/ui/Checkbox";
import type { FormCheckboxProps } from "@/shared/types/form/FormCheckbox.types";
import { useFormCheckbox } from "@/shared/hooks/form/useFormCheckbox";

export const FormCheckbox = (props: FormCheckboxProps) => {
	const { handleToggle } = useFormCheckbox(props);

	const {
		checked,
		title,
		description,
		icon: Icon,
		disabled = false,
		className,
		hideCheckbox = false,
		tags,
	} = props;

	const checkboxClass =
		"w-5 h-5 border-2 border-zinc-300 dark:border-zinc-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-black transition-all shadow-none shrink-0 rounded-md pointer-events-none";

	return (
		<button
			type="button"
			onClick={handleToggle}
			className={cn(
				"w-full text-left p-6 rounded-2xl border transition-all flex items-center gap-6 group shadow-sm outline-none",
				disabled
					? "opacity-40 cursor-not-allowed bg-zinc-50 dark:bg-zinc-900/10 border-zinc-100 dark:border-zinc-800/50"
					: "cursor-pointer",
				!disabled && checked
					? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(var(--primary),0.05)]"
					: "",
				!disabled && !checked
					? "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 hover:border-zinc-900 dark:hover:border-zinc-600 focus-visible:border-zinc-900 dark:focus-visible:border-zinc-600"
					: "",
				className,
			)}
		>
			{!hideCheckbox && (
				<Checkbox
					checked={checked}
					disabled={disabled}
					className={checkboxClass}
				/>
			)}

			<div className={cn("flex items-center gap-3", hideCheckbox && "w-full")}>
				{Icon && <Icon className="w-4 h-4 opacity-70" />}
				<div className="space-y-1">
					<h5
						className={cn(
							"font-bold text-base transition-colors",
							checked ? "text-primary" : "text-zinc-900 dark:text-white",
							!disabled && !checked
								? "group-hover:text-zinc-900 dark:group-hover:text-white"
								: "",
						)}
					>
						{title}
					</h5>
					{description && (
						<p className="text-sm text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors">
							{description}
						</p>
					)}
					{tags && tags.length > 0 && (
						<div className="flex flex-wrap gap-1.5 pt-1">
							{tags.map((tag, idx) => (
								<span key={idx} className="text-[10px] text-zinc-500 font-mono">
									#{tag.toLowerCase()}
								</span>
							))}
						</div>
					)}
				</div>
			</div>
		</button>
	);
};
