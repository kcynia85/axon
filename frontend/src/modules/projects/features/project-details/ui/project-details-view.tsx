import { Project } from "../../../domain";
import { Artifact } from "../infrastructure/mock-api";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Code, Image as ImageIcon } from "lucide-react";

interface ProjectDetailsViewProps {
    project: Project;
    artifacts: Artifact[];
}

export const ProjectDetailsView = ({ project, artifacts }: ProjectDetailsViewProps) => {
    return (
        <div className="space-y-8">
            <div className="border-b pb-4">
                <div className="flex items-center gap-4 mb-2">
                    <h2 className="text-3xl font-bold">{project.name}</h2>
                    <Badge>{project.status}</Badge>
                    <Badge variant="outline">{project.domain}</Badge>
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