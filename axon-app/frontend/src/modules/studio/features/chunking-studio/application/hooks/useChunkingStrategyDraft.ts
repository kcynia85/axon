"use client";

import { useEntityDraft } from "@/modules/studio/application/hooks/useEntityDraft";
import type { ChunkingStrategyStudioValues } from "../../types/chunking-studio.types";

/**
 * useChunkingStrategyDraft hook manages chunking strategy creation/editing drafts.
 * Follows the standard Workspace Draft Pattern (localStorage + TanStack Query).
 */
export const useChunkingStrategyDraft = (strategyId?: string | null) => {
  return useEntityDraft<ChunkingStrategyStudioValues>("chunking-strategy", "ke", strategyId);
};
