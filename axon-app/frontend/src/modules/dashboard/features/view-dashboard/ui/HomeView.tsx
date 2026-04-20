import React from "react";
import { PageContent } from "@/shared/ui/layout/PageContent";
import { MagicSphere } from "@/shared/ui/complex/MagicSphere";
import { AiAssistantCard } from "@/shared/ui/complex/AiAssistantCard";
import { KnowledgeSearchResults } from "@/modules/knowledge/ui/KnowledgeSearchResults";
import { HomeViewProps } from "./HomeView.types";

export const HomeView = ({
    inputValue,
    searchResults = [],
    isSearching = false,
    onInputChange,
    onSubmission,
    onKeyDown,
}: HomeViewProps): React.ReactNode => {
    return (
        <PageContent className="flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center -mt-9 py-12 max-w-5xl mx-auto w-full space-y-3">
                
                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col items-center space-y-6">
                    <MagicSphere />
                    
                    <div className="space-y-2 text-center">
                        <p className="text-zinc-500 dark:text-zinc-400 font-bold tracking-tight text-lg">
                            Hello, Kamil
                        </p>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
                            How can I assist <br className="hidden md:block" /> you today?
                        </h1>
                    </div>
                </div>

                {/* --- MAIN CONTENT (INPUT + RECENTLY USED) --- */}
                <div className="w-full max-w-3xl space-y-9 pt-12">
                    <div className="space-y-4">
                        <AiAssistantCard 
                            value={inputValue}
                            onChange={onInputChange}
                            onSubmit={() => onSubmission()}
                            onKeyDown={onKeyDown}
                        >
                            <KnowledgeSearchResults 
                                results={searchResults}
                                isLoading={isSearching}
                                isVisible={inputValue.length > 2}
                            />
                        </AiAssistantCard>
                    </div>

                   
                </div>
            </div>
        </PageContent>
    );
};
