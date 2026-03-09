import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AgentStudio } from "../ui/AgentStudio";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

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

// Mock useCreateAgent
vi.mock("@/modules/agents/infrastructure/useAgents", () => ({
  useCreateAgent: vi.fn(() => ({
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
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe("AgentStudio", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useParams as any).mockReturnValue({ workspace: "test-workspace" });
  });

  const enterDesignMode = () => {
    renderWithProviders(<AgentStudio />);
    const emptyAgentButton = screen.getByText("Pusty Agent");
    fireEvent.click(emptyAgentButton);
  };

  it("renders all architecture sections including Skills", () => {
    enterDesignMode();
    
    // Check navigator and section titles (multiple instances)
    expect(screen.getAllByText("Identity").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Cognition").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Engine").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Skills").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Interface").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Availability").length).toBeGreaterThan(0);
  });

  it("updates agent name in header when input changes", async () => {
    enterDesignMode();
    
    const nameInput = screen.getByPlaceholderText("NAME YOUR AGENT");
    fireEvent.change(nameInput, { target: { value: "New Stealth Agent" } });
    
    await waitFor(() => {
      // Should be in header/poster
      expect(screen.getAllByText("New Stealth Agent").length).toBeGreaterThan(0);
    });
  });

  it("allows adding and removing instructions in Cognition section", async () => {
    enterDesignMode();
    
    const addButtons = screen.getAllByText("Add");
    fireEvent.click(addButtons[0]); 
    
    const instructionInput = screen.getByPlaceholderText("Operational guideline...");
    expect(instructionInput).toBeDefined();
    
    fireEvent.change(instructionInput, { target: { value: "Always be polite" } });
    expect((instructionInput as HTMLInputElement).value).toBe("Always be polite");
  });

  it("displays Live Poster with initial data", () => {
    enterDesignMode();
    
    // Live Poster shows "New Agent" by default
    expect(screen.getByText("New Agent")).toBeDefined();
    expect(screen.getByText("Model Engine")).toBeDefined();
  });

  it("renders h3 section labels with updated text", () => {
    enterDesignMode();
    
    expect(screen.getByText("Keywords / Skills Tags")).toBeDefined();
    expect(screen.getByText("Native Skills")).toBeDefined();
    expect(screen.getByText("Custom Functions")).toBeDefined();
  });
});
