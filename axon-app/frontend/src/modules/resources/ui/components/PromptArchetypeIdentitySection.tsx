import { Brain } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/ui/Form";
import { Input } from "@/shared/ui/ui/Input";
import { PromptArchetypeSectionProps } from "../../types/prompt-archetype-ui.types";

/**
 * PromptArchetypeIdentitySection: Presentational component for archetype identity fields.
 */
export const PromptArchetypeIdentitySection = ({ form }: PromptArchetypeSectionProps) => {
    return (
        <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <Brain className="w-3 h-3" /> Core Identity
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="archetype_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[10px] uppercase font-bold">Callsign</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Master Strategist" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="workspace_domain"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[10px] uppercase font-bold">Domain</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Finance, QA, R&D" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
                control={form.control}
                name="archetype_description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[10px] uppercase font-bold">Brief Description</FormLabel>
                        <FormControl>
                            <Input placeholder="Used for tactical decision making in complex scenarios..." {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};
