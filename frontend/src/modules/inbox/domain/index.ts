export interface InboxItem {
    id: string;
    type: "ARTIFACT" | "MESSAGE";
    status: "PENDING" | "REVIEWED";
    content: any;
}
