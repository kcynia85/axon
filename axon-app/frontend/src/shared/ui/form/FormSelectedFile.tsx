import React from "react";
import { X, FileText } from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";
import { cn } from "@/shared/lib/utils";

interface FormSelectedFileProps {
	readonly fileName: string;
	readonly fileSize?: string | null;
	readonly onRemove: () => void;
	readonly label?: string;
	readonly className?: string;
}

/**
 * FormSelectedFile: A reusable component to display a selected file within a form context.
 * Designed to match the Axon Studio aesthetic.
 */
export const FormSelectedFile = ({
	fileName,
	fileSize,
	onRemove,
	label = "Wybrano",
	className,
}: FormSelectedFileProps) => {
	return (
		<div
			className={cn(
				"flex items-center gap-4 p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 group transition-all",
				className,
			)}
		>
			<div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 group-hover:border-primary/30 transition-all shadow-sm">
				<FileText className="w-6 h-6 text-zinc-400 dark:text-zinc-500 group-hover:text-primary transition-colors" />
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2">
					<span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
						{label}
					</span>
					{fileSize && (
						<>
							<span className="text-zinc-300 dark:text-zinc-700 font-mono text-xs">
								•
							</span>
							<span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
								{fileSize}
							</span>
						</>
					)}
				</div>
				<h4 className="text-zinc-900 dark:text-white font-mono text-sm truncate mt-1 underline decoration-zinc-200 dark:border-zinc-800 underline-offset-8">
					{fileName}
				</h4>
			</div>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				onClick={onRemove}
				className="text-zinc-400 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-400/10 h-10 w-10 transition-all"
			>
				<X className="w-5 h-5" />
			</Button>
		</div>
	);
};
