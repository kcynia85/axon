"use client";

import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { DashboardPrototypeView } from "@/modules/dashboard/features/view-dashboard/ui/DashboardPrototypeView";
import { useDashboardLogic } from "@/modules/dashboard/features/view-dashboard/application/useDashboardLogic";
import React from "react";

const DashboardPrototypePage = () => {
    const {
        messages,
        inputValue,
        setInputValue,
        handleSubmission,
        handleKeyDown,
    } = useDashboardLogic();

    return (
        <PageContainer className="max-w-7xl mx-auto">
            <DashboardPrototypeView 
                messages={messages}
                inputValue={inputValue}
                onInputChange={setInputValue}
                onSubmission={handleSubmission}
                onKeyDown={handleKeyDown}
            />
        </PageContainer>
    );
};

export default DashboardPrototypePage;
