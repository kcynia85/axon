import { describe, it, expect } from 'vitest';
import { 
    PromptArchetypeSchema, 
    ExternalServiceSchema, 
    InternalToolSchema, 
    AutomationSchema 
} from './resources';

describe('Resources Domain Schemas - Contract Tests', () => {
    describe('PromptArchetypeSchema', () => {
        it('should validate a complete archetype', () => {
            const validArchetype = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                archetypeName: 'Expert Researcher',
                archetypeDescription: 'A thorough research assistant',
                archetypeRole: 'Senior Researcher',
                archetypeGoal: 'Provide comprehensive research',
                archetypeBackstory: 'PhD in Computer Science',
                archetypeGuardrails: {
                    instructions: ['Be thorough', 'Cite sources'],
                    constraints: ['No speculation']
                },
                archetypeKnowledgeHubs: [{ id: 'hub-1', name: 'Research' }],
                archetypeKeywords: ['research', 'analysis'],
                workspaceDomain: 'engineering',
                createdAt: '2024-01-15T10:00:00Z',
                updatedAt: '2024-01-15T10:00:00Z'
            };

            const result = PromptArchetypeSchema.safeParse(validArchetype);
            expect(result.success).toBe(true);
        });
    });

    describe('ExternalServiceSchema', () => {
        it('should validate external service', () => {
            const validService = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                serviceName: 'OpenAI API',
                serviceCategory: 'Business',
                serviceUrl: 'https://api.openai.com',
                serviceKeywords: ['ai', 'llm'],
                availabilityWorkspace: ['engineering'],
                capabilities: [],
                createdAt: '2024-01-15T10:00:00Z',
                updatedAt: '2024-01-15T10:00:00Z'
            };

            const result = ExternalServiceSchema.safeParse(validService);
            expect(result.success).toBe(true);
        });
    });

    describe('InternalToolSchema', () => {
        it('should validate internal tool', () => {
            const validTool = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                toolFunctionName: 'search_knowledge',
                toolDisplayName: 'Search Knowledge',
                toolDescription: 'Search the knowledge base',
                toolCategory: 'AI_Utils',
                toolKeywords: ['search', 'rag'],
                toolInputSchema: { type: 'object', properties: {} },
                toolOutputSchema: { type: 'object', properties: {} },
                toolIsActive: true,
                availabilityWorkspace: ['default'],
                createdAt: '2024-01-15T10:00:00Z',
                updatedAt: '2024-01-15T10:00:00Z'
            };

            const result = InternalToolSchema.safeParse(validTool);
            expect(result.success).toBe(true);
        });
    });

    describe('AutomationSchema', () => {
        it('should validate automation', () => {
            const validAutomation = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                automationName: 'Slack Notification',
                automationDescription: 'Send notifications to Slack',
                automationPlatform: 'Webhook',
                automationWebhookUrl: 'https://hooks.slack.com/...',
                automationHttpMethod: 'POST',
                automationAuthConfig: { type: 'bearer' },
                automationInputSchema: { type: 'object' },
                automationOutputSchema: { type: 'object' },
                automationValidationStatus: 'UNTESTED',
                automationKeywords: ['slack', 'notification'],
                availabilityWorkspace: ['default'],
                executions: [],
                createdAt: '2024-01-15T10:00:00Z',
                updatedAt: '2024-01-15T10:00:00Z'
            };

            const result = AutomationSchema.safeParse(validAutomation);
            expect(result.success).toBe(true);
        });
    });
});
