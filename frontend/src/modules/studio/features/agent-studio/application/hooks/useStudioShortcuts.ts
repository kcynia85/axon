import { useCallback } from "react";
import type React from "react";
import type { UseStudioShortcutsProps, UseStudioShortcutsReturn } from "../../types/hooks.types";

export const useStudioShortcuts = ({
	onSave,
	onEscape,
	isActive,
}: UseStudioShortcutsProps): UseStudioShortcutsReturn => {
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (!isActive) return;

			if ((e.metaKey || e.ctrlKey) && e.key === "s") {
				e.preventDefault();
				onSave();
			}
			if (e.key === "Escape") {
				onEscape();
			}
		},
		[onSave, onEscape, isActive],
	);

	return { handleKeyDown };
};
