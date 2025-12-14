import { Scenario } from "../../../domain";
import { isMockMode } from "@/shared/infrastructure/mock-adapter";
import { getScenariosMock } from "./mock-api";

export const getScenarios = async (): Promise<Scenario[]> => {
    if (isMockMode()) {
        return getScenariosMock();
    }
    return [];
};