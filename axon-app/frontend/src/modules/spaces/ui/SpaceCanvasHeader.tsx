import React from "react";
import { SpaceCanvasHeaderView } from "./pure/SpaceCanvasHeaderView";
import type { SpaceCanvasHeaderProperties } from "./types";

/**
 * SpaceCanvasHeader - Container component for the canvas header.
 * Passes data to the Pure View.
 */
export const SpaceCanvasHeader = (properties: SpaceCanvasHeaderProperties) => {
    return <SpaceCanvasHeaderView {...properties} />;
};
