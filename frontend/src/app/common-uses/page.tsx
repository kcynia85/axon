import { ScenarioList } from "@/modules/common-uses/components/scenario-list";

const CommonUsesPage = () => {
    return (
        <div className="container mx-auto py-10 px-4">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Common Uses</h1>
                <p className="text-muted-foreground mt-2">
                    Ready-made scenarios for common agency operations.
                </p>
            </header>

            <main>
                <ScenarioList />
            </main>
        </div>
    );
};

export default CommonUsesPage;