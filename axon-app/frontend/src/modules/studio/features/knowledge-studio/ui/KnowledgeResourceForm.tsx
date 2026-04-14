import React, { useRef } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormSubheading } from "@/shared/ui/form/FormSubheading";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { FormSelectedFile } from "@/shared/ui/form/FormSelectedFile";
import { FormFileUpload } from "@/shared/ui/form/FormFileUpload";
import { FormKeyValueTable } from "@/shared/ui/form/FormKeyValueTable";
import { FormTagInput } from "@/shared/ui/form/FormTagInput";
import { Button } from "@/shared/ui/ui/Button";
import { Wand2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { KnowledgeResourceData } from "../types/knowledge-studio.types";

type KnowledgeResourceFormProps = {
    data: KnowledgeResourceData;
    isLoadingStrategies: boolean;
    strategyOptions: { id: string; name: string; subtitle?: string }[];
    isLoadingVectorStores: boolean;
    vectorStores: { id: string; vector_database_name: string }[];
    isLoadingHubs: boolean;
    hubs: { id: string; hub_name: string }[];
    isLocalFileOver: boolean;
    onSelectFile: (file: File) => void;
    onDataChange: (updates: Partial<KnowledgeResourceData>) => void;
    onAutoTag: () => void;
    setIsLocalFileOver: (isOver: boolean) => void;
};

/**
 * KnowledgeResourceForm: Decomposed form sections for the Knowledge Studio.
 * Standard: Pure View, 0% logic.
 */
export const KnowledgeResourceForm = ({
    data,
    isLoadingStrategies,
    strategyOptions,
    isLoadingVectorStores,
    vectorStores,
    isLoadingHubs,
    hubs,
    isLocalFileOver,
    onSelectFile,
    onDataChange,
    onAutoTag,
    setIsLocalFileOver,
}: KnowledgeResourceFormProps) => {
    const fileInputReference = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onSelectFile(file);
            event.target.value = "";
        }
    };

    return (
        <div className="space-y-16 w-full" onClick={(event) => event.stopPropagation()}>
            {/* 1. Wybierz Zasób */}
            <FormSection id="RESOURCE" number={1} title="Wybierz Zasób" variant="island">
                <div className="space-y-6">
                    <input
                        type="file"
                        ref={fileInputReference}
                        onChange={handleFileChange}
                        accept=".md,.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/markdown"
                        className="hidden"
                    />

                    {data.fileName ? (
                        <div className="space-y-6">
                            <div 
                                className={cn(
                                    "transition-all duration-300 rounded-xl border border-transparent",
                                    isLocalFileOver ? "bg-primary/10 border-primary/50 shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)] scale-[1.01]" : ""
                                )}
                                onDragOver={(event) => { event.preventDefault(); setIsLocalFileOver(true); }}
                                onDragLeave={() => setIsLocalFileOver(false)}
                                onDrop={(event) => {
                                    event.preventDefault();
                                    setIsLocalFileOver(false);
                                    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
                                        onSelectFile(event.dataTransfer.files[0]);
                                    }
                                }}
                            >
                                <FormSelectedFile
                                    fileName={data.fileName}
                                    fileSize={data.fileSize}
                                    onRemove={() => onDataChange({ fileName: null, fileSize: null })}
                                />
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => fileInputReference.current?.click()}
                                    className="font-mono uppercase tracking-[0.2em] text-[10px] h-10 px-6 transition-all"
                                >
                                    Zmień
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <FormFileUpload 
                            onClick={() => fileInputReference.current?.click()} 
                            onDrop={(files) => onSelectFile(files[0])}
                        />
                    )}
                </div>
            </FormSection>

            {/* 2. Metadane */}
            <FormSection id="METADATA" number={2} title="Metadane (JSONB)" variant="island">
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
            <FormSection id="STRATEGY" number={3} title="Strategia Przetwarzania" variant="island">
                <div className="space-y-6">
                    <FormSubheading>Chunk Types</FormSubheading>
                    <FormItemField>
                        <FormSelect
                            options={strategyOptions}
                            value={data.chunkTypeId}
                            onChange={(value) => {
                                const selected = strategyOptions.find(option => option.id === value);
                                onDataChange({ 
                                    chunkTypeId: value as string,
                                    chunkType: selected?.name || "Brak nazwy"
                                });
                            }}
                            placeholder={isLoadingStrategies ? "Ładowanie..." : "Wybierz strategię..."}
                            renderTrigger={() => {
                                const activeStrategy = strategyOptions.find(option => option.id === data.chunkTypeId);
                                return (
                                    <div className="flex items-center gap-3 cursor-pointer group/trigger w-full border border-zinc-800 bg-zinc-900/50 p-4 rounded-xl hover:border-zinc-700 transition-colors">
                                        <div className="flex-1 text-left">
                                            <div className={cn("text-lg font-mono transition-colors", activeStrategy ? "text-white" : "text-zinc-600")}>
                                                {activeStrategy ? activeStrategy.name : "Wybierz strategię..."}
                                            </div>
                                            {activeStrategy?.subtitle && (
                                                <div className="text-[12px] text-zinc-500 font-mono capitalize mt-0.5">
                                                    {activeStrategy.subtitle.toLowerCase()}
                                                </div>
                                            )}
                                        </div>
                                        <ChevronDown className="w-5 h-5 text-zinc-600" />
                                    </div>
                                );
                            }}
                        />
                    </FormItemField>
                </div>
            </FormSection>

            {/* 4. Tagi */}
            <FormSection id="METADATA" number={4} title="Tagi" variant="island">
                <FormItemField>
                    <FormTagInput 
                        value={data.tags}
                        onChange={(newTags) => onDataChange({ tags: newTags })}
                        placeholder="Wpisz tag i naciśnij Enter..."
                    />
                </FormItemField>
            </FormSection>

            {/* 5. Baza Wektorowa */}
            <FormSection id="VECTOR_STORE" number={5} title="Baza Wektorowa" variant="island">
                <FormItemField>
                    <FormSelect
                        options={vectorStores.map(db => ({ id: db.id, name: db.vector_database_name }))}
                        value={data.vectorStoreId}
                        onChange={(value) => onDataChange({ vectorStoreId: value as string })}
                        placeholder={isLoadingVectorStores ? "Ładowanie..." : "Wybierz bazę wektorową..."}
                    />
                </FormItemField>
            </FormSection>

            {/* 6. Huby */}
            <FormSection id="HUBS" number={6} title="Przypisanie do Hubów" variant="island">
                <FormItemField>
                    <FormSelect
                        options={hubs.map(hub => ({ name: hub.hub_name, id: hub.id }))}
                        value={data.hubs}
                        onChange={(value) => onDataChange({ hubs: value as string[] })}
                        multiple
                        placeholder={isLoadingHubs ? "Ładowanie..." : "Wybierz Huby..."}
                    />
                </FormItemField>
            </FormSection>
        </div>
    );
};
