import { ExternalServicesList } from "@/modules/resources/ui/external-services-list";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";
import { Button } from "@/shared/ui/ui/button";
import { Plus } from "lucide-react";

const ServicesPage = () => {
    return (
        <PageContainer>
            <PageHeader
                title="External Services"
                description="Manage third-party integrations and service capabilities."
            >
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Register Service
                </Button>
            </PageHeader>
            <PageContent>
                <ExternalServicesList />
            </PageContent>
        </PageContainer>
    );
};

export default ServicesPage;
