import React from "react";
import { SpaceCard } from "./SpaceCard";
import { SpaceListItem } from "./SpaceListItem";
import { ResourceList } from "@/shared/ui/complex/ResourceList";
import type { SpaceListProperties } from "./types";

export const SpaceList = ({ spaces, viewMode = 'grid' }: SpaceListProperties) => {
    return (
        <ResourceList 
            viewMode={viewMode}
            items={spaces}
            renderItem={(spaceItem) => (
                viewMode === 'grid' ? (
                    <SpaceCard key={spaceItem.id} space={spaceItem} />
                ) : (
                    <SpaceListItem key={spaceItem.id} space={spaceItem} />
                )
            )}
        />
    );
};
