// frontend/src/modules/spaces/ui/inspectors/SpaceTemplateNodeInspector.tsx

import React from "react";
import {
  CardBody,
  Button,
  ScrollShadow,
  Checkbox,
} from "@heroui/react";
import { 
  Plus,
} from "lucide-react";
import { SpaceTemplateInspectorProperties } from "../../domain/types";

export const SpaceTemplateNodeInspector = ({ 
    data, 
    onPropertyChange 
}: SpaceTemplateInspectorProperties) => (
    <CardBody className="p-0 flex flex-col h-full bg-black">
        <ScrollShadow className="flex-1 p-8 space-y-10">
            
            {/* Actions Checklist Section */}
            <div className="space-y-1">
                <h3 className="text-xl font-black text-white tracking-tight">Actions (To-Do)</h3>
            </div>

            <div className="space-y-8">
                {/* Item 1: Cel Researchu */}
                <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-sm font-black text-white">1. Cel Researchu (Checklist)</h4>
                    </div>
                    <div className="flex flex-col gap-3 pl-1">
                        <Checkbox 
                            size="sm" 
                            radius="full"
                            classNames={{
                                label: "text-xs font-bold text-zinc-300",
                                wrapper: "after:bg-zinc-200"
                            }}
                        >
                            Zdefiniuj Pytania Badawcze
                        </Checkbox>
                        <Checkbox 
                            size="sm" 
                            radius="full"
                            isSelected
                            classNames={{
                                label: "text-xs font-bold text-zinc-500 line-through",
                                wrapper: "after:bg-zinc-200"
                            }}
                        >
                            Identyfikacja grupy odbiorców
                        </Checkbox>
                        <Checkbox 
                            size="sm" 
                            radius="full"
                            classNames={{
                                label: "text-xs font-bold text-zinc-300",
                                wrapper: "after:bg-zinc-200"
                            }}
                        >
                            Zidentyfikuj &quot;white space&quot; na rynku
                        </Checkbox>
                    </div>
                </div>

                {/* Item 2: Profile Konkurencji */}
                <div className="space-y-4">
                    <h4 className="text-sm font-black text-white">2. Profile Konkurencji</h4>
                    <div className="flex flex-col gap-3 pl-1">
                        <Checkbox 
                            size="sm" 
                            radius="full"
                            classNames={{
                                label: "text-xs font-bold text-zinc-300",
                                wrapper: "after:bg-zinc-200"
                            }}
                        >
                            <div className="flex flex-col">
                                <span>Wypełnij tabelę na podstawie danych</span>
                                <span className="text-[10px] text-zinc-500">(Nazwa firmy + Przewaga + ceny)</span>
                            </div>
                        </Checkbox>
                    </div>
                </div>

                {/* Item 3: Wnioski Strategiczne */}
                <div className="space-y-4">
                    <h4 className="text-sm font-black text-white">3. Wnioski Strategiczne</h4>
                    <div className="flex items-center gap-6 pl-1">
                        <Checkbox 
                            size="sm" 
                            radius="full"
                            classNames={{
                                label: "text-xs font-bold text-zinc-300",
                                wrapper: "after:bg-zinc-200"
                            }}
                        >
                            Komunikacja
                        </Checkbox>
                        <Checkbox 
                            size="sm" 
                            radius="full"
                            classNames={{
                                label: "text-xs font-bold text-zinc-300",
                                wrapper: "after:bg-zinc-200"
                            }}
                        >
                            Marketing
                        </Checkbox>
                    </div>
                </div>

                <Button 
                    size="sm" 
                    className="w-full h-11 bg-zinc-200 text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-white transition-colors"
                    startContent={<Plus size={14}/>}
                >
                    Dodaj Akcję
                </Button>
            </div>

            {/* Context Information Section */}
            <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em]">CONTEXT</h4>
                <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-black text-zinc-300">brand_guidelines</span>
                        <span className="text-[10px] text-zinc-500 font-bold">[ Link ]</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-black text-zinc-300">persona</span>
                        <span className="text-[10px] text-zinc-500 font-bold">[ Link ]</span>
                    </div>
                </div>
            </div>

        </ScrollShadow>
    </CardBody>
);
