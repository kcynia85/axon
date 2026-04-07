"use client";

import * as React from "react";
import { useLLMRouters, useLLMModels } from "../application/useSettings";
import { Card, CardHeader } from "@/shared/ui/ui/Card";
import { Route } from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import Link from "next/link";
import { LLMRouterCard } from "./LLMRouterCard";
import { ResourceList } from "@/shared/ui/complex/ResourceList";
import type { LLMRouter } from "@/shared/domain/settings";

type LLMRoutersListProps = {
    readonly items?: LLMRouter[];
    readonly isLoading?: boolean;
    readonly isError?: boolean;
    readonly viewMode?: "grid" | "list";
    readonly onItemClick?: (router: LLMRouter) => void;
    readonly onDelete?: (id: string) => void;
    readonly onEdit?: (router: LLMRouter) => void;
};

type PriorityChainItem = {
    readonly model_id: string;
    readonly error_timeout: number;
};

export const LLMRoutersList = ({
    items: providedItems,
    isLoading: providedIsLoading,
    isError: providedIsError,
    viewMode = "grid",
    onItemClick,
    onDelete,
    onEdit
}: LLMRoutersListProps) => {
    const { data: fetchedRouters, isLoading: routersLoading, isError: routersError } = useLLMRouters();
    const { data: models = [] } = useLLMModels();

    const routers = providedItems || fetchedRouters || [];
    const isLoading = providedIsLoading ?? routersLoading;
    const isError = providedIsError ?? routersError;

    const getModelName = (modelId: string) => {
        const model = models.find(model => model.id === modelId);
        return model?.model_display_name || "Unknown Model";
    };

    if (isError) {
        return (
            <div className="p-8 text-center text-red-500 bg-red-500/10 rounded-2xl border border-red-500/20">
                Wystąpił błąd podczas ładowania routerów. Spróbuj ponownie później.
            </div>
        );
    }

    return (
        <ResourceList
            items={routers}
            isLoading={isLoading}
            viewMode={viewMode}
            emptyTitle="Nie znaleziono routerów"
            emptyDescription="Zdefiniuj swój pierwszy inteligentny router, aby zarządzać ruchem LLM."
            renderItem={(router) => {
                // Map chain or flat structure to list for card preview
                let chainModels: { id: string; name: string }[] = [];
                
                if (router.priority_chain && router.priority_chain.length > 0) {
                    chainModels = (router.priority_chain as unknown as PriorityChainItem[]).slice(0, 2).map(chainItem => ({
                        id: chainItem.model_id,
                        name: getModelName(chainItem.model_id)
                    }));
                } else {
                    if (router.primary_model_id) {
                        chainModels.push({ id: router.primary_model_id, name: getModelName(router.primary_model_id) });
                    }
                    if (router.fallback_model_id) {
                        chainModels.push({ 
                            id: router.fallback_model_id, 
                            name: getModelName(router.fallback_model_id) 
                        });
                    }
                }

                return (
                    <LLMRouterCard
                        key={router.id}
                        id={router.id}
                        title={router.router_alias}
                        strategy={router.router_strategy}
                        models={chainModels}
                        onEdit={() => onEdit?.(router)}
                        onDelete={() => onDelete?.(router.id)}
                        onClick={() => onItemClick?.(router)}
                    />
                );
            }}
            renderSkeleton={() => (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((index) => (
                        <Card key={index} className="h-64 border-zinc-200 dark:border-zinc-800 opacity-50">
                            <CardHeader className="space-y-4">
                                <Skeleton className="h-8 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <div className="space-y-2 pt-4">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}
        />
    );
};
