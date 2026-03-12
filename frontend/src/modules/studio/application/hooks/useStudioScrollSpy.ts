import { useSyncExternalStore, useCallback, useRef } from "react";

/**
 * useStudioScrollSpy: Advanced hook for tracking active sections in a scrollable container.
 * Adheres to "Zero useEffect" paradigm by using useSyncExternalStore and IntersectionObserver.
 * Standard: Full descriptive names, 0% useEffect.
 */
export const useStudioScrollSpy = <SectionId extends string>(
    sectionIdentifiers: readonly SectionId[],
    initialSectionIdentifier: SectionId,
    intersectionOptions: IntersectionObserverInit = { threshold: 0.5, rootMargin: "-10% 0px -40% 0px" }
) => {
    const activeSectionIdentifierReference = useRef<SectionId>(initialSectionIdentifier);
    const subscriberCallbacksReference = useRef<Set<() => void>>(new Set());

    const subscribeToSectionChanges = useCallback((onStoreChange: () => void) => {
        subscriberCallbacksReference.current.add(onStoreChange);
        return () => subscriberCallbacksReference.current.delete(onStoreChange);
    }, []);

    const getActiveSectionSnapshot = useCallback(() => activeSectionIdentifierReference.current, []);

    const setCanvasContainerReference = useCallback((scrollContainerNode: HTMLDivElement | null) => {
        if (!scrollContainerNode) return;

        const intersectionObserver = new IntersectionObserver((intersectionEntries) => {
            let bestIntersectionEntry: IntersectionObserverEntry | null = null;
            let maximumIntersectionRatio = 0;

            for (const entry of intersectionEntries) {
                if (entry.isIntersecting && entry.intersectionRatio > maximumIntersectionRatio) {
                    maximumIntersectionRatio = entry.intersectionRatio;
                    bestIntersectionEntry = entry;
                }
            }

            if (bestIntersectionEntry) {
                const detectedSectionIdentifier = bestIntersectionEntry.target.id as SectionId;
                if (activeSectionIdentifierReference.current !== detectedSectionIdentifier) {
                    activeSectionIdentifierReference.current = detectedSectionIdentifier;
                    for (const callback of subscriberCallbacksReference.current) {
                        callback();
                    }
                }
            }
        }, { ...intersectionOptions, root: scrollContainerNode });

        for (const identifier of sectionIdentifiers) {
            const sectionElement = document.getElementById(identifier);
            if (sectionElement) {
                intersectionObserver.observe(sectionElement);
            }
        }

        return () => intersectionObserver.disconnect();
    }, [sectionIdentifiers, intersectionOptions]);

    const activeSectionIdentifier = useSyncExternalStore(subscribeToSectionChanges, getActiveSectionSnapshot);

    const scrollToSectionIdentifier = useCallback((sectionIdentifier: SectionId) => {
        const targetSectionElement = document.getElementById(sectionIdentifier);
        if (targetSectionElement) {
            targetSectionElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, []);

    return {
        activeSectionIdentifier,
        setCanvasContainerReference,
        scrollToSectionIdentifier
    };
};
