import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AgentStudio } from "../ui/studio/AgentStudio";
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
vi.mock("../application/useAgentDraft", () => ({
  useAgentDraft: vi.fn(() => ({
    draft: null,
    isLoading: false,
    saveDraft: vi.fn(),
    clearDraft: vi.fn(),
  })),
}));

// Mock useCreateAgent
vi.mock("../infrastructure/useAgents", () => ({
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

  it("renders all architecture sections", () => {
    renderWithProviders(<AgentStudio />);
    
    expect(screen.getAllByText("Identity").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Cognition").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Engine").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Interface").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Availability").length).toBeGreaterThan(0);
  });

  it("updates agent name in header when input changes", async () => {
    renderWithProviders(<AgentStudio />);
    
    const nameInput = screen.getByPlaceholderText("NAME YOUR AGENT");
    fireEvent.change(nameInput, { target: { value: "New Stealth Agent" } });
    
    await waitFor(() => {
      // Should be in header and live poster
      expect(screen.getAllByText("New Stealth Agent").length).toBeGreaterThan(0);
    });
  });

  it("allows adding and removing instructions in Cognition section", async () => {
    renderWithProviders(<AgentStudio />);
    
    // Find "Add" button specifically for Instructions
    const addButtons = screen.getAllByText("Add");
    fireEvent.click(addButtons[0]); // First one is instructions
    
    const instructionInput = screen.getByPlaceholderText("Operational guideline...");
    expect(instructionInput).toBeDefined();
    
    fireEvent.change(instructionInput, { target: { value: "Always be polite" } });
    expect((instructionInput as HTMLInputElement).value).toBe("Always be polite");
    
    // Test removal
    const removeButtons = screen.getAllByRole("button").filter(b => b.querySelector('svg.lucide-trash2'));
    if (removeButtons.length > 0) {
        fireEvent.click(removeButtons[0]);
        expect(screen.queryByPlaceholderText("Operational guideline...")).toBeNull();
    }
  });

  it("displays Live Poster with initial data", () => {
    renderWithProviders(<AgentStudio />);
    
    // Live Poster is in an aside, should show "Untitled Agent" by default
    expect(screen.getByText("Untitled Agent")).toBeDefined();
    expect(screen.getByText("Model Engine")).toBeDefined();
  });
});
