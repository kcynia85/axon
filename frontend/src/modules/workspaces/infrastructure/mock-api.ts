import {
  Workspace,
  Agent,
  Crew,
  Pattern,
  Template,
  Service,
  Automation,
  PatternTypeSchema,
  ProcessTypeSchema
} from "@/shared/domain/workspaces";

// --- Mock Data ---

const MOCK_WORKSPACES: Workspace[] = [
  {
    id: "ws-1",
    name: "Product Development",
    description: "Main workspace for product crew",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "ws-2",
    name: "Marketing Ops",
    description: "Campaign management and content creation",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const MOCK_AGENTS: Agent[] = [
  {
    id: "6ea3c829-5778-43e6-a0fa-b930d099958d",
    agent_name: "Product Owner",
    agent_role_text: "Lead Product Strategy",
    agent_goal: "Define requirements and priorities",
    agent_backstory: "Experienced product lead with focus on delivery.",
    guardrails: { instructions: [], constraints: [] },
    few_shot_examples: [],
    reflexion: false,
    temperature: 0.7,
    rag_enforcement: false,
    availability_workspace: ["ws-1"],
    agent_keywords: ["product"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "7ea3c829-5778-43e6-a0fa-b930d099958e",
    agent_name: "Developer",
    agent_role_text: "Fullstack implementation",
    agent_goal: "Implement features based on specs",
    agent_backstory: "Senior dev specialized in Next.js and FastAPI.",
    guardrails: { instructions: [], constraints: [] },
    few_shot_examples: [],
    reflexion: false,
    temperature: 0.5,
    rag_enforcement: false,
    availability_workspace: ["ws-1"],
    agent_keywords: ["coding"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const MOCK_CREWS: Crew[] = [
  {
    id: "8ea3c829-5778-43e6-a0fa-b930d099958f",
    crew_name: "Feature Delivery Crew",
    crew_description: "Handles E2E features",
    crew_process_type: "Sequential",
    agent_member_ids: [MOCK_AGENTS[0].id, MOCK_AGENTS[1].id],
    availability_workspace: ["ws-1"],
    crew_keywords: ["delivery"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const MOCK_PATTERNS: Pattern[] = [
  {
    id: "9ea3c829-5778-43e6-a0fa-b930d0999590",
    pattern_name: "Standard Researcher",
    pattern_type: "Pattern",
    pattern_okr_context: "Research initiatives",
    pattern_graph_structure: {},
    pattern_keywords: ["research"],
    availability_workspace: ["ws-1"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const MOCK_TEMPLATES: Template[] = [
  {
    id: "aea3c829-5778-43e6-a0fa-b930d0999591",
    template_name: "Empty Workspace",
    template_description: "Start from scratch",
    template_markdown_content: "# Welcome",
    template_checklist_items: [],
    template_keywords: ["basic"],
    availability_workspace: ["ws-1"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const MOCK_SERVICES: Service[] = [
  {
    id: "bea3c829-5778-43e6-a0fa-b930d0999592",
    service_name: "ElevenLabs",
    service_description: "Voice generation platform",
    service_category: "GenAI",
    availability_workspace: ["ws-1"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const MOCK_AUTOMATIONS: Automation[] = [
  {
    id: "cea3c829-5778-43e6-a0fa-b930d0999593",
    automation_name: "Invoice OCR Scanner",
    automation_description: "Extracts data from PDF invoices.",
    automation_platform: "n8n",
    availability_workspace: ["ws-1"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

// --- Mock Functions ---

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  getWorkspaces: async (): Promise<Workspace[]> => {
    await delay(600);
    return MOCK_WORKSPACES;
  },

  getWorkspace: async (id: string): Promise<Workspace | null> => {
    await delay(400);
    return MOCK_WORKSPACES.find((w) => w.id === id) || null;
  },

  getAgents: async (workspaceId: string): Promise<Agent[]> => {
    await delay(500);
    return MOCK_AGENTS;
  },

  getCrews: async (workspaceId: string): Promise<Crew[]> => {
    await delay(500);
    return MOCK_CREWS;
  },

  getPatterns: async (workspaceId: string): Promise<Pattern[]> => {
    await delay(300);
    return MOCK_PATTERNS;
  },

  getTemplates: async (workspaceId: string): Promise<Template[]> => {
    await delay(300);
    return MOCK_TEMPLATES;
  },

  getServices: async (workspaceId: string): Promise<Service[]> => {
    await delay(300);
    return MOCK_SERVICES;
  },

  getAutomations: async (workspaceId: string): Promise<Automation[]> => {
    await delay(300);
    return MOCK_AUTOMATIONS;
  }
};
