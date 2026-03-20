import * as React from "react";
import { Button } from "@/shared/ui/ui/Button";
import { Card } from "@/shared/ui/ui/Card";
import { Plus } from "lucide-react";

type BrowserEmptyStateProps = {
  readonly message: string;
  readonly buttonLabel?: string;
  readonly onAdd?: () => void;
  readonly icon?: React.ReactNode;
};

export const BrowserEmptyState = ({ 
  message, 
  buttonLabel, 
  onAdd,
  icon = <Plus className="w-4 h-4" />
}: BrowserEmptyStateProps) => {
  return (
    <Card className="border-dashed h-40 flex flex-col items-center justify-center px-8 text-muted-foreground text-sm italic rounded-xl bg-muted/5 w-full col-span-full gap-4">
      <span>{message}</span>
      {buttonLabel && onAdd && (
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onAdd}
          className="gap-2 font-semibold"
        >
          {icon} {buttonLabel}
        </Button>
      )}
    </Card>
  );
};
