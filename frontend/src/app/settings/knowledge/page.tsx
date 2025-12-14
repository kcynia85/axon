import { AssetList } from "@/modules/knowledge/components/asset-list";

const KnowledgePage = () => {
    return (
        <div className="container mx-auto py-10 px-4">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
                <p className="text-muted-foreground mt-2">
                    Browse assets, templates, and procedures indexed by the system.
                </p>
            </header>
            
            <main>
                <AssetList />
            </main>
        </div>
    );
};

export default KnowledgePage;
