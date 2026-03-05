import React from "react";
import { RecentlyUsedItemProps } from "../types";
import { QuickAccessCard } from "@/shared/ui/complex/QuickAccessCard";
import { Box } from "lucide-react";

export const RecentlyUsedItem: React.FC<RecentlyUsedItemProps> = ({ viewModel, onClick }) => {
    return (
        <QuickAccessCard 
            title={viewModel.title}
            status={viewModel.statusLabel}
            icon={Box}
            onClick={() => onClick(viewModel.id)}
        />
    );
};
