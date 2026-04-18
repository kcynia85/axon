import React from "react";
import { RecentlyUsedHeaderProps } from "../types";
import { RecentlyUsedHeaderLayout, RecentlyUsedHeaderTitle, RecentlyUsedIcon } from "./RecentlyUsedLayout";

export const RecentlyUsedHeader: React.FC<RecentlyUsedHeaderProps> = ({ title }) => {
    return (
        <RecentlyUsedHeaderLayout>
            <RecentlyUsedHeaderTitle>
                <RecentlyUsedIcon />
                {title}
            </RecentlyUsedHeaderTitle>
        </RecentlyUsedHeaderLayout>
    );
};
