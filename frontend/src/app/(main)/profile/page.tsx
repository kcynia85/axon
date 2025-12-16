import { EmptyState } from "@/components/ui/empty-state";
import { User } from "lucide-react";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";

const ProfilePage = () => {
    return (
       <PageContainer>
            <PageHeader title="User Profile" />
            <PageContent>
                <EmptyState 
                    icon={User}
                    title="Account Settings"
                    description="Manage your profile, notifications, and preferences."
                />
            </PageContent>
        </PageContainer>
    );
};

export default ProfilePage;
