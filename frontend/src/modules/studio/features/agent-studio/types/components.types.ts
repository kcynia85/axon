import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";

export type AvatarItem = {
	readonly id: number;
	readonly url: string;
};

export type AvatarGallerySliderProps = {
	readonly value?: string | null;
	readonly onChange: (url: string) => void;
};

export type AvatarGallerySliderViewProps = {
	readonly avatars: readonly AvatarItem[];
	readonly value?: string | null;
	readonly onSelect: (url: string) => void;
};

export type LivePosterProps = {
	readonly data: Partial<CreateAgentFormData>;
};

export type LivePosterViewProps = {
	readonly modelName: string;
	readonly inferenceCost: string;
	readonly data: Partial<CreateAgentFormData>;
};
