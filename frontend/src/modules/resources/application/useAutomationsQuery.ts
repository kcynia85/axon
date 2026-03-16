import { useAutomations } from "./useAutomations";
import { Automation } from "@/shared/domain/workspaces";

export const useAutomationsQuery = (initialAutomations: readonly Automation[] = []) => {
    const { data: automations = initialAutomations, isLoading, isError } = useAutomations();

    return {
        automations,
        isLoading,
        isError
    };
};
