import { SpaceCanvas } from "@/shared/domain/spaces";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const spacesApi = {
  getSpaceCanvas: async (spaceId: string): Promise<SpaceCanvas> => {
    const response = await fetch(`${API_BASE}/spaces/${spaceId}/canvas`);
    if (!response.ok) {
        throw new Error("Failed to fetch space canvas");
    }
    return response.json();
  },
  
  // Placeholder for real persistence
  saveCanvas: async (spaceId: string, data: Partial<SpaceCanvas>): Promise<void> => {
      // Implementation pending
      console.log("Saving canvas data...", data);
  }
};
