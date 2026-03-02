import { Project, ProjectStatus, Artifact } from "@/modules/projects/domain";

let mockedProjects: readonly Project[] = [
    {
        id: "1",
        project_name: "Deep Research Assistant",
        project_status: ProjectStatus.IN_PROGRESS,
        project_summary: "Automated research pipeline using multi-agent systems for deep market analysis.",
        project_keywords: ["AI", "Research", "Agents"],
        owner_id: "user-1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        key_resources: [],
        artifacts: [],
        workspaces: ["AI Research", "Product Strategy"],
    },
    {
        id: "2",
        project_name: "SEO Content Engine",
        project_status: ProjectStatus.IDEA,
        project_summary: "Content generation engine optimized for long-tail keywords and semantic search.",
        project_keywords: ["SEO", "Marketing", "Content"],
        owner_id: "user-1",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        key_resources: [],
        artifacts: [],
        workspaces: ["Marketing", "Growth"],
    },
    {
        id: "3",
        project_name: "Axon V2 Architecture",
        project_status: ProjectStatus.REVIEW,
        project_summary: "Redesigning the core modular monolith to support federated execution nodes.",
        project_keywords: ["Architecture", "System Design", "Node.js"],
        owner_id: "user-1",
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date(Date.now() - 172800000).toISOString(),
        key_resources: [],
        artifacts: [],
        workspaces: ["Engineering", "DevOps"],
    },
    {
        id: "4",
        project_name: "Customer Feedback Loop",
        project_status: ProjectStatus.DONE,
        project_summary: "Integration of Zendesk and Slack to automatically categorize and route user feedback.",
        project_keywords: ["Integration", "Customer Success"],
        owner_id: "user-1",
        created_at: new Date(Date.now() - 604800000).toISOString(),
        updated_at: new Date(Date.now() - 604800000).toISOString(),
        key_resources: [],
        artifacts: [],
        workspaces: ["Product", "Support"],
    }
];

export const getProjects = async (): Promise<readonly Project[]> => {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockedProjects;
};

export const createProject = async (data: Partial<Project>): Promise<Project> => {
    const newProject: Project = {
        id: Math.random().toString(36).substr(2, 9),
        project_name: data.project_name || "New Project",
        project_status: ProjectStatus.IDEA,
        project_keywords: data.project_keywords || [],
        owner_id: "user-1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        key_resources: [],
        artifacts: [],
        workspaces: ["General"],
    };
    mockedProjects = [newProject, ...mockedProjects];
    return newProject;
};

export const getProjectDetails = async (id: string): Promise<Project | null> => {
    const project = mockedProjects.find(p => p.id === id);
    return project || null;
};

export const getProjectArtifacts = async (_projectId: string): Promise<readonly Artifact[]> => {
    return [];
};

export const deleteProject = async (id: string): Promise<void> => {
    mockedProjects = mockedProjects.filter(p => p.id !== id);
};
