import { apiClient } from "@/shared/lib/api-client/config";
import {
    InboxItem,
    InboxItemSchema
} from "@/shared/domain/inbox";

export const inboxApi = {
    getInboxItems: async (): Promise<InboxItem[]> => {
        const res = await apiClient.get("/inbox");
        const data = await res.json();
        return data.map((i: any) => InboxItemSchema.parse(i));
    },

    resolveItem: async (id: string): Promise<InboxItem> => {
        const res = await apiClient.patch(`/inbox/${id}`);
        const data = await res.json();
        return InboxItemSchema.parse(data);
    },

    bulkResolve: async (itemIds: string[]): Promise<void> => {
        await apiClient.post("/inbox/bulk-resolve", { item_ids: itemIds });
    }
};
