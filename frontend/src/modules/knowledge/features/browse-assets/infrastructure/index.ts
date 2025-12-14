import { apiClient } from "@/lib/api-client/config";
import { Asset } from "../../../domain";

export const getAssets = async (limit = 100, offset = 0, type?: string): Promise<Asset[]> => {
    let url = `/knowledge/assets?limit=${limit}&offset=${offset}`;
    if (type) {
        url += `&type=${encodeURIComponent(type)}`;
    }
    const response = await apiClient.get(url);
    return response.json();
};

export const getAssetBySlug = async (slug: string): Promise<Asset> => {
    const response = await apiClient.get(`/knowledge/assets/${slug}`);
    return response.json();
};

export const createAsset = async (asset: Partial<Asset>): Promise<Asset> => {
    const response = await apiClient.post("/knowledge/assets", asset);
    return response.json();
};

export const updateAsset = async (id: string, asset: Partial<Asset>): Promise<Asset> => {
    const response = await apiClient.put(`/knowledge/assets/${id}`, asset);
    return response.json();
};

export const deleteAsset = async (id: string): Promise<void> => {
    await apiClient.delete(`/knowledge/assets/${id}`);
};
