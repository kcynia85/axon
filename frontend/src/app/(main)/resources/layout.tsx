import { Metadata } from "next";
import { ResourcesSidebar } from "@/modules/resources/ui/resources-sidebar";

export const metadata: Metadata = {
    title: "Resources - Axon",
    description: "Manage knowledge bases, prompts, tools, services, and automations",
};

export default function ResourcesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-full">
            <ResourcesSidebar />
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}
