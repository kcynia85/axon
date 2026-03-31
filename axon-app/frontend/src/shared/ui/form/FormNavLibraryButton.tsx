import { Button } from "@/shared/ui/ui/Button";
import type { FormNavLibraryButtonProps } from "@/shared/types/form/FormNavItem.types";

export const FormNavLibraryButton = ({
	onClick,
	label = "Library",
	className,
}: FormNavLibraryButtonProps) => {
	return (
		<Button
			variant="ghost"
			className="w-full justify-start text-zinc-600 hover:text-white hover:bg-zinc-900 group transition-all"
			onClick={onClick}
		>
			<span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
				{label}
			</span>
		</Button>
	);
};
