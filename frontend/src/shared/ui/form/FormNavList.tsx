import { cn } from "@/shared/lib/utils";
import type { FormNavListProps } from "@/shared/types/form/FormNavItem.types";

export const FormNavList = ({ children, className }: FormNavListProps) => {
	return <ul className={cn("space-y-8", className)}>{children}</ul>;
};
