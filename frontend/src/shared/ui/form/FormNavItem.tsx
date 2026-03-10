import { cn } from "@/shared/lib/utils";
import type { FormNavItemProps } from "@/shared/types/form/FormNavItem.types";
import { FormProgress } from "./FormProgress";

export const FormNavItem = ({
	number,
	title,
	currentProgress,
	totalProgress,
	isActive,
	onClick,
	className,
}: FormNavItemProps) => {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"group block w-full text-left space-y-2 transition-all outline-none cursor-pointer",
				isActive ? "opacity-100 scale-[1.02]" : "opacity-40 hover:opacity-60",
				className,
			)}
		>
			<div className="flex items-center justify-between">
				<span
					className={cn(
						"font-mono text-[10px] font-bold tracking-tighter transition-colors",
						isActive ? "text-white" : "text-zinc-500",
					)}
				>
					0{number}
				</span>
				{totalProgress > 0 && (
					<span
						className={cn(
							"font-mono text-[8px] transition-colors",
							isActive ? "text-white/80" : "text-zinc-500",
						)}
					>
						{currentProgress}/{totalProgress}
					</span>
				)}
			</div>
			<div
				className={cn(
					"text-sm font-bold uppercase tracking-[0.2em] transition-colors",
					isActive ? "text-white" : "text-zinc-400",
				)}
			>
				{title}
			</div>
			<FormProgress
				current={currentProgress}
				total={totalProgress}
				isActive={isActive}
			/>
		</button>
	);
};
