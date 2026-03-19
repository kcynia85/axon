"use client";

import { PromptArchetypesList } from "@/modules/resources/ui/PromptArchetypesList";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { useRouter } from "next/navigation";
import { ActionButton } from "@/shared/ui/complex/ActionButton";

const PromptsPage = () => {
    const router = useRouter();

    const handleCreateNew = () => {
        router.push("/resources/archetypes/studio");
    };

    return (
        <PageContainer>
            <div className="flex justify-start mb-6">
                <ActionButton 
                    label="New Archetype" 
                    onClick={handleCreateNew} 
                    variant="secondary"
                />
            </div>
            <PromptArchetypesList />
        </PageContainer>
    );
};

export default PromptsPage;
