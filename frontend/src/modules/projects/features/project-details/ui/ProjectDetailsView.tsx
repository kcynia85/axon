'use client';

import React from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Project, Artifact, ProjectStatus, ApprovalStatus } from "../../../domain";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/ui/Tabs";
import { Button } from "@/shared/ui/ui/Button";
import { ExternalLink, Edit, Plus, FileText, CheckCircle2, Clock, Trash2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { deleteProject } from "../infrastructure/api";
import { cn } from "@/shared/lib/utils";

interface ProjectDetailsViewProps {
    project: Project;
    artifacts: Artifact[];
    activeTab?: string;
}

export const ProjectDetailsView = ({ project, artifacts, activeTab = "overview" }: ProjectDetailsViewProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleTabChange = (tab: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tab);
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;

        try {
            await deleteProject(project.id);
            toast.success("Project deleted");
            router.push("/projects");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete project");
        }
    };

    const getStatusLabel = (status: ProjectStatus) => {
        if (status === ProjectStatus.IN_PROGRESS) return "In Progress";
        if (status === ProjectStatus.DONE) return "Completed";
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-10">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
                <Link href="/dashboard" className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">Dashboard</Link>
                <ChevronRight size={10} className="text-zinc-300" />
                <Link href="/projects" className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">Projects</Link>
                <ChevronRight size={10} className="text-zinc-300" />
                <span className="text-zinc-800 dark:text-zinc-200">{project.project_name || project.name}</span>
            </nav>

            {/* Top Pill */}
            <div>
                <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs font-bold text-zinc-500 uppercase tracking-widest border border-zinc-200 dark:border-zinc-700">
                    Project
                </span>
            </div>

            {/* Main Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
...                <TabsList className="flex bg-transparent border-b border-zinc-100 dark:border-zinc-900 rounded-none h-auto p-0 mb-8 gap-8">
                    <TabsTrigger 
                        value="overview" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:bg-transparent px-0 pb-4 text-sm font-bold uppercase tracking-wider"
                    >
                        Tab: Overview
                    </TabsTrigger>
                    <TabsTrigger 
                        value="resources" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:bg-transparent px-0 pb-4 text-sm font-bold uppercase tracking-wider"
                    >
                        Tab: Key Resources
                    </TabsTrigger>
                    <TabsTrigger 
                        value="artifacts" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:bg-transparent px-0 pb-4 text-sm font-bold uppercase tracking-wider"
                    >
                        Tab: Artefakty
                    </TabsTrigger>
                    <TabsTrigger 
                        value="activity" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:bg-transparent px-0 pb-4 text-sm font-bold uppercase tracking-wider"
                    >
                        Tab: Activity (future)
                    </TabsTrigger>
                </TabsList>

                {/* --- Tab: Overview --- */}
                <TabsContent value="overview" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Project Name:</span>
                            <h1 className="text-3xl font-bold">{project.project_name || project.name}</h1>
                        </div>

                        <div className="space-y-1">
                            <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Status:</span>
                            <p className="text-lg font-bold">{getStatusLabel(project.project_status || project.status!)}</p>
                        </div>

                        <div className="space-y-3">
                            <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Active Workspaces:</span>
                            <div className="flex flex-col space-y-1">
                                {(project.workspaces || ["Design", "Product Management", "Discovery"]).map((ws, i) => (
                                    <span key={i} className="text-lg font-bold text-zinc-800 dark:text-zinc-200">{ws}</span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Keywords:</span>
                            <p className="text-lg font-bold text-zinc-600 dark:text-zinc-400">
                                {project.project_keywords?.join(", ") || "Forma Oto"}
                            </p>
                        </div>

                        <div className="pt-6 flex flex-col space-y-3 max-w-xs">
                            <Button variant="ghost" className="justify-start px-0 text-lg font-bold hover:bg-transparent group h-auto">
                                <Edit className="mr-3 h-5 w-5 text-zinc-400 group-hover:text-black dark:group-hover:text-white" />
                                Edit Project
                            </Button>
                            <Button asChild variant="ghost" className="justify-start px-0 text-lg font-bold hover:bg-transparent group h-auto">
                                <Link href={`/projects/${project.id}/space`}>
                                    <ExternalLink className="mr-3 h-5 w-5 text-zinc-400 group-hover:text-black dark:group-hover:text-white" />
                                    Open Space
                                </Link>
                            </Button>
                            <Button variant="ghost" className="justify-start px-0 text-lg font-bold text-red-500 hover:text-red-600 hover:bg-transparent group h-auto pt-4" onClick={handleDelete}>
                                <Trash2 className="mr-3 h-5 w-5 text-red-300 group-hover:text-red-500" />
                                Delete Project
                            </Button>
                        </div>
                    </div>
                </TabsContent>

                {/* --- Tab: Key Resources --- */}
                <TabsContent value="resources" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex flex-col space-y-6">
                        <div className="flex flex-col space-y-4">
                            {(project.key_resources?.length > 0 ? project.key_resources : [
                                { id: '1', resource_label: 'https://notion.so/product-redesign-strategy...', resource_url: '#' },
                                { id: '2', resource_label: 'https://www.figma.com/board/zqtOuUghkFq...', resource_url: '#' }
                            ]).map((res: any) => (
                                <a 
                                    key={res.id} 
                                    href={res.resource_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-lg font-medium text-zinc-500 hover:text-black dark:hover:text-white underline underline-offset-4 decoration-zinc-200 dark:decoration-zinc-800 transition-colors"
                                >
                                    {res.resource_label}
                                </a>
                            ))}
                        </div>

                        <Button variant="ghost" className="justify-start px-0 text-lg font-bold hover:bg-transparent group h-auto w-fit">
                            <Plus className="mr-3 h-5 w-5 text-zinc-400 group-hover:text-black dark:group-hover:text-white" />
                            Add Resource
                        </Button>
                    </div>
                </TabsContent>

                {/* --- Tab: Artefakty --- */}
                <TabsContent value="artifacts" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="space-y-8">
                        {/* Filters */}
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-bold text-zinc-400">Filtruj:</span>
                            <button className="font-bold border-b-2 border-black dark:border-white">Wszystkie</button>
                            <span className="text-zinc-300 px-1">|</span>
                            <button className="text-zinc-500 hover:text-black dark:hover:text-white transition-colors">Discovery</button>
                        </div>

                        {/* Artifact List */}
                        <div className="flex flex-col space-y-10">
                            {(artifacts.length > 0 ? artifacts : [
                                { id: '1', artifact_name: 'JTBD Analysis Report', artifact_source_path: 'discovery/jtbd-research-flow', artifact_approval_status: 'approved' },
                                { id: '2', artifact_name: 'Market Competitive Analysis', artifact_source_path: 'discovery/competitive-analysis-crew', artifact_approval_status: 'approved' },
                                { id: '3', artifact_name: 'Product Strategy Document', artifact_source_path: 'product-mgmt/strategy-definition-flow', artifact_approval_status: 'in_review' }
                            ]).map((art: any) => (
                                <div key={art.id} className="group cursor-pointer space-y-1">
                                    <h3 className="text-xl font-bold group-hover:underline underline-offset-4">{art.artifact_name || art.title}</h3>
                                    <p className="text-sm font-bold text-zinc-400">{art.artifact_source_path || 'unknown-path'}</p>
                                    <div className="flex items-center gap-2">
                                        {art.artifact_approval_status === 'approved' ? (
                                            <span className="text-sm font-bold text-green-600 flex items-center gap-1.5">
                                                <CheckCircle2 size={14} />
                                                Approved
                                            </span>
                                        ) : (
                                            <span className="text-sm font-bold text-orange-500 flex items-center gap-1.5">
                                                <Clock size={14} />
                                                In Review
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* --- Tab: Activity --- */}
                <TabsContent value="activity" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Timeline of changes</h3>
                        <p className="text-zinc-500 italic">No activity recorded yet.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};
