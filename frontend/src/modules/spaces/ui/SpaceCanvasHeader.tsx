// frontend/src/modules/spaces/ui/SpaceCanvasHeader.tsx

import React from "react";
import { SpaceCanvasHeaderProperties } from "../domain/types";
import { SpaceCanvasHeaderView } from "./pure/SpaceCanvasHeaderView";

export const SpaceCanvasHeader = (props: SpaceCanvasHeaderProperties) => {
    return <SpaceCanvasHeaderView {...props} />;
};
