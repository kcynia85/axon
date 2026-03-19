import { create } from "zustand";

type UiState = {
  readonly isInboxOpen: boolean;
  readonly setIsInboxOpen: (open: boolean) => void;
  readonly toggleInbox: () => void;
  
  readonly isSidebarCollapsed: boolean;
  readonly setIsSidebarCollapsed: (collapsed: boolean) => void;
  readonly toggleSidebar: () => void;

  readonly isTrashOpen: boolean;
  readonly setIsTrashOpen: (open: boolean) => void;
  readonly toggleTrash: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isInboxOpen: false,
  setIsInboxOpen: (open) => set({ isInboxOpen: open }),
  toggleInbox: () => set((state) => ({ isInboxOpen: !state.isInboxOpen })),
  
  isSidebarCollapsed: false,
  setIsSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  isTrashOpen: false,
  setIsTrashOpen: (open) => set({ isTrashOpen: open }),
  toggleTrash: () => set((state) => ({ isTrashOpen: !state.isTrashOpen })),
}));
