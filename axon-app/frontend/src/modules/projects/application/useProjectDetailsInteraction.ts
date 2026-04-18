"use client";
import { useState } from "react";
import { useDeleteProjectMutation } from "./hooks";

type ProjectDetailsInteractionProperties = {
    readonly projectIdentifier: string;
    readonly initialTab?: string;
    readonly onTabChange?: (tab: string) => void;
};

/**
 * useProjectDetailsInteraction - Application hook for managing project details
 * interaction states (deletion, tab management).
 */
export const useProjectDetailsInteraction = ({ 
    projectIdentifier, 
    initialTab = "overview",
    onTabChange 
}: ProjectDetailsInteractionProperties) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { mutate: deleteProject, isPending: isDeleting } = useDeleteProjectMutation();

    const handleOpenDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleConfirmDeletion = () => {
        deleteProject(projectIdentifier);
        setIsDeleteModalOpen(false);
    };

    const handleTabChange = (newTab: string) => {
        onTabChange?.(newTab);
    };

    return {
        isDeleteModalOpen,
        isDeleting,
        handleOpenDeleteModal,
        handleCloseDeleteModal,
        handleConfirmDeletion,
        handleTabChange
    };
};
