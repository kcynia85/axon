import { useCallback, useRef, useState } from "react";
import type { AgentStudioSectionId } from "../../types/agent-studio.types";
import type { SectionConfig, UseStudioScrollReturn } from "../../types/hooks.types";

export const useStudioScroll = (
	sections: readonly SectionConfig[],
	isActive: boolean,
): UseStudioScrollReturn => {
	const [activeSection, setActiveSection] =
		useState<AgentStudioSectionId>("IDENTITY");
	const canvasScrollRef = useRef<HTMLDivElement | null>(null);
	const observerRef = useRef<IntersectionObserver | null>(null);
	const activeSectionRef = useRef<AgentStudioSectionId>("IDENTITY");
	const isScrollingByClick = useRef(false);

	const scrollToSection = useCallback((id: AgentStudioSectionId) => {
		const el = document.getElementById(id);
		if (el && canvasScrollRef.current) {
			isScrollingByClick.current = true;
			activeSectionRef.current = id;
			setActiveSection(id);

			const containerRect = canvasScrollRef.current.getBoundingClientRect();
			const elRect = el.getBoundingClientRect();
			const scrollTop =
				canvasScrollRef.current.scrollTop + (elRect.top - containerRect.top) - 40;

			canvasScrollRef.current.scrollTo({
				top: scrollTop,
				behavior: "smooth",
			});

			setTimeout(() => {
				isScrollingByClick.current = false;
			}, 800);
		}
	}, []);

	const setCanvasRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}

			canvasScrollRef.current = node;

			if (node && isActive) {
				const observer = new IntersectionObserver(
					(entries) => {
						if (isScrollingByClick.current) return;

						let bestEntry: IntersectionObserverEntry | null = null;
						let maxRatio = 0;

						for (const entry of entries) {
							if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
								maxRatio = entry.intersectionRatio;
								bestEntry = entry;
							}
						}

						if (bestEntry) {
							const newId = bestEntry.target.id as AgentStudioSectionId;
							if (activeSectionRef.current !== newId) {
								activeSectionRef.current = newId;
								setActiveSection(newId);
							}
						}
					},
					{
						threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
						root: node,
						rootMargin: "-10% 0px -40% 0px",
					},
				);

				for (const s of sections) {
					const el = document.getElementById(s.id);
					if (el) observer.observe(el);
				}

				observerRef.current = observer;
			}
		},
		[isActive, sections],
	);

	return {
		setCanvasRef,
		activeSection,
		scrollToSection,
	};
};
