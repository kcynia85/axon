import { EmptyState } from "@/components/ui/empty-state";
import { User } from "lucide-react";

const ProfilePage = () => {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">User Profile</h1>
            <EmptyState 
                icon={User}
                title="Account Settings"
                description="Manage your profile, notifications, and preferences."
            />
        </div>
    );
};

export default ProfilePage;
