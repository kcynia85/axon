"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  CreateAgentSchema, 
  CreateAgentDTO 
} from "@/shared/domain/workspaces";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/ui/form";
import { Input } from "@/shared/ui/ui/input";
import { Textarea } from "@/shared/ui/ui/textarea";
import { Button } from "@/shared/ui/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * AgentModal - MVP Baseline
 * Strictly following "Tożsamość" section from axon_bb_workspace_agents.pdf
 */
export const AgentModal = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get("modal") === "new-agent";

  const form = useForm<CreateAgentDTO>({
    resolver: zodResolver(CreateAgentSchema),
    defaultValues: {
      role: "",
      goal: "",
      backstory: "",
      keywords: [],
    },
  });

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    router.replace(`?${params.toString()}`, { scroll: false });
    form.reset();
  };

  const onSubmit = async (data: CreateAgentDTO) => {
    console.log("Saving baseline agent (breadboard-aligned):", data);
    // TODO: Implement mutation
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Nowy Agent</DialogTitle>
          <DialogDescription>
            Krok 3: Tożsamość. Zdefiniuj podstawowe cechy swojego agenta.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rola</FormLabel>
                  <FormControl>
                    <Input placeholder="np. QA Process Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cel</FormLabel>
                  <FormControl>
                    <Input placeholder="Co agent ma osiągnąć?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="backstory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Backstory (Meta Prompt)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Kontekst i instrukcje systemowe..." 
                      className="resize-none h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords</FormLabel>
                  <FormControl>
                    <Input 
                        placeholder="np. research, analysis, writing (rozdzielaj przecinkami)" 
                        onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val.split(",").map(s => s.trim()).filter(Boolean));
                        }}
                        value={field.value?.join(", ")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={closeModal}>
                Anuluj
              </Button>
              <Button type="submit">Zapisz Agenta</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
