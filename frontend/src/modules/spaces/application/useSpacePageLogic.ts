"use client";

import { useParams } from "next/navigation";

export const useSpacePageLogic = () => {
  const params = useParams();
  const id = params.id as string;
  
  // Mocking data loading for now
  const isLoading = false;
  const error = null;
  const canvas = { id };

  return {
    id,
    isLoading,
    error,
    canvas,
  };
};
