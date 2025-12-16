"use client";

import { Project } from "../../../domain";
import { Artifact } from "../infrastructure/mock-api";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Code, Image as ImageIcon, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProject } from "../infrastructure/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProjectDetailsViewProps {
    project: Project;
    artifacts: Artifact[];
}

export const ProjectDetailsView = ({ project, artifacts }: ProjectDetailsViewProps) => {
    const router = useRouter();

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
        <div className="space-y-8">
            <div className="border-b pb-4">
                <div className="flex justify-between items-start mb-2">
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
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4">Artifacts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {artifacts.map((artifact) => (
                        <Card key={artifact.id} className="hover:bg-muted/50 cursor-pointer transition-colors">
                            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    {artifact.type === 'CODE' ? <Code className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                                </div>
                                <div>
                                    <CardTitle className="text-base">{artifact.title}</CardTitle>
                                    <CardDescription>{new Date(artifact.createdAt).toLocaleDateString()}</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                    {artifacts.length === 0 && (
                        <p className="text-muted-foreground col-span-3 text-center py-8">No artifacts yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};