import { cn } from "@/shared/lib/utils";
import type { FormNavFooterProps } from "@/shared/types/form/FormNavItem.types";

export const FormNavFooter = ({ children, className }: FormNavFooterProps) => {
	return (
		<div
			className={cn(
				"mt-24 pb-24 pt-8 border-t border-zinc-900 shrink-0",
				className,
			)}
		>
			{children}
		</div>
	);
};
