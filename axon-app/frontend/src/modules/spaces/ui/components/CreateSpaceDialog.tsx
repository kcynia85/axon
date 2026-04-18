'use client';

import React, { useState } from "react";
import { Button } from "@/shared/ui/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/shared/ui/ui/Dialog"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/shared/ui/ui/Form"
import { useCreateSpaceForm } from "../../application/useCreateSpaceForm";
import { SpaceProjectSelector } from "./SpaceProjectSelector";
import { CreateProjectFormScrollArea } from "@/modules/projects/ui/components/CreateProjectFormLayout";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { FormTextField } from "@/shared/ui/form/FormTextField";

export const CreateSpaceDialog = () => {
  const [open, setOpen] = useState(false);
  const {
    form,
    spaceName,
    projectMode,
    handleSubmit,
    isPending
  } = useCreateSpaceForm(() => setOpen(false));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ActionButton label="New Space" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[95vh] p-0 overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black shadow-2xl rounded-2xl flex flex-col">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <CreateProjectFormScrollArea>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <FormTextField 
                        placeholder="Nazwa Space" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SpaceProjectSelector 
                form={form as any} 
                projectMode={projectMode} 
                spaceName={spaceName} 
              />
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
                type="submit" 
                size="sm" 
                className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-black rounded-md shadow-xl transition-all active:scale-[0.98] tracking-normal text-base px-10 h-12"
                disabled={isPending}
              >
                {isPending ? "Tworzenie..." : "Utwórz space"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
