'use server';

import { createStreamableUI } from 'ai/rsc';
import { ReactNode } from 'react';
import { createClient } from '@/shared/infrastructure/supabase/server';

export async function submitUserMessage(input: string, projectId: string): Promise<{ id: number; display: ReactNode }> {
  const ui = createStreamableUI();

  // --- REAL MODE ---
  (async () => {
    try {
        ui.update(
            <div className="flex items-center gap-2 text-muted-foreground text-sm my-2">
                <span className="animate-pulse">Contacting Axon Brain...</span>
            </div>
        );

        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) {
             throw new Error("Unauthorized: Please sign in.");
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_SSE_DIRECT_URL || ""}/api/agents/chat`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                project_id: projectId,
                agent_role: "MANAGER", // TODO: Pass role dynamically as well
                message: input
            }),
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Backend Error: ${response.status}`);
        }

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let currentText = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
            
            // Process SSE lines
            const lines = buffer.split('\n');
            buffer = lines.pop() || ""; // Keep incomplete line

            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    const dataStr = line.slice(6).trim();
                    if (dataStr === "[DONE]") continue;
                    
                    try {
                        const data = JSON.parse(dataStr);
                        if (data.type === "token") {
                            currentText += data.content;
                            ui.update(
                                <div className="bg-muted/20 p-3 rounded-lg text-sm my-2 whitespace-pre-wrap">
                                    {currentText}
                                </div>
                            );
                        } else if (data.type === "error") {
                             ui.update(
                                <div className="text-red-500 text-sm my-2">
                                    Error: {data.content}
                                </div>
                            );
                        }
                    } catch (e) {
                        // Ignore parse errors for keepalives
                    }
                }
            }
        }
        
        ui.done();

    } catch (error) {
        console.error("Agent Stream Error:", error);
        ui.done(
            <div className="text-red-500 p-3 rounded-lg text-sm my-2">
                Connection Failed. Is the Backend running? ({String(error)})
            </div>
        );
    }
  })();

  return {
    id: Date.now(),
    display: ui.value,
  };
}
