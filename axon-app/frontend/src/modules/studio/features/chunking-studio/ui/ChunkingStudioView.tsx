"use client";

import React, { useCallback, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StudioLayout } from "@/modules/studio/ui/layout/StudioLayout";
import { Button } from "@/shared/ui/ui/Button";
import { X, Save } from "lucide-react";
import { ChunkingStrategyStudioSchema, type ChunkingStrategyStudioValues } from "../types/chunking-studio.types";
import { StrategyBasicSection } from "./sections/StrategyBasicSection";
import { StrategyParamsSection } from "./sections/StrategyParamsSection";
import { StrategySeparatorsSection } from "./sections/StrategySeparatorsSection";
import { ChunkingSimulatorPoster } from "./components/ChunkingSimulatorPoster";
import { GenericStudioSectionNav } from "@/modules/studio/ui/components/StudioSectionNav/GenericStudioSectionNav";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { useChunkingStrategyDraft } from "../application/hooks/useChunkingStrategyDraft";
import { toast } from "sonner";

type ChunkingStudioViewProps = {
    readonly initialData?: any;
    readonly onSave: (data: ChunkingStrategyStudioValues) => void;
    readonly onExit: () => void;
    readonly isSaving?: boolean;
    readonly strategyId?: string | null;
}

export const ChunkingStudioView = ({ 
    initialData, 
    onSave, 
    onExit, 
    isSaving,
    strategyId
}: ChunkingStudioViewProps) => {
    const { draft, saveDraft, clearDraft } = useChunkingStrategyDraft(strategyId);

    const defaultValues = useMemo(() => ({
        strategy_name: "",
        strategy_chunking_method: "Recursive_Character",
        strategy_chunk_size: 1000,
        strategy_chunk_overlap: 200,
        strategy_chunk_boundaries: { separators: ["\\n\\n", "\\n", " "] },
        is_draft: false,
    }), []);

    const form = useForm<ChunkingStrategyStudioValues>({
        resolver: zodResolver(ChunkingStrategyStudioSchema),
        values: initialData || draft || defaultValues,
    });

    const sections = [
        { id: "basic", label: "Informacje" },
        { id: "params", label: "Rozmiar" },
        { id: "separators", label: "Separatory" },
    ];

    const visibleSections = sections.filter(s => {
        const rawMethod = form.watch("strategy_chunking_method");
        const method = rawMethod?.toLowerCase().replace(/_/g, "");
        if (s.id === "separators") return method === "recursivecharacter" || method === "character";
        return true;
    });

    const [activeSection, setActiveSection] = React.useState("basic");

    const handleSectionClick = (id: string) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const syncDraft = useCallback(() => {
        saveDraft(form.getValues());
    }, [form, saveDraft]);

    const handleFinalSave = async (data: ChunkingStrategyStudioValues) => {
        await onSave({ ...data, is_draft: false });
        clearDraft();
    };

    const handleInvalid = useCallback(() => {
        toast.error("Formularz zawiera błędy. Sprawdź wymagane pola.");
    }, []);

    return (
        <FormProvider {...form}>
            <div className="h-full w-full outline-none" tabIndex={0}>
                <StudioLayout
                    studioLabel="Chunking"
                    exitButton={
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onExit}
                            className="hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all h-9 w-9"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    }
                    navigator={
                        <GenericStudioSectionNav 
                            sections={visibleSections}
                            activeSection={activeSection}
                            onSectionClick={handleSectionClick}
                        />
                    }
                    canvas={
                        <div className="px-16 pb-48 pt-20 w-full">
                            <form className="space-y-16 w-full" onSubmit={(e) => e.preventDefault()}>
                                <StrategyBasicSection onSyncDraft={syncDraft} />
                                <StrategyParamsSection onSyncDraft={syncDraft} />
                                <StrategySeparatorsSection onSyncDraft={syncDraft} />
                            </form>
                        </div>
                    }
                    poster={<ChunkingSimulatorPoster />}
                    footer={
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="lg"
                                onClick={onExit}
                                className="hover:bg-zinc-900 h-11 font-mono text-base tracking-widest px-6 text-zinc-500 hover:text-white transition-all"
                            >
                                Anuluj
                            </Button>
                            <ActionButton 
                                label={isSaving ? "Zapisywanie..." : "Zapisz Strategię"}
                                icon={Save}
                                onClick={form.handleSubmit(handleFinalSave, handleInvalid)} 
                            />
                        </div>
                    }
                />
            </div>
        </FormProvider>
    );
};
