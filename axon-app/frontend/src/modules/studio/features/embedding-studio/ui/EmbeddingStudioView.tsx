"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StudioLayout } from "@/modules/studio/ui/layout/StudioLayout";
import { Button } from "@/shared/ui/ui/Button";
import { X } from "lucide-react";
import { EmbeddingModelStudioSchema, type EmbeddingModelStudioValues } from "../types/embedding-studio.types";
import { EmbeddingIdentitySection } from "./sections/EmbeddingIdentitySection";
import { EmbeddingParamsSection } from "./sections/EmbeddingParamsSection";
import { EmbeddingCostSection } from "./sections/EmbeddingCostSection";
import { MigrationPlanPoster } from "./components/MigrationPlanPoster";
import { GenericStudioSectionNav } from "@/modules/studio/ui/components/StudioSectionNav/GenericStudioSectionNav";
import { ActionButton } from "@/shared/ui/complex/ActionButton";

type EmbeddingStudioViewProps = {
    readonly initialData?: any;
    readonly onSave: (data: EmbeddingModelStudioValues) => void;
    readonly onExit: () => void;
    readonly isSaving?: boolean;
}

export const EmbeddingStudioView = ({ 
    initialData, 
    onSave, 
    onExit, 
    isSaving 
}: EmbeddingStudioViewProps) => {
    const form = useForm<EmbeddingModelStudioValues>({
        resolver: zodResolver(EmbeddingModelStudioSchema),
        defaultValues: initialData || {
            model_provider_name: "OpenAI",
            model_id: "",
            model_vector_dimensions: 1536,
            model_max_context_tokens: 8191,
            model_cost_per_1m_tokens: 0.02,
        },
    });

    const sections = [
        { id: "identity", label: "Dostawca" },
        { id: "technical", label: "Parametry" },
        { id: "economy", label: "Ekonomia" },
    ];

    const [activeSection, setActiveSection] = React.useState("identity");

    const handleSectionClick = (id: string) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <FormProvider {...form}>
            <div className="h-full w-full outline-none" tabIndex={0}>
                <StudioLayout
                    studioLabel="Embedding"
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
                            sections={sections}
                            activeSection={activeSection}
                            onSectionClick={handleSectionClick}
                        />
                    }
                    canvas={
                        <div className="px-16 pb-48 pt-20 w-full">
                            <form className="space-y-16 w-full" onSubmit={(e) => e.preventDefault()}>
                                <EmbeddingIdentitySection />
                                <EmbeddingParamsSection />
                                <EmbeddingCostSection />
                            </form>
                        </div>
                    }
                    poster={<MigrationPlanPoster />}
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
                                label={isSaving ? "Zapisywanie..." : "Zapisz Model"}
                                onClick={form.handleSubmit(onSave)} 
                            />
                        </div>
                    }
                />
            </div>
        </FormProvider>
    );
};
