"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProviderStudioContainer } from "@/modules/studio/features/provider-studio/ui/ProviderStudioContainer";
import { useLLMProvider } from "@/modules/settings/application/useLLMProviders";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import type { ProviderFormData } from "@/modules/studio/features/provider-studio/types/provider-schema";

const ProviderEditPageContent = () => {
    const params = useParams();
    const providerId = params.id as string;
    const { data: provider, isLoading, isError } = useLLMProvider(providerId);
    const router = useRouter();

    const initialData = useMemo((): Partial<ProviderFormData> | undefined => {
        if (!provider) return undefined;

        return {
            provider_type: provider.provider_type as any,
            display_name: provider.provider_name,
            provider_id: provider.provider_technical_id,
            base_url: provider.provider_api_endpoint || "",
            api_key: provider.provider_api_key || "",
            protocol: (provider as any).protocol || "openai",
            custom_headers: (provider as any).custom_headers || [],
            
            // SSoT Fields
            auth_header_name: (provider as any).auth_header_name,
            auth_header_prefix: (provider as any).auth_header_prefix,
            api_key_placement: (provider as any).api_key_placement,
            discovery_json_path: (provider as any).discovery_json_path,
            discovery_id_key: (provider as any).discovery_id_key,
            discovery_name_key: (provider as any).discovery_name_key,
            discovery_context_key: (provider as any).discovery_context_key,
            
            // Response Mapping
            response_content_path: (provider as any).response_content_path,
            response_error_path: (provider as any).response_error_path,
            
            // Legacy / Custom
            tokenization_strategy: (provider.provider_custom_config as any)?.tokenization_strategy,
            tokenization_fallback: (provider.provider_custom_config as any)?.tokenization_fallback,
            billing_model: (provider.provider_custom_config as any)?.billing_model,
        };
    }, [provider]);

    if (isLoading) {
        return (
            <div className="p-12 space-y-12 bg-black min-h-screen">
                <Skeleton className="h-24 w-full rounded-2xl bg-zinc-900" />
                <Skeleton className="h-[400px] w-full rounded-3xl bg-zinc-900/50" />
            </div>
        );
    }

    if (isError || !provider) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white space-y-4">
                <h1 className="text-2xl font-bold">Provider not found</h1>
                <button 
                    onClick={() => router.push("/settings/llms/providers")}
                    className="text-zinc-400 hover:text-white underline font-mono"
                >
                    Back to providers
                </button>
            </div>
        );
    }

    return (
        <ProviderStudioContainer providerId={providerId} initialData={initialData} />
    );
};

export default function ProviderEditPage() {
    return (
        <ProviderEditPageContent />
    );
}
