import React from "react";
import { RecentlyUsedItemProps } from "../types";
import { ResourceQuickCard } from "@/shared/ui/complex/ResourceQuickCard";
import { Box } from "lucide-react";

export const RecentlyUsedItem: React.FC<RecentlyUsedItemProps> = ({ viewModel, onClick }) => {
    return (
        <ResourceQuickCard 
            title={viewModel.title}
            status={viewModel.statusLabel}
            icon={Box}
            onClick={() => onClick(viewModel.id)}
        />
    );
};
