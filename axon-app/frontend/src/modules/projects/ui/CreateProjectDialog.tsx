"use client";

import React from "react";
import { CreateProjectDialogView } from "./pure/CreateProjectDialogView";
import { useCreateProjectForm } from "@/modules/projects/application/useCreateProjectForm";
import { useCreateProjectDialog } from "@/modules/projects/application/useCreateProjectDialog";

type CreateProjectDialogProperties = {
    readonly trigger?: React.ReactNode;
};

/**
 * CreateProjectDialog - Container component for the create project dialog.
 * Orchestrates form logic and dialog visibility state.
 */
export const CreateProjectDialog = ({ trigger }: CreateProjectDialogProperties) => {
    const {
        isDialogOpen,
        handleOpenDialog,
        handleCloseDialog
    } = useCreateProjectDialog();

    const formLogic = useCreateProjectForm(handleCloseDialog);

    return (
        <CreateProjectDialogView 
            {...formLogic}
            isDialogOpen={isDialogOpen}
            onOpenChange={handleOpenDialog}
            onClose={handleCloseDialog}
            trigger={trigger}
        />
    );
};
