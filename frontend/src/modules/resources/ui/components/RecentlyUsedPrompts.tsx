'use client';

import React from "react";
import { Sparkles } from "lucide-react";
import { PromptArchetype } from "@/shared/domain/resources";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";

interface RecentlyUsedPromptsProps {
  prompts: readonly PromptArchetype[];
  onSelect: (id: string) => void;
}

export const RecentlyUsedPrompts = ({ prompts, onSelect }: RecentlyUsedPromptsProps) => {
  if (prompts.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
        <Sparkles className="w-3 h-3 text-primary" /> Recently Discovered Archetypes
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {prompts.map((prompt) => (
          <Card 
            key={prompt.id} 
            className="group hover:border-primary/50 transition-all cursor-pointer bg-muted/20"
            onClick={() => onSelect(prompt.id)}
          >
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="text-[8px] uppercase font-bold tracking-widest bg-primary/5">
                  {prompt.workspace_domain}
                </Badge>
              </div>
              <CardTitle className="text-xs font-bold mt-2 group-hover:text-primary transition-colors">
                {prompt.archetype_name}
              </CardTitle>
              <CardDescription className="text-[10px] line-clamp-1 mt-1">
                {prompt.archetype_description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};
