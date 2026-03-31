"use client";

import React, { useState, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { X, Plus, Wand2, RefreshCw } from "lucide-react";
import { StudioLayout } from "@/modules/studio/ui/layout/StudioLayout";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { Button } from "@/shared/ui/ui/Button";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormRadio } from "@/shared/ui/form/FormRadio";
import { FormKeyValueTable } from "@/shared/ui/form/FormKeyValueTable";
import { FormSubheading } from "@/shared/ui/form/FormSubheading";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { FormSelectedFile } from "@/shared/ui/form/FormSelectedFile";
import { KnowledgeStudioViewProps } from "../types/knowledge-studio.types";
import { KnowledgeStudioSectionNav, KnowledgeStudioSectionId } from "./KnowledgeStudioSectionNav";
import { FormField } from "@/shared/ui/ui/Form";
import { RagDebugger } from "./RagDebugger";
import { KnowledgeResourceStatusCard } from "./KnowledgeResourceStatusCard";
import { FormFileUpload } from "@/shared/ui/form/FormFileUpload";

const EMBEDDING_MODELS = [
    { name: "text-embedding-3-small (domyślny)", id: "text-embedding-3-small" },
    { name: "text-embedding-3-large", id: "text-embedding-3-large" },
    { name: "text-embedding-ada-002", id: "text-embedding-ada-002" },
];

const HUB_OPTIONS = [
    { name: "Delivery", id: "delivery" },
    { name: "Research", id: "research" },
    { name: "Internal Wiki", id: "internal-wiki" },
    { name: "Onboarding", id: "onboarding" },
];

