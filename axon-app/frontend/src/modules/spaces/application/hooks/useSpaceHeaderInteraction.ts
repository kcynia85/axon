import { useState, useEffect } from "react";

type SpaceHeaderInteractionProperties = {
    readonly activeSpaceDisplayName: string;
    readonly onRenameSpace?: (newName: string) => void;
};

/**
 * useSpaceHeaderInteraction - Application hook for managing the space header's 
 * interaction states (editing, renaming, feedback).
 */
export const useSpaceHeaderInteraction = ({ 
    activeSpaceDisplayName, 
    onRenameSpace 
}: SpaceHeaderInteractionProperties) => {
    const [isEditing, setIsEditing] = useState(false);
    const [temporarySpaceDisplayName, setTemporarySpaceDisplayName] = useState(activeSpaceDisplayName);
    const [showSuccessFeedback, setShowSuccessFeedback] = useState(false);

    useEffect(() => {
        setTemporarySpaceDisplayName(activeSpaceDisplayName);
    }, [activeSpaceDisplayName]);

    const handleToggleEditing = () => {
        setIsEditing(true);
    };

    const handleCancelEditing = () => {
        setTemporarySpaceDisplayName(activeSpaceDisplayName);
        setIsEditing(false);
    };

    const handleChangeTemporaryDisplayName = (newName: string) => {
        setTemporarySpaceDisplayName(newName);
    };

    const handleCommitRename = () => {
        if (!isEditing) return;
        
        setIsEditing(false);
        
        if (temporarySpaceDisplayName && temporarySpaceDisplayName !== activeSpaceDisplayName) {
            onRenameSpace?.(temporarySpaceDisplayName);
            setShowSuccessFeedback(true);
            setTimeout(() => setShowSuccessFeedback(false), 2000);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            handleCommitRename();
        }

        if (event.key === "Escape") {
            handleCancelEditing();
        }
    };

    return {
        isEditing,
        temporarySpaceDisplayName,
        showSuccessFeedback,
        handleToggleEditing,
        handleCancelEditing,
        handleCommitRename,
        handleChangeTemporaryDisplayName,
        handleKeyDown
    };
};
