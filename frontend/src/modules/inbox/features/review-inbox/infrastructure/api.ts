import { InboxItem } from "../../../domain";
import { isMockMode } from "@/shared/infrastructure/mock-adapter";
import { getInboxItemsMock } from "./mock-api";

export const getInboxItems = async (): Promise<InboxItem[]> => {
    if (isMockMode()) {
        return getInboxItemsMock();
    }
    
    // Placeholder for real API
    return [];
};