export const KnowledgeStudioView = ({
    data,
    activeSection,
    onDataChange,
    onSave,
    onCancel,
    onAutoTag,
    onSelectFile,
    scrollToSection,
    setCanvasContainerReference,
}: KnowledgeStudioViewProps & { 
    activeSection: KnowledgeStudioSectionId;
    scrollToSection: (id: KnowledgeStudioSectionId) => void;
    setCanvasContainerReference: (node: HTMLDivElement | null) => void;
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm({
        defaultValues: {
            chunkType: data.chunkType,
            model: data.model,
            hubs: data.hubs,
        }
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log("File detected in View:", file.name);
            onSelectFile(file);
            // Reset input value to allow re-selection
            e.target.value = "";
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };
    
    return (
        <FormProvider {...form}>
            <StudioLayout
                canvasRef={setCanvasContainerReference}
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
                navigator={<KnowledgeStudioSectionNav activeSection={activeSection} onSectionClick={scrollToSection} data={data} />}
                poster={
                    <div className="space-y-8 w-full">
                        {data.id && (
                            <KnowledgeResourceStatusCard 
                                model={data.model}
                                chunksCount={4}
                            />
                        )}
                        <RagDebugger fileName={data.fileName} strategy={data.chunkType} />
                    </div>
                }
                canvas={

                    <div className="px-24 pb-48">
                        <form className="space-y-0" onSubmit={(e) => e.preventDefault()}>
                            
                            {/* 1. Wybierz Zasób */}
                            <FormSection id="RESOURCE" number={1} title="Wybierz Zasób">
                                <div className="space-y-6">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept=".md,.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/markdown"
                                        className="hidden"
                                    />
                                    
                                    {data.fileName ? (
                                        <div className="space-y-6">
                                            <FormSelectedFile 
                                                fileName={data.fileName}
                                                fileSize={data.fileSize}
                                                onRemove={() => onDataChange({ fileName: null, fileSize: null })}
                                            />
                                            
                                            <div className="flex gap-4">
                                                <Button 
                                                    type="button"
                                                    variant="secondary" 
                                                    size="sm"
                                                    onClick={triggerFileInput}
                                                    className="font-mono uppercase tracking-[0.2em] text-[10px] h-10 px-6 transition-all"
                                                >
                                                    Zmień
                                                </Button>
                                                <Button 
                                                    type="button"
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => {}}
                                                    className="text-zinc-500 hover:text-white hover:bg-zinc-900 font-mono uppercase tracking-[0.2em] text-[10px] px-6 h-10 rounded-xl border border-transparent hover:border-zinc-800 transition-all"
                                                >
                                                    Podgląd
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <FormFileUpload onClick={triggerFileInput} />
                                    )}
                                </div>
                            </FormSection>

                            {/* 2. Metadane (JSONB) */}
                            <FormSection id="METADATA" number={2} title="Metadane (JSONB)">
                                <div className="space-y-8">
                                    <Button 
                                        type="button"
                                        onClick={onAutoTag} 
                                        variant="secondary" 
                                        size="sm" 
                                        className="gap-2 h-10 px-6 rounded-xl font-mono uppercase tracking-[0.2em] text-[10px] transition-all"
                                    >
                                        <Wand2 className="w-3.5 h-3.5" />
                                        Auto-Taguj (AI)
                                    </Button>
                                    
                                    <FormKeyValueTable
                                        items={data.metadata}
                                        onChange={(newMetadata) => onDataChange({ metadata: newMetadata })}
                                        keyPlaceholder="key"
                                        valuePlaceholder="value"
                                        addPlaceholder="+ Dodaj Pole"
                                    />
                                </div>
                            </FormSection>

                            {/* 3. Strategia Przetwarzania */}
                            <FormSection id="STRATEGY" number={3} title="Strategia Przetwarzania" description="Wybierz model i typ przetwarzania zasobu.">
                                <div className="space-y-12">
                                    <div className="space-y-6">
                                        <FormSubheading>Model Embeddingu</FormSubheading>
                                        <div className="w-full max-w-2xl">
                                            <FormField
                                                control={form.control}
                                                name="model"
                                                render={({ field }) => (
                                                    <FormItemField>
                                                        <FormSelect
                                                            options={EMBEDDING_MODELS}
                                                            value={field.value || ""}
                                                            onChange={(val) => {
                                                                field.onChange(val);
                                                                onDataChange({ model: val as string });
                                                            }}
                                                            placeholder="Wybierz model..."
                                                            searchPlaceholder="Szukaj modelu..."
                                                        />
                                                    </FormItemField>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <FormSubheading>Chunk Types</FormSubheading>
                                        <FormField
                                            control={form.control}
                                            name="chunkType"
                                            render={({ field }) => (
                                                <FormItemField>
                                                    <div className="grid grid-cols-1 gap-6">
                                                        {[
                                                            { title: 'General Text', description: 'Standardowe dzielenie tekstu z nakładaniem się fragmentów (dokumentacja, artykuły).' },
                                                            { title: 'Codebase', description: 'Dzielenie z zachowaniem struktury kodu źródłowego (funkcje, klasy).' },
                                                            { title: 'Precise / Legal', description: 'Dokładne dzielenie na mniejsze fragmenty z rygorystycznym zachowaniem słownictwa.' }
                                                        ].map((type) => (
                                                            <FormRadio
                                                                key={type.title}
                                                                title={type.title}
                                                                description={type.description}
                                                                checked={field.value === type.title}
                                                                onChange={() => {
                                                                    field.onChange(type.title);
                                                                    onDataChange({ chunkType: type.title });
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                </FormItemField>
                                            )}
                                        />
                                    </div>
                                </div>
                            </FormSection>

                            {/* 4. Przypisanie do Hubów */}
                            <FormSection id="HUBS" number={4} title="Przypisanie do Hubów" description="Przypisz zasób do odpowiednich hubów dla lepszej kategoryzacji.">
                                <div className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="hubs"
                                        render={({ field }) => (
                                            <FormItemField>
                                                <FormSelect
                                                    options={HUB_OPTIONS}
                                                    value={field.value || []}
                                                    onChange={(val) => {
                                                        field.onChange(val);
                                                        onDataChange({ hubs: val as string[] });
                                                    }}
                                                    multiple
                                                    placeholder="Wybierz Huby..."
                                                    searchPlaceholder="Szukaj hubów..."
                                                />
                                            </FormItemField>
                                        )}
                                    />
                                </div>
                            </FormSection>
                        </form>
                    </div>
                }
                footer={
                    <div className="flex items-center gap-4 justify-end w-full">
                        <Button
                            type="button"
                            variant="ghost"
                            size="lg"
                            onClick={onCancel}
                            className="hover:bg-zinc-900 h-11 font-mono text-base tracking-widest px-6 text-zinc-500 hover:text-white transition-all"
                        >
                            Anuluj
                        </Button>
                        <ActionButton
                            label={data.id ? "Re-indeksuj" : "Zapisz i Indeksuj"}
                            icon={data.id ? RefreshCw : Plus}
                            onClick={onSave}
                        />
                    </div>
                }
            />
        </FormProvider>
    );
};
