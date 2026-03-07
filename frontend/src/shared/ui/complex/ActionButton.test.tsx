import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ActionButton } from "./ActionButton";
import { useIsMutating } from "@tanstack/react-query";

// Mock useIsMutating from TanStack Query
vi.mock("@tanstack/react-query", () => ({
  useIsMutating: vi.fn(),
}));

describe("ActionButton Debouncing & Global State", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    (useIsMutating as any).mockReturnValue(0);
  });

  it("should prevent rapid double clicks (UI Debounce)", () => {
    const onClick = vi.fn();
    render(<ActionButton label="Click Me" onClick={onClick} debounceMs={400} />);
    
    const button = screen.getByRole("button", { name: /click me/i });

    // Click multiple times rapidly
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    // Should only be called once immediately
    expect(onClick).toHaveBeenCalledTimes(1);

    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(400);
    });

    // Click again after debounce period
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("should be disabled and show loading state when a global 'create-' mutation is pending", () => {
    // Simulate a pending mutation that starts with 'create-'
    (useIsMutating as any).mockReturnValue(1);

    render(<ActionButton label="Create Entity" />);
    
    const button = screen.getByRole("button", { name: /create entity/i });

    // Button should be disabled due to isAnyCreating logic in ActionButton
    expect(button).toBeDisabled();
    
    // Spinner (Loader2) should be present (rendered via Button's loading prop)
    const spinner = button.querySelector(".animate-spin");
    expect(spinner).toBeTruthy();
  });

  it("should not be affected by non-creation mutations", () => {
    // Simulate a pending mutation that is NOT a 'create-' mutation
    // Note: The actual predicate logic is inside ActionButton, 
    // here we verify if the button respects the logic when useIsMutating returns 0 for our predicate
    (useIsMutating as any).mockImplementation((options) => {
        // Mocking the predicate behavior: 
        // ActionButton uses a predicate to filter mutations. 
        // If useIsMutating returns 0, it means no mutations matched the predicate.
        return 0; 
    });

    render(<ActionButton label="Safe Button" />);
    
    const button = screen.getByRole("button", { name: /safe button/i });
    expect(button).not.toBeDisabled();
  });
});
