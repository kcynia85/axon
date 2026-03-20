"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resourcesApi } from "@/modules/resources/infrastructure/api";
import { InternalToolsList } from "@/modules/resources/ui/InternalToolsList";
import { Button } from "@/shared/ui/ui/Button";
import { RefreshCw, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/shared/ui/layout/PageHeader";

export default function InternalToolsPage() {
    const queryClient = useQueryClient();

    const { data: tools, isLoading } = useQuery({
        queryKey: ["internal-tools"],
        queryFn: resourcesApi.getInternalTools,
    });

    const { mutate: syncTools, isPending: isSyncing } = useMutation({
        mutationFn: resourcesApi.syncInternalTools,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["internal-tools"] });
            if (data.errors && data.errors.length > 0) {
                toast.warning(`Synced with errors: ${data.updated} updated. Check console for details.`);
                console.warn("Sync errors:", data.errors);
            } else {
                toast.success(`Tools synced successfully! Updated: ${data.updated}`);
            }
        },
        onError: () => {
            toast.error("Failed to sync tools");
        }
    });

    return (
        <div className="flex flex-col h-full w-full">
            <PageHeader 
                title="Internal Tools" 
                description="Python functions defined in the codebase, available as tools for agents."
            >
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => syncTools()} 
                        disabled={isSyncing}
                        className="gap-2"
                    >
                        <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                        {isSyncing ? "Syncing..." : "Sync from Code"}
                    </Button>
                </div>
            </PageHeader>

            <div className="flex-1 p-6 overflow-hidden">
                <InternalToolsList tools={tools || []} isLoading={isLoading} />
            </div>
        </div>
    );
}
