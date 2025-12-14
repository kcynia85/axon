import { Project, ProjectStatus, HubType } from "../../../domain";
import { simulateDelay } from "@/shared/infrastructure/mock-adapter";

const MOCK_PROJECTS: Project[] = [
    {
        id: "p1",
        name: "Axon Core System",
        description: "AI Command Center Architecture & MVP",
        domain: HubType.CODING,
        status: ProjectStatus.ACTIVE,
        owner_id: "u1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: "p2",
        name: "Q3 Marketing Strategy",
        description: "Growth analysis and campaign planning",
        domain: HubType.MARKETING,
        status: ProjectStatus.PLANNING,
        owner_id: "u1",
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        updated_at: new Date().toISOString()
    },
    {
        id: "p3",
        name: "User Research 2024",
        description: "Interviews and persona definitions",
        domain: HubType.DISCOVERY,
        status: ProjectStatus.COMPLETED,
        owner_id: "u1",
        created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
        updated_at: new Date().toISOString()
    }
];

export const getProjectsMock = async (): Promise<Project[]> => {
    return simulateDelay(MOCK_PROJECTS);
};

export const createProjectMock = async (data: Partial<Project>): Promise<Project> => {
    const newProject: Project = {
        id: `p${Date.now()}`,
        name: data.name || "Untitled Project",
        description: data.description || "",
        domain: data.domain || HubType.PRODUCT,
        status: ProjectStatus.IDEA,
        owner_id: "u1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...data
    } as Project;
    
    // In a real mock store, we'd push to MOCK_PROJECTS, but for read-only mocks usually sufficient
    // or we can simulate it:
    MOCK_PROJECTS.unshift(newProject);
    
    return simulateDelay(newProject);
};