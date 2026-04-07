import { UIState } from "@/modules/agents/infrastructure/AiProvider";

export type RecentlyUsedItem = {
    readonly title: string;
    readonly type: string;
    readonly time: string;
    readonly href: string;
}

export type HomeViewProps = {
    readonly messages: UIState;
    readonly inputValue: string;
    readonly recentlyUsed: readonly RecentlyUsedItem[];
    readonly onInputChange: (value: string) => void;
    readonly onSubmission: (event?: React.FormEvent) => void;
    readonly onKeyDown: (event: React.KeyboardEvent) => void;
}
