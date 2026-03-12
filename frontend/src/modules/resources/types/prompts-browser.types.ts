import { PromptArchetype } from "@/shared/domain/resources";
import { useResourceFilters } from "@/shared/lib/hooks/useResourceFilters";

export type PromptsViewMode = "grid" | "list";

export type PromptsBrowserViewState = {
    readonly viewMode: PromptsViewMode;
    readonly setViewMode: (mode: PromptsViewMode) => void;
    readonly selectedPromptId: string | null;
    readonly isSidebarOpen: boolean;
    readonly setIsSidebarOpen: (isOpen: boolean) => void;
    readonly handleViewDetails: (promptId: string) => void;
    readonly handleCloseSidebar: () => void;
};

export type PromptsFilterResult = {
    readonly processedPrompts: readonly PromptArchetype[];
    readonly filterConfiguration: ReturnType<typeof useResourceFilters<PromptArchetype>>;
};

export type UsePromptsFilterProps = {
    readonly prompts: readonly PromptArchetype[];
};

export type PromptsBrowserFacade = {
    readonly prompts: readonly PromptArchetype[];
    readonly processedPrompts: readonly PromptArchetype[];
    readonly recentlyUsedPrompts: readonly PromptArchetype[];
    readonly selectedPrompt: PromptArchetype | null;
    readonly isLoading: boolean;
    readonly isError: boolean;
    readonly filterConfiguration: ReturnType<typeof useResourceFilters<PromptArchetype>>;
} & PromptsBrowserViewState;
