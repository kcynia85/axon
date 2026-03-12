import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/ui/Form";
import { Input } from "@/shared/ui/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/ui/Select";
import { AutomationStepProps } from "../../types/automation-ui.types";

/**
 * AutomationDefinitionStep: Presentational component for the first wizard step.
 */
export const AutomationDefinitionStep = ({ form }: AutomationStepProps) => {
    return (
        <>
            <FormField
                control={form.control}
                name="automation_name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-xs uppercase font-bold">Automation Alias</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. Invoice Generation Flow" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="automation_platform"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-xs uppercase font-bold">Execution Platform</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select platform" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {["n8n", "Zapier", "Make", "Custom"].map((platform) => (
                                    <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormDescription className="text-[10px]">Identify the engine running this workflow.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
};
