import { create } from "zustand";

interface UiState {
  isInboxOpen: boolean;
  setIsInboxOpen: (open: boolean) => void;
  toggleInbox: () => void;
  
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isInboxOpen: false,
  setIsInboxOpen: (open) => set({ isInboxOpen: open }),
  toggleInbox: () => set((state) => ({ isInboxOpen: !state.isInboxOpen })),
  
  isSidebarCollapsed: false,
  setIsSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}));
