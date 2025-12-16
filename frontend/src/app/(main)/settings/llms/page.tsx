import { EmptyState } from "@/components/ui/empty-state";
import { Cpu } from "lucide-react";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";

const LLMsPage = () => {
    return (
        <PageContainer>
            <PageHeader title="LLM Configuration" className="mb-6" />
            <EmptyState 
                icon={Cpu}
                title="Model Settings"
                description="Manage API keys and select default models for fallback resilience."
            />
        </PageContainer>
    );
};

export default LLMsPage;
