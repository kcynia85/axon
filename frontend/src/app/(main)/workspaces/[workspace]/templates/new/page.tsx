"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TemplateSchema, Template } from "@/shared/domain/workspaces";
import { useWorkspace } from "@/modules/workspaces/application/use-workspaces";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/shared/ui/ui/form";
import { Input } from "@/shared/ui/ui/input";
import { Button } from "@/shared/ui/ui/button";
import { Textarea } from "@/shared/ui/ui/textarea";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/shared/ui/ui/separator";

export default function NewTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspace as string;
  
  const { data: workspace } = useWorkspace(workspaceId);

  const form = useForm<Partial<Template>>({
    resolver: zodResolver(TemplateSchema.omit({ id: true })),
    defaultValues: {
      name: "",
      description: "",
      category: "General",
      tags: [],
    },
  });

  const onSubmit = async (data: Partial<Template>) => {
    console.log("Saving template:", data);
    // TODO: Mutation
    router.push(`/workspaces/${workspaceId}/templates`);
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Nowy Template" 
        description="Create reusable blueprints for your agents and workflows."
        breadcrumbs={[
            { label: "Workspaces", href: "/workspaces" },
            { label: workspace?.name || "...", href: `/workspaces/${workspaceId}` },
            { label: "Templates", href: `/workspaces/${workspaceId}/templates` },
            { label: "New", active: true }
        ]}
      />

      <PageContent className="max-w-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            {/* Section 1: Definition */}
            <section className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">1. Definicja</h3>
                    <p className="text-sm text-muted-foreground">Podstawowe parametry szablonu.</p>
                </div>
                
                <div className="grid gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Nazwa Szablonu</AddressLabel>
                            <FormControl>
                                <Input placeholder="np. Analiza Konkurencji" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Opis</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Krótki cel szablonu..." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Kategoria</FormLabel>
                            <FormControl>
                                <Input placeholder="np. Research" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </section>

            <Separator />

            {/* Section 2: Instructions */}
            <section className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">2. Instrukcja (Markdown / Content)</h3>
                    <p className="text-sm text-muted-foreground">Zdefiniuj wytyczne dla agenta korzystającego z tego szablonu.</p>
                </div>

                <div className="border rounded-md bg-muted/20 p-1 min-h-[300px]">
                    <Textarea 
                        placeholder="# Twoja Instrukcja&#10;&#10;Opisz kroki, które agent ma wykonać..." 
                        className="min-h-[290px] border-none focus-visible:ring-0 resize-none font-mono text-sm"
                    />
                </div>
            </section>

            <div className="flex justify-end gap-4 pt-6 border-t">
                <Button type="button" variant="ghost" onClick={() => router.back()}>Anuluj</Button>
                <Button type="submit" size="lg">
                    Zapisz Template
                </Button>
            </div>
          </form>
        </Form>
      </PageContent>
    </PageContainer>
  );
}
