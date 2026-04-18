import { SpaceCanvas } from "@/shared/domain/spaces";
import { Space } from "../domain";

const SPACE_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface BackendSpaceItem {
    id: string;
    space_name: string;
    space_description?: string;
    space_status: string;
    created_at: string;
    project_id: string;
    [key: string]: unknown;
}

export const SpaceCanvasInfrastructureApi = {
  fetchSpaceCanvasConfiguration: async (spaceIdentifier: string): Promise<SpaceCanvas> => {
    const apiResponse = await fetch(`${SPACE_API_BASE_URL}/spaces/${spaceIdentifier}/canvas`);
    if (!apiResponse.ok) {
        throw new Error("Failed to fetch space canvas configuration from the backend.");
    }
    const data = await apiResponse.json();
    return {
        id: data.id,
        nodes: data.nodes,
        edges: data.edges,
        viewport: data.viewport
    };
  },

  persistCanvasConfiguration: async (spaceIdentifier: string, canvasConfiguration: Partial<SpaceCanvas>): Promise<void> => {
    const apiResponse = await fetch(`${SPACE_API_BASE_URL}/spaces/${spaceIdentifier}/canvas`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            config: canvasConfiguration
        }),
    });

    if (!apiResponse.ok) {
        throw new Error("Failed to persist canvas configuration to the backend.");
    }
  },

  getSpaces: async (): Promise<Space[]> => {
    const apiResponse = await fetch(`${SPACE_API_BASE_URL}/spaces/`);
    if (!apiResponse.ok) {
        throw new Error("Failed to fetch spaces from the backend.");
    }
    const data = await apiResponse.json() as BackendSpaceItem[];
    return data.map((item) => ({
        id: item.id,
        name: item.space_name,
        description: item.space_description || "",
        lastEdited: "Recently", // Backend returns actual times, could map if needed
        status: item.space_status.toLowerCase(),
        created_at: item.created_at,
        projectId: item.project_id,
        projectName: "Assigned Project" // Placeholder
    }));
  },

  getSpaceById: async (id: string): Promise<Space | undefined> => {
      const apiResponse = await fetch(`${SPACE_API_BASE_URL}/spaces/${id}/canvas`);
      if (!apiResponse.ok) return undefined;
      const data = await apiResponse.json();
      return {
          id: data.id,
          name: data.name,
          description: data.description || "",
          lastEdited: "Recently",
          status: data.status.toLowerCase(),
          created_at: new Date().toISOString(),
          projectId: data.projectId,
          projectName: data.projectName,
          // Include canvas data if present for initialization
          nodes: data.nodes,
          edges: data.edges,
          viewport: data.viewport
      } as Space;
  },

  updateSpace: async (id: string, updates: Partial<Space>): Promise<Space> => {
      // Map frontend fields to backend schema
      const backendUpdates: Record<string, any> = {};
      if (updates.name) backendUpdates.space_name = updates.name;
      if (updates.description) backendUpdates.space_description = updates.description;
      if (updates.status) backendUpdates.space_status = updates.status;
      if (updates.projectId) backendUpdates.project_id = updates.projectId;

      const apiResponse = await fetch(`${SPACE_API_BASE_URL}/spaces/${id}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(backendUpdates),
      });

      if (!apiResponse.ok) {
          throw new Error("Failed to update space metadata in the backend.");
      }

      return { id, ...updates } as Space;
  },

  createSpace: async (spaceData: any): Promise<Space> => {
      const apiResponse = await fetch(`${SPACE_API_BASE_URL}/spaces/`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              space_name: spaceData.name,
              space_description: spaceData.description,
              project_id: spaceData.projectId,
          }),
      });

      if (!apiResponse.ok) {
          throw new Error("Failed to create space in the backend.");
      }

      const data = await apiResponse.json();
      return {
          id: data.id,
          name: data.space_name,
          description: data.space_description || "",
          lastEdited: "Just now",
          status: data.space_status.toLowerCase(),
          created_at: data.created_at,
          projectId: data.project_id,
          projectName: "Assigned Project"
      } as Space;
  },
  
  deleteSpace: async (id: string): Promise<void> => {
      const apiResponse = await fetch(`${SPACE_API_BASE_URL}/spaces/${id}`, {
          method: 'DELETE',
      });

      if (!apiResponse.ok) {
          throw new Error("Failed to delete space in the backend.");
      }
  }
};
