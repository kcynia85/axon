"use client";

import { PromptsBrowser } from "@/modules/resources/ui/PromptsBrowser";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { usePromptArchetypes } from "@/modules/resources/application/usePromptArchetypes";
import { Button } from "@/shared/ui/ui/Button";
import { Plus } from "lucide-react";
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
        >
            <PromptsBrowser initialPrompts={archetypes} />
        </PageLayout>
    );
};

export default PromptsPage;
