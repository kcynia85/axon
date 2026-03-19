'use client';

import React from "react";
import { Sparkles, FileText, Clock } from "lucide-react";
import { PromptArchetype } from "@/shared/domain/resources";
import { QuickAccessCard } from "@/shared/ui/complex/QuickAccessCard";

interface RecentlyUsedPromptsProps {
  prompts: readonly PromptArchetype[];
  onSelect: (id: string) => void;
}

export const RecentlyUsedPrompts = ({ prompts, onSelect }: RecentlyUsedPromptsProps) => {
  if (prompts.length === 0) return null;

  return (
    <div className="space-y-4 mb-8">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
        <Clock className="w-3 h-3 text-primary" /> RECENTLY USED
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {prompts.map((prompt) => (
          <QuickAccessCard 
            key={prompt.id} 
            title={prompt.archetype_name}
            status={prompt.workspace_domain}
            onClick={() => onSelect(prompt.id)}
          />
        ))}
      </div>
    </div>
  );
};
