import React from "react";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { StudioLayout } from "@/modules/studio/ui/layout/StudioLayout";
import { Button } from "@/shared/ui/ui/Button";
import { X, Database, ChevronDown, Zap, Layers, Cpu } from "lucide-react";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { FormRadio } from "@/shared/ui/form/FormRadio";
import { MigrationPlanPoster } from "./components/MigrationPlanPoster";
import { GenericStudioSectionNav } from "@/modules/studio/ui/components/StudioSectionNav/GenericStudioSectionNav";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { cn } from "@/shared/lib/utils";

const DB_TYPE_OPTIONS = [
    { id: "Postgres_pgvector", name: "Postgres (pgvector)" },
    { id: "ChromaDB", name: "ChromaDB" },
    { id: "Pinecone", name: "Pinecone" },
];

const MODEL_OPTIONS = [
    { id: "text-embedding-3-small", name: "text-embedding-3-small" },
    { id: "gemini-embedding-001", name: "gemini-embedding-001" },
];

export const VectorStudioView = ({ initialData, onSave, onExit, isSaving }: any) => {
    const form = useForm({
        defaultValues: initialData || {
            vector_database_type: "Postgres_pgvector",
            vector_database_embedding_model_reference: "text-embedding-3-small",
            vector_database_connection_url: "aws-eu-central-1",
            vector_database_collection_name: "axon_knowledge_vectors_",
            index_type: "HNSW",
        },
    });

    const sections = [
        { id: "type", label: "Typ Bazy" },
        { id: "model", label: "Model" },
        { id: "connection", label: "Połączenie" },
        { id: "indexing", label: "Indeksowanie" },
    ];

    const [activeSection, setActiveSection] = React.useState("type");

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
                    studioLabel="Vector DB"
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
                                <FormSection title="Typ Bazy" id="type" number={1} variant="island">
                                    <div className="max-w-4xl">
                                        <Controller
                                            name="vector_database_type"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormSelect
                                                    options={DB_TYPE_OPTIONS}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="Wybierz typ bazy..."
                                                    renderTrigger={(selected) => (
                                                        <div className="flex items-center gap-3 cursor-pointer group/trigger w-full border border-zinc-800 bg-zinc-900/50 p-4 rounded-xl hover:border-zinc-700 transition-colors">
                                                            <Database className="w-5 h-5 text-zinc-600 group-hover/trigger:text-zinc-400" />
                                                            <span className={cn(
                                                                "text-lg font-bold transition-colors flex-1 text-left",
                                                                selected.length > 0 ? "text-white" : "text-zinc-600 group-hover/trigger:text-zinc-400"
                                                            )}>
                                                                {selected.length > 0 ? selected[0].name : "Wybierz typ bazy..."}
                                                            </span>
                                                            <ChevronDown className="w-5 h-5 text-zinc-600 group-hover/trigger:text-zinc-400" />
                                                        </div>
                                                    )}
                                                />
                                            )}
                                        />
                                    </div>
                                </FormSection>

                                <FormSection title="Embedding Model" id="model" number={2} variant="island">
                                    <div className="max-w-4xl">
                                        <FormItemField label="Wybrany Model">
                                            <Controller
                                                name="vector_database_embedding_model_reference"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <FormSelect
                                                        options={MODEL_OPTIONS}
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder="Wybierz model..."
                                                        renderTrigger={(selected) => (
                                                            <div className="flex items-center gap-3 cursor-pointer group/trigger w-full border border-zinc-800 bg-zinc-900/50 p-4 rounded-xl hover:border-zinc-700 transition-colors">
                                                                <Cpu className="w-5 h-5 text-zinc-600 group-hover/trigger:text-zinc-400" />
                                                                <span className={cn(
                                                                    "text-lg font-mono transition-colors flex-1 text-left",
                                                                    selected.length > 0 ? "text-white" : "text-zinc-600 group-hover/trigger:text-zinc-400"
                                                                )}>
                                                                    {selected.length > 0 ? selected[0].name : "Wybierz model..."}
                                                                </span>
                                                                <ChevronDown className="w-5 h-5 text-zinc-600 group-hover/trigger:text-zinc-400" />
                                                            </div>
                                                        )}
                                                    />
                                                )}
                                            />
                                        </FormItemField>
                                    </div>
                                </FormSection>

                                <FormSection title="Connection String (Prefix)" id="connection" number={3} variant="island">
                                    <FormTextField 
                                        name="vector_database_collection_name" 
                                        label="Prefix Tabeli / Kolekcji"
                                        placeholder="np. axon_knowledge_vectors_"
                                    />
                                </FormSection>

                                <FormSection title="Indeksowanie (Index Type)" id="indexing" number={4} variant="island">
                                    <div className="grid grid-cols-1 gap-4 max-w-4xl">
                                        <Controller
                                            name="index_type"
                                            control={form.control}
                                            render={({ field }) => (
                                                <>
                                                    <FormRadio
                                                        title="HNSW (Szybkie / Więcej RAM)"
                                                        description="Hierarchical Navigable Small World. Najwyższa wydajność wyszukiwania kosztem pamięci."
                                                        checked={field.value === "HNSW"}
                                                        onChange={() => field.onChange("HNSW")}
                                                    />
                                                    <FormRadio
                                                        title="IVFFlat (Wolniejsze)"
                                                        description="Inverted File Flat. Mniejsze zużycie zasobów, dłuższy czas wyszukiwania przy dużych zbiorach."
                                                        checked={field.value === "IVFFlat"}
                                                        onChange={() => field.onChange("IVFFlat")}
                                                    />
                                                </>
                                            )}
                                        />
                                    </div>
                                </FormSection>
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
                                label={isSaving ? "Zapisywanie..." : "Zapisz Bazę"}
                                onClick={form.handleSubmit(onSave)} 
                            />
                        </div>
                    }
                />
            </div>
        </FormProvider>
    );
};
