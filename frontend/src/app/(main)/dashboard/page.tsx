"use client";

import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { DashboardView } from "@/modules/dashboard/features/view-dashboard/ui/DashboardView";
import { useDashboardLogic } from "@/modules/dashboard/features/view-dashboard/application/useDashboardLogic";
import React from "react";

const DashboardPage = () => {
    const {
        messages,
        inputValue,
        setInputValue,
        handleSubmission,
        handleKeyDown,
    } = useDashboardLogic();

    return (
        <PageContainer className="max-w-4xl mx-auto">
            <DashboardView 
                messages={messages}
                inputValue={inputValue}
                onInputChange={setInputValue}
                onSubmission={handleSubmission}
                onKeyDown={handleKeyDown}
            />
        </PageContainer>
    );
};

export default DashboardPage;
