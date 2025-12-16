import { API_BASE_URL } from "@/shared/lib/api-client/config";
import { Asset } from "../../../domain";
import { createClient } from "@/shared/infrastructure/supabase/client";

const getAuthHeaders = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const headers: Record<string, string> = {
        "Content-Type": "application/json"
    };
    const token = session?.access_token || "test-token";
    headers["Authorization"] = `Bearer ${token}`;
    
    return headers;
};

export const getAssets = async (limit = 100, offset = 0, type?: string): Promise<Asset[]> => {
    // FIX: Add trailing slash for FastAPI compatibility if needed, but query params usually handle it. 
    // Let's assume /knowledge/assets (no slash) works if query params follow. 
    // But safely, FastAPI might want /knowledge/assets/?...
    let url = `${API_BASE_URL}/knowledge/assets/?limit=${limit}&offset=${offset}`;
    if (type) {
        url += `&type=${encodeURIComponent(type)}`;
    }
    const headers = await getAuthHeaders();
    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error(`Failed to fetch assets: ${response.statusText}`);
    return response.json();
};

export const getAssetBySlug = async (slug: string): Promise<Asset> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/knowledge/assets/${slug}`, { headers });
    if (!response.ok) throw new Error(`Failed to fetch asset: ${response.statusText}`);
    return response.json();
};

export const createAsset = async (asset: Partial<Asset>): Promise<Asset> => {
    const headers = await getAuthHeaders();
    // Add trailing slash
    const response = await fetch(`${API_BASE_URL}/knowledge/assets/`, {
        method: "POST",
        headers,
        body: JSON.stringify(asset)
    });
    if (!response.ok) throw new Error(`Failed to create asset: ${response.statusText}`);
    return response.json();
};

export const updateAsset = async (id: string, asset: Partial<Asset>): Promise<Asset> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/knowledge/assets/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(asset)
    });
    if (!response.ok) throw new Error(`Failed to update asset: ${response.statusText}`);
    return response.json();
};

export const deleteAsset = async (id: string): Promise<void> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/knowledge/assets/${id}`, {
        method: "DELETE",
        headers
    });
    if (!response.ok) throw new Error(`Failed to delete asset: ${response.statusText}`);
};
