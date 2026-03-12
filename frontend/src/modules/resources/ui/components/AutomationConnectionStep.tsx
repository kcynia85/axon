import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/ui/Form";
import { Input } from "@/shared/ui/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/ui/Select";
import { AutomationStepProps } from "../../types/automation-ui.types";

/**
 * AutomationConnectionStep: Presentational component for the second wizard step.
 */
export const AutomationConnectionStep = ({ form }: AutomationStepProps) => {
    return (
        <>
            <FormField
                control={form.control}
                name="automation_webhook_url"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-xs uppercase font-bold">Webhook Endpoint</FormLabel>
                        <FormControl>
                            <Input placeholder="https://n8n.instance.com/webhook/..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="automation_http_method"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-xs uppercase font-bold">HTTP Method</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {["GET", "POST", "PUT"].map((method) => (
                                    <SelectItem key={method} value={method}>{method}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
};
