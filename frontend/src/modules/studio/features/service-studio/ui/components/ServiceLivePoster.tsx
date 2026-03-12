import { useFormContext, useWatch } from "react-hook-form";
import type { ServiceStudioFormData } from "../../types/service-schema";
import { Globe, Activity } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";

const COLOR_TO_RGB: Record<string, string> = {
    blue: "59, 130, 246",
    purple: "168, 85, 247",
    pink: "236, 72, 153",
    green: "34, 197, 94",
    yellow: "234, 179, 8",
    orange: "249, 115, 22",
    default: "113, 113, 122"
};

export const ServiceLivePoster = () => {
	const { control } = useFormContext<ServiceStudioFormData>();
	
	// Use useWatch for more reliable re-renders in deep trees
	const name = useWatch({ control, name: "name" });
	const business_context = useWatch({ control, name: "business_context" });
	const capabilities = useWatch({ control, name: "capabilities" });

	// We'll simulate the "Design" workspace style for the preview
	const accentColor = "pink"; 
	const rgb = COLOR_TO_RGB[accentColor];

	return (
		<div className="h-full w-full flex flex-col items-center justify-center px-8 py-12">
			<div className="w-full">
				<Card className={cn(
					"relative overflow-hidden flex flex-col pt-2 transition-all duration-200 rounded-xl group",
					"border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl",
					"hover:border-pink-500/50"
				)}>
					{/* Accent Top Bar */}
					<div className="absolute top-0 left-0 right-0 h-[2px] opacity-100 z-10 bg-pink-500" />

					{/* Background Grid Pattern */}
					<div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0" 
						style={{ backgroundImage: `radial-gradient(rgb(${rgb}) 0.5px, transparent 0.5px)`, backgroundSize: '12px 12px' }} 
					/>

					<CardHeader className="relative z-10 space-y-3 pb-3 pt-4 px-5">
						<div className="flex justify-between items-start">
							<div className="flex items-center gap-2">
								<div className="p-1.5 rounded bg-muted/30 border border-zinc-100 dark:border-zinc-800">
									<Globe className="h-4 w-4 text-zinc-500" />
								</div>
								<CardTitle className="text-sm font-bold font-display text-zinc-900 dark:text-white">
									{name || "Unnamed Service"}
								</CardTitle>
							</div>
						</div>
						<CardDescription className="text-[11px] mt-1 line-clamp-2 leading-relaxed text-zinc-500 dark:text-zinc-400">
							{business_context || `Integration with ${name || 'external'} platform for automated workflows.`}
						</CardDescription>
					</CardHeader>

					<CardContent className="relative z-10 mt-auto pt-0 pb-4 px-5">
						<div className="flex items-center gap-2">
							<Activity className="h-3 w-3 text-muted-foreground opacity-40" />
							<span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest opacity-60">Connected</span>
						</div>
					</CardContent>
				</Card>

				<div className="mt-12 space-y-4 px-2">
					<div className="space-y-2">
						<div className="flex flex-wrap gap-1 mt-2">
							{capabilities?.map((cap, i) => (
								<span key={i} className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-[8px] font-mono text-zinc-500 border border-zinc-200 dark:border-zinc-800">
									{cap.name}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
