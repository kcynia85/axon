import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/ui/Form";
import { Input } from "@/shared/ui/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/ui/Select";
import { ExternalServiceStepProps } from "../../types/external-service-ui.types";

/**
 * ExternalServiceIdentityStep: Presentational component for the first wizard step.
 */
export const ExternalServiceIdentityStep = ({ form }: ExternalServiceStepProps) => {
    return (
        <>
            <FormField
                control={form.control}
                name="service_name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-xs uppercase font-bold">Service Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. ScraperAPI, Twilio" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="service_url"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-xs uppercase font-bold">API Base URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://api.provider.com/v1" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="service_category"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-xs uppercase font-bold">Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {["Utility", "GenAI", "Scraping", "Business"].map((category) => (
                                    <SelectItem key={category} value={category}>{category}</SelectItem>
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
