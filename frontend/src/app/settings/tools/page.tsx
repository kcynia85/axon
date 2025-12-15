import { ToolCatalog, getTools } from "@/modules/tools";

const ToolsPage = async () => {
    const tools = await getTools();

    return (
        <div className="container mx-auto py-10 px-4">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Tools & MCP</h1>
                <p className="text-muted-foreground mt-2">
                    Catalog of tools available for your agents to use.
                </p>
            </header>

            <main>
                <ToolCatalog tools={tools} />
            </main>
        </div>
    );
};

export default ToolsPage;