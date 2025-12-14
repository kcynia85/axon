import { Project, ProjectStatus, HubType } from "../../../domain";
import { simulateDelay } from "@/shared/infrastructure/mock-adapter";

// Basic Artifact Type (Local definition if domain missing, or assume domain export)
export interface Artifact {
    id: string;
    projectId: string;
    title: string;
    type: "DOC" | "CODE" | "IMAGE";
    status: "DRAFT" | "APPROVED";
    createdAt: string;
}

const MOCK_PROJECT: Project = {
    id: "p1",
    name: "Axon Core System",
    description: "AI Command Center Architecture & MVP",
    domain: HubType.CODING,
    status: ProjectStatus.ACTIVE,
    owner_id: "u1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
};

const MOCK_ARTIFACTS: Artifact[] = [
    { id: "a1", projectId: "p1", title: "Tech PRD", type: "DOC", status: "APPROVED", createdAt: new Date().toISOString() },
    { id: "a2", projectId: "p1", title: "Backend Architecture", type: "DOC", status: "DRAFT", createdAt: new Date().toISOString() },
    { id: "a3", projectId: "p1", title: "Main.py", type: "CODE", status: "APPROVED", createdAt: new Date().toISOString() }
];

export const getProjectDetailsMock = async (id: string): Promise<Project> => {
    return simulateDelay({ ...MOCK_PROJECT, id });
};

export const getProjectArtifactsMock = async (projectId: string): Promise<Artifact[]> => {
    return simulateDelay(MOCK_ARTIFACTS);
};