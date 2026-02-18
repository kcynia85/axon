import { z } from "zod";

// --- React Flow compatible types ---

export const NodePositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const NodeDataSchema = z.object({
  label: z.string().optional(),
  status: z.string(),
  runtime: z.record(z.any()).optional(),
});

export const SpaceNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: NodePositionSchema,
  data: NodeDataSchema,
});

export const SpaceEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
});

export const ViewportSchema = z.object({
  x: z.number(),
  y: z.number(),
  zoom: z.number(),
});

export const SpaceCanvasSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  status: z.string(),
  viewport: ViewportSchema,
  nodes: z.array(SpaceNodeSchema),
  edges: z.array(SpaceEdgeSchema),
});

export type SpaceCanvas = z.infer<typeof SpaceCanvasSchema>;
export type SpaceNode = z.infer<typeof SpaceNodeSchema>;
export type SpaceEdge = z.infer<typeof SpaceEdgeSchema>;
