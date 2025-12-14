import { Workflow } from "../types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Play, MoreHorizontal, Clock, CheckCircle2, XCircle, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MOCK_WORKFLOWS: Workflow[] = [
    {
        id: "1",
        name: "Content Research & Draft",
        description: "Researcher gathers info -> Writer drafts post -> Manager reviews.",
        steps: 3,
        lastRun: "2 hours ago",
        status: "COMPLETED"
    },
    {
        id: "2",
        name: "Code Refactor Pipeline",
        description: "Scan files -> Analyze Complexity -> Suggest Refactors -> Create PR.",
        steps: 4,
        lastRun: "1 day ago",
        status: "IDLE"
    },
    {
        id: "3",
        name: "Weekly Digest Generation",
        description: "Summarize Project updates -> Format for Email -> Send.",
        steps: 3,
        lastRun: "5 days ago",
        status: "FAILED"
    }
];

const getStatusBadge = (status: string) => {
    switch(status) {
        case 'COMPLETED': return <Badge variant="default" className="bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1"/> Completed</Badge>;
        case 'FAILED': return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1"/> Failed</Badge>;
        case 'RUNNING': return <Badge variant="secondary" className="animate-pulse"><Clock className="w-3 h-3 mr-1"/> Running</Badge>;
        default: return <Badge variant="outline"><Circle className="w-3 h-3 mr-1"/> Idle</Badge>;
    }
}

export const WorkflowList = () => {
    return (
        <div className="border rounded-xl bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Workflow Name</TableHead>
                        <TableHead>Steps</TableHead>
                        <TableHead>Last Run</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {MOCK_WORKFLOWS.map((workflow) => (
                        <TableRow key={workflow.id}>
                            <TableCell>
                                <div>
                                    <div className="font-medium">{workflow.name}</div>
                                    <div className="text-sm text-muted-foreground">{workflow.description}</div>
                                </div>
                            </TableCell>
                            <TableCell>{workflow.steps}</TableCell>
                            <TableCell>{workflow.lastRun}</TableCell>
                            <TableCell>{getStatusBadge(workflow.status)}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon">
                                    <Play className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
