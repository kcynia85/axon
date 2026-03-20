import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
} from "@/shared/ui/ui/Form";
import { Badge } from "@/shared/ui/ui/Badge";
import { ProjectKeywordsFieldProps } from "../types";
import { ProjectKeywordsContainer } from "./ProjectKeywordsLayout";
import { ProjectKeywordInput } from "./ProjectFormAtoms";
import { ProjectActionRemoveTag } from "./ProjectActionAtoms";

export const ProjectKeywordsField: React.FC<ProjectKeywordsFieldProps> = ({ 
    form, 
    currentKeywords, 
    keywordInput, 
    onKeywordChange, 
    onKeywordKeyDown, 
    onRemoveKeyword 
}) => {
    return (
        <FormField
            control={form.control}
            name="keywords"
            render={() => (
                <FormItem className="space-y-4">
                    <ProjectKeywordsContainer 
                        onClick={() => document.getElementById('keyword-input')?.focus()}
                    >
                        {currentKeywords.map((keyword) => (
                            <Badge 
                                key={keyword} 
                                variant="secondary"
                                className="bg-white dark:bg-zinc-100 text-zinc-900 dark:text-zinc-900 px-5 py-2 text-[12px] font-black border border-zinc-200 dark:border-zinc-300 flex items-center gap-3 rounded-full shadow-md hover:bg-zinc-50 dark:hover:bg-zinc-200 transition-all shrink-0 tracking-normal group/pill"
                            >
                                #{keyword}
                                <ProjectActionRemoveTag onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onRemoveKeyword(keyword);
                                }} />
                            </Badge>
                        ))}
                        <FormControl>
                            <ProjectKeywordInput 
                                id="keyword-input"
                                placeholder={currentKeywords.length === 0 ? "Słowa kluczowe" : ""} 
                                value={keywordInput}
                                onChange={onKeywordChange}
                                onKeyDown={onKeywordKeyDown}
                            />
                        </FormControl>
                    </ProjectKeywordsContainer>
                </FormItem>
            )}
        />
    );
};
