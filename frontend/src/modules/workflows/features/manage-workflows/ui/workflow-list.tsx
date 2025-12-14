import { Workflow } from "../../../domain";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkflowListProps {
    items: Workflow[];
}

export const WorkflowList = ({ items }: WorkflowListProps) => {
    return (
        <div className="space-y-4">
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
                        <Button size="sm">
                            <Play className="h-3 w-3 mr-2" /> Run
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
};