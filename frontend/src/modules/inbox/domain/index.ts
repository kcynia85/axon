export type InboxItemType = "DOCUMENT" | "CODE" | "IMAGE";
export type InboxItemStatus = "DRAFT" | "REVIEW" | "APPROVED" | "REJECTED";

export interface InboxItem {
    id: string;
    title: string;
    type: InboxItemType;
    status: InboxItemStatus;
    projectName: string;
    createdAt: string;
    preview: string;
    contentUrl?: string;
}