"use client";

import { useEffect, useState } from "react";

/**
 * Hook to track which section is currently in view.
 * @param sectionIds Array of section IDs to observe.
 * @param offset Pixel offset from the top to trigger activation.
 */
export const useScrollSpy = (sectionIds: string[], offset: number = 100) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const listeners = sectionIds.map((id) => {
      const element = document.getElementById(id);
      if (!element) return null;

      return {
        id,
        offsetTop: element.offsetTop,
        offsetBottom: element.offsetTop + element.offsetHeight,
      };
    }).filter(Boolean);

    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;

      const activeSection = listeners!.find(
        (section) =>
          scrollPosition >= section!.offsetTop &&
          scrollPosition < section!.offsetBottom
      );

      if (activeSection && activeSection.id !== activeId) {
        setActiveId(activeSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds, offset, activeId]);

  return activeId;
}
