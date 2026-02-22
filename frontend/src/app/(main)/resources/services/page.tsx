import { ExternalServicesList } from "@/modules/resources/ui/ExternalServicesList";
import { PageHeader } from "@/shared/ui/layout/PageHeader";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { PageContent } from "@/shared/ui/layout/PageContent";
import { Button } from "@/shared/ui/ui/Button";
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
