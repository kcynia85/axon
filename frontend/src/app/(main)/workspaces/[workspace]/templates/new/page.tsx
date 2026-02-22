"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/shared/ui/layout/PageHeader";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { PageContent } from "@/shared/ui/layout/PageContent";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/ui/Form";
import { Input } from "@/shared/ui/ui/Input";
import { Button } from "@/shared/ui/ui/Button";
import { Textarea } from "@/shared/ui/ui/Textarea";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/shared/ui/ui/Separator";
import { z } from "zod";

const FormSchema = z.object({
  template_name: z.string().min(1, "Nazwa jest wymagana"),
  template_description: z.string().optional(),
  template_markdown_content: z.string().min(1, "Treść jest wymagana"),
  template_keywords: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof FormSchema>;

export default function NewTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspace as string;

  // workspace unused for now

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      template_name: "",
      template_description: "",
      template_markdown_content: "",
      template_keywords: [],
    },
  });

  const onSubmit = async (data: FormValues) => {
    console.log("Saving template:", data);
    // TODO: Mutation
    router.push(`/workspaces/${workspaceId}/templates`);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Nowy Template"
        description="Create reusable blueprints for your agents and workflows."
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
                  name="template_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nazwa Szablonu</FormLabel>
                      <FormControl>
                        <Input placeholder="np. Analiza Konkurencji" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="template_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opis</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Krótki cel szablonu..." {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="template_keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slowa kluczowe (rozdzielone przecinkiem)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="np. Research, Analiza"
                          value={field.value?.join(", ") || ""}
                          onChange={(event) => field.onChange(event.target.value.split(",").map((tag) => tag.trim()))}
                        />
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

              <FormField
                control={form.control}
                name="template_markdown_content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="border rounded-md bg-muted/20 p-1 min-h-[300px]">
                        <Textarea
                          {...field}
                          placeholder="# Twoja Instrukcja&#10;&#10;Opisz kroki, które agent ma wykonać..."
                          className="min-h-[290px] border-none focus-visible:ring-0 resize-none font-mono text-sm"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
