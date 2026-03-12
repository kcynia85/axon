import { Plus, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";
import { Input } from "@/shared/ui/ui/Input";
import { FormLabel } from "@/shared/ui/ui/Form";
import { ExternalServiceCapabilitiesStepProps } from "../../types/external-service-ui.types";

/**
 * ExternalServiceCapabilitiesStep: Presentational component for the second wizard step.
 */
export const ExternalServiceCapabilitiesStep = ({ 
    capabilities, 
    onAddCapability, 
    onRemoveCapability, 
    onUpdateCapability 
}: ExternalServiceCapabilitiesStepProps) => {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <FormLabel className="text-xs uppercase font-bold flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-primary" /> Exposed Methods
                </FormLabel>
                <Button type="button" variant="outline" size="sm" className="h-7 text-[10px]" onClick={onAddCapability}>
                    <Plus className="w-3 h-3 mr-1" /> Add
                </Button>
            </div>
            <div className="space-y-2">
                {capabilities?.map((capabilityValue, index) => (
                    <div key={index} className="flex gap-2">
                        <Input
                            placeholder="e.g. search_web, send_sms"
                            className="h-8 text-xs font-mono"
                            onChange={(event) => onUpdateCapability(index, event.target.value)}
                            value={capabilityValue}
                        />
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onRemoveCapability(index)}>
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                ))}
                {(!capabilities || capabilities.length === 0) && (
                    <p className="text-center text-[10px] text-muted-foreground py-10 border border-dashed rounded-lg">
                        Define capabilities for agents to interact with this service.
                    </p>
                )}
            </div>
        </div>
    );
};
