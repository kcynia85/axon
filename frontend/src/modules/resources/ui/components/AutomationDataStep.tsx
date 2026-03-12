import { Terminal } from "lucide-react";
import { Textarea } from "@/shared/ui/ui/Textarea";

export const AutomationDataStep = () => {
    return (
        <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-primary/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                    <Terminal className="w-3 h-3" /> Input Payload
                </div>
                <p className="text-[10px] text-muted-foreground">
                    Define the JSON structure agents should send to this webhook.
                </p>
                <Textarea
                    placeholder='{ "task_id": "{{id}}", "query": "{{text}}" }'
                    className="font-mono text-[10px] h-32 bg-background border-none shadow-none"
                />
            </div>
        </div>
    );
};
