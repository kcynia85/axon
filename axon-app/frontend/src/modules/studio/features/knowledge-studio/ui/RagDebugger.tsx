import React, { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/ui/Card";
import { MetricBlock } from "@/shared/ui/complex/MetricBlock";
import { Pagination } from "@/shared/ui/layout/Pagination";
import { NativeAccordion } from "@/shared/ui/ui/NativeAccordion";

export type RagDebuggerProps = {
	readonly fileName?: string | null;
	readonly strategy?: string;
	readonly className?: string;
};

const MOCK_CHUNKS = [
	{
		id: 1,
		content: "Wprowadzenie do Roadmapy 2025. Skupiamy się na rozwoju agentów AI oraz optymalizacji procesów RAG. Kluczowym elementem jest zapewnienie wysokiej jakości danych wejściowych.",
		metadata: "source: Roadmap_2025.md, section: intro"
	},
	{
		id: 2,
		content: "Implementacja paginacji w Inspektorze Chunków pozwoli na wygodne przeglądanie wyników processingu. Użytkownik może weryfikować, czy podział tekstu jest logiczny i spójny.",
		metadata: "source: Roadmap_2025.md, section: implementation"
	},
	{
		id: 3,
		content: "Metadane (JSONB) są kluczowe dla filtrowania wyników wyszukiwania wektorowego. Każdy chunk powinien posiadać zestaw tagów umożliwiających precyzyjne odnalezienie kontekstu.",
		metadata: "source: Roadmap_2025.md, section: metadata"
	},
	{
		id: 4,
		content: "Ostatni etap to integracja z silnikiem wyszukiwania. Testowanie overlapu (200 chars) zapewnia, że kontekst nie zostanie utracony na granicach poszczególnych fragmentów tekstu.",
		metadata: "source: Roadmap_2025.md, section: integration"
	}
];

/**
 * RagDebugger: Inspektor Chunków (RAG Debugger) UI component.
 * Features a functional chunk preview with standard pagination wrapped in an accordion.
 */
export const RagDebugger = ({
	fileName,
	strategy,
	className,
}: RagDebuggerProps) => {
	const [activeChunkIndex, setActiveChunkIndex] = useState(1); // Starting with Chunk 2
	const currentChunk = MOCK_CHUNKS[activeChunkIndex];

	const handlePageChange = (page: number) => setActiveChunkIndex(page - 1);
	const handlePrev = () => setActiveChunkIndex((prev) => (prev > 0 ? prev - 1 : prev));
	const handleNext = () => setActiveChunkIndex((prev) => (prev < MOCK_CHUNKS.length - 1 ? prev + 1 : prev));

	const paginationPages = MOCK_CHUNKS.map((_, index) => ({
		number: index + 1,
		isActive: index === activeChunkIndex,
	}));

	return (
		<Card className={cn("w-full bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-900 shadow-xl", className)}>
			<CardHeader className="pb-6 border-b border-zinc-100 dark:border-zinc-900">
				<CardTitle className="text-xl font-bold text-zinc-900 dark:text-white">
					Inspektor Chunków (RAG Debugger)
				</CardTitle>
			</CardHeader>
			
			<CardContent className="space-y-8 pt-6">
				<MetricBlock
					label="Plik"
					value={fileName || "Roadmap_2025.md"}
				/>

				<MetricBlock
					label="Strategia"
					value={strategy || "General Text (1000 chars / 200 overlap)"}
				/>

				{/* Chunk Preview Section wrapped in Accordion */}
				<NativeAccordion title="Podgląd Chunków">
					<div className="space-y-4 pt-4">
						<h3 className="font-bold text-base text-zinc-900 dark:text-white">
							Chunk {currentChunk.id}
						</h3>
						<div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
							<p className="text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
								{currentChunk.content}
							</p>
						</div>
						
						<Pagination 
							pages={paginationPages}
							onPageChange={handlePageChange}
							canGoBack={activeChunkIndex > 0}
							canGoNext={activeChunkIndex < MOCK_CHUNKS.length - 1}
							onBack={handlePrev}
							onNext={handleNext}
							className="pt-4 border-none"
						/>

						<MetricBlock
							label={`Metadane Chunk ${currentChunk.id}`}
							className="pt-4"
							value={
								<div className="font-mono text-[14px] bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-primary/80">
									{currentChunk.metadata}
								</div>
							}
						/>
					</div>
				</NativeAccordion>
			</CardContent>
		</Card>
	);
};
