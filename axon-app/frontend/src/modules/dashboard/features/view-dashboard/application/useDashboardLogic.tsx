"use client";

import { useState } from "react";
import { useUIState, useActions } from "ai/rsc";
import type { AI, UIState } from "@/modules/agents/infrastructure/AiProvider";
import React from "react";

export const useDashboardLogic = () => {
    const [messages, setMessages] = useUIState<typeof AI>();
    const { submitUserMessage } = useActions<typeof AI>();
    const [inputValue, setInputValue] = useState<string>("");

    const handleSubmission = async (event?: React.FormEvent) => {
        event?.preventDefault();
        if (!inputValue.trim()) return;

        const value = inputValue;
        setInputValue("");

        setMessages((current: UIState) => [
            ...current,
            {
                id: Date.now(),
                display: (
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">U</div>
                        <div className="flex-1 bg-muted/50 rounded-lg p-3 text-sm">{value}</div>
                    </div>
                ),
            },
        ]);

        try {
            const responseMessage = await submitUserMessage(value, "home");
            setMessages((current: UIState) => [...current, responseMessage]);
        } catch (error) {
            console.error("Error submitting message:", error);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            void handleSubmission();
        }
    };

    return {
        messages,
        inputValue,
        setInputValue,
        handleSubmission,
        handleKeyDown,
    };
};
