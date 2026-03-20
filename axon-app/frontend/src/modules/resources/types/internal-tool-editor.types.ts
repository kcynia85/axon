import { InternalTool } from "@/shared/domain/resources";

export type InternalToolCategory = "Primeval" | "AI_Utils" | "Local" | "Systems";

export type InternalToolEditorFormData = {
    readonly tool_function_name: string;
    readonly tool_display_name: string;
    readonly tool_description: string;
    readonly tool_category: InternalToolCategory;
    readonly tool_keywords: readonly string[];
    readonly tool_is_active: boolean;
    readonly availability_workspace: readonly string[];
};

export type InternalToolEditorLogic = {
    readonly toolData: Partial<InternalTool>;
    readonly inputSchemaJson: string;
    readonly outputSchemaJson: string;
    readonly updateToolData: (data: Partial<InternalTool>) => void;
    readonly updateInputSchemaJson: (json: string) => void;
    readonly updateOutputSchemaJson: (json: string) => void;
    readonly handleSave: () => void;
};

export type InternalToolEditorProps = {
    readonly tool?: InternalTool;
    readonly onSave?: (tool: Partial<InternalTool>) => void;
};

export type InternalToolEditorViewProps = {
    readonly tool?: InternalTool;
    readonly toolData: Partial<InternalTool>;
    readonly inputSchemaJson: string;
    readonly outputSchemaJson: string;
    readonly onUpdateToolData: (data: Partial<InternalTool>) => void;
    readonly onUpdateInputSchemaJson: (json: string) => void;
    readonly onUpdateOutputSchemaJson: (json: string) => void;
    readonly onSave: () => void;
};
