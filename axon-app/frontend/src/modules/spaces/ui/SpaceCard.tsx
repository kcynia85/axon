import React from "react";
import { MainCard, MainCardHeader, MainCardContent, MainCardFooter } from "@/shared/ui/complex/MainCard";
import { StatusBadge } from "@/shared/ui/complex/StatusBadge";
import type { SpaceCardProperties } from "./types";

/**
 * SpaceCard component displays a single space in a grid format.
 * Pure presentation, no internal state.
 */
export const SpaceCard = ({ space: spaceItem }: SpaceCardProperties) => {
    return (
        <MainCard href={`/spaces/${spaceItem.id}`}>
            <MainCardHeader 
                title={spaceItem.name}
            >
                <StatusBadge status={spaceItem.status} />
            </MainCardHeader>
            
            <MainCardContent>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                    {spaceItem.description || "No description provided."}
                </p>
            </MainCardContent>

            <MainCardFooter label="Open Space" />
        </MainCard>
    );
};
