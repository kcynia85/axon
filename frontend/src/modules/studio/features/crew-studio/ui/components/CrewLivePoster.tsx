import { useFormContext, useWatch } from "react-hook-form";
import { Users, Workflow, Layers } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { CrewStudioFormData } from "../../types/crew-schema";

export const CrewLivePoster = () => {
	const { control } = useFormContext<CrewStudioFormData>();
	
	const name = useWatch({ control, name: "crew_name" }) || "Unnamed Crew";
	const type = useWatch({ control, name: "crew_process_type" });
	const members = useWatch({ control, name: "agent_member_ids" }) || [];
	const tasks = useWatch({ control, name: "tasks" }) || [];

	// Derived counts based on process type
	const agentCount = type === "Sequential" 
		? new Set(tasks.map(t => t.specialist_id).filter(Boolean)).size
		: members.length;

	const taskCount = tasks.length;

	return (
		<div className="w-full max-w-[320px] aspect-[3/4] bg-zinc-900 rounded-[40px] border border-zinc-800 p-8 flex flex-col justify-between relative overflow-hidden group">
			{/* Background Decorative Element */}
			<div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-1000" />
			
			<div className="space-y-6 relative z-10">
				<div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
					{type === "Sequential" ? <Workflow size={24} /> : <Users size={24} />}
				</div>
				
				<div className="space-y-2">
					<h3 className="text-2xl font-bold tracking-tight text-white line-clamp-2 leading-tight">
						{name}
					</h3>
					<div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
						<Layers size={12} className="text-primary" />
						{type} Process
					</div>
				</div>
			</div>

			<div className="space-y-4 relative z-10">
				<div className="space-y-1">
					<div className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 font-bold">
						Configuration
					</div>
					<div className="text-sm font-bold text-zinc-300">
						{type === "Sequential" 
							? `${taskCount} ${taskCount === 1 ? 'Task' : 'Tasks'} Defined` 
							: `${agentCount} ${agentCount === 1 ? 'Agent' : 'Agents'} Assigned`}
					</div>
				</div>

				<div className="h-[2px] w-full bg-zinc-800 rounded-full overflow-hidden">
					<div 
						className="h-full bg-primary transition-all duration-700 ease-out" 
						style={{ width: name && name !== "Unnamed Crew" ? '100%' : '20%' }}
					/>
				</div>
			</div>
		</div>
	);
};
