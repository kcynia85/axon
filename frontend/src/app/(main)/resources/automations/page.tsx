import { AutomationsList } from "@/modules/resources/ui/automations-list";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";
import { Button } from "@/shared/ui/ui/button";
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
