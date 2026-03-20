import React from 'react';
import { usePendingDeletionsStore } from "../lib/store/usePendingDeletionsStore";
import { toast } from "sonner";
import { useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteTimer } from "../ui/complex/DeleteTimer";

/**
 * useDeleteWithUndo - A hook that provides a "Delete with Undo" pattern.
 * When deleteWithUndo is called, the item is immediately hidden from the UI
 * and a 10-second timer starts. The actual deletion happens when the timer expires.
 */
export const useDeleteWithUndo = () => {
  const { addPending, removePending } = usePendingDeletionsStore();
  const queryClient = useQueryClient();
  const timeouts = useRef<Record<string, NodeJS.Timeout>>({});

  const deleteWithUndo = (
    id: string,
    resourceName: string,
    onConfirm: () => void
  ) => {
    // 1. Mark as pending (hides from cards)
    addPending(id);

    // 3. Show toast with Undo action and custom timer
    toast.success(
      React.createElement(
        "div",
        { className: "flex flex-col gap-3 min-w-[280px]" },
        React.createElement("p", { className: "text-sm font-medium" }, `Usunięto "${resourceName}"`),
        React.createElement(DeleteTimer, {
          id: id,
          duration: 10000,
          onComplete: () => {
            onConfirm();
            delete timeouts.current[id];
            queryClient.invalidateQueries({ queryKey: ["trash"] });
            toast.dismiss(id);
          },
        })
      ),
      {
        id,
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
        dismissible: true,
      }
    );
  };

  return { deleteWithUndo };
};
