'use client';

import { Project, Artifact } from "../../../domain";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Code, Image as ImageIcon, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { deleteProject } from "../infrastructure/api";
import { toast } from "sonner";
import { ChatSessionView, AgentRole } from "@/modules/agents";

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
            router.push("/dashboard");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete project");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold">{project.name}</h2>
                    <Badge>{project.status}</Badge>
                    <Badge variant="outline">{project.domain}</Badge>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                </div>
            </div>

            <p className="text-muted-foreground text-lg">{project.description}</p>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-md">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                    <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Project Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Status</p>
                                            <p className="font-medium">{project.status}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Domain</p>
                                            <p className="font-medium">{project.domain}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Created</p>
                                            <p className="font-medium">{project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Unknown'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="h-[500px]">
                            <ChatSessionView projectId={project.id} agentRole={AgentRole.MANAGER} />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="resources" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Key Resources</CardTitle>
                            <CardDescription>Links to external tools and documents</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600 font-bold text-xs">N</div>
                                    <div>
                                        <p className="font-medium text-sm">Notion Wiki</p>
                                        <p className="text-xs text-muted-foreground">Product documentation</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                                    <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center text-purple-600 font-bold text-xs">F</div>
                                    <div>
                                        <p className="font-medium text-sm">Figma Designs</p>
                                        <p className="text-xs text-muted-foreground">UI mockups and wireframes</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-600 font-bold text-xs">G</div>
                                    <div>
                                        <p className="font-medium text-sm">GitHub Repo</p>
                                        <p className="text-xs text-muted-foreground">Source code</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="artifacts" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {artifacts.map((artifact) => (
                            <Card key={artifact.id} className="hover:bg-muted/50 cursor-pointer transition-colors">
                                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        {artifact.type === 'CODE' ? <Code className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{artifact.title}</CardTitle>
                                        <CardDescription>
                                            {artifact.created_at ? new Date(artifact.created_at).toLocaleDateString() : 'Unknown'}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                        {artifacts.length === 0 && (
                            <p className="text-muted-foreground col-span-2 text-center py-8">No artifacts yet.</p>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};