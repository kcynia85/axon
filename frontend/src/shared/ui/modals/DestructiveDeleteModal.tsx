"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/ui/Dialog";
import { Button } from "@/shared/ui/ui/Button";
import { AlertTriangle, Info } from "lucide-react";

interface AffectedResource {
  id: string;
  name: string;
  role: string;
}

interface DestructiveDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  resourceName: string;
  affectedResources: AffectedResource[];
  isLoading?: boolean;
}

export const DestructiveDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  resourceName,
  affectedResources,
  isLoading = false,
}: DestructiveDeleteModalProps) => {
  const hasAffiliations = affectedResources.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-0 overflow-hidden rounded-3xl">
        <div className="p-8 space-y-6">
          <DialogHeader className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mb-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase italic">
              {title}
            </DialogTitle>
            <DialogDescription className="text-base text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
              Are you sure you want to delete <span className="text-zinc-900 dark:text-white font-bold">&quot;{resourceName}&quot;</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="py-10 flex justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : hasAffiliations ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-bold leading-tight uppercase tracking-wider">
                  Important: This agent is currently assigned to the following crews:
                </p>
              </div>
              
              <div className="max-h-[200px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {affectedResources.map((resource) => (
                  <div key={resource.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                    <span className="font-bold text-sm text-zinc-900 dark:text-white">{resource.name}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-500">
                      {resource.role}
                    </span>
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-zinc-500 italic px-1">
                Note: Deleting this agent will automatically remove them from these teams.
              </p>
            </div>
          ) : null}
        </div>

        <DialogFooter className="p-6 bg-zinc-50 dark:bg-zinc-900/30 border-t border-zinc-100 dark:border-zinc-800 gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 rounded-2xl h-12 font-bold uppercase tracking-widest text-[11px] border-zinc-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-900"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-[1.5] rounded-2xl h-12 font-black uppercase tracking-widest text-[11px] bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
          >
            Confirm Deletion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
