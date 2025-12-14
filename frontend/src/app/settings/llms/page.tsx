import { EmptyState } from "@/components/ui/empty-state";
import { Cpu } from "lucide-react";

const LLMsPage = () => {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">LLM Configuration</h1>
            <EmptyState 
                icon={Cpu}
                title="Model Settings"
                description="Manage API keys and select default models for fallback resilience."
            />
        </div>
    );
};

export default LLMsPage;
