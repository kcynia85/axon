"use client";

import { useParams, useRouter } from "next/navigation";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Badge } from "@/shared/ui/ui/Badge";
import { Button } from "@/shared/ui/ui/Button";
import { Separator } from "@/shared/ui/ui/Separator";
import { useTemplates } from "@/modules/workspaces/application/useWorkspaces";
import { FileText, Tag, ListTodo, Info } from "lucide-react";

export default function TemplateSidePeekPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspace as string;
  const templateId = params.id as string;
  
  const { data: templates } = useTemplates(workspaceId);
    const template = templates?.find((templateItem) => templateItem.id === templateId);

  if (!template) return null;

  return (
    <SidePeek 
        title={template.template_name} 
        description="Template Details"
        open={true}
        onOpenChange={() => router.push(`/workspaces/${workspaceId}/templates`)}
        footer={
            <Button className="w-full" variant="outline" onClick={() => router.push(`/workspaces/${workspaceId}/templates/${templateId}/edit`)}>
                Edytuj Template
            </Button>
        }
    >
        <div className="space-y-8">
            {/* Context & Tags */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase text-muted-foreground font-bold">Category</div>
                    <Badge variant="outline">SOP</Badge>
                </div>
                <div className="space-y-2">
                    <div className="text-[10px] uppercase text-muted-foreground font-bold flex items-center gap-1">
                        <Tag className="h-3 w-3" /> Keywords
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {template.template_keywords.map(tag => (
                            <Badge key={tag} variant="secondary" className="font-normal">#{tag}</Badge>
                        ))}
                    </div>
                </div>
            </section>

            <Separator />

            {/* Content Preview */}
            <section className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" /> Opis
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                    {template.template_description}
                </p>
            </section>

            <Separator />

            {/* Instruction / Markdown */}
            <section className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" /> Instrukcja (Markdown)
                </h3>
                <div className="text-xs font-mono bg-muted p-4 rounded border overflow-x-auto whitespace-pre-wrap">
                    {template.template_markdown_content}
                </div>
            </section>

            <Separator />

            {/* Deliverables / To-Do (As per breadboard) */}
            <section className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <ListTodo className="h-4 w-4 text-primary" /> Actions (To-Do)
                </h3>
                <ul className="space-y-2 text-xs">
                    {template.template_checklist_items.map(item => (
                        <li key={item.id} className="flex items-center gap-2 text-muted-foreground">
                            <div className={`h-3 w-3 border rounded ${item.isCompleted ? 'bg-primary' : ''}`} /> {item.label}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    </SidePeek>
  );
}
