import { useCallback, useRef, useState } from "react";
import { KnowledgeResourceData, KnowledgeStudioSectionId } from "../types/knowledge-studio.types";

export const useKnowledgeStudio = () => {
    const [data, setData] = useState<KnowledgeResourceData>({
        fileName: null,
        fileSize: null,
        metadata: [],
        model: "text-embedding-3-small",
        chunkType: "General Text",
        hubs: []
    });

    const [activeSection, setActiveSection] = useState<KnowledgeStudioSectionId>("RESOURCE");
    const canvasScrollRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const activeSectionRef = useRef<KnowledgeStudioSectionId>("RESOURCE");
    const isScrollingByClick = useRef(false);

    const handleDataChange = (updates: Partial<KnowledgeResourceData>) => {
        setData(prev => ({ ...prev, ...updates }));
    };

    const handleAutoTag = () => {
        setData(prev => ({
            ...prev,
            metadata: [
                ...prev.metadata,
                { id: Date.now().toString(), key: "auto-tag", value: "generated" }
            ]
        }));
    };

    const handleSelectFile = (file: File) => {
        console.log("useKnowledgeStudio: File received", file.name, file.size);
        const sizeInKb = Math.round(file.size / 1024);
        setData(prev => {
            console.log("useKnowledgeStudio: Updating state with file", file.name);
            return {
                ...prev,
                fileName: file.name,
                fileSize: `${sizeInKb}kb`
            };
        });
    };

    const scrollToSection = useCallback((id: KnowledgeStudioSectionId) => {
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

    const setCanvasContainerReference = useCallback(
        (node: HTMLDivElement | null) => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }

            canvasScrollRef.current = node;

            if (node) {
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
                            const newId = bestEntry.target.id as KnowledgeStudioSectionId;
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

                const sections: KnowledgeStudioSectionId[] = ["RESOURCE", "METADATA", "STRATEGY", "HUBS"];
                for (const id of sections) {
                    const el = document.getElementById(id);
                    if (el) observer.observe(el);
                }

                observerRef.current = observer;
            }
        },
        [],
    );

    const handleSave = () => {
        console.log("Saving Knowledge Resource", data);
    };

    return {
        data,
        activeSection,
        handleDataChange,
        handleSave,
        handleAutoTag,
        handleSelectFile,
        scrollToSection,
        setCanvasContainerReference
    };
};
