"use client";

import { useEntityDraft } from "@/modules/studio/application/hooks/useEntityDraft";
import type { EmbeddingModelStudioValues } from "../../types/embedding-studio.types";

/**
 * useEmbeddingModelDraft hook manages embedding model creation/editing drafts.
 * Follows the standard Workspace Draft Pattern (localStorage + TanStack Query).
 */
export const useEmbeddingModelDraft = (modelId?: string | null) => {
  // Knowledge Engine uses "global" as workspaceId for now, 
  // but we can pass an empty string or "ke" to keep keys consistent.
  return useEntityDraft<EmbeddingModelStudioValues>("embedding-model", "ke", modelId);
};
