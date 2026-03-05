"use client";

import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { HomeView } from "@/modules/dashboard/features/view-dashboard/ui/HomeView";
import { useDashboardLogic } from "@/modules/dashboard/features/view-dashboard/application/useDashboardLogic";
import React from "react";

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
                onInputChange={setInputValue}
                onSubmission={handleSubmission}
                onKeyDown={handleKeyDown}
            />
        </PageContainer>
    );
};

export default HomePage;
