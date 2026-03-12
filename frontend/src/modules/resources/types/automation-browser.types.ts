import { Automation } from "@/shared/domain/resources";
import { useResourceFilters } from "@/shared/lib/hooks/useResourceFilters";

export type ViewMode = "grid" | "list";

export type AutomationBrowserViewState = {
    readonly viewMode: ViewMode;
    readonly setViewMode: (mode: ViewMode) => void;
    readonly selectedAutomationId: string | null;
    readonly isSidebarOpen: boolean;
    readonly setIsSidebarOpen: (isOpen: boolean) => void;
    readonly handleViewDetails: (automationId: string) => void;
    readonly handleCloseSidebar: () => void;
};

export type AutomationFilterResult = {
    readonly processedAutomations: readonly Automation[];
    readonly filterConfiguration: ReturnType<typeof useResourceFilters<Automation>>;
};

export type UseAutomationsFilterProps = {
    readonly automations: readonly Automation[];
};
