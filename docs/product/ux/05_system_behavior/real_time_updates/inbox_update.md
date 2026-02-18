socket.on('inbox:new-item', (item) => {
  // Increment badge count
  // Show toast notification
  // Add item to inbox list (if viewing)
});

socket.on('inbox:item-resolved', (itemId) => {
  // Decrement badge count
  // Remove from list (if viewing)
});