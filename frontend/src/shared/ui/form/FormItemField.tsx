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
	className,
}: FormItemFieldProps) => {
	return (
		<FormItem className={className}>
			{label && (
				<FormLabel className="text-lg font-mono text-zinc-500 block h4">
					{label}
				</FormLabel>
			)}
			<FormControl>{children}</FormControl>
			{error ? <FormMessage>{error}</FormMessage> : <FormMessage />}
		</FormItem>
	);
};
