import { 
  Workspace, 
  Agent, 
  Crew, 
  Pattern, 
  Template, 
  Service, 
  Automation 
} from "@/shared/domain/workspaces";

// --- Mock Data ---

const MOCK_WORKSPACES: Workspace[] = [
  {
    id: "ws-1",
    name: "Product Development",
    description: "Main workspace for product crew",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ws-2",
    name: "Marketing Ops",
    description: "Campaign management and content creation",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const MOCK_AGENTS: Agent[] = [
  {
    id: "ag-1",
    role: "Product Owner",
    goal: "Define requirements and priorities",
    type: "chat",
  },
  {
    id: "ag-2",
    role: "Developer",
    goal: "Implement features based on specs",
    type: "task",
  }
];

const MOCK_CREWS: Crew[] = [
  {
    id: "cr-1",
    name: "Feature Delivery Crew",
    process: "sequential",
    agents: ["ag-1", "ag-2"],
  }
];

const MOCK_PATTERNS: Pattern[] = [
  {
    id: "pa-1",
    name: "Standard Researcher",
    description: "Basic research pattern",
    type: "behavior",
    content: "{}",
  }
];

const MOCK_TEMPLATES: Template[] = [
  {
    id: "te-1",
    name: "Empty Workspace",
    description: "Start from scratch",
    category: "General",
    tags: ["basic"],
  }
];

const MOCK_SERVICES: Service[] = [
  {
    id: "se-1",
    name: "ElevenLabs",
    url: "elevenlabs.io",
    category: "GenAI",
    keywords: ["audio"],
    capabilities: ["Text-to-Speech", "Voice Cloning", "Dubbing Studio", "+ 2 More"],
    workspaces: ["Growth & Market"],
    authType: "bearer",
    status: "active",
  }
];

const MOCK_AUTOMATIONS: Automation[] = [
  {
    id: "au-1",
    name: "Invoice OCR Scanner",
    status: "Gotowy",
    description: "Wyciąga dane (kwota, data, NIP) z pliku faktury PDF.",
    keywords: ["finanse"],
    context: [
        { name: "file_url", type: "URL" },
        { name: "doc_type", type: "Text" }
    ],
    artefacts: [
        { name: "total", type: "Number" },
        { name: "currency", type: "Text" }
    ],
    workspaces: ["Growth & Market"],
    trigger: "Webhook",
    enabled: true,
    lastRun: new Date().toISOString(),
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
