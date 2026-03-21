"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { HeroUIProvider } from "@heroui/react";
import { useRouter } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider navigate={router.push}>
        {children}
      </HeroUIProvider>
    </QueryClientProvider>
  );
}
