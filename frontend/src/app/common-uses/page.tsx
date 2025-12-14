import { ScenarioList } from "@/modules/common-uses/features/catalog/ui/scenario-list";
import { getScenarios } from "@/modules/common-uses/features/catalog/infrastructure/api";

const CommonUsesPage = async () => {
    const scenarios = await getScenarios();

    return (
        <div className="container mx-auto py-10 px-4">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Common Uses</h1>
                <p className="text-muted-foreground mt-2">
                    Standardized workflows and templates for common tasks.
                </p>
            </header>

            <main>
                <ScenarioList items={scenarios} />
            </main>
        </div>
    );
};

export default CommonUsesPage;