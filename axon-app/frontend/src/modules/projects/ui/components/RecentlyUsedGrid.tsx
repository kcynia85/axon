import React from "react";
import { RecentlyUsedGridProps } from "../types";
import { RecentlyUsedGridLayout as Layout } from "./RecentlyUsedGridLayout";

export const RecentlyUsedGrid: React.FC<RecentlyUsedGridProps> = ({ children }) => {
    return (
        <Layout>
            {children}
        </Layout>
    );
};
