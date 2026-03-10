import { cn } from "@/shared/lib/utils";
import type { FormNavContainerProps } from "@/shared/types/form/FormNavItem.types";

export const FormNavContainer = ({
	children,
	ariaLabel = "Navigator",
	className,
}: FormNavContainerProps) => {
	return (
		<nav aria-label={ariaLabel} className={cn("h-full w-full", className)}>
			{children}
		</nav>
	);
};
