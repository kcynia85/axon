import { AgentList } from "@/modules/agents/components/agent-list";

const AgentsPage = () => {
    return (
        <div className="container mx-auto py-10 px-4">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Agent Configuration</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your AI workforce, assign tools, and configure models.
                </p>
            </header>

            <main>
                <AgentList />
            </main>
        </div>
    );
};

export default AgentsPage;
