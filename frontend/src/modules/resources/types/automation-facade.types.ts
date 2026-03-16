import { Automation } from "@/shared/domain/workspaces";
import { AutomationBrowserViewState } from "../types/automation-browser.types";
import { useResourceFilters } from "@/shared/lib/hooks/useResourceFilters";

export type AutomationBrowserFacade = {
    readonly automations: readonly Automation[];
    readonly processedAutomations: readonly Automation[];
    readonly recentlyUsedAutomations: readonly Automation[];
    readonly selectedAutomation: Automation | null;
    readonly isLoading: boolean;
    readonly isError: boolean;
    readonly filterConfiguration: ReturnType<typeof useResourceFilters<Automation>>;
} & AutomationBrowserViewState;
