"use client";

import { PromptsBrowser } from "@/modules/resources/ui/PromptsBrowser";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { usePromptArchetypes } from "@/modules/resources/application/usePromptArchetypes";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { useRouter } from "next/navigation";

const PromptsPage = () => {
    const router = useRouter();
    const { data: archetypes = [] } = usePromptArchetypes();

    const handleCreateNew = () => {
        router.push("/resources/archetypes/studio");
    };

    return (
        <PageLayout
            title="Archetypes"
            description="Manage and create prompt templates for your AI agents."
            actions={
                <ActionButton 
                    label="Dodaj Archetyp" 
                    onClick={handleCreateNew} 
                />
            }
        >
            <PromptsBrowser initialPrompts={archetypes} />
        </PageLayout>
    );
};

export default PromptsPage;
