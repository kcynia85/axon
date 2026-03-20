import { renderHook, act } from "@testing-library/react";
import { useCrewForm } from "../application/useCrewForm";
import { describe, it, expect } from "vitest";
import React from "react";

describe("useCrewForm", () => {
    it("should initialize with default values", () => {
        const { result } = renderHook(() => useCrewForm());

        expect(result.current.currentType).toBe("Hierarchical");
        expect(result.current.estimatedCost).toBe(0); // 0 members * 45.0
    });

    it("should calculate estimated cost based on agent members for Hierarchical type", () => {
        const { result } = renderHook(() => useCrewForm());

        act(() => {
            result.current.form.setValue("agent_member_ids", ["agent-1", "agent-2"]);
        });

        // 2 members * 45.0 = 90
        expect(result.current.estimatedCost).toBe(90);
    });

    it("should calculate estimated cost based on tasks for Sequential type", () => {
        const { result } = renderHook(() => useCrewForm());

        act(() => {
            result.current.handleTypeChange("Sequential");
            result.current.form.setValue("tasks", [
                { id: "1", description: "Task 1", specialist_id: "agent-1" },
                { id: "2", description: "Task 2", specialist_id: "agent-2" },
                { id: "3", description: "Task 3", specialist_id: "agent-1" }
            ]);
        });

        expect(result.current.currentType).toBe("Sequential");
        // 3 tasks * 45.0 = 135
        expect(result.current.estimatedCost).toBe(135);
    });

    it("should not reset fields when changing crew type", () => {
        const { result } = renderHook(() => useCrewForm());

        act(() => {
            result.current.form.setValue("crew_name", "Test Crew");
            result.current.form.setValue("agent_member_ids", ["agent-1"]);
        });

        expect(result.current.form.getValues("crew_name")).toBe("Test Crew");
        expect(result.current.estimatedCost).toBe(45);

        act(() => {
            result.current.handleTypeChange("Parallel");
        });

        expect(result.current.currentType).toBe("Parallel");
        expect(result.current.form.getValues("crew_name")).toBe("Test Crew");
        expect(result.current.form.getValues("agent_member_ids")).toEqual(["agent-1"]);
        expect(result.current.estimatedCost).toBe(45);
    });
});
