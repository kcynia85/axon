import React, { useMemo } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Search, X, Check, Plus, AlertCircle, RefreshCw } from "lucide-react";
import { Badge } from "@/shared/ui/ui/Badge";
import { Button } from "@/shared/ui/ui/Button";
import { ScrollArea } from "@/shared/ui/ui/ScrollArea";
import { FilterBigMenu } from "@/shared/ui/complex/FilterBigMenu";
import { useInternalSkillsModal, BaseSkill } from "../../application/hooks/sections/useInternalSkillsModal";
import { cn } from "@/shared/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resourcesApi } from "@/modules/resources/infrastructure/api";
import { InternalTool } from "@/shared/domain/resources";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { toast } from "sonner";

export interface InternalSkillsModalProps {
	readonly isOpen: boolean;
	readonly onOpenChange: (open: boolean) => void;
	readonly addedFunctionIds: readonly string[];
	readonly onAddFunction: (id: string) => void;
	readonly onRemoveFunction: (id: string) => void;
}

export const InternalSkillsModal = ({
	isOpen,
	onOpenChange,
	addedFunctionIds,
	onAddFunction,
	onRemoveFunction,
}: InternalSkillsModalProps) => {
	const queryClient = useQueryClient();

	const { data: tools, isLoading } = useQuery({
		queryKey: ["internal-tools"],
		queryFn: resourcesApi.getInternalTools,
		enabled: isOpen,
	});

	const { mutate: syncTools, isPending: isSyncing } = useMutation({
		mutationFn: resourcesApi.syncInternalTools,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["internal-tools"] });
			if (data.errors && data.errors.length > 0) {
				toast.warning(`Synced with errors: ${data.updated} updated.`);
			} else {
				toast.success(`Tools synced successfully! Updated: ${data.updated}`);
			}
		},
		onError: () => toast.error("Failed to sync tools")
	});

	const availableSkills: BaseSkill[] = useMemo(() => {
		if (!tools) return [];
		return tools.map((tool: InternalTool) => ({
			id: tool.id,
			name: tool.tool_name || tool.tool_function_name,
			desc: tool.tool_description || "No description provided",
			category: "Internal"
		}));
	}, [tools]);

	const {
		searchQuery,
		setSearchQuery,
		filterGroups,
		handleApplyFilters,
		handleClearFilters,
		filteredSkills,
		handleOpenChange,
	} = useInternalSkillsModal(isOpen, onOpenChange, availableSkills, addedFunctionIds);

	return (
		<DialogPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

				<DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
					<div className="bg-zinc-950 border border-zinc-800 text-white rounded-xl overflow-hidden shadow-2xl flex flex-col h-[85vh]">
						{/* Header */}
						<div className="flex flex-col border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-sm z-10 shrink-0">
							<div className="flex items-center justify-between p-6 pb-4">
								<div className="space-y-1">
									<DialogPrimitive.Title className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
										Add Custom Functions
										<span className="text-zinc-500 font-normal text-sm ml-2 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800">
											{filteredSkills.length} available
										</span>
									</DialogPrimitive.Title>
									<DialogPrimitive.Description className="text-zinc-400 text-sm">
										Browse and select internal Python functions to attach to this agent.
									</DialogPrimitive.Description>
								</div>
								<DialogPrimitive.Close className="rounded-full p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition-all outline-none">
									<X className="w-5 h-5" />
								</DialogPrimitive.Close>
							</div>

							{/* Toolbar */}
							<div className="px-6 pb-6 flex items-center gap-3">
								<div className="relative flex-1 group">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
									<input
										placeholder="Search functions by name or description..."
										className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
									/>
								</div>
								<FilterBigMenu
									groups={filterGroups}
									onApply={handleApplyFilters}
									onClear={handleClearFilters} // Corrected prop name based on hook
								/>
								<Button 
									variant="outline" 
									size="icon" 
									className="rounded-xl border-zinc-800 hover:bg-zinc-900 hover:text-white shrink-0"
									onClick={() => syncTools()}
									disabled={isSyncing}
									title="Sync tools from code"
								>
									<RefreshCw className={cn("w-4 h-4 text-zinc-400", isSyncing && "animate-spin")} />
								</Button>
							</div>
						</div>

						{/* Content */}
						<ScrollArea className="flex-1 bg-zinc-950">
							<div className="p-6">
								{isLoading ? (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
									</div>
								) : filteredSkills.length > 0 ? (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{filteredSkills.map((fn) => (
											<div
												key={fn.id}
												className={cn(
													"group relative flex flex-col gap-3 p-4 rounded-xl border transition-all duration-200",
													fn.isAdded
														? "bg-primary/5 border-primary/20 hover:bg-primary/10"
														: "bg-zinc-900/30 border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-900/50"
												)}
											>
												<div className="flex items-start justify-between gap-3">
													<div className="space-y-1.5 min-w-0">
														<div className="flex items-center gap-2">
															<h4 className={cn(
																"text-sm font-semibold truncate",
																fn.isAdded ? "text-primary-foreground" : "text-zinc-200"
															)}>
																{fn.name}
															</h4>
															{fn.category && (
																<Badge 
																	variant="secondary" 
																	className="text-[10px] h-5 px-1.5 bg-zinc-800/50 text-zinc-400 border-none"
																>
																	{fn.category}
																</Badge>
															)}
														</div>
														<p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
															{fn.desc}
														</p>
													</div>
													<div className="shrink-0">
														<Button
															size="sm"
															variant={fn.isAdded ? "secondary" : "default"}
															className={cn(
																"h-8 px-3 rounded-lg text-xs font-medium transition-all shadow-none",
																fn.isAdded
																	? "bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary border-transparent"
																	: "bg-white text-black hover:bg-zinc-200 dark:bg-zinc-100 dark:text-zinc-900 border-none"
															)}
															onClick={() =>
																fn.isAdded ? onRemoveFunction(fn.id) : onAddFunction(fn.id)
															}
														>
															{fn.isAdded ? (
																<>
																	<Check className="w-3.5 h-3.5 mr-1.5" />
																	Added
																</>
															) : (
																<>
																	<Plus className="w-3.5 h-3.5 mr-1.5" />
																	Add
																</>
															)}
														</Button>
													</div>
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
										<div className="w-16 h-16 rounded-full bg-zinc-900/50 border border-zinc-800 flex items-center justify-center">
											<AlertCircle className="w-8 h-8 text-zinc-600" />
										</div>
										<div className="space-y-1">
											<h3 className="text-lg font-medium text-zinc-300">No functions found</h3>
											<p className="text-zinc-500 text-sm max-w-sm mx-auto">
												We couldn't find any functions matching your search. Try different keywords or sync your tools.
											</p>
										</div>
										<Button 
											variant="outline" 
											onClick={() => syncTools()} 
											disabled={isSyncing}
											className="mt-4"
										>
											<RefreshCw className={cn("w-4 h-4 mr-2", isSyncing && "animate-spin")} />
											Sync Tools
										</Button>
									</div>
								)}
							</div>
						</ScrollArea>
					</div>
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
};
