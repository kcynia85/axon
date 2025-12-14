export type ArtifactStatus = "DRAFT" | "REVIEW" | "APPROVED" | "REJECTED";

export interface InboxItem {
    id: string;
    title: string;
    type: "DOCUMENT" | "CODE" | "IMAGE";
    status: ArtifactStatus;
    projectName: string;
    createdAt: string;
    preview: string;
}
