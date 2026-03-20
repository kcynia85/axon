import { useFormContext } from "react-hook-form";
import type { AutomationFormData } from "../../types/automation-schema";

/**
 * AutomationLivePoster: Visual representation of the automation being configured.
 */
export const AutomationLivePoster = () => {
	const { watch } = useFormContext<AutomationFormData>();
	const platform = watch("connection.platform");
	const url = watch("connection.url");
	const method = watch("connection.method");

	return (
		<div className="h-full w-full flex flex-col items-center justify-center p-12 text-center space-y-8">
			<div className="w-32 h-32 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-2xl">
				<span className="text-4xl font-bold text-primary">
					{platform ? platform[0].toUpperCase() : "A"}
				</span>
			</div>

			<div className="space-y-2">
				<h2 className="text-2xl font-bold tracking-tight text-white uppercase">
					{platform || "Automation Service"}
				</h2>
				<p className="text-sm font-mono text-zinc-500 max-w-md mx-auto">
					{url || "https://your-webhook-url.com"}
				</p>
			</div>

			<div className="flex gap-4">
				<div className="px-4 py-2 bg-zinc-900 rounded-lg border border-zinc-800">
					<span className="text-[10px] font-mono text-zinc-500 block uppercase mb-1">
						Method
					</span>
					<span className="text-sm font-bold text-primary">{method}</span>
				</div>
				<div className="px-4 py-2 bg-zinc-900 rounded-lg border border-zinc-800">
					<span className="text-[10px] font-mono text-zinc-500 block uppercase mb-1">
						Status
					</span>
					<span className="text-sm font-bold text-zinc-300">Draft</span>
				</div>
			</div>
		</div>
	);
};
