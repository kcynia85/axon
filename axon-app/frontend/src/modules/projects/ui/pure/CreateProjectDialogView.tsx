'use client';

import React from "react";
import { Button } from "@/shared/ui/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/shared/ui/ui/Dialog"
import { Form } from "@/shared/ui/ui/Form"
import { ProjectNameField } from "../components/ProjectNameField";
import { ProjectResourcesField } from "../components/ProjectResourcesField";
import { ProjectKeywordsField } from "../components/ProjectKeywordsField";
import { ProjectSpaceSelector } from "../components/ProjectSpaceSelector";
import { CreateProjectFormScrollArea } from "../components/CreateProjectFormLayout";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { UseFormReturn, FieldArrayWithId } from "react-hook-form";
import { CreateProjectFormData } from "@/modules/projects/application/schemas";

type CreateProjectDialogViewProperties = {
    readonly trigger?: React.ReactNode;
    readonly isDialogOpen: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly onClose: () => void;
    readonly form: UseFormReturn<CreateProjectFormData>;
    readonly linkFields: FieldArrayWithId<CreateProjectFormData, "links", "id">[];
    readonly appendLink: (value: { url: string }) => void;
    readonly removeLink: (index: number) => void;
    readonly projectName: string;
    readonly spaceMode: "new" | "existing";
    readonly currentKeywords: readonly string[];
    readonly keywordInput: string;
    readonly handleKeywordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    readonly handleKeywordKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    readonly removeKeyword: (keyword: string) => void;
    readonly handleSubmit: (values: CreateProjectFormData) => Promise<void>;
    readonly isPending: boolean;
};

/**
 * CreateProjectDialogView - Pure presentation component for the create project dialog.
 * Strictly 0% business logic, 0% state.
 */
export const CreateProjectDialogView = ({ 
    trigger,
    isDialogOpen,
    onOpenChange,
    onClose,
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
}: CreateProjectDialogViewProperties) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <ActionButton label="Nowy projekt" />
        )}
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
                onClick={onClose}
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
