import type * as React from "react";
import { cn } from "@/shared/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/ui/Card";
import { MetricBlock } from "@/shared/ui/complex/MetricBlock";
import { CheckCircle2 } from "lucide-react";

export type KnowledgeResourceStatusCardProps = {
	readonly model: string;
	readonly chunksCount: number;
	readonly className?: string;
};

/**
 * KnowledgeResourceStatusCard: Displays the indexing status and basic info for an existing resource.
 * Stylized to match the CostEstimator and RagDebugger.
 */
export const KnowledgeResourceStatusCard = ({
	model,
	chunksCount,
	className,
}: KnowledgeResourceStatusCardProps) => {
	return (
		<Card className={cn("w-full bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-900 shadow-xl", className)}>
			<CardHeader className="pb-6 border-b border-zinc-100 dark:border-zinc-900">
				<CardTitle className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
					Status Zasobu
				</CardTitle>
			</CardHeader>
			
			<CardContent className="space-y-8 pt-6">
				<MetricBlock
					label="Status"
					value={
						<div className="flex items-center gap-2 text-emerald-500 font-bold">
							<CheckCircle2 className="w-4 h-4" />
							<span>Ready (Zsynchronizowane)</span>
						</div>
					}
				/>

				<MetricBlock
					label="Model Embeddingu"
					value={model}
				/>

				<MetricBlock
					label="Liczba Chunków"
					value={
						<div className="font-mono text-[14px]">
							{chunksCount} fragmentów
						</div>
					}
				/>
			</CardContent>
		</Card>
	);
};
