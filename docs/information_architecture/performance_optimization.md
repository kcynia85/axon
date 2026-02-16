## List Views (Pagination)
- Default page size: 20 items
- Load more: Infinite scroll or "Load More" button
- Virtual scrolling for large lists (>100 items)

## Canvas (Large Graphs)
- Render only visible nodes (viewport culling)
- Lazy load node details on Inspector open
- Debounce viewport updates (pan/zoom)
- WebGL rendering for >50 nodes

## Search (Debouncing)
- Debounce search input: 300ms
- Cancel previous search request on new input
- Show loading indicator during search