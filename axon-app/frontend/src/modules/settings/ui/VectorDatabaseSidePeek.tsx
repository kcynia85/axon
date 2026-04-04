"use client";

import React from "react";
import { 
    SidePeek, 
    SidePeekSection, 
    SidePeekGrid, 
    SidePeekGridItem 
} from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { 
    Database, 
    Settings, 
    Trash2,
    AlertTriangle
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { VectorDatabase } from "@/shared/domain/settings";
import { CategoryChip } from "@/shared/ui/ui/CategoryChip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/shared/ui/ui/Dialog";

type VectorDatabaseSidePeekProps = {
  readonly db: VectorDatabase | (VectorDatabase & { isMock?: boolean }) | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onEdit?: (db: any) => void;
  readonly onDelete?: (id: string) => void;
}

export const VectorDatabaseSidePeek = ({ 
    db, 
    isOpen, 
    onClose, 
    onEdit, 
    onDelete 
}: VectorDatabaseSidePeekProps) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

    if (!db) return null;

    const isConnected = db.vector_database_connection_status.toUpperCase() === "CONNECTED";
    const isPostgres = db.vector_database_type.toUpperCase().includes("POSTGRES");

    const handleDelete = () => {
        if (db.id && onDelete) {
            onDelete(db.id);
            setShowDeleteConfirm(false);
            onClose();
        }
    };

    return (
        <>
            <SidePeek
                open={isOpen}
                onOpenChange={(open) => !open && onClose()}
                title={db.vector_database_name}
                description={isConnected ? "Połączony" : "Rozłączony"}
                modal={false}
                image={
                    <div className={cn(
                        "p-3 rounded-xl",
                        isPostgres ? "bg-blue-500/10 text-blue-500" : "bg-primary/10 text-primary"
                    )}>
                        <Database className="w-6 h-6" />
                    </div>
                }
                footer={
                    <div className="flex w-full justify-between items-center">
                        <Button 
                            variant="ghost" 
                            size="icon-lg"
                            className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 shrink-0" 
                            onClick={() => setShowDeleteConfirm(true)}
                            disabled={'isMock' in db}
                        >
                            <Trash2 className="w-5 h-5" />
                        </Button>
                        <Button 
                            className="bg-primary hover:bg-primary/90 font-bold" 
                            size="lg"
                            onClick={() => !('isMock' in db) && onEdit?.(db)}
                            disabled={'isMock' in db}
                        >
                            <Settings className="w-4 h-4 mr-2" /> Edytuj Bazę
                        </Button>
                    </div>
                }
            >
                <div className="space-y-12">
                    {/* ── Metadata Summary ── */}
                    <SidePeekGrid>
                        <SidePeekGridItem 
                            label="Host" 
                            value={<CategoryChip label={db.vector_database_connection_url || "aws-eu-central-1"} className="font-mono" />} 
                        />
                        <SidePeekGridItem 
                            label="Typ" 
                            value={<CategoryChip label={db.vector_database_type.replace(/_/g, " ")} />} 
                        />
                    </SidePeekGrid>

                    {/* ── Table ── */}
                    <SidePeekSection title="Tabela">
                        <div className="p-3 rounded-lg bg-muted/30 border border-primary/5">
                            <p className="text-base font-mono font-semibold text-white">
                                {db.vector_database_collection_name || "axon_knowledge_vectors_1536"}
                            </p>
                        </div>
                    </SidePeekSection>

                    {/* ── Embedding Model ── */}
                    <SidePeekSection title="Embedding Model">
                        <div className="p-3 rounded-lg bg-muted/30 border border-primary/5">
                            <CategoryChip label={db.vector_database_embedding_model_reference || "text-embedding-3-small"} />
                        </div>
                    </SidePeekSection>

                    {/* ── Statistics ── */}
                    <SidePeekSection title="Statystyki">
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                                <p className="text-base font-semibold text-white">
                                    {(db.vector_database_total_vectors || 450200).toLocaleString()} wektorów
                                </p>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                                <p className="text-base font-semibold text-white">
                                    {db.vector_database_size ? `${db.vector_database_size} MB` : "45 MB"}
                                </p>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                                <p className="text-base font-semibold text-white">
                                    Avg. Query: 24 ms
                                </p>
                            </div>
                        </div>
                    </SidePeekSection>
                </div>
            </SidePeek>

            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-500">
                            <AlertTriangle className="w-5 h-5" />
                            Usuwanie Bazy Wektorowej
                        </DialogTitle>
                        <DialogDescription className="py-4">
                            Czy na pewno chcesz usunąć bazę <strong className="text-foreground">{db.vector_database_name}</strong>? 
                            Tej operacji nie można cofnąć.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
                            Anuluj
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleDelete}
                        >
                            Tak, usuń bazę
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
