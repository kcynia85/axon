import * as React from "react";
import { Plus } from "lucide-react";
import { Button, type ButtonProps } from "@/shared/ui/ui/button";
import { cn } from "@/shared/lib/utils";

interface CreateButtonProps extends ButtonProps {
    label: string;
}

export const CreateButton = ({ label, className, ...props }: CreateButtonProps) => {
    return (
        <Button className={cn("", className)} {...props}>
            <Plus className="h-4 w-4 mr-2" />
            {label}
        </Button>
    );
};
