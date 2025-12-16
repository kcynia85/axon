export type InboxItemType = "DOCUMENT" | "CODE" | "IMAGE";
export type InboxItemStatus = "DRAFT" | "REVIEW" | "APPROVED" | "REJECTED";

export type InboxItem = {
    readonly id: string;
    readonly title: string;
    readonly type: InboxItemType;
    readonly status: InboxItemStatus;
    readonly projectName: string;
    readonly createdAt: string;
    readonly preview: string;
    readonly contentUrl?: string;
}
