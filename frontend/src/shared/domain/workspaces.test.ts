import { describe, it, expect } from 'vitest';
import { AgentSchema, CrewSchema, CostEstimateSchema } from './workspaces';

describe('Workspaces Domain Schemas - Contract Tests', () => {
    describe('AgentSchema', () => {
        it('should validate a complete agent object', () => {
            const validAgent = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                agent_name: 'Research Assistant',
                agent_role_text: 'researcher',
                agent_goal: 'Help users find information',
                agent_backstory: 'Expert researcher with 10 years experience',
                guardrails: {
                    instructions: ['Be helpful', 'Be concise'],
                    constraints: ['No harmful content']
                },
                few_shot_examples: [],
                reflexion: true,
                temperature: 0.7,
                rag_enforcement: false,
                input_schema: { type: 'object' },
                output_schema: { type: 'object' },
                llm_model_id: '550e8400-e29b-41d4-a716-446655440001',
                knowledge_hub_ids: ['550e8400-e29b-41d4-a716-446655440002'],
                availability_workspace: ['product', 'engineering'],
                agent_keywords: ['research', 'assistant'],
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z'
            };

            const result = AgentSchema.safeParse(validAgent);
            expect(result.success).toBe(true);
        });

        it('should validate agent with minimal required fields', () => {
            const minimalAgent = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                agent_name: 'Test Agent',
                agent_role_text: 'assistant',
                agent_goal: 'Test goal',
                availability_workspace: ['default'],
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z'
            };

            const result = AgentSchema.safeParse(minimalAgent);
            expect(result.success).toBe(true);
        });

        it('should reject agent with invalid UUID', () => {
            const invalidAgent = {
                id: 'not-a-uuid',
                agent_name: 'Test Agent',
                agent_role_text: 'assistant',
                agent_goal: 'Test goal',
                availability_workspace: ['default'],
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z'
            };

            const result = AgentSchema.safeParse(invalidAgent);
            expect(result.success).toBe(false);
        });
    });

    describe('CrewSchema', () => {
        it('should validate a complete crew object', () => {
            const validCrew = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                crew_name: 'Development Team',
                crew_description: 'Full-stack development crew',
                crew_process_type: 'Sequential',
                agent_member_ids: ['550e8400-e29b-41d4-a716-446655440001'],
                manager_agent_id: '550e8400-e29b-41d4-a716-446655440002',
                crew_keywords: ['development', 'engineering'],
                availability_workspace: ['engineering'],
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z'
            };

            const result = CrewSchema.safeParse(validCrew);
            expect(result.success).toBe(true);
        });

        it('should reject invalid process type', () => {
            const invalidCrew = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                crew_name: 'Test Crew',
                crew_process_type: 'invalid_type',
                agent_member_ids: [],
                availability_workspace: ['default']
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
