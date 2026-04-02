"use client";

import React from "react";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { StudioLayout } from "@/modules/studio/ui/layout/StudioLayout";
import { Button } from "@/shared/ui/ui/Button";
import { X, Database } from "lucide-react";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/ui/Select";
import { VectorTestConnectionPoster } from "./components/VectorTestConnectionPoster";
import { GenericStudioSectionNav } from "@/modules/studio/ui/components/StudioSectionNav/GenericStudioSectionNav";
import { ActionButton } from "@/shared/ui/complex/ActionButton";

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
                                    <Controller
                                        name="vector_database_type"
                                        control={form.control}
                                        render={({ field }) => (
                                            <div className="grid grid-cols-1 gap-2">
                                                {["Postgres_pgvector", "ChromaDB", "Pinecone"].map((type) => (
                                                    <Button
                                                        key={type}
                                                        type="button"
                                                        variant={field.value === type ? "default" : "outline"}
                                                        className="justify-start font-mono text-sm h-12"
                                                        onClick={() => field.onChange(type)}
                                                    >
                                                        <Database className="w-4 h-4 mr-3 opacity-50" />
                                                        {type.replace("_", " (") + (type.includes("_") ? ")" : "")}
                                                    </Button>
                                                ))}
                                            </div>
                                        )}
                                    />
                                </FormSection>

                                <FormSection title="Embedding Model" id="model" number={2} variant="island">
                                    <FormItemField name="vector_database_embedding_model_reference" label="Wybrany Model">
                                        <Controller
                                            name="vector_database_embedding_model_reference"
                                            control={form.control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="h-12 bg-zinc-900 border-zinc-800 font-mono">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="text-embedding-3-small">text-embedding-3-small</SelectItem>
                                                        <SelectItem value="gemini-embedding-001">gemini-embedding-001</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </FormItemField>
                                </FormSection>

                                <FormSection title="Connection String (Prefix)" id="connection" number={3} variant="island">
                                    <FormTextField 
                                        name="vector_database_collection_name" 
                                        label="Prefix Tabeli / Kolekcji"
                                        placeholder="np. axon_knowledge_vectors_"
                                    />
                                </FormSection>

                                <FormSection title="Indeksowanie (Index Type)" id="indexing" number={4} variant="island">
                                    <Controller
                                        name="index_type"
                                        control={form.control}
                                        render={({ field }) => (
                                            <div className="flex flex-col gap-2">
                                                <Button
                                                    type="button"
                                                    variant={field.value === "HNSW" ? "default" : "outline"}
                                                    className="justify-start text-sm h-12"
                                                    onClick={() => field.onChange("HNSW")}
                                                >
                                                    HNSW (Szybkie / Więcej RAM)
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant={field.value === "IVFFlat" ? "default" : "outline"}
                                                    className="justify-start text-sm h-12"
                                                    onClick={() => field.onChange("IVFFlat")}
                                                >
                                                    IVFFlat (Wolniejsze)
                                                </Button>
                                            </div>
                                        )}
                                    />
                                </FormSection>
                            </form>
                        </div>
                    }
                    poster={<VectorTestConnectionPoster />}
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
