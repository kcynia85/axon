import { Workflow } from "../../../domain";
import { simulateDelay } from "@/shared/infrastructure/mock-adapter";

const MOCK_WORKFLOWS: Workflow[] = [
    {
        id: "wf-1",
        title: "Content Publishing Chain",
        description: "Research -> Draft -> Review -> Publish to CMS",
        status: "ACTIVE",
        stepsCount: 4,
        lastRun: new Date().toISOString()
    },
    {
        id: "wf-2",
        title: "Competitor Analysis",
        description: "Weekly scrape and summary of competitor pricing",
        status: "ACTIVE",
        stepsCount: 2,
        lastRun: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: "wf-3",
        title: "Onboarding Sequence",
        description: "New user welcome email and resource distribution",
        status: "DRAFT",
        stepsCount: 5
    }
];

export const getWorkflowsMock = async (): Promise<Workflow[]> => {
    return simulateDelay(MOCK_WORKFLOWS);
};