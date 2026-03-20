import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CostEstimator } from "./CostEstimator";
import type { CostEstimatorData } from "./CostEstimator.types";

const mockData: CostEstimatorData = {
	averageCostPerAction: 0.7,
	contextUsage: {
		current: 4256,
		total: 128000,
	},
	suggestions: ["Zmień model na GPT-4o-mini", "Wyłącz RAG"],
	staticCosts: [
		{ label: "Inicjalizacja Agenta (Setup)", cost: 0.005 },
		{ label: "Koszt użycia RAG (1 Hub)", cost: 0.008 },
		{ label: "Koszt wywołania Narzędzi (2)", cost: 0.002 },
	],
	dynamicCosts: [
		{ label: "Tokeny Wejściowe (Prompt)", tokenCount: "~15k", cost: 0.025 },
		{ label: "Tokeny Wyjściowe (Odpowiedź)", tokenCount: "~2k", cost: 0.008 },
	],
	memoryAllocation: [
		{ label: "System", size: "1.2k" },
		{ label: "Guardrails", size: "2.5k" },
	],
};

describe("CostEstimator", () => {
	it("renders main costs and suggestions correctly", () => {
		render(<CostEstimator data={mockData} />);

		// Header
		expect(screen.getByText("Estymator Kosztów")).toBeDefined();

		// Cost per action
		expect(screen.getByText("Średni ($0.70)")).toBeDefined();

		// Suggestions
		expect(screen.getByText("Zmień model na GPT-4o-mini")).toBeDefined();
		expect(screen.getByText("Wyłącz RAG")).toBeDefined();

		// Context usage
		expect(screen.getByText("4,256 / 128,000 tokenów")).toBeDefined();
	});

	it("renders detailed costs inside accordion", () => {
		render(<CostEstimator data={mockData} />);

		// Details Summary
		expect(screen.getByText("Pokaż Szczegóły")).toBeDefined();

		// Static costs
		expect(screen.getByText("Inicjalizacja Agenta (Setup)")).toBeDefined();
		expect(screen.getByText("$0.005")).toBeDefined();

		// Dynamic costs
		expect(screen.getByText("Tokeny Wejściowe (Prompt)")).toBeDefined();
		expect(screen.getByText("~15k")).toBeDefined();
		expect(screen.getByText("$0.025")).toBeDefined();

		// Memory
		expect(screen.getByText("System")).toBeDefined();
		expect(screen.getByText("1.2k")).toBeDefined();
	});
});
