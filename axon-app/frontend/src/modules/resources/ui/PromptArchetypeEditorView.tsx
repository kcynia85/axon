"use client";

import * as React from "react";
import { Sparkles, Save, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/ui/Dialog";
import { Form } from "@/shared/ui/ui/Form";
import { Button } from "@/shared/ui/ui/Button";
import { PromptArchetypeIdentitySection } from "./components/PromptArchetypeIdentitySection";
import { PromptArchetypeBehaviorSection } from "./components/PromptArchetypeBehaviorSection";
import { PromptArchetypeCategorizationSection } from "./components/PromptArchetypeCategorizationSection";
import { PromptArchetypeEditorViewProps } from "../types/prompt-archetype-ui.types";

/**
 * PromptArchetypeEditorView: Pure presentation layer for the archetype editor dialog.
 * Standard: 0% Logic, 0% useEffect.
 */
export const PromptArchetypeEditorView = ({
    open,
    onOpenChange,
    form,
    isCreating,
    onSubmit
}: PromptArchetypeEditorViewProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] p-0 flex flex-col h-[85vh]">
                <DialogHeader className="p-6 border-b bg-muted/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Laboratory</span>
                    </div>
                    <DialogTitle className="text-xl font-bold font-display">Prompt Archetype Blueprint</DialogTitle>
                    <DialogDescription className="text-xs">
                        Architect a persistent persona and capability set that can be inherited by any agent.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            <PromptArchetypeIdentitySection form={form} />
                            <PromptArchetypeBehaviorSection form={form} />
                            <PromptArchetypeCategorizationSection form={form} />
                        </div>

                        <DialogFooter className="p-4 border-t bg-muted/10">
                            <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="text-xs gap-2">
                                <X className="w-3 h-3" /> Abort
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                className="text-xs gap-2 px-6"
                                disabled={isCreating}
                            >
                                <Save className="w-3 h-3" />
                                {isCreating ? "Indexing..." : "Register Archetype"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
