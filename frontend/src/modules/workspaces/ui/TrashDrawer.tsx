"use client";

import * as React from "react";
import { 
    X,
    Trash2,
    RotateCcw,
    AlertTriangle,
    Clock,
    Search
} from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";
import { Input } from "@/shared/ui/ui/Input";
import { useUiStore } from "@/shared/lib/store/useUiStore";
import { cn } from "@/shared/lib/utils";
import { useTrash, useRestoreItem, usePurgeItem } from "@/modules/workspaces/application/useTrash";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export const TrashDrawer = () => {
    const { isTrashOpen, setIsTrashOpen, isSidebarCollapsed } = useUiStore();
    const [searchQuery, setSearchQuery] = React.useState("");
    
    const { data: trashItems, isLoading } = useTrash();
    const restoreMutation = useRestoreItem();
    const purgeMutation = usePurgeItem();

    // Close when clicking outside - simple implementation
    // Ideally use useClickOutside hook, but for now a backdrop or check is fine.
    // Since we want it modeless-like, we might not want a full backdrop.
    // But for a "Drawer", usually clicking away closes it.
    // Let's assume user clicks toggle button to close or the X button.

    const handleRestore = async (id: string, type: string, name: string) => {
        try {
            await restoreMutation.mutateAsync({ id, type });
            toast.success(`Przywrócono "${name}"`);
        } catch (error) {
            toast.error("Nie udało się przywrócić elementu");
        }
    };

    const handlePurge = async (id: string, type: string, name: string) => {
        if (window.confirm(`Czy na pewno chcesz trwale usunąć "${name}"? Tej operacji nie można cofnąć.`)) {
            try {
                await purgeMutation.mutateAsync({ id, type });
                toast.success(`Trwale usunięto "${name}"`);
            } catch (error) {
                toast.error("Nie udało się usunąć elementu");
            }
        }
    };

    const filteredItems = React.useMemo(() => {
        if (!trashItems) return [];
        let items = [...trashItems];
        
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            items = items.filter(item => 
                item.name.toLowerCase().includes(lowerQuery) || 
                item.type.toLowerCase().includes(lowerQuery)
            );
        }

        return items.sort((a, b) => new Date(b.deleted_at).getTime() - new Date(a.deleted_at).getTime());
    }, [trashItems, searchQuery]);

    const sidebarWidth = isSidebarCollapsed ? "90px" : "260px";
    // Add small offset
    const leftOffset = isSidebarCollapsed ? "100px" : "270px";

    return (
        <AnimatePresence>
            {isTrashOpen && (
                <>
                    {/* Invisible backdrop to close on click outside if needed, or just let user click the toggle button again */}
                    <div 
                        className="fixed inset-0 z-40 bg-transparent" 
                        onClick={() => setIsTrashOpen(false)}
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        style={{ left: leftOffset }}
                        className={cn(
                            "fixed bottom-4 z-50 w-[400px] max-h-[600px] h-[60vh] flex flex-col",
                            "bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800",
                            "rounded-xl shadow-2xl shadow-zinc-950/20",
                            "backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-zinc-950/80"
                        )}
                    >
                        {/* Header */}
                        <div className="flex flex-col gap-3 p-4 border-b border-zinc-100 dark:border-zinc-900/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                    <Trash2 className="w-4 h-4 text-zinc-500" />
                                    <span>Kosz</span>
                                    <span className="ml-1 text-xs text-zinc-400 font-medium">
                                        {filteredItems.length}
                                    </span>
                                </div>
                                {/* Optional: Close button if they don't want to click outside */}
                                {/* <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsTrashOpen(false)}>
                                    <X className="w-3 h-3" />
                                </Button> */}
                            </div>
                            
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                                <Input 
                                    placeholder="Szukaj w koszu..." 
                                    className="h-8 pl-8 text-xs bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                            {isLoading ? (
                                <div className="space-y-2 p-2">
                                    {[1, 2, 3].map(i => (
                                        <Skeleton key={i} className="h-12 w-full rounded-lg" />
                                    ))}
                                </div>
                            ) : filteredItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2 opacity-50 pb-8">
                                    <Search className="w-8 h-8" />
                                    <p className="text-xs font-medium">Brak elementów</p>
                                </div>
                            ) : (
                                filteredItems.map((item) => (
                                    <div 
                                        key={item.id} 
                                        className="group flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                                            {/* Icon based on type? For now generic file icon or similar */}
                                            <div className="w-6 h-6 rounded flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 shrink-0">
                                                <span className="text-[10px] font-bold text-zinc-500 uppercase">{item.type[0]}</span>
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate pr-2">
                                                    {item.name}
                                                </span>
                                                <span className="text-[10px] text-zinc-400 truncate">
                                                    W koszu {formatDistanceToNow(new Date(item.deleted_at), { addSuffix: true, locale: pl })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 bg-white dark:bg-zinc-950 shadow-sm rounded-md border border-zinc-100 dark:border-zinc-800 p-0.5">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-zinc-400 hover:text-green-600 hover:bg-green-500/10 rounded"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRestore(item.id, item.type, item.name);
                                                }}
                                                title="Przywróć"
                                            >
                                                <RotateCcw className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-zinc-400 hover:text-red-600 hover:bg-red-500/10 rounded"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handlePurge(item.id, item.type, item.name);
                                                }}
                                                title="Usuń trwale"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-3 border-t border-zinc-100 dark:border-zinc-900/50 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-b-xl">
                            <p className="text-[10px] text-center text-zinc-400 font-medium">
                                Elementy starsze niż 30 dni są usuwane automatycznie.
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
