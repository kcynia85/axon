"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { apiClient } from "@/shared/lib/api-client/config";

export const useGlobalNotifications = () => {
    const lastCheckRef = useRef<number>(Date.now());

    useEffect(() => {
        // Polling for recent ready resources that haven't been "toasted" yet
        const checkNewResources = async () => {
            try {
                // We fetch sources from the API
                // In a real app, we might have a dedicated notifications endpoint
                const res = await apiClient.get("/knowledge/resources");
                const sources = await res.json() as any[];
                
                const now = Date.now();
                
                // Find sources that became Ready recently
                // Note: This is a simple heuristic. 
                // A better way would be a dedicated events table in DB.
                const newReady = sources.filter(s => {
                    const indexedAt = s.source_indexed_at ? new Date(s.source_indexed_at).getTime() : 0;
                    return s.source_rag_indexing_status === "Ready" && 
                           indexedAt > lastCheckRef.current;
                });

                newReady.forEach(source => {
                    toast.success("Dokument zaindeksowany", {
                        description: `Plik "${source.source_file_name}" jest gotowy do użycia.`,
                        duration: 5000,
                    });
                });

                lastCheckRef.current = now;
            } catch (error) {
                // Silently ignore polling errors
            }
        };

        const interval = setInterval(checkNewResources, 5000); // Check every 5s
        return () => clearInterval(interval);
    }, []);
};
