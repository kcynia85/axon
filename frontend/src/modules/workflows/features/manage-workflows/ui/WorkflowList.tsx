"use client";

import { Workflow } from "../../../domain";
import { Card } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { Play, FileText, Settings, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";
import { deleteWorkflow } from "../infrastructure/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface WorkflowListProps {
    items: Workflow[];
}

export const WorkflowList = ({ items }: WorkflowListProps) => {
    const router = useRouter();

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this workflow?")) return;
        
        try {
            await deleteWorkflow(id);
            toast.success("Workflow deleted");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete workflow");
        }
    };

    return (
        <div className="space-y-4">
             {items.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">No workflows found. Create one to get started.</p>
                </div>
            )}
            {items.map((wf) => (
                <Card key={wf.id} className="flex flex-col md:flex-row items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <Settings className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{wf.title}</h3>
                                <Badge variant={wf.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                    {wf.status}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{wf.description}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <FileText className="h-3 w-3" /> {wf.stepsCount} Steps
                                </span>
                                {wf.lastRun && (
                                    <span>Last run: {new Date(wf.lastRun).toLocaleDateString()}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive"
                            onClick={() => handleDelete(wf.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm">
                            <Play className="h-3 w-3 mr-2" /> Run
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
};