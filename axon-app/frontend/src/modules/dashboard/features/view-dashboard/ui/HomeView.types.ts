import { UIState } from "@/modules/agents/infrastructure/AiProvider";
import { KnowledgeSearchResult } from "@/modules/knowledge/infrastructure/api";

export type HomeViewProps = {
    readonly messages: UIState;
    readonly inputValue: string;
    readonly searchResults?: KnowledgeSearchResult[];
    readonly isSearching?: boolean;
    readonly onInputChange: (value: string) => void;
    readonly onSubmission: (event?: React.FormEvent) => void;
    readonly onKeyDown: (event: React.KeyboardEvent) => void;
}
