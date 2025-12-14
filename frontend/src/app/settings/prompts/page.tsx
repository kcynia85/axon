import { PromptList } from "@/modules/prompts";

const PromptsPage = () => {
    return (
        <div className="container mx-auto py-10 px-4">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Prompt Library</h1>
                <p className="text-muted-foreground mt-2">
                    Create, version, and manage system instructions for your agents.
                </p>
            </header>
            
            <main>
                <PromptList />
            </main>
        </div>
    );
};

export default PromptsPage;
