import { InboxItem } from "../../../domain";
import { simulateDelay } from "@/shared/infrastructure/mock-adapter";

const MOCK_INBOX: InboxItem[] = [
    {
        id: "1",
        title: "Q3 Marketing Strategy Draft",
        type: "DOCUMENT",
        status: "REVIEW",
        projectName: "Brand Awareness Q3",
        createdAt: "2024-05-20T10:30:00Z",
        preview: "Here is the proposed strategy for Q3 based on competitor analysis..."
    },
    {
        id: "2",
        title: "Landing Page Hero Section",
        type: "CODE",
        status: "DRAFT",
        projectName: "Website Redesign",
        createdAt: "2024-05-19T15:45:00Z",
        preview: "export const Hero = () => { return <section className='h-screen'>...</section> }"
    },
    {
        id: "3",
        title: "Social Media Assets",
        type: "IMAGE",
        status: "REVIEW",
        projectName: "Product Launch",
        createdAt: "2024-05-18T09:00:00Z",
        preview: "[Image Placeholder]"
    }
];

export const getInboxItemsMock = async (): Promise<InboxItem[]> => {
    return simulateDelay(MOCK_INBOX);
};
