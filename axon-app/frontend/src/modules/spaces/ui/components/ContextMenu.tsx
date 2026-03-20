// frontend/src/modules/spaces/ui/components/ContextMenu.tsx

import React from 'react';
import { cn } from '@/shared/lib/utils';

export type ContextMenuOption = {
    readonly id: string;
    readonly label: string;
    readonly icon?: React.ReactNode;
    readonly shortcut?: string;
    readonly danger?: boolean;
    readonly separator?: boolean;
};

type ContextMenuProps = {
    readonly x: number;
    readonly y: number;
    readonly type: 'pane' | 'node' | 'selection';
    readonly onAction: (id: string) => void;
    readonly onClose: () => void;
};

const PANE_OPTIONS: readonly ContextMenuOption[] = [
    { id: 'paste', label: 'Paste', shortcut: '⌘V' },
    { id: 'sep1', label: '', separator: true },
    { id: 'add-agent', label: 'Add Agent' },
    { id: 'add-crew', label: 'Add Crew' },
    { id: 'sep2', label: '', separator: true },
    { id: 'analyze-structure', label: 'Analyze Structure', icon: '✨' },
];

const NODE_OPTIONS: readonly ContextMenuOption[] = [
    { id: 'duplicate', label: 'Duplicate', shortcut: '⌘D' },
    { id: 'copy', label: 'Copy', shortcut: '⌘C' },
    { id: 'cut', label: 'Cut', shortcut: '⌘X' },
    { id: 'sep1', label: '', separator: true },
    { id: 'status-active', label: 'Set Active' },
    { id: 'status-idle', label: 'Set Idle' },
    { id: 'sep2', label: '', separator: true },
    { id: 'delete', label: 'Delete', shortcut: '⌫', danger: true },
];

const SELECTION_OPTIONS: readonly ContextMenuOption[] = [
    { id: 'copy', label: 'Copy Selection', shortcut: '⌘C' },
    { id: 'cut', label: 'Cut Selection', shortcut: '⌘X' },
    { id: 'sep1', label: '', separator: true },
    { id: 'create-pattern', label: 'Create Pattern from Selection', icon: '📦' },
    { id: 'sep2', label: '', separator: true },
    { id: 'delete', label: 'Delete Selection', shortcut: '⌫', danger: true },
];

export const ContextMenu = ({ x, y, type, onAction, onClose }: ContextMenuProps) => {
    const options = type === 'pane' ? PANE_OPTIONS : type === 'node' ? NODE_OPTIONS : SELECTION_OPTIONS;

    React.useEffect(() => {
        const handleOutsideClick = () => onClose();
        window.addEventListener('click', handleOutsideClick);
        return () => window.removeEventListener('click', handleOutsideClick);
    }, [onClose]);

    return (
        <div 
            className="fixed z-[1000] bg-zinc-900 border border-zinc-800 shadow-2xl rounded-xl py-1.5 min-w-[200px] font-mono"
            style={{ left: x, top: y }}
            onClick={(e) => e.stopPropagation()}
        >
            {options.map((opt) => (
                opt.separator ? (
                    <div key={opt.id} className="h-[1px] bg-zinc-800 my-1 mx-2" />
                ) : (
                    <button
                        key={opt.id}
                        className={cn(
                            "w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors",
                            opt.danger ? "text-red-400 hover:bg-red-500/10" : "text-zinc-300 hover:bg-white/5 hover:text-white"
                        )}
                        onClick={() => {
                            onAction(opt.id);
                            onClose();
                        }}
                    >
                        <div className="flex items-center gap-2">
                            {opt.icon && <span>{opt.icon}</span>}
                            {opt.label}
                        </div>
                        {opt.shortcut && <span className="opacity-30 ml-4">{opt.shortcut}</span>}
                    </button>
                )
            ))}
        </div>
    );
};
