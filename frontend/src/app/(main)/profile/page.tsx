import { EmptyState } from "@/components/ui/EmptyState";
import { User } from "lucide-react";
import { PageHeader } from "@/shared/ui/layout/PageHeader";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { PageContent } from "@/shared/ui/layout/PageContent";

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
