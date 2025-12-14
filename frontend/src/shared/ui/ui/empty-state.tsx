import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8 border-2 border-dashed rounded-xl bg-slate-50/50">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
                <Icon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
            {action}
        </div>
    );
};
