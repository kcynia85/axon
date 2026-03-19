import { usePendingDeletionsStore } from "../lib/store/usePendingDeletionsStore";
import { toast } from "sonner";
import { useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

/**
 * useDeleteWithUndo - A hook that provides a "Delete with Undo" pattern.
 * When deleteWithUndo is called, the item is immediately hidden from the UI
 * and a 10-second timer starts. The actual deletion happens when the timer expires.
 */
export const useDeleteWithUndo = () => {
  const { addPending, removePending } = usePendingDeletionsStore();
  const queryClient = useQueryClient();
  // We use a ref to track timeouts to avoid re-renders or accidental clears
  const timeouts = useRef<Record<string, NodeJS.Timeout>>({});

  const deleteWithUndo = (
    id: string,
    resourceName: string,
    onConfirm: () => void
  ) => {
    // 1. Mark as pending (hides from cards)
    addPending(id);

    // 2. Set timer for 10 seconds
    const timeout = setTimeout(() => {
      onConfirm();
      removePending(id);
      delete timeouts.current[id];
      // Invalidate trash query to update the count/list
      queryClient.invalidateQueries({ queryKey: ["trash"] });
    }, 10000);

    timeouts.current[id] = timeout;

    // 3. Show toast with Undo action
    toast.success(`Usunięto "${resourceName}"`, {
      action: {
        label: "Cofnij",
        onClick: () => {
          if (timeouts.current[id]) {
            clearTimeout(timeouts.current[id]);
            delete timeouts.current[id];
          }
          removePending(id);
          toast.info(`Przywrócono "${resourceName}"`);
        },
      },
      duration: 10000,
      onAutoClose: () => {
        // Just cleanup if needed, timer already triggered
      }
    });
  };

  return { deleteWithUndo };
};
