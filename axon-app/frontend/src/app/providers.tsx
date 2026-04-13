"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { HeroUIProvider } from "@heroui/react";
import { useRouter } from "next/navigation";
import { TooltipProvider } from "@/shared/ui/ui/Tooltip";
import { ThemeProvider } from "@/shared/infrastructure/ThemeProvider";
import { useGlobalNotifications } from "@/shared/lib/hooks/useGlobalNotifications";

const Providers = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    useGlobalNotifications();
    
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >
                <HeroUIProvider navigate={router.push}>
                    <TooltipProvider>
                        {children}
                    </TooltipProvider>
                </HeroUIProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
};

export default Providers;
