"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CrewSchema, Crew } from "@/shared/domain/workspaces";
import { useAgents, useWorkspace } from "@/modules/workspaces/application/use-workspaces";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/shared/ui/ui/form";
import { Input } from "@/shared/ui/ui/input";
import { Button } from "@/shared/ui/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/ui/select";
import { Checkbox } from "@/shared/ui/ui/checkbox";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/shared/ui/ui/skeleton";
import { Card, CardContent } from "@/shared/ui/ui/card";
import { Separator } from "@/shared/ui/ui/separator";

export default function NewCrewPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspace as string;
  
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: agents, isLoading: isLoadingAgents } = useAgents(workspaceId);

  const form = useForm<Partial<Crew>>({
    resolver: zodResolver(CrewSchema.omit({ id: true })),
    defaultValues: {
      name: "",
      process: "sequential",
      agents: [],
    },
  });

  const onSubmit = async (data: Partial<Crew>) => {
    console.log("Saving crew:", data);
    // TODO: Mutation
    router.push(`/workspaces/${workspaceId}/crews`);
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Nowy Crew" 
        description="Assemble a team of agents to perform complex tasks."
        breadcrumbs={[
            { label: "Workspaces", href: "/workspaces" },
            { label: workspace?.name || "...", href: `/workspaces/${workspaceId}` },
            { label: "Crews", href: `/workspaces/${workspaceId}/crews` },
            { label: "New", active: true }
        ]}
      />

      <PageContent className="max-w-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            {/* Section 1: Basic Info */}
            <section className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">1. Podstawowe informacje</h3>
                    <p className="text-sm text-muted-foreground">Define the identity and goal of this crew.</p>
                </div>
                
                <div className="grid gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Crew Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Content Production Team" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </section>

            <Separator />

            {/* Section 2: Process Type */}
            <section className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">2. Wybór procesu współpracy (Typ)</h3>
                    <p className="text-sm text-muted-foreground">How should agents interact with each other?</p>
                </div>

                <FormField
                    control={form.control}
                    name="process"
                    render={({ field }) => (
                        <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger className="w-full md:w-[300px]">
                                <SelectValue placeholder="Select process type" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="sequential">Sequential (Step-by-step)</SelectItem>
                                <SelectItem value="hierarchical">Hierarchical (Manager-led)</SelectItem>
                                <SelectItem value="parallel">Parallel (Independent)</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormDescription>
                            {field.value === 'sequential' && "Agents work in order. Output of one is input for the next."}
                            {field.value === 'hierarchical' && "A manager agent delegates tasks to others."}
                            {field.value === 'parallel' && "Agents work simultaneously on separate parts."}
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </section>

            <Separator />

            {/* Section 3: Team Members */}
            <section className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">3. Team Members (Agents)</h3>
                    <p className="text-sm text-muted-foreground">Select which agents will belong to this crew.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {isLoadingAgents ? (
                        [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full" />)
                    ) : (
                        agents?.map((agent) => (
                            <FormField
                                key={agent.id}
                                control={form.control}
                                name="agents"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-card shadow-sm group cursor-pointer hover:border-primary/50 transition-colors">
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
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-sm font-medium cursor-pointer">
                                                {agent.role}
                                            </FormLabel>
                                            <p className="text-[10px] text-muted-foreground line-clamp-1">
                                                {agent.goal}
                                            </p>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        ))
                    )}
                </div>
            </section>

            <div className="flex justify-end gap-4 pt-6 border-t">
                <Button type="button" variant="ghost" onClick={() => router.back()}>Anuluj</Button>
                <Button type="submit" size="lg" disabled={form.watch("agents")?.length === 0}>
                    Zapisz Team
                </Button>
            </div>
          </form>
        </Form>
      </PageContent>
    </PageContainer>
  );
}
