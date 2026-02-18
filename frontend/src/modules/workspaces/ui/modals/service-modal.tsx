"use client";

import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/ui/dialog";
import { Button } from "@/shared/ui/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Globe, Check } from "lucide-react";
import { Skeleton } from "@/shared/ui/ui/skeleton";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";

// Mock globalnych usług z Resources
const GLOBAL_SERVICES = [
  { id: "ser-1", name: "Langfuse Tracing", url: "https://cloud.langfuse.com", type: "Observability" },
  { id: "ser-2", name: "Custom Tool API", url: "https://api.mytool.com", type: "Tools" },
  { id: "ser-3", name: "Slack Notification Webhook", url: "https://hooks.slack.com/...", type: "Notification" },
];

/**
 * ServiceModal - Workspace Assignment
 * Allows attaching global services defined in Resources to this Workspace.
 */
export const ServiceModal = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get("modal") === "new-service";
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    router.replace(`?${params.toString()}`, { scroll: false });
    setSelectedIds([]);
  };

  const toggleService = (id: string) => {
    setSelectedIds(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAssign = () => {
    console.log("Assigning services to workspace:", selectedIds);
    // TODO: Implement mutation (assign services to workspace)
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Przypisz Usługę (Services)</DialogTitle>
          <DialogDescription>
            Wybierz usługi zdefiniowane w Resources, aby udostępnić je w tym workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase px-1">Dostępne Usługi</div>
            <div className="border rounded-md divide-y overflow-hidden">
                {GLOBAL_SERVICES.map((service) => (
                    <div 
                        key={service.id}
                        onClick={() => toggleService(service.id)}
                        className={cn(
                            "flex items-center justify-between p-3 cursor-pointer transition-colors",
                            selectedIds.includes(service.id) ? "bg-primary/5" : "hover:bg-muted"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "p-2 rounded-full",
                                selectedIds.includes(service.id) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            )}>
                                <Globe className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="text-sm font-medium">{service.name}</div>
                                <div className="text-[10px] text-muted-foreground">{service.type} • {service.url}</div>
                            </div>
                        </div>
                        {selectedIds.includes(service.id) && (
                            <Check className="h-4 w-4 text-primary" />
                        )}
                    </div>
                ))}
            </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={closeModal}>Anuluj</Button>
          <Button onClick={handleAssign} disabled={selectedIds.length === 0}>
            Przypisz do Workspace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
