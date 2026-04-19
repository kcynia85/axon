import * as React from "react";
import { FormSection } from "@/shared/ui/form/FormSection";
import { Plus, Component } from "lucide-react";
import { ProjectSpaceModal } from "../components/ProjectSpaceModal";
import { useSpaces } from "@/modules/spaces/application/hooks";
import { FormCheckbox } from "@/shared/ui/form/FormCheckbox";

export const SpaceSection = ({ 
    syncDraft,
    projectName,
    spaceIds,
    usedSpaceIds,
    generateNewSpace,
    isOpen,
    onOpen,
    onClose,
    onSelect,
    onCreateNew,
    onRemove
}: { 
    syncDraft: () => void;
    projectName: string;
    spaceIds: readonly string[];
    usedSpaceIds: readonly string[];
    generateNewSpace: boolean;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onSelect: (id: string) => void;
    onCreateNew: () => void;
    onRemove: (id: string) => void;
}) => {
    const { data: allSpaces = [] } = useSpaces();
    
    // Filter the spaces that are currently selected
    const selectedSpaces = allSpaces.filter(s => (spaceIds || []).includes(s.id));

    return (
        <FormSection id="SPACE" number={3} title="Spaces" variant="island">
            <div className="w-full space-y-4">
                {/* ── Generated New Space Card ── */}
                {generateNewSpace && (
                    <FormCheckbox
                        title={`${projectName} space`}
                        checked={true}
                        hideCheckbox={true}
                        badge="Space"
                        onChange={onCreateNew} // Toggle generateNewSpace
                    />
                )}

                {/* ── Existing Linked Spaces ── */}
                {selectedSpaces.map((space) => (
                    <FormCheckbox
                        key={space.id}
                        title={space.name}
                        checked={true}
                        hideCheckbox={true}
                        badge="Space"
                        onChange={() => onRemove(space.id)}
                    />
                ))}

                {/* ── Add Space Trigger ── */}
                <button
                    type="button"
                    onClick={onOpen}
                    className="w-full text-left p-6 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-all flex items-center justify-center gap-2 group shadow-sm outline-none cursor-pointer"
                >
                    <Plus className="text-zinc-400 group-hover:text-zinc-600 transition-colors w-5 h-5" />
                    <span className="font-bold text-zinc-500 group-hover:text-zinc-700 transition-colors text-base">
                        Add Space
                    </span>
                </button>

                <ProjectSpaceModal 
                    isOpen={isOpen}
                    onOpenChange={(open) => !open && onClose()}
                    selectedSpaceIds={spaceIds}
                    usedSpaceIds={usedSpaceIds}
                    onSelectSpace={onSelect}
                    onRemoveSpace={onRemove}
                    onCreateNew={onCreateNew}
                />
            </div>
        </FormSection>
    );
};
