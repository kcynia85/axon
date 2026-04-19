"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ActionButton } from "@/shared/ui/complex/ActionButton";

export const NewProjectStudioButton = () => {
    const router = useRouter();
    const { workspace: workspaceId } = useParams<{ workspace: string }>();

    const handleClick = () => {
        if (workspaceId) {
            router.push(`/workspaces/${workspaceId}/projects/studio`);
        } else {
            router.push(`/projects/studio`);
        }
    };

    return (
        <ActionButton label="Nowy projekt" onClick={handleClick} />
    );
};
