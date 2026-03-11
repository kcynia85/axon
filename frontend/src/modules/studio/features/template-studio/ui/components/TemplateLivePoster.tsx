"use client";

import { useFormContext, useWatch } from "react-hook-form";
import type { TemplateStudioFormData } from "../../types/template-studio.types";
import { useMemo } from "react";
import { 
	Checkbox, 
	Divider, 
	ScrollShadow 
} from "@heroui/react";
import { cn } from "@/shared/lib/utils";

type ActionGroup = {
	title: string;
	subactions: { label: string; isCompleted: boolean }[];
};

export const TemplateLivePoster = () => {
	const { control } = useFormContext<TemplateStudioFormData>();
	const data = useWatch({ control });

	const actionGroups = useMemo(() => {
		if (!data.markdown) return [];
		
		const lines = data.markdown.split("\n");
		const groups: ActionGroup[] = [];
		let currentGroup: ActionGroup | null = null;

		for (const line of lines) {
			const trimmedLine = line.trim();
			if (!trimmedLine) continue;
			
			const headerMatch = trimmedLine.match(/^#+\s*(.*)/) || trimmedLine.match(/^\*\*(.*)\*\*/);
			if (headerMatch) {
				currentGroup = { title: headerMatch[1].replace(/\*\*/g, ""), subactions: [] };
				groups.push(currentGroup);
				continue;
			}

			const checkMatch = trimmedLine.match(/^[-*]\s*\[([ xX])\]\s*(.*)/);
			if (checkMatch) {
				if (!currentGroup) {
					currentGroup = { title: "Actions", subactions: [] };
					groups.push(currentGroup);
				}
				currentGroup.subactions.push({
					label: checkMatch[2],
					isCompleted: checkMatch[1].toLowerCase() === 'x'
				});
			}
		}

		return groups;
	}, [data.markdown]);

	return (
		<div className="w-full animate-in fade-in slide-in-from-right-8 duration-700">
			<div className="bg-zinc-900/40 rounded-2xl border border-zinc-800 shadow-2xl backdrop-blur-xl max-h-[85vh] overflow-hidden">
				<ScrollShadow className="h-full p-8 custom-scrollbar">
					{/* Actions Visualization */}
					{actionGroups.length > 0 ? (
						<div className="space-y-12">
							{actionGroups.map((actionGroup, groupIndex) => (
								<div key={groupIndex} className="space-y-5">
									<div className="flex flex-col gap-1.5">
										<h4 className="text-sm font-black text-white">
											{actionGroup.title}
										</h4>
										<Divider className="bg-zinc-800/50" />
									</div>
									<div className="flex flex-col gap-3.5 pl-1">
										{actionGroup.subactions.map((subaction, subactionIndex) => (
											<Checkbox
												key={subactionIndex}
												size="sm"
												radius="full"
												isSelected={subaction.isCompleted}
												isReadOnly
												classNames={{
													label: cn(
														"text-xs font-bold transition-all font-inherit",
														subaction.isCompleted ? "text-zinc-500 line-through" : "text-zinc-200"
													),
													wrapper: "after:bg-zinc-200"
												}}
											>
												{subaction.label}
											</Checkbox>
										))}
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
							<div className="w-12 h-12 rounded-2xl border-2 border-dashed border-zinc-700 flex items-center justify-center">
								<div className="w-2 h-2 rounded-full bg-zinc-700 animate-pulse" />
							</div>
							<p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
								Awaiting content...
							</p>
						</div>
					)}
				</ScrollShadow>
			</div>
		</div>
	);
};
