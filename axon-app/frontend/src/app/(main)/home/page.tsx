import React from "react";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { HomeContainer } from "@/modules/dashboard/features/view-dashboard/ui/HomeContainer";
import { RecentlyUsedItem } from "@/modules/dashboard/features/view-dashboard/ui/HomeView.types";

const recentlyUsed: readonly RecentlyUsedItem[] = [
    { title: "Market Landscape", type: "Space", time: "2 hours ago", href: "/spaces/1" },
    { title: "Axon MVP", type: "Project", time: "3 hours ago", href: "/projects/p1" },
    { title: "Market Research", type: "Space", time: "Yesterday", href: "/spaces/2" },
    { title: "Product Strategy", type: "Project", time: "Yesterday", href: "/projects/p2" },
];

export default function HomePage() {
    return (
        <PageContainer>
            <HomeContainer recentlyUsed={recentlyUsed} />
        </PageContainer>
    );
}
