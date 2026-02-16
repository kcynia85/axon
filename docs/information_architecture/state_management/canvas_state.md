// Canvas viewport
viewportConfig: {
  zoom: 1.0,
  panX: 0,
  panY: 0
}

// Nodes
nodes: [
  {
    id: "node-1",
    type: "agent",
    componentId: "agent-abc",
    position: { x: 100, y: 200 },
    executionStatus: "working",
    context: {...},
    artifacts: [...]
  }
]

// Edges
edges: [
  {
    id: "edge-1",
    sourceNodeId: "node-1",
    targetNodeId: "node-2",
    sourceHandle: "output-1",
    targetHandle: "input-1"
  }
]

// Selected nodes
selection: ["node-1", "node-3"]

// Inspector state
inspectorOpen: true,
inspectorNodeId: "node-1"