import React from "react";
import { Automation } from "@/shared/domain/resources";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/ui/Card";
import { Zap } from "lucide-react";

interface RecentlyUsedAutomationsProps {
  automations: Automation[];
  onSelect: (id: string) => void;
}

export const RecentlyUsedAutomations = ({ automations, onSelect }: RecentlyUsedAutomationsProps) => {
  if (automations.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Recently Used</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {automations.map((auto) => (
          <Card 
            key={auto.id} 
            className="cursor-pointer hover:border-primary/50 transition-all bg-muted/5 group"
            onClick={() => onSelect(auto.id)}
          >
            <CardHeader className="p-4">
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-yellow-500" />
                <CardTitle className="text-xs font-bold truncate">{auto.automation_name}</CardTitle>
              </div>
              <CardDescription className="text-[10px] mt-1 line-clamp-1">
                {auto.automation_platform} • {auto.automation_webhook_url}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};
