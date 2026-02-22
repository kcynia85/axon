import { PromptArchetypesList } from "@/modules/resources/ui/PromptArchetypesList";
import { PageHeader } from "@/shared/ui/layout/PageHeader";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { PageContent } from "@/shared/ui/layout/PageContent";
import { Button } from "@/shared/ui/ui/Button";
import { Plus } from "lucide-react";

const PromptsPage = () => {
    return (
        <PageContainer>
            <PageHeader
                title="Prompt Archetypes"
                description="Manage reusable agent identity templates and system prompts."
            >
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Archetype
                </Button>
            </PageHeader>
            <PageContent>
                <PromptArchetypesList />
            </PageContent>
        </PageContainer>
    );
};

export default PromptsPage;
