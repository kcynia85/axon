import { useCallback } from "react";
import { AVATARS } from "../../types/agent-studio.constants";
import type { AvatarGallerySliderProps, AvatarGallerySliderViewProps } from "../../types/components.types";

export const useAvatarGallerySlider = ({
	value,
	onChange,
}: AvatarGallerySliderProps): AvatarGallerySliderViewProps => {
	const onSelect = useCallback(
		(url: string) => {
			onChange(url);
		},
		[onChange],
	);

	return {
		avatars: AVATARS,
		value,
		onSelect,
	};
};
