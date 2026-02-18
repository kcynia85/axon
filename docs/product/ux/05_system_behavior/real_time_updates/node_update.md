// Subscribe to node execution
socket.on(`node:${nodeId}:update`, (data) => {
  // Update:
  // - executionStatus
  // - progress (percentage)
  // - liveThoughts (streaming text)
  // - metrics (tokens, time, cost)
});

socket.on(`node:${nodeId}:complete`, (data) => {
  // Update:
  // - executionStatus = "done"
  // - artifacts (ready for download)
  // - summary
});

socket.on(`node:${nodeId}:error`, (data) => {
  // Update:
  // - executionStatus = "error"
  // - errorMessage
  // - errorDetails
});