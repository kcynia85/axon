import { PromptArchetypesList } from "@/modules/resources/ui/prompt-archetypes-list";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";
import { Button } from "@/shared/ui/ui/button";
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
