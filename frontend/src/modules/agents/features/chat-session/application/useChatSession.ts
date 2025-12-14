import { useState, useCallback } from "react";
import { Message, AgentRole } from "../domain/types";
import { streamChat } from "../infrastructure/agent-api";

interface UseAgentSessionProps {
    projectId: string;
    agentRole: AgentRole;
}

export const useAgentSession = ({ projectId, agentRole }: UseAgentSessionProps) => {
    const [sessionHistory, setSessionHistory] = useState<Message[]>([]);
    const [isAgentThinking, setIsAgentThinking] = useState(false);

    const submitUserQuery = useCallback(async (userQuery: string) => {
        // 1. Record User Intent
        const userMessage: Message = { role: "user", content: userQuery };
        setSessionHistory((prev) => [...prev, userMessage]);
        setIsAgentThinking(true);

        try {
            // 2. Prepare Agent Response Placeholder
            setSessionHistory((prev) => [...prev, { role: "model", content: "" }]);

            // 3. Initiate Reasoning Stream via Infrastructure Layer
            const response = await streamChat({
                project_id: projectId,
                agent_role: agentRole,
                message: userQuery,
            });

            const streamReader = response.body!.getReader();
            const textDecoder = new TextDecoder();
            let accumulatedAgentResponse = "";

            while (true) {
                const { done, value } = await streamReader.read();
                if (done) break;

                const chunkText = textDecoder.decode(value, { stream: true });
                // Parse SSE format
                const lines = chunkText.split("\n\n");
                
                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        try {
                            const jsonStr = line.replace("data: ", "");
                            const eventData = JSON.parse(jsonStr);
                            
                            if (eventData.type === "token") {
                                accumulatedAgentResponse += eventData.content;
                                // Update the active response in history
                                setSessionHistory((prev) => {
                                    const historyCopy = [...prev];
                                    const lastMessage = historyCopy[historyCopy.length - 1];
                                    if (lastMessage.role === "model") {
                                        lastMessage.content = accumulatedAgentResponse;
                                    }
                                    return historyCopy;
                                });
                            }
                        } catch (e) {
                            console.warn("Failed to parse reasoning event", e);
                        }
                    }
                }
            }

        } catch (error) {
            console.error("Agent Session Error:", error);
            setSessionHistory((prev) => [...prev, { role: "system", content: "System Error: Agent failed to respond." }]);
        } finally {
            setIsAgentThinking(false);
        }
    }, [projectId, agentRole]);

    return { sessionHistory, submitUserQuery, isAgentThinking };
};
