"use client";

import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { HomeView, RecentlyUsedItem } from "@/modules/dashboard/features/view-dashboard/ui/HomeView";
import { useDashboardLogic } from "@/modules/dashboard/features/view-dashboard/application/useDashboardLogic";
import React from "react";

const recentlyUsed: readonly RecentlyUsedItem[] = [
    { title: "Market Landscape", type: "Space", time: "2 hours ago", href: "/spaces/1" },
    { title: "Axon MVP", type: "Project", time: "3 hours ago", href: "/projects/p1" },
    { title: "Market Research", type: "Space", time: "Yesterday", href: "/spaces/2" },
    { title: "Product Strategy", type: "Project", time: "Yesterday", href: "/projects/p2" },
];

const HomePage = (): React.ReactNode => {
    const {
        messages,
        inputValue,
        setInputValue,
        handleSubmission,
        handleKeyDown,
    } = useDashboardLogic();

    return (
        <PageContainer>
            <HomeView 
                messages={messages}
                inputValue={inputValue}
                recentlyUsed={recentlyUsed}
                onInputChange={setInputValue}
                onSubmission={handleSubmission}
                onKeyDown={handleKeyDown}
            />
        </PageContainer>
    );
};

export default HomePage;
