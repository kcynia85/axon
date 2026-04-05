// frontend/src/modules/spaces/ui/inspectors/components/SpaceTemplateCustomActionsEditor.tsx

import React from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";

type SpaceTemplateCustomActionsEditorProps = {
    readonly initialContent?: string;
    readonly onChange: (content: string) => void;
};

export const SpaceTemplateCustomActionsEditor = ({ 
    initialContent, 
    onChange 
}: SpaceTemplateCustomActionsEditorProps) => {
    // Derived state - React Compiler handles optimization
    const getInitialBlocks = () => {
        if (!initialContent) return undefined;
        try {
            return JSON.parse(initialContent);
        } catch (e) {
            console.error("Failed to parse BlockNote content", e);
            return undefined;
        }
    };

    const editor = useCreateBlockNote({
        initialContent: getInitialBlocks(),
    });

    const handleChange = () => {
        const content = JSON.stringify(editor.document);
        onChange(content);
    };

    return (
        <div className="min-h-[240px]">
            <BlockNoteView 
                editor={editor} 
                theme="dark"
                onChange={handleChange}
                className="min-h-[220px]"
                data-axon-editor="template"
            />
            <style jsx global>{`
                /* Font Overrides */
                [data-axon-editor="template"] .bn-editor,
                [data-axon-editor="template"] .bn-block-content,
                [data-axon-editor="template"] .bn-inline-content {
                    font-family: var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
                }

                /* Container tweaks */
                [data-axon-editor="template"] .bn-editor {
                    padding-inline: 0px !important;
                    background: transparent !important;
                }
                
                /* Typography overrides */
                [data-axon-editor="template"] .bn-block-content[data-content-type="heading"] {
                    font-weight: 900 !important;
                    text-transform: uppercase !important;
                    letter-spacing: -0.025em !important;
                    color: white !important;
                }
                
                [data-axon-editor="template"] .bn-inline-content {
                    font-size: 13px !important;
                    line-height: 1.6 !important;
                    color: #d4d4d8 !important; /* zinc-300 */
                }

                [data-axon-editor="template"] .bn-side-menu {
                    opacity: 0.3;
                    transition: opacity 0.2s;
                }
                
                [data-axon-editor="template"] .bn-side-menu:hover {
                    opacity: 1;
                }

                .bn-editor {
                    box-shadow: none !important;
                }
            `}</style>
        </div>
    );
};
