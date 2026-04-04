import {
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/shared/ui/ui/Form";
import type { FormItemFieldProps } from "@/shared/types/form/FormPrimitives.types";

export const FormItemField = ({
	label,
	children,
	error,
	hint,
	className,
}: FormItemFieldProps) => {
	return (
		<FormItem className={className}>
			{label && (
				<FormLabel className="text-lg font-mono text-zinc-200 block mb-3">
					{label}
				</FormLabel>
			)}
			{hint && (
				<p className="text-base font-mono text-zinc-500 mb-4 -mt-2">
					{hint}
				</p>
			)}
			<FormControl>{children}</FormControl>
			<FormMessage className="mt-2">{error}</FormMessage>
		</FormItem>
	);
};
