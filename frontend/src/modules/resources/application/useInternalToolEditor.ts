"use client";

import { useState } from "react";
import { InternalTool } from "@/shared/domain/resources";
import { InternalToolEditorLogic, InternalToolEditorProps, InternalToolCategory } from "../types/internal-tool-editor.types";

/**
 * useInternalToolEditor: Encapsulates the logic for editing internal tools.
 * Standard: 0% co-located types, 0% useEffect.
 */
export const useInternalToolEditor = ({ tool, onSave }: InternalToolEditorProps): InternalToolEditorLogic => {
    const [toolData, setToolData] = useState<Partial<InternalTool>>({
        tool_function_name: tool?.tool_function_name || "",
        tool_display_name: tool?.tool_display_name || "",
        tool_description: tool?.tool_description || "",
        tool_category: tool?.tool_category || "AI_Utils",
        tool_keywords: tool?.tool_keywords || [],
        tool_is_active: tool?.tool_is_active ?? true,
        availability_workspace: tool?.availability_workspace || ["default"],
    });

    const [inputSchemaJson, setInputSchemaJson] = useState(
        JSON.stringify(tool?.tool_input_schema || { type: "object", properties: {} }, null, 2)
    );
    const [outputSchemaJson, setOutputSchemaJson] = useState(
        JSON.stringify(tool?.tool_output_schema || { type: "object", properties: {} }, null, 2)
    );

    const updateToolData = (data: Partial<InternalTool>) => {
        setToolData((prev) => ({ ...prev, ...data }));
    };

    const updateInputSchemaJson = (json: string) => {
        setInputSchemaJson(json);
    };

    const updateOutputSchemaJson = (json: string) => {
        setOutputSchemaJson(json);
    };

    const handleSave = () => {
        try {
            const inputSchema = JSON.parse(inputSchemaJson) as Record<string, unknown>;
            const outputSchema = JSON.parse(outputSchemaJson) as Record<string, unknown>;
            
            onSave?.({
                ...toolData,
                tool_input_schema: inputSchema,
                tool_output_schema: outputSchema,
            });
        } catch (error) {
            console.error("Invalid JSON schema:", error);
            alert("Invalid JSON schema");
        }
    };

    return {
        toolData,
        inputSchemaJson,
        outputSchemaJson,
        updateToolData,
        updateInputSchemaJson,
        updateOutputSchemaJson,
        handleSave,
    };
};
