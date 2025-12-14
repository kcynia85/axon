import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project, ProjectStatus } from "../../../domain";

interface ProjectCardProps {
    project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle>{project.name}</CardTitle>
                    <Badge variant={project.status === ProjectStatus.ACTIVE ? "default" : "secondary"}>
                        {project.status}
                    </Badge>
                </div>
                <CardDescription>{project.domain} HUB</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description || "No description provided."}
                </p>
            </CardContent>
            <CardFooter>
                <div className="text-xs text-muted-foreground">
                    Created: {new Date(project.created_at).toLocaleDateString()}
                </div>
            </CardFooter>
        </Card>
    );
};
