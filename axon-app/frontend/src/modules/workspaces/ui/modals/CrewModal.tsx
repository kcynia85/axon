"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CrewSchema
} from "@/shared/domain/workspaces";
import { useAgents } from "@/modules/agents/infrastructure/useAgents";
import { useCreateCrew } from "@/modules/workspaces/application/useCrews";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/ui/Dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/ui/Form";
import { Input } from "@/shared/ui/ui/Input";
import { Button } from "@/shared/ui/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/shared/ui/ui/Select";
import { Checkbox } from "@/shared/ui/ui/Checkbox";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Users, Info } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const CreateCrewFormSchema = CrewSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
});

type FormData = z.infer<typeof CreateCrewFormSchema>;

/**
 * CrewModal: UI for assembling a new agent crew.
 * Standard: 0% useEffect, arrow function.
 */
export const CrewModal = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const workspaceId = params.workspace as string;
  const isOpen = searchParams.get("modal") === "new-crew";

  const { data: agents, isLoading: isLoadingAgents } = useAgents(workspaceId);
  const { mutateAsync: createCrew, isPending } = useCreateCrew(workspaceId);

  const form = useForm<FormData>({
    resolver: zodResolver(CreateCrewFormSchema) as any,
    defaultValues: {
      crew_name: "",
      crew_description: "",
      crew_process_type: "Sequential",
      manager_agent_id: null,
      crew_keywords: [],
      availability_workspace: [workspaceId],
      agent_member_ids: [],
    },
  });

  const crewProcessType = useWatch({
    control: form.control,
    name: "crew_process_type",
  });

  const agentMemberIds = useWatch({
    control: form.control,
    name: "agent_member_ids",
  });

  const closeModal = () => {
    const urlParams = new URLSearchParams(searchParams.toString());
    urlParams.delete("modal");
    router.replace(`?${urlParams.toString()}`, { scroll: false });
    form.reset();
  };

  const onSubmit = async (data: FormData) => {
    try {
      await createCrew(data);
      closeModal();
    } catch (error) {
      console.error("Failed to create crew:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[550px] p-0">
        <DialogHeader className="p-6 border-b bg-muted/20">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Strategic Unit</span>
          </div>
          <DialogTitle className="text-xl font-bold font-display">Assemble Agent Crew</DialogTitle>
          <DialogDescription className="text-xs">
            Combine multiple agents into a tactical unit with a defined execution protocol.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control as any}
                  name="crew_name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className="text-xs uppercase font-bold">Crew Callsign</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Genesis Alpha" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="crew_process_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase font-bold">Protocol</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="text-xs">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sequential" className="text-xs">Sequential (Step-by-step)</SelectItem>
                          <SelectItem value="Hierarchical" className="text-xs">Hierarchical (Manager-led)</SelectItem>
                          <SelectItem value="Parallel" className="text-xs">Parallel (Consensus)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="manager_agent_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase font-bold">Unit Manager</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || "none"}
                        disabled={crewProcessType !== "Hierarchical"}
                      >
                        <FormControl>
                          <SelectTrigger className="text-xs">
                            <SelectValue placeholder="Unmanaged" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none" className="text-xs italic">De-centralized</SelectItem>
                          {agents?.map(a => (
                            <SelectItem key={a.id} value={a.id} className="text-xs">
                              {a.agent_name || a.agent_role_text || "Specialist"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <FormLabel className="text-xs uppercase font-bold">Squad Selection</FormLabel>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {agentMemberIds?.length || 0} units active
                  </span>
                </div>
                <div className="border rounded-md p-2 grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto bg-muted/5">
                  {isLoadingAgents ? (
                    [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-8 w-full" />)
                  ) : agents?.length === 0 ? (
                    <div className="col-span-2 py-4 flex flex-col items-center gap-2 text-muted-foreground">
                      <Info className="w-4 h-4" />
                      <span className="text-[10px] italic">Hostiles detected: 0 Agents found.</span>
                    </div>
                  ) : (
                    agents?.map((agent) => (
                      <FormField
                        key={agent.id}
                        control={form.control as any}
                        name="agent_member_ids"
                        render={({ field }) => {
                          const isChecked = field.value?.includes(agent.id);
                          return (
                            <div
                              className={cn(
                                "flex items-center gap-2 p-2 rounded border transition-all cursor-pointer",
                                isChecked ? "bg-primary/10 border-primary" : "bg-background border-transparent"
                              )}
                              onClick={() => {
                                const current = field.value || [];
                                if (isChecked) {
                                  field.onChange(current.filter(id => id !== agent.id));
                                } else {
                                  field.onChange([...current, agent.id]);
                                }
                              }}
                            >
                              <Checkbox checked={isChecked} />
                              <div className="flex flex-col overflow-hidden">
                                <span className="text-[10px] font-bold truncate">
                                  {agent.agent_name || "Specialist"}
                                </span>
                                <span className="text-[8px] text-muted-foreground truncate opacity-70">
                                  {agent.agent_role_text || "Tactical Agent"}
                                </span>
                              </div>
                            </div>
                          )
                        }}
                      />
                    ))
                  )}
                </div>
                <FormMessage />
              </div>
            </div>

            <DialogFooter className="p-4 border-t bg-muted/10">
              <Button type="button" variant="ghost" size="sm" onClick={closeModal} className="text-xs">
                Abort
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs gap-2"
                disabled={(agentMemberIds?.length || 0) < 1 || isPending}
              >
                {isPending ? "Assembling..." : "Initialize Crew"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
