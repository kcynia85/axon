import { Globe } from "lucide-react";

/**
 * ExternalServiceAvailabilityStep: Presentational component for the third wizard step.
 */
export const ExternalServiceAvailabilityStep = () => {
    return (
        <div className="space-y-4 text-center py-10">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-sm font-bold">Broadcast Access</h4>
            <p className="text-xs text-muted-foreground px-10">
                By default, new services are available to all agents in this domain. You can restrict access later in the Permissions tab.
            </p>
        </div>
    );
};
