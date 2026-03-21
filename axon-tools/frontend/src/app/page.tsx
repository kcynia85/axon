"use client";

import { useToolsRegistry, ToolsRegistryView, ToolDetailView } from "@/modules/tools";

const Home = () => {
  const {
    items,
    isLoading,
    error,
    selectedTool,
    params,
    result,
    isRunning,
    isSyncing,
    testSuccess,
    page,
    searchFilter,
    sortDescriptor,
    pages,
    setPage,
    setSearchFilter,
    setSortDescriptor,
    setParams,
    filterGroups,
    filteredItems,
    activeFilters,
    sortOptions,
    activeSortId,
    handleSelectTool,
    handleUpdateStatus,
    handleRunTool,
    handleSyncTool,
    handleApplyFilters,
    handleClearFilters,
    handleRemoveFilter,
    handleSortChange,
  } = useToolsRegistry();

  if (selectedTool) {
    return (
      <ToolDetailView
        tool={selectedTool}
        parameters={params}
        result={result}
        isRunning={isRunning}
        isSyncing={isSyncing}
        isTestSuccessful={testSuccess}
        onBack={() => handleSelectTool(null)}
        onParameterChange={(key, value) => setParams(prev => ({ ...prev, [key]: value }))}
        onStatusChange={handleUpdateStatus}
        onRun={handleRunTool}
        onSync={handleSyncTool}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono selection:bg-blue-500/30">
      <div className="max-w-full mx-auto px-16 pb-12">
        <ToolsRegistryView
          items={items}
          isLoading={isLoading}
          error={error}
          searchFilter={searchFilter}
          sortDescriptor={sortDescriptor}
          page={page}
          pages={pages}
          filterGroups={filterGroups}
          filteredCount={filteredItems.length}
          activeFilters={activeFilters}
          sortOptions={sortOptions}
          activeSortId={activeSortId}
          onSearchChange={setSearchFilter}
          onSortChange={setSortDescriptor}
          onPageChange={setPage}
          onToolSelect={handleSelectTool}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          onRemoveFilter={handleRemoveFilter}
          onSortOptionSelect={handleSortChange}
        />
      </div>
    </div>
  );
};

export default Home;
