import React from "react";
import { RecentlyUsedItemProps } from "../types";
import { 
    RecentlyUsedItemLayout, 
    RecentlyUsedItemIconWrapper, 
    RecentlyUsedItemInfo,
    RecentlyUsedItemTitle,
    RecentlyUsedItemStatus,
    RecentlyUsedItemArrow,
    RecentlyUsedButton,
    RecentlyUsedItemIcon
} from "./RecentlyUsedLayout";

export const RecentlyUsedItem: React.FC<RecentlyUsedItemProps> = ({ viewModel, onClick }) => {
    return (
        <RecentlyUsedButton onClick={() => onClick(viewModel.id)}>
            <RecentlyUsedItemLayout>
                <RecentlyUsedItemIconWrapper>
                    <RecentlyUsedItemIcon />
                </RecentlyUsedItemIconWrapper>
                <RecentlyUsedItemInfo>
                    <RecentlyUsedItemTitle>{viewModel.title}</RecentlyUsedItemTitle>
                    <RecentlyUsedItemStatus>{viewModel.statusLabel}</RecentlyUsedItemStatus>
                </RecentlyUsedItemInfo>
                <RecentlyUsedItemArrow />
            </RecentlyUsedItemLayout>
        </RecentlyUsedButton>
    );
};
