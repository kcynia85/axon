import { describe, it, expect } from 'vitest';
import { AgentSchema, CrewSchema, PatternSchema, TemplateSchema, WorkspaceSchema, CostEstimateSchema } from './workspaces';

describe('Workspaces Domain Schemas - Contract Tests', () => {
    describe('AgentSchema', () => {
        it('should validate a complete agent object', () => {
            const validAgent = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                agentName: 'Research Assistant',
                role: 'researcher',
                goal: 'Help users find information',
                backstory: 'Expert researcher with 10 years experience',
                guardrails: {
                    instructions: ['Be helpful', 'Be concise'],
                    constraints: ['No harmful content']
                },
                fewShotExamples: [],
                reflexion: true,
                temperature: 0.7,
                ragEnforcement: false,
                inputSchema: { type: 'object' },
                outputSchema: { type: 'object' },
                llmModelId: '550e8400-e29b-41d4-a716-446655440001',
                knowledgeHubIds: ['550e8400-e29b-41d4-a716-446655440002'],
                assignedToolIds: ['550e8400-e29b-41d4-a716-446655440003'],
                availabilityWorkspace: ['product', 'engineering'],
                keywords: ['research', 'assistant'],
                createdAt: '2024-01-15T10:00:00Z',
                updatedAt: '2024-01-15T10:00:00Z'
            };

            const result = AgentSchema.safeParse(validAgent);
            expect(result.success).toBe(true);
        });

        it('should validate agent with minimal required fields', () => {
            const minimalAgent = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                agentName: 'Test Agent',
                role: 'assistant',
                goal: 'Test goal',
                availabilityWorkspace: ['default'],
                createdAt: '2024-01-15T10:00:00Z',
                updatedAt: '2024-01-15T10:00:00Z'
            };

            const result = AgentSchema.safeParse(minimalAgent);
            expect(result.success).toBe(true);
        });

        it('should reject agent with invalid UUID', () => {
            const invalidAgent = {
                id: 'not-a-uuid',
                agentName: 'Test Agent',
                role: 'assistant',
                goal: 'Test goal',
                availabilityWorkspace: ['default'],
                createdAt: '2024-01-15T10:00:00Z',
                updatedAt: '2024-01-15T10:00:00Z'
            };

            const result = AgentSchema.safeParse(invalidAgent);
            expect(result.success).toBe(false);
        });
    });

    describe('CrewSchema', () => {
        it('should validate a complete crew object', () => {
            const validCrew = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                crewName: 'Development Team',
                crewDescription: 'Full-stack development crew',
                processType: 'sequential',
                agentMemberIds: ['550e8400-e29b-41d4-a716-446655440001'],
                managerAgentId: '550e8400-e29b-41d4-a716-446655440002',
                keywords: ['development', 'engineering'],
                availabilityWorkspace: ['engineering']
            };

            const result = CrewSchema.safeParse(validCrew);
            expect(result.success).toBe(true);
        });

        it('should reject invalid process type', () => {
            const invalidCrew = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                crewName: 'Test Crew',
                processType: 'invalid_type',
                agentMemberIds: [],
                availabilityWorkspace: ['default']
            };

            const result = CrewSchema.safeParse(invalidCrew);
            expect(result.success).toBe(false);
        });
    });

    describe('CostEstimateSchema', () => {
        it('should validate cost estimate with breakdown', () => {
            const validEstimate = {
                staticCost: 0.001,
                dynamicCost: 0.002,
                totalEstimate: 0.003,
                breakdown: {
                    agentSetup: 0.0005,
                    ragUsage: 0.001,
                    toolCalls: 0.0005,
                    inputTokens: 1000,
                    outputTokens: 500
                },
                suggestions: ['Use smaller model', 'Enable caching']
            };

            const result = CostEstimateSchema.safeParse(validEstimate);
            expect(result.success).toBe(true);
        });
    });
});
