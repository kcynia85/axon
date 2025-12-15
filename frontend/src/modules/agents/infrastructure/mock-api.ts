import { AgentRole, AgentConfig } from "../domain";
import { simulateDelay } from "@/shared/infrastructure/mock-adapter";

const MOCK_AGENTS: AgentConfig[] = [
    {
        id: "123e4567-e89b-12d3-a456-426614174000",
        role: AgentRole.MANAGER,
        description: "Orchestrates complex tasks and delegates to other agents.",
        tools: ["delegate_task", "review_plan"],
        model_tier: "TIER_2_EXPERT",
        system_instruction: "You are the Project Manager..."
    },
    {
        id: "123e4567-e89b-12d3-a456-426614174001",
        role: AgentRole.RESEARCHER,
        description: "Searches knowledge base and internet for information.",
        tools: ["search_knowledge", "find_asset"],
        model_tier: "TIER_1_FAST",
        system_instruction: "You are the Researcher..."
    },
    {
        id: "123e4567-e89b-12d3-a456-426614174002",
        role: AgentRole.BUILDER,
        description: "Writes code and implements solutions.",
        tools: ["write_code", "read_code"],
        model_tier: "TIER_2_EXPERT",
        system_instruction: "You are the Builder..."
    },
    {
        id: "123e4567-e89b-12d3-a456-426614174003",
        role: AgentRole.WRITER,
        description: "Creates content and documentation.",
        tools: ["write_markdown"],
        model_tier: "TIER_1_FAST",
        system_instruction: "You are the Writer..."
    }
];

export const getAgentsMock = async (): Promise<AgentConfig[]> => {
    return simulateDelay(MOCK_AGENTS);
};