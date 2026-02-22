import { AutomationsList } from "@/modules/resources/ui/AutomationsList";
import { PageHeader } from "@/shared/ui/layout/PageHeader";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { PageContent } from "@/shared/ui/layout/PageContent";
import { Button } from "@/shared/ui/ui/Button";
import { Plus } from "lucide-react";

const AutomationsPage = () => {
    return (
        <PageContainer>
            <PageHeader
                title="Automations"
                description="Configure webhooks and automated workflows."
            >
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Automation
                </Button>
            </PageHeader>
            <PageContent>
                <AutomationsList />
            </PageContent>
        </PageContainer>
    );
};

export default AutomationsPage;
