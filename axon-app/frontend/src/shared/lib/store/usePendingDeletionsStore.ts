import { create } from "zustand";

/**
 * usePendingDeletionsStore - Tracks entities that are visually "deleted" 
 * but still waiting for the 10s undo timer to expire.
 */
type PendingDeletionsState = {
  readonly pendingIds: Set<string>;
  readonly addPending: (id: string) => void;
  readonly removePending: (id: string) => void;
  readonly isPending: (id: string) => boolean;
};

export const usePendingDeletionsStore = create<PendingDeletionsState>((set, get) => ({
  pendingIds: new Set<string>(),
  addPending: (id) => set((state) => {
    const newSet = new Set(state.pendingIds);
    newSet.add(id);
    return { pendingIds: newSet };
  }),
  removePending: (id) => set((state) => {
    const newSet = new Set(state.pendingIds);
    newSet.delete(id);
    return { pendingIds: newSet };
  }),
  isPending: (id) => {
    if (!id) return false;
    return get().pendingIds.has(id);
  },
}));
