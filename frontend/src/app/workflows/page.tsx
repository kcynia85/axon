import { WorkflowList } from "@/modules/workflows/features/manage-workflows/ui/workflow-list";
import { getWorkflows } from "@/modules/workflows/features/manage-workflows/infrastructure/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const WorkflowsPage = async () => {
    const workflows = await getWorkflows();

    return (
        <div className="container mx-auto py-10 px-4">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
                    <p className="text-muted-foreground mt-2">
                        Automate your research and content pipelines.
                    </p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Workflow
                </Button>
            </header>

            <main>
                <WorkflowList items={workflows} />
            </main>
        </div>
    );
};

export default WorkflowsPage;