"use client";

import React from "react";
import { useDashboardLogic } from "../application/useDashboardLogic";
import { HomeView } from "./HomeView";
import { useKnowledgeSearch } from "@/modules/knowledge/application/useKnowledgeSearch";

export const HomeContainer = () => {
    const {
        messages,
        inputValue,
        setInputValue,
        handleSubmission,
        handleKeyDown,
    } = useDashboardLogic();

    const { data: searchResults, isLoading: isSearching } = useKnowledgeSearch(
        inputValue,
        inputValue.length > 2
    );

    return (
        <HomeView 
            messages={messages}
            inputValue={inputValue}
            searchResults={searchResults}
            isSearching={isSearching}
            onInputChange={setInputValue}
            onSubmission={handleSubmission}
            onKeyDown={handleKeyDown}
        />
    );
};
