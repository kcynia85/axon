// frontend/src/modules/spaces/ui/pure/SpaceCreatePatternModal.tsx

import React, { useState } from 'react';
import { 
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter, 
    Button, 
    Input, 
    Textarea,
    Divider,
    Chip
} from "@heroui/react";
import { Save, Info, Zap, Network, Box } from 'lucide-react';
import { SpacePatternBlueprint } from '../../domain/types';

type SpaceCreatePatternModalProperties = {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly onSave: (name: string, description: string) => void;
    readonly blueprint: SpacePatternBlueprint | null;
};

export const SpaceCreatePatternModal = ({
    isOpen,
    onClose,
    onSave,
    blueprint
}: SpaceCreatePatternModalProperties) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSave = () => {
        if (!name.trim()) return;
        onSave(name, description);
        setName("");
        setDescription("");
        onClose();
    };

    if (!blueprint) return null;

    const nodeCount = blueprint.structure.nodes.length;
    const isSuperPattern = blueprint.type === 'super-pattern';

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose}
            size="2xl"
            classNames={{
                base: "bg-zinc-900 border border-zinc-800 shadow-2xl rounded-3xl max-h-[90vh] overflow-y-auto",
                header: "border-b border-zinc-800 p-6",
                body: "p-8 space-y-8",
                footer: "border-t border-zinc-800 p-6"
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                                    Create {isSuperPattern ? "Super Pattern" : "Pattern"}
                                </h3>
                                <Chip size="sm" variant="flat" className="bg-zinc-800 text-zinc-400 font-black text-[9px] uppercase tracking-widest">
                                    {isSuperPattern ? "Multi-Zone" : "Single Unit"}
                                </Chip>
                            </div>
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Intelligent Selection Analyzer</p>
                        </ModalHeader>
                        <ModalBody>
                            {/* Summary Card */}
                            <div className="flex items-start gap-4 p-5 bg-zinc-950 border border-zinc-800 rounded-3xl">
                                <div className="p-3 bg-zinc-900 rounded-2xl text-zinc-400">
                                    <Box size={20} />
                                </div>
                                <div>
                                    <p className="text-[12px] font-bold text-zinc-200">
                                        Capturing <span className="text-white font-black">{nodeCount} elements</span>
                                    </p>
                                    <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed italic">
                                        All internal logic, states, and prompt configurations will be serialized into a reusable blueprint.
                                    </p>
                                </div>
                            </div>

                            {/* Intelligent Mapping Section */}
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                                        <Zap size={12} className="text-yellow-500" /> Detected Interface
                                    </h4>
                                    <div className="space-y-2">
                                        {blueprint.interface.ports.length > 0 ? blueprint.interface.ports.map(port => (
                                            <div key={port.id} className="flex items-center justify-between p-2 bg-zinc-900/50 border border-zinc-800/50 rounded-xl">
                                                <span className="text-[10px] font-bold text-zinc-300">{port.label}</span>
                                                <Chip size="sm" variant="dot" color={port.type === 'input' ? "primary" : "success"} className="text-[8px] uppercase font-black">
                                                    {port.type}
                                                </Chip>
                                            </div>
                                        )) : (
                                            <p className="text-[10px] text-zinc-600 italic">No external ports detected.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                                        <Network size={12} className="text-purple-500" /> Dependencies
                                    </h4>
                                    <div className="space-y-2">
                                        {blueprint.dependencies.length > 0 ? blueprint.dependencies.map(dep => (
                                            <div key={dep.zoneId} className="flex items-center justify-between p-2 bg-zinc-900/50 border border-zinc-800/50 rounded-xl">
                                                <span className="text-[10px] font-bold text-zinc-300">{dep.zoneLabel}</span>
                                                <span className="text-[9px] font-black text-zinc-600 uppercase">EXT-REF</span>
                                            </div>
                                        )) : (
                                            <p className="text-[10px] text-zinc-600 italic">No external dependencies.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Divider className="bg-zinc-800" />

                            {/* Configuration */}
                            <div className="space-y-6">
                                <Input
                                    label="Pattern Name"
                                    placeholder="e.g. Research & Analysis Pipeline"
                                    variant="bordered"
                                    value={name}
                                    onValueChange={setName}
                                    classNames={{
                                        label: "text-[10px] font-black uppercase text-zinc-500 tracking-widest",
                                        input: "text-sm font-bold text-white",
                                        inputWrapper: "bg-black border-zinc-800 hover:border-zinc-700 focus-within:!border-zinc-200 h-14"
                                    }}
                                />
                                <Textarea
                                    label="Description"
                                    placeholder="Describe the reusable logic of this component..."
                                    variant="bordered"
                                    value={description}
                                    onValueChange={setDescription}
                                    minRows={3}
                                    classNames={{
                                        label: "text-[10px] font-black uppercase text-zinc-500 tracking-widest",
                                        input: "text-xs font-bold text-zinc-300 italic",
                                        inputWrapper: "bg-black border-zinc-800 hover:border-zinc-700 focus-within:!border-zinc-200"
                                    }}
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button 
                                variant="light" 
                                onPress={onClose}
                                className="text-zinc-500 font-black uppercase text-[10px] tracking-widest"
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="bg-white text-black font-black uppercase text-[10px] tracking-widest px-10 h-12 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:bg-zinc-100"
                                onPress={handleSave}
                                isDisabled={!name.trim()}
                                startContent={<Save size={16} />}
                            >
                                Save {isSuperPattern ? "Super Pattern" : "Pattern"}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
