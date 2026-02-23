// frontend/src/modules/spaces/infrastructure/api.ts

import { SpaceCanvas } from "@/shared/domain/spaces";

const SPACE_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const SpaceCanvasInfrastructureApi = {
  fetchSpaceCanvasConfiguration: async (spaceIdentifier: string): Promise<SpaceCanvas> => {
    const apiResponse = await fetch(`${SPACE_API_BASE_URL}/spaces/${spaceIdentifier}/canvas`);
    
    if (!apiResponse.ok) {
        throw new Error("Failed to fetch space canvas configuration from the infrastructure layer.");
    }
    
    return apiResponse.json();
  },
  
  // Placeholder for real persistence implementation
  persistSpaceCanvasConfiguration: async (spaceIdentifier: string, updatedCanvasConfiguration: Partial<SpaceCanvas>): Promise<void> => {
      // Implementation pending for the next sprint
      console.log("Persisting updated space canvas configuration data...", updatedCanvasConfiguration);
  }
};
