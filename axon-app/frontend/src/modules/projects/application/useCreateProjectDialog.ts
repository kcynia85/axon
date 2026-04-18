"use client";

import { useState } from "react";

/**
 * useCreateProjectDialog - Application hook for managing the create project dialog state.
 */
export const useCreateProjectDialog = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    return {
        isDialogOpen,
        handleOpenDialog,
        handleCloseDialog
    };
};
