"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPrompts, deletePrompt } from "../infrastructure/api";
import { toast } from "sonner";
import { PromptListView } from "./PromptListView";

export const PromptList = () => {
    const { data: prompts = [], isLoading, refetch } = useQuery({
        queryKey: ["prompts"],
        queryFn: getPrompts,
    });

    const [promptToDeleteId, setPromptToDeleteId] = useState<string | null>(null);

    const handleDeleteClick = (id: string) => {
        setPromptToDeleteId(id);
    };

    const confirmDelete = async () => {
        if (promptToDeleteId) {
            try {
                await deletePrompt(promptToDeleteId);
                toast.success("Prompt deleted");
                setPromptToDeleteId(null);
                refetch();
            } catch (error) {
                console.error("Failed to delete prompt:", error);
                toast.error("Failed to delete prompt");
            }
        }
    };

    const cancelDelete = () => {
        setPromptToDeleteId(null);
    };

    const promptToDeleteTitle = prompts.find(p => p.id === promptToDeleteId)?.title;

    return (
        <PromptListView 
            prompts={prompts}
            isLoading={isLoading}
            onSaved={() => refetch()}
            onDeleteClick={handleDeleteClick}
            promptToDeleteId={promptToDeleteId}
            onConfirmDelete={confirmDelete}
            onCancelDelete={cancelDelete}
            promptToDeleteTitle={promptToDeleteTitle}
        />
    );
};
