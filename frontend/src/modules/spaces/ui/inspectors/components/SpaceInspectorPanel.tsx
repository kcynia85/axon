// frontend/src/modules/spaces/ui/inspectors/components/SpaceInspectorPanel.tsx

import React from "react";
import { CardBody } from "@heroui/react";

type SpaceInspectorPanelProps = {
    readonly children: React.ReactNode;
};

/**
 * A shared container component for all Node Inspectors.
 * Ensures a consistent layout structure (black background, relative positioning for footers, etc.)
 */
export const SpaceInspectorPanel = ({ children }: SpaceInspectorPanelProps) => {
    return (
        <CardBody className="p-0 flex flex-col h-full bg-black relative">
            {children}
        </CardBody>
    );
};
