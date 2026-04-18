'use client';

import React, { useState } from "react";
import { Button } from "@/shared/ui/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/shared/ui/ui/Dialog";
import { CreateProjectFormScrollArea } from "../../../projects/features/browse-projects/ui/components/CreateProjectFormLayout";
import { useProjectsQuery } from "@/modules/projects/features/browse-projects/application/hooks";
import { useUpdateSpaceMutation } from "../../application/hooks";
import { Search } from "lucide-react";
import { Input } from "@/shared/ui/ui/Input";

export const AttachProjectDialog = ({ spaceId, children }: { spaceId: string, children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { data: projects = [] } = useProjectsQuery();
  const { mutate: updateSpace, isPending } = useUpdateSpaceMutation();

  const filteredProjects = projects.filter(p => 
      (p.name || p.project_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAttach = () => {
      if (!selectedProjectId) return;
      updateSpace(
          { id: spaceId, updates: { projectId: selectedProjectId } },
          {
              onSuccess: () => {
                  setOpen(false);
              }
          }
      );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[95vh] p-0 overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black shadow-2xl rounded-2xl flex flex-col">
          <div className="flex flex-col flex-1 overflow-hidden">
            <CreateProjectFormScrollArea>
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-black text-black dark:text-white">Podłącz projekt</h2>
                        <p className="text-sm text-zinc-500 mt-1">Wybierz projekt z listy, do którego chcesz przypisać ten space.</p>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input 
                            placeholder="Wyszukaj projekt..." 
                            className="h-11 pl-11 bg-zinc-50 dark:bg-zinc-900/50 text-black dark:text-white border-zinc-200 dark:border-zinc-800 rounded-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        {filteredProjects.map(p => (
                            <div 
                                key={p.id}
                                onClick={() => setSelectedProjectId(p.id)}
                                className={`p-4 border rounded-xl cursor-pointer transition-all ${
                                    selectedProjectId === p.id 
                                    ? 'border-zinc-900 bg-zinc-50 dark:border-white dark:bg-zinc-900' 
                                    : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700'
                                }`}
                            >
                                <div className="font-bold text-sm text-black dark:text-white">{p.name || p.project_name || "Nienazwany projekt"}</div>
                                {p.description && <div className="text-xs text-zinc-500 mt-1 line-clamp-1">{p.description}</div>}
                            </div>
                        ))}
                        {filteredProjects.length === 0 && (
                            <div className="text-center text-zinc-500 p-8 text-sm">Brak dostępnych projektów.</div>
                        )}
                    </div>
                </div>
            </CreateProjectFormScrollArea>

            <DialogFooter className="p-10 pt-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-black/80 backdrop-blur-xl shrink-0 z-20 flex flex-row justify-end items-center gap-6">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => setOpen(false)}
                className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-black tracking-normal text-base"
              >
                Anuluj
              </Button>
              <Button 
                type="button" 
                size="sm" 
                className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-black rounded-md shadow-xl transition-all active:scale-[0.98] tracking-normal text-base px-10 h-12"
                disabled={!selectedProjectId || isPending}
                onClick={handleAttach}
              >
                {isPending ? "Podłączanie..." : "Podłącz projekt"}
              </Button>
            </DialogFooter>
          </div>
      </DialogContent>
    </Dialog>
  );
};
