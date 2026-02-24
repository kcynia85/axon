// frontend/src/modules/spaces/ui/inspectors/SpacePatternNodeInspector.tsx

import {
    CardBody,
} from "@heroui/react";
import React from "react";
import { SpacePatternNodeInspectorProperties } from "../../domain/types";

export const SpacePatternNodeInspector = ({ }: SpacePatternNodeInspectorProperties) => {
    return (
        <CardBody className="p-0 flex flex-col h-full bg-background/50">
            <div className="p-4 space-y-4">
                <div className="p-3 bg-purple-50 rounded border border-purple-100 text-xs text-purple-800">
                    Use this pattern to standardize how qualitative interviews are analyzed across projects.
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold">Steps</label>
                    <ul className="list-disc pl-4 text-sm space-y-1 text-default-700">
                        <li>Extract raw text</li>
                        <li>Sentiment Analysis</li>
                        <li>Key Topic Extraction</li>
                        <li>Summary Generation</li>
                    </ul>
                </div>
            </div>
        </CardBody>
    );
};
