'use client';

import React from "react";
import { Project, Artifact, ProjectStatus } from "../../../domain";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/ui/Tabs";
import { Button } from "@/shared/ui/ui/Button";
import { ExternalLink, Edit, Plus, CheckCircle2, Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteProject } from "../infrastructure/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProjectDetailsViewProps {
    readonly project: Project;
    readonly artifacts: readonly Artifact[];
    readonly activeTab?: string;
    readonly onTabChange?: (tab: string) => void;
}

export const ProjectDetailsView = ({ project, artifacts, activeTab = "overview", onTabChange }: ProjectDetailsViewProps) => {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;

        try {
            await deleteProject(project.id);
            toast.success("Project deleted");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete project");
        }
    };

    const getStatusLabel = (status: ProjectStatus) => {
        if (status === ProjectStatus.IN_PROGRESS) return "In progress";
        if (status === ProjectStatus.DONE) return "Completed";
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    };

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* Main Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={onTabChange} className="w-full flex-1">
                <TabsList className="flex bg-transparent border-b border-zinc-100 dark:border-zinc-900 rounded-none h-auto p-0 mb-6 gap-6 overflow-x-auto overflow-y-hidden scrollbar-none border-none! shadow-none!">
                    {[
                        { id: "overview", label: "Overview" },
                        { id: "resources", label: "Key resources" },
                        { id: "artifacts", label: "Artefakty" },
                        { id: "activity", label: "Activity" }
                    ].map((tab) => (
                        <TabsTrigger 
                            key={tab.id}
                            value={tab.id} 
                            className="rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:bg-transparent! data-[state=active]:shadow-none! px-0 pb-3 text-[11px] font-bold transition-all whitespace-nowrap"
                        >
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* --- Tab: Overview --- */}
                <TabsContent value="overview" className="mt-0 space-y-6 animate-in fade-in slide-in-from-right-2 duration-300 outline-none focus-visible:ring-0">
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-zinc-400">Project name</span>
                            <h2 className="text-xl font-bold">{project.project_name || project.name}</h2>
                        </div>

                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-zinc-400">Status</span>
                            <p className="text-sm font-bold">{getStatusLabel(project.project_status || project.status!)}</p>
                        </div>

                        <div className="space-y-2">
                            <span className="text-[10px] font-bold text-zinc-400">Active workspaces</span>
                            <div className="flex flex-col space-y-1">
                                {(project.workspaces || ["Design", "Product Management", "Discovery"]).map((ws, i) => (
                                    <span key={i} className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{ws}</span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-zinc-400">Keywords</span>
                            <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400">
                                {project.project_keywords?.join(", ") || "No keywords"}
                            </p>
                        </div>

                        <div className="pt-4 flex flex-col space-y-2">
                            <Button variant="ghost" className="justify-start px-0 text-sm font-bold hover:bg-transparent group h-auto py-2">
                                <Edit className="mr-3 h-4 w-4 text-zinc-400 group-hover:text-black dark:group-hover:text-white" />
                                Edit project
                            </Button>
                            <Button asChild variant="ghost" className="justify-start px-0 text-sm font-bold hover:bg-transparent group h-auto py-2">
                                <Link href={`/projects/${project.id}/space`}>
                                    <ExternalLink className="mr-3 h-4 w-4 text-zinc-400 group-hover:text-black dark:group-hover:text-white" />
                                    Open space
                                </Link>
                            </Button>
                            <Button variant="ghost" className="justify-start px-0 text-sm font-bold text-red-500 hover:text-red-600 hover:bg-transparent group h-auto pt-4" onClick={handleDelete}>
                                <Trash2 className="mr-3 h-4 w-4 text-red-300 group-hover:text-red-500" />
                                Delete project
                            </Button>
                        </div>
                    </div>
                </TabsContent>

                {/* --- Tab: Key Resources --- */}
                <TabsContent value="resources" className="mt-0 space-y-6 animate-in fade-in slide-in-from-right-2 duration-300 outline-none focus-visible:ring-0">
                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-col space-y-3">
                            {(project.key_resources?.length > 0 ? project.key_resources : [
                                { id: '1', resource_label: 'Project notion strategy', resource_url: '#' },
                                { id: '2', resource_label: 'Design system figma', resource_url: '#' }
                            ]).map((res: any) => (
                                <a 
                                    key={res.id} 
                                    href={res.resource_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-sm font-bold text-zinc-500 hover:text-black dark:hover:text-white underline underline-offset-4 decoration-zinc-200 dark:decoration-zinc-800 transition-colors"
                                >
                                    {res.resource_label}
                                </a>
                            ))}
                        </div>

                        <Button variant="ghost" className="justify-start px-0 text-sm font-bold hover:bg-transparent group h-auto w-fit py-2">
                            <Plus className="mr-3 h-4 w-4 text-zinc-400 group-hover:text-black dark:group-hover:text-white" />
                            Add resource
                        </Button>
                    </div>
                </TabsContent>

                {/* --- Tab: Artefakty --- */}
                <TabsContent value="artifacts" className="mt-0 space-y-6 animate-in fade-in slide-in-from-right-2 duration-300 outline-none focus-visible:ring-0">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-[10px]">
                            <span className="font-bold text-zinc-400">Filtruj:</span>
                            <button className="font-bold border-b-2 border-black dark:border-white text-zinc-900 dark:text-zinc-100 transition-colors">Wszystkie</button>
                            <span className="text-zinc-300 px-1">|</span>
                            <button className="font-bold text-zinc-500 hover:text-black dark:hover:text-white transition-colors">Discovery</button>
                        </div>

                        <div className="flex flex-col space-y-8">
                            {(artifacts.length > 0 ? artifacts : [
                                { id: '1', artifact_name: 'JTBD analysis report', artifact_source_path: 'discovery/jtbd-research-flow', artifact_approval_status: 'approved' },
                                { id: '2', artifact_name: 'Market competitive analysis', artifact_source_path: 'discovery/competitive-analysis-crew', artifact_approval_status: 'approved' },
                                { id: '3', artifact_name: 'Product strategy document', artifact_source_path: 'product-mgmt/strategy-definition-flow', artifact_approval_status: 'in_review' }
                            ]).map((art: any) => (
                                <div key={art.id} className="group cursor-pointer space-y-1">
                                    <h3 className="text-base font-bold group-hover:underline underline-offset-4">{art.artifact_name || art.title}</h3>
                                    <p className="text-[10px] font-bold text-zinc-400">{art.artifact_source_path || 'unknown-path'}</p>
                                    <div className="flex items-center gap-2">
                                        {art.artifact_approval_status === 'approved' ? (
                                            <span className="text-[10px] font-bold text-green-600 flex items-center gap-1.5">
                                                <CheckCircle2 size={12} />
                                                Approved
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-bold text-blue-500 flex items-center gap-1.5">
                                                <Clock size={12} />
                                                In review
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* --- Tab: Activity --- */}
                <TabsContent value="activity" className="mt-0 space-y-4 animate-in fade-in slide-in-from-right-2 duration-300 outline-none focus-visible:ring-0">
                    <div className="space-y-2">
                        <h3 className="text-sm font-bold text-zinc-400">Timeline of changes</h3>
                        <p className="text-xs text-zinc-500 italic">No activity recorded yet.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};
