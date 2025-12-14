import { Workflow } from "../../../domain";
import { isMockMode } from "@/shared/infrastructure/mock-adapter";
import { getWorkflowsMock } from "./mock-api";

export const getWorkflows = async (): Promise<Workflow[]> => {
    if (isMockMode()) {
        return getWorkflowsMock();
    }
    return [];
};