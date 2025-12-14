// Infrastructure wrapper for Prompts (delegates to Knowledge API for now)
import { getAssets, createAsset, updateAsset, deleteAsset as deleteAssetApi } from "@/modules/knowledge/features/browse-assets/infrastructure";
import { Prompt } from "../../../domain";

export const getPrompts = async (): Promise<Prompt[]> => {
    return getAssets(100, 0, "prompt");
};

export const createPrompt = async (data: any): Promise<Prompt> => {
    return createAsset({ ...data, type: "prompt", domain: "general", metadata: {} });
};

export const updatePrompt = async (id: string, data: any): Promise<Prompt> => {
    return updateAsset(id, { ...data, type: "prompt" });
};

export const deletePrompt = async (id: string): Promise<void> => {
    return deleteAssetApi(id);
};
