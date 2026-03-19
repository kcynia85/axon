"use client";

import { PromptsBrowser } from "@/modules/resources/ui/PromptsBrowser";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
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
        <PageContainer>
            <div className="flex justify-end items-center mb-8">
            </div>
            <PromptsBrowser initialPrompts={archetypes} />
        </PageContainer>
    );
};

export default PromptsPage;
