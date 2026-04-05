import { useSyncExternalStore, useCallback, useRef } from "react";

/**
 * useStudioScrollSpy: Advanced hook for tracking active sections in a scrollable container.
 * Adheres to "Zero useEffect" paradigm by using useSyncExternalStore and IntersectionObserver.
 * Standard: Full descriptive names, 0% useEffect.
 */
export const useStudioScrollSpy = <SectionId extends string>(
	sectionIdentifiers: readonly SectionId[],
	initialSectionIdentifier: SectionId,
	intersectionOptions: IntersectionObserverInit = { threshold: 0.5, rootMargin: "-10% 0px -40% 0px" },
) => {
	const activeSectionIdentifierReference = useRef<SectionId>(initialSectionIdentifier);
	const subscriberCallbacksReference = useRef<Set<() => void>>(new Set());
	const intersectionObserverReference = useRef<IntersectionObserver | null>(null);

	const subscribeToSectionChanges = (onStoreChange: () => void) => {
		subscriberCallbacksReference.current.add(onStoreChange);
		return () => subscriberCallbacksReference.current.delete(onStoreChange);
	};

	const getActiveSectionSnapshot = () => activeSectionIdentifierReference.current;
	const getServerSnapshot = () => initialSectionIdentifier;

	const setCanvasContainerReference = (scrollContainerNode: HTMLDivElement | null) => {
		// Cleanup previous observer
		if (intersectionObserverReference.current) {
			intersectionObserverReference.current.disconnect();
			intersectionObserverReference.current = null;
		}

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

		intersectionObserverReference.current = intersectionObserver;
	};

	const activeSectionIdentifier = useSyncExternalStore(
		subscribeToSectionChanges,
		getActiveSectionSnapshot,
		getServerSnapshot,
	);

	const scrollToSectionIdentifier = (sectionIdentifier: SectionId) => {
		const targetSectionElement = document.getElementById(sectionIdentifier);
		if (targetSectionElement) {
			targetSectionElement.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	return {
		activeSectionIdentifier,
		setCanvasContainerReference,
		scrollToSectionIdentifier,
	};
};
