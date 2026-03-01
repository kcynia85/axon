'use client';

import React, { useState } from "react";
import { Button } from "@/shared/ui/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/shared/ui/ui/Dialog"
import { Form } from "@/shared/ui/ui/Form"
import { Plus } from "lucide-react"
import { useCreateProjectForm } from "../application/useCreateProjectForm";
import { ProjectNameField } from "./components/ProjectNameField";
import { ProjectResourcesField } from "./components/ProjectResourcesField";
import { ProjectKeywordsField } from "./components/ProjectKeywordsField";
import { ProjectSpaceSelector } from "./components/ProjectSpaceSelector";
import { CreateProjectDialogProps } from "./types";
import { CreateProjectFormScrollArea } from "./components/CreateProjectFormLayout";

export const CreateProjectDialog: React.FC<CreateProjectDialogProps> = () => {
  const [open, setOpen] = useState(false);
  
  const {
    form,
    linkFields,
    appendLink,
    removeLink,
    projectName,
    spaceMode,
    currentKeywords,
    keywordInput,
    handleKeywordChange,
    handleKeywordKeyDown,
    removeKeyword,
    handleSubmit,
    isPending
  } = useCreateProjectForm(() => setOpen(false));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Nowy projekt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[95vh] p-0 overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black shadow-2xl rounded-2xl flex flex-col">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <CreateProjectFormScrollArea>
              <ProjectNameField form={form} />

              <ProjectResourcesField 
                form={form} 
                linkFields={linkFields} 
                onAppend={appendLink} 
                onRemove={removeLink} 
              />

              <ProjectKeywordsField 
                form={form}
                currentKeywords={currentKeywords}
                keywordInput={keywordInput}
                onKeywordChange={handleKeywordChange}
                onKeywordKeyDown={handleKeywordKeyDown}
                onRemoveKeyword={removeKeyword}
              />

              <ProjectSpaceSelector 
                form={form}
                spaceMode={spaceMode}
                projectName={projectName}
              />
            </CreateProjectFormScrollArea>

            <DialogFooter className="absolute bottom-0 left-0 right-0 p-10 pt-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-black/80 backdrop-blur-xl shrink-0 z-20 flex flex-row justify-end items-center gap-6">
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
                type="submit" 
                size="sm" 
                className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-black rounded-md shadow-xl transition-all active:scale-[0.98] tracking-normal text-base px-10 h-12"
                disabled={isPending}
              >
                {isPending ? "Tworzenie..." : "Utwórz projekt"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
