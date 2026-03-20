import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

/**
 * Generates a deterministic image ID (1-5) based on a string ID.
 */
export const getDeterministicImgId = (id: string): number => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return (Math.abs(hash) % 5) + 1;
};

/**
 * Returns the correct avatar URL for an agent ID, 
 * relying strictly on provided customUrl or a deterministic fallback.
 */
export const getAgentAvatarUrl = (id: string, customUrl?: string | null): string => {
  if (customUrl) return customUrl;

  const imgId = getDeterministicImgId(id);
  return `/images/avatars/agent-${imgId}.webp`;
};
