"use client";

import { PromptArchetypesList } from "@/modules/resources/ui/PromptArchetypesList";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { Button } from "@/shared/ui/ui/Button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const PromptsPage = () => {
    const router = useRouter();

    const handleCreateNew = () => {
        router.push("/resources/archetypes/studio");
    };

    return (
        <PageLayout
            title="Prompt Archetypes"
            description="Manage reusable agent identity templates and system prompts."
            breadcrumbs={[
                { label: "Home", href: "/home" },
                { label: "Resources", href: "/resources" },
                { label: "Prompts" }
            ]}
            actions={
                <Button onClick={handleCreateNew}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Archetype
                </Button>
            }
        >
            <PromptArchetypesList />
        </PageLayout>
    );
};

export default PromptsPage;
