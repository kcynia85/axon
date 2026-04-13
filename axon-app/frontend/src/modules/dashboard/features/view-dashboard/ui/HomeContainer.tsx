"use client";

import React from "react";
import { useDashboardLogic } from "../application/useDashboardLogic";
import { HomeView } from "./HomeView";
import { RecentlyUsedItem } from "./HomeView.types";

type HomeContainerProps = {
    readonly recentlyUsed: readonly RecentlyUsedItem[];
};

export const HomeContainer = ({ recentlyUsed }: HomeContainerProps) => {
    const {
        messages,
        inputValue,
        setInputValue,
        handleSubmission,
        handleKeyDown,
    } = useDashboardLogic();

    return (
        <HomeView 
            messages={messages}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSubmission={handleSubmission}
            onKeyDown={handleKeyDown}
        />
    );
};
