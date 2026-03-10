import type { SelectableCardProps } from "./SelectableCard.types";

export const useSelectableCard = ({
	checked,
	onChange,
	disabled,
}: SelectableCardProps) => {
	const handleToggle = () => {
		if (!disabled) {
			onChange(!checked);
		}
	};

	return {
		handleToggle,
	};
};
