// frontend/src/modules/spaces/ui/inspectors/components/SpaceInspectorFooter.tsx

import React from "react";

type SpaceInspectorFooterProps = {
    readonly children: React.ReactNode;
};

/**
 * A shared footer component for Node Inspectors in the Space Canvas.
 * Provides a fixed position at the bottom with a consistent backdrop-blur and shadow.
 */
export const SpaceInspectorFooter = ({ children }: SpaceInspectorFooterProps) => {
    return (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-zinc-900/40 backdrop-blur-2xl border-t border-white/5 z-20 w-full shadow-[0_-20px_50px_rgba(0,0,0,0.8)] space-y-3 pointer-events-auto">
            {children}
        </div>
    );
};
