import { Metadata } from "next";
import { ResourcesSidebar } from "@/modules/resources/ui/ResourcesSidebar";

export const metadata: Metadata = {
    title: "Resources - Axon",
    description: "Manage knowledge bases, prompts, tools, services, and automations",
};

import { ResourcesNavIsland } from "@/modules/resources/ui/ResourcesNavIsland";

export default function ResourcesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-full w-full relative">
            <ResourcesNavIsland />
            <div className="flex-1 overflow-y-auto pt-24">
                {children}
            </div>
        </div>
    );
}
