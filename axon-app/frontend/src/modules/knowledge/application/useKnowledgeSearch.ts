"use client";

import { useQuery } from "@tanstack/react-query";
import { knowledgeApi } from "../infrastructure/api";

export const useKnowledgeSearch = (query: string, enabled: boolean = false) => {
    return useQuery({
        queryKey: ["knowledge-search", query],
        queryFn: () => knowledgeApi.search(query),
        enabled: enabled && query.length > 2,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
