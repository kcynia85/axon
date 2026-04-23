import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { MetaAgentVoiceSection } from '../../studio/features/meta-agent-studio/ui/sections/MetaAgentVoiceSection';
import { MetaAgentEngineSection } from '../../studio/features/meta-agent-studio/ui/sections/MetaAgentEngineSection';
import { MetaAgentPanel } from '../../spaces/ui/meta-agent/MetaAgentPanel';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MetaAgentStudioSchema } from '../../studio/features/meta-agent-studio/types/meta-agent-schema';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// --- Mocks ---

// Mock state for useVoiceInteraction
const voiceMockState = {
    isRecording: false,
    isProcessing: false,
    toggleRecording: vi.fn(),
    playAudioResponse: vi.fn(),
};

// Mock framer-motion to avoid animation issues
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock useVoiceInteraction hook
vi.mock('../../spaces/application/useVoiceInteraction', () => ({
    useVoiceInteraction: () => voiceMockState,
}));

// Mock FormSelect to avoid complex dropdown interactions in unit/integration tests
vi.mock('@/shared/ui/form/FormSelect', () => ({
    FormSelect: ({ options, value, onChange, placeholder, renderTrigger }: any) => (
        <select 
            data-testid="mock-select"
            value={value} 
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">{placeholder}</option>
            {options.map((opt: any) => (
                <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
        </select>
    ),
}));

// Mock Next.js router
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        refresh: vi.fn(),
    }),
}));

// --- Test Utilities ---

const FormWrapper = ({ children, initialValues }: { children: React.ReactNode, initialValues?: any }) => {
    const methods = useForm({
        resolver: zodResolver(MetaAgentStudioSchema),
        defaultValues: {
            meta_agent_system_prompt: "Test prompt",
            meta_agent_temperature: 0.7,
            meta_agent_rag_enabled: true,
            llm_model_id: "model-1",
            voice_provider: "ElevenLabs",
            provider_config: {
                voice_id: "voice-123",
                stability: 0.5,
                speed: 1.0,
            },
            ...initialValues
        }
    });
    return <FormProvider {...methods}>{children}</FormProvider>;
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
    },
});

const ProviderWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
);

describe('Meta-Agent Voice E2E Lifecycle (Integration)', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
        voiceMockState.isRecording = false;
        voiceMockState.isProcessing = false;
    });

    describe('Studio Configuration', () => {
        it('renders ElevenLabs specific fields when selected', async () => {
            render(
                <FormWrapper>
                    <MetaAgentVoiceSection />
                </FormWrapper>
            );

            // Check if Voice ID field is present by value
            expect(screen.getByDisplayValue(/voice-123/i)).toBeInTheDocument();

            // Check if Stability slider label is present
            expect(screen.getByText(/Stability/i)).toBeInTheDocument();
            
            // Check if Model select is present (value)
            const providerInfo = screen.getAllByText(/ElevenLabs/i);
            expect(providerInfo.length).toBeGreaterThan(0);
        });

        it('switches provider and resets configuration', async () => {
            render(
                <FormWrapper>
                    <MetaAgentVoiceSection />
                </FormWrapper>
            );

            // Change provider to Cartesia
            // We use the first select (Voice Provider)
            const providerSelect = screen.getAllByTestId('mock-select')[0];
            fireEvent.change(providerSelect, { target: { value: 'Cartesia' } });

            // Verify Cartesia specific fields appear (Model ID)
            await waitFor(() => {
                expect(screen.getByPlaceholderText(/e.g. sonic-english/i)).toBeInTheDocument();
            });
            
            // Verify ElevenLabs specific fields (like Stability) are gone
            expect(screen.queryByText(/Stability/i)).not.toBeInTheDocument();
        });

        it('filters models to only show reasoning-enabled models in Cognitive Engine', async () => {
            const mockModels: any[] = [
                { id: '1', model_display_name: 'GPT-4', model_id: 'gpt-4', model_supports_thinking: false },
                { id: '2', model_display_name: 'o1-preview', model_id: 'o1', model_supports_thinking: true },
                { id: '3', model_display_name: 'Claude 3.5 Sonnet', model_id: 'claude-3-5', model_supports_thinking: false },
            ];

            render(
                <FormWrapper>
                    <MetaAgentEngineSection llmModels={mockModels} />
                </FormWrapper>
            );

            // Check the select options
            const modelSelect = screen.getByTestId('mock-select');
            const options = within(modelSelect).getAllByRole('option');
            
            // Should contain: placeholder + 1 reasoning model (o1-preview)
            expect(options.length).toBe(2);
            expect(screen.getByText(/o1-preview/i)).toBeInTheDocument();
            
            // Should NOT contain non-reasoning models
            expect(screen.queryByText(/GPT-4/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/Claude 3.5 Sonnet/i)).not.toBeInTheDocument();
        });
    });

    describe('Space Canvas Interaction', () => {
        const defaultPanelProps: any = {
            isOpen: true,
            onClose: vi.fn(),
            drafts: [],
            connections: [],
            reasoning: null,
            isProposing: false,
            error: null,
            onPropose: vi.fn(),
            onApproveDrafts: vi.fn(),
            onRejectDraft: vi.fn(),
            onNewChat: vi.fn(),
            contextLabel: 'Space Canvas',
            knowledgeEnabled: true,
            setKnowledgeEnabled: vi.fn(),
            attachedFiles: [],
            addFiles: vi.fn(),
            removeFile: vi.fn()
        };

        it('triggers recording when microphone button is clicked', () => {
            render(
                <ProviderWrapper>
                    <MetaAgentPanel {...defaultPanelProps} />
                </ProviderWrapper>
            );

            const micButton = screen.getByTitle(/Voice Input/i);
            fireEvent.click(micButton);

            expect(voiceMockState.toggleRecording).toHaveBeenCalled();
        });

        it('shows active state and white styling when recording', () => {
            // Update mock state before render
            voiceMockState.isRecording = true;

            render(
                <ProviderWrapper>
                    <MetaAgentPanel {...defaultPanelProps} />
                </ProviderWrapper>
            );

            const micButton = screen.getByTitle(/Stop Recording/i);
            expect(micButton).toBeInTheDocument();
            
            // Verify "Selected" state styles (bg-white text-black)
            expect(micButton.className).toContain('bg-white');
            expect(micButton.className).toContain('text-black');
            expect(micButton.className).toContain('border-white');
        });
    });
});

