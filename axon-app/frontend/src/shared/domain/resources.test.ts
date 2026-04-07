import { describe, it, expect } from 'vitest';
import { 
    PromptArchetypeSchema, 
    ExternalServiceSchema, 
    InternalToolSchema
} from './resources';
import { AutomationSchema } from './workspaces';

describe('Resources Domain Schemas - Contract Tests', () => {
    describe('PromptArchetypeSchema', () => {
        it('should validate a complete archetype', () => {
            const validArchetype = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                archetype_name: 'Expert Researcher',
                archetype_description: 'A thorough research assistant',
                archetype_role: 'Senior Researcher',
                archetype_goal: 'Provide comprehensive research',
                archetype_backstory: 'PhD in Computer Science',
                archetype_guardrails: {
                    instructions: ['Be thorough', 'Cite sources'],
                    constraints: ['No speculation']
                },
                archetype_knowledge_hubs: [{ id: 'hub-1', name: 'Research' }],
                archetype_keywords: ['research', 'analysis'],
                workspace_domain: 'engineering',
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z'
            };

            const result = PromptArchetypeSchema.safeParse(validArchetype);
            expect(result.success).toBe(true);
        });
    });

    describe('ExternalServiceSchema', () => {
        it('should validate external service', () => {
            const validService = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                service_name: 'OpenAI API',
                service_category: 'Business',
                service_url: 'https://api.openai.com',
                service_keywords: ['ai', 'llm'],
                availability_workspace: ['engineering'],
                capabilities: [],
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z'
            };

            const result = ExternalServiceSchema.safeParse(validService);
            expect(result.success).toBe(true);
        });
    });

    describe('InternalToolSchema', () => {
        it('should validate internal tool', () => {
            const validTool = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                tool_function_name: 'search_knowledge',
                tool_display_name: 'Search Knowledge',
                tool_description: 'Search the knowledge base',
                tool_category: 'AI_Utils',
                tool_keywords: ['search', 'rag'],
                tool_input_schema: { type: 'object', properties: {} },
                tool_output_schema: { type: 'object', properties: {} },
                tool_is_active: true,
                availability_workspace: ['default'],
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z'
            };

            const result = InternalToolSchema.safeParse(validTool);
            expect(result.success).toBe(true);
        });
    });

    describe('AutomationSchema', () => {
        it('should validate automation', () => {
            const validAutomation = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                automation_name: 'Slack Notification',
                automation_description: 'Send notifications to Slack',
                automation_platform: 'Custom',
                automation_webhook_url: 'https://hooks.slack.com/services/123',
                automation_http_method: 'POST',
                automation_auth_config: { type: 'bearer' },
                automation_input_schema: { type: 'object' },
                automation_output_schema: { type: 'object' },
                automation_validation_status: 'Untested',
                automation_keywords: ['slack', 'notification'],
                availability_workspace: ['default'],
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z'
            };

            const result = AutomationSchema.safeParse(validAutomation);
            expect(result.success).toBe(true);
        });
    });
});
