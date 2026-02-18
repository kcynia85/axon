"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  CrewSchema, 
  Crew 
} from "@/shared/domain/workspaces";
import { useAgents } from "@/modules/workspaces/application/use-workspaces";
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
import { Button } from "@/shared/ui/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shared/ui/ui/select";
import { Checkbox } from "@/shared/ui/ui/checkbox";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { Skeleton } from "@/shared/ui/ui/skeleton";

export const CrewModal = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const workspaceId = params.workspace as string;
  const isOpen = searchParams.get("modal") === "new-crew";
  
  const { data: agents, isLoading: isLoadingAgents } = useAgents(workspaceId);

  const form = useForm<Partial<Crew>>({
    resolver: zodResolver(CrewSchema.omit({ id: true })),
    defaultValues: {
      name: "",
      process: "sequential",
      agents: [],
    },
  });

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    router.replace(`?${params.toString()}`, { scroll: false });
    form.reset();
  };

  const onSubmit = async (data: Partial<Crew>) => {
    console.log("Saving crew:", data);
    // TODO: Implement mutation
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Assemble Crew</DialogTitle>
          <DialogDescription>
            A crew is a group of agents working together to achieve a common goal.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crew Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Research & Writing Crew" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="process"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Process Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select process type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sequential">Sequential (Step-by-step)</SelectItem>
                      <SelectItem value="hierarchical">Hierarchical (Manager-led)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
                <FormLabel>Select Agents</FormLabel>
                <div className="border rounded-md p-4 space-y-3 max-h-[200px] overflow-y-auto">
                    {isLoadingAgents ? (
                        [1, 2].map(i => <Skeleton key={i} className="h-6 w-full" />)
                    ) : agents?.length === 0 ? (
                        <div className="text-sm text-muted-foreground text-center py-2">No agents available. Add agents first.</div>
                    ) : (
                        agents?.map((agent) => (
                            <FormField
                                key={agent.id}
                                control={form.control}
                                name="agents"
                                render={({ field }) => {
                                    return (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value?.includes(agent.id)}
                                                    onCheckedChange={(checked) => {
                                                        return checked
                                                            ? field.onChange([...(field.value || []), agent.id])
                                                            : field.onChange(
                                                                field.value?.filter(
                                                                    (value) => value !== agent.id
                                                                )
                                                            )
                                                    }}
                                                />
                                            </FormControl>
                                            <FormLabel className="text-sm font-normal cursor-pointer">
                                                {agent.role}
                                            </FormLabel>
                                        </FormItem>
                                    )
                                }}
                            />
                        ))
                    )}
                </div>
                <FormMessage />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.watch("agents")?.length === 0}>
                Create Crew
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
