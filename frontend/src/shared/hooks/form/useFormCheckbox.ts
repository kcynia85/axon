import type { FormCheckboxProps } from "@/shared/types/form/FormCheckbox.types";

export const useFormCheckbox = ({
	checked,
	onChange,
	disabled,
}: FormCheckboxProps) => {
	const handleToggle = () => {
		if (!disabled) {
			onChange(!checked);
		}
	};

	return {
		handleToggle,
	};
};
