import { Shield } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/ui/Form";
import { Textarea } from "@/shared/ui/ui/Textarea";
import { PromptArchetypeSectionProps } from "../../types/prompt-archetype-ui.types";

/**
 * PromptArchetypeBehaviorSection: Presentational component for behavioral logic fields.
 */
export const PromptArchetypeBehaviorSection = ({ form }: PromptArchetypeSectionProps) => {
    return (
        <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <Shield className="w-3 h-3" /> Behavioral Logic
            </h3>
            <FormField
                control={form.control}
                name="archetype_backstory"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[10px] uppercase font-bold">Base Prompt (Backstory)</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Define the core logic and instruction set..."
                                className="h-32 resize-none text-xs font-mono"
                                {...field}
                                value={field.value || ""}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};
