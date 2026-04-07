import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useParams } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AgentStudio } from "../ui/AgentStudio";

// Mock next/navigation
vi.mock("next/navigation", () => ({
        useParams: vi.fn(),
        useRouter: vi.fn(() => ({
                back: vi.fn(),
                push: vi.fn(),
        })),
}));

// Mock useAgentDraft to avoid localStorage/network during UI tests
vi.mock("@/modules/agents/application/useAgentDraft", () => ({
        useAgentDraft: vi.fn(() => ({
                draft: null,
                isLoading: false,
                saveDraft: vi.fn(),
                clearDraft: vi.fn(),
        })),
}));

// Mock useCreateAgent and useUpdateAgent
vi.mock("@/modules/agents/infrastructure/useAgents", () => ({
        useCreateAgent: vi.fn(() => ({
                mutateAsync: vi.fn(),
                isPending: false,
        })),
        useUpdateAgent: vi.fn(() => ({
                mutateAsync: vi.fn(),
                isPending: false,
        })),
}));

const queryClient = new QueryClient({
        defaultOptions: {
                queries: {
                        retry: false,
                },
        },
});

const renderWithProviders = (ui: React.ReactElement) => {
        return render(
                <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
        );
};

describe("AgentStudio", () => {
        beforeEach(() => {
                vi.clearAllMocks();
                // biome-ignore lint/suspicious/noExplicitAny: test mock
                (useParams as any).mockReturnValue({ workspace: "test-workspace" });
        });

        const enterDesignMode = () => {
                renderWithProviders(<AgentStudio />);
                const emptyAgentButton = screen.getByText("Start Blank");
                fireEvent.click(emptyAgentButton);
        };

        it("renders all architecture sections", () => {
                enterDesignMode();

                // Check navigator and section titles (multiple instances)
                expect(screen.getAllByText("Identity").length).toBeGreaterThan(0);
                expect(screen.getAllByText("Cognition").length).toBeGreaterThan(0);
                expect(screen.getAllByText("Engine").length).toBeGreaterThan(0);
                expect(screen.getAllByText("Skills").length).toBeGreaterThan(0);
                expect(screen.getAllByText("Context").length).toBeGreaterThan(0);
                expect(screen.getAllByText("Artefacts").length).toBeGreaterThan(0);
                expect(screen.getAllByText("Availability").length).toBeGreaterThan(0);
        });

        it("updates agent name in header when input changes", async () => {
                enterDesignMode();

                const nameInput = screen.getByPlaceholderText("Name your agent...");
                fireEvent.change(nameInput, { target: { value: "New Stealth Agent" } });

                await waitFor(() => {
                        // Should be in header/poster
                        expect(screen.getAllByText("New Stealth Agent").length).toBeGreaterThan(
                                0,
                        );
                });
        });

        it("allows adding instructions in Cognition section", async () => {
                enterDesignMode();

                const instructionInput = screen.getByPlaceholderText(
                        "Add new instruction...",
                );
                expect(instructionInput).toBeDefined();

                fireEvent.change(instructionInput, {
                        target: { value: "Always be polite" },
                });
                
                // FormDynamicList adds on Enter or Plus click
                fireEvent.keyDown(instructionInput, { key: 'Enter', code: 'Enter' });

                await waitFor(() => {
                    expect(screen.getByDisplayValue("Always be polite")).toBeDefined();
                });
        });

        it("displays Live Poster with initial data", () => {
                enterDesignMode();

                // Live Poster shows "New Agent" by default
                expect(screen.getByText("New Agent")).toBeDefined();
                // Check for Engine section title instead of Model Engine which might have been changed
                expect(screen.getAllByText("Engine").length).toBeGreaterThan(0);
        });

        it("renders h3 section labels with updated text", () => {
                enterDesignMode();

                expect(screen.getByText("Knowledge Hubs (RAG)")).toBeDefined();
                expect(screen.getByText("Native Skills")).toBeDefined();
                expect(screen.getByText("Tools")).toBeDefined();
        });
});
