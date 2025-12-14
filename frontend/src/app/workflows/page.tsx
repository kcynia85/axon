import { WorkflowList } from "@/modules/workflows/components/workflow-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const WorkflowsPage = () => {
    return (
        <div className="container mx-auto py-10 px-4">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
                    <p className="text-muted-foreground mt-2">
                        Orchestrate multi-step agent processes.
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> New Workflow
                </Button>
            </header>

            <main>
                <WorkflowList />
            </main>
        </div>
    );
};

export default WorkflowsPage;