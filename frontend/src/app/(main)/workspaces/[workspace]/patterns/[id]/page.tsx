"use client";

import { useParams, useRouter } from "next/navigation";
import { SidePeek } from "@/shared/ui/layout/side-peek";
import { Badge } from "@/shared/ui/ui/badge";
import { Button } from "@/shared/ui/ui/button";
import { Separator } from "@/shared/ui/ui/separator";
import { usePatterns } from "@/modules/workspaces/application/use-workspaces";
import { Box, Layers, ExternalLink, Globe } from "lucide-react";

export default function PatternSidePeekPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspace as string;
  const patternId = params.id as string;
  
  const { data: patterns } = usePatterns(workspaceId);
  const pattern = patterns?.find(p => p.id === patternId);

  if (!pattern) return null;

  return (
    <SidePeek 
        title={pattern.name} 
        subtitle="Pattern Details"
        footer={
            <Button className="w-full gap-2" variant="outline">
                <ExternalLink className="h-4 w-4" /> Edit in Space
            </Button>
        }
    >
        <div className="space-y-8">
            {/* Context & Description */}
            <section className="space-y-4">
                <div className="space-y-1">
                    <div className="text-[10px] uppercase text-muted-foreground font-bold">Type</div>
                    <Badge variant="secondary" className="capitalize">{pattern.type}</Badge>
                </div>
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                        <Box className="h-4 w-4 text-primary" /> Description
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {pattern.description}
                    </p>
                </div>
            </section>

            <Separator />

            {/* Components (As per breadboard) */}
            <section className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" /> Components
                </h3>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 border rounded bg-muted/30">Template</div>
                    <div className="p-2 border rounded bg-muted/30">Crew</div>
                    <div className="p-2 border rounded bg-muted/30">Agent</div>
                    <div className="p-2 border rounded bg-muted/30 font-bold border-primary/50">Pattern</div>
                </div>
            </section>

            <Separator />

            {/* Shared With */}
            <section className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" /> Shared with
                </h3>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Discovery</Badge>
                    <Badge variant="outline">Product Management</Badge>
                </div>
            </section>
        </div>
    </SidePeek>
  );
}
