import { Tags } from "lucide-react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/ui/Form";
import { Input } from "@/shared/ui/ui/Input";
import { PromptArchetypeSectionProps } from "../../types/prompt-archetype-ui.types";

/**
 * PromptArchetypeCategorizationSection: Presentational component for keywords fields.
 */
export const PromptArchetypeCategorizationSection = ({ form }: PromptArchetypeSectionProps) => {
    return (
        <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <Tags className="w-3 h-3" /> Categorization
            </h3>
            <FormField
                control={form.control}
                name="archetype_keywords"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[10px] uppercase font-bold">Search Keywords</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Comma separated: tactical, logic, synthesis"
                                onChange={(changeEvent) => field.onChange(changeEvent.target.value.split(",").map((tag) => tag.trim()).filter(Boolean))}
                                value={field.value?.join(", ")}
                            />
                        </FormControl>
                        <FormDescription className="text-[10px]">These tags help filter archetypes during agent creation.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};
