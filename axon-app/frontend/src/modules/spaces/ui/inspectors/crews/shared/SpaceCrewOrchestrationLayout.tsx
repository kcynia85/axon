import React from "react";
import { ScrollShadow } from "@heroui/react";

export type SpaceCrewOrchestrationLayoutProperties = {
    readonly children: React.ReactNode;
    readonly footer?: React.ReactNode;
};

/**
 * SpaceCrewOrchestrationLayout - Layout component for crew orchestration tab.
 */
export const SpaceCrewOrchestrationLayout = ({ children, footer }: SpaceCrewOrchestrationLayoutProperties) => {
    return (
        <div className="relative h-full flex flex-col">
            <ScrollShadow className="flex-1 p-8 pb-40">
                {children}
            </ScrollShadow>
            {footer && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent pt-12 z-10">
                    {footer}
                </div>
            )}
        </div>
    );
};
