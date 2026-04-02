"use client";

import React from "react";
import { Button } from "@/shared/ui/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/ui/Card";
import { Terminal } from "lucide-react";

export const VectorTestConnectionPoster = () => {
    const [isTesting, setIsTesting] = React.useState(false);
    const [testLogs, setTestLogs] = React.useState<string[]>([]);

    const handleTestConnection = () => {
        setIsTesting(true);
        setTestLogs(["Rozpoczynanie testu połączenia...", "Sprawdzanie hosta...", "Łączenie z bazą..."]);
        
        setTimeout(() => {
            setTestLogs(prev => [...prev, "Weryfikacja uprawnień do tworzenia tabel...", "Sprawdzanie rozszerzenia pgvector..."]);
            setTimeout(() => {
                setTestLogs(prev => [...prev, "Sukces! Połączenie ustanowione pomyślnie.", "Czas odpowiedzi: 14ms."]);
                setIsTesting(false);
            }, 800);
        }, 800);
    };

    return (
        <div className="w-full h-full p-6 flex flex-col gap-6 overflow-y-auto">
            <Card className="bg-zinc-950 border-zinc-800 shadow-xl overflow-hidden flex-1 flex flex-col">
                <CardHeader className="p-4 bg-zinc-900 border-b border-zinc-800 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-2">
                        <Terminal className="w-4 h-4" />
                        Test połączenia
                    </CardTitle>
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        className="h-7 text-[10px] uppercase font-bold tracking-wider"
                        onClick={handleTestConnection}
                        disabled={isTesting}
                    >
                        Uruchom test
                    </Button>
                </CardHeader>
                <CardContent className="p-0 flex-1 relative bg-black/50">
                    {testLogs.length === 0 ? (
                        <div className="absolute inset-0 flex items-center justify-center text-zinc-600 font-mono text-[10px] uppercase tracking-widest">
                            Oczekiwanie na test...
                        </div>
                    ) : (
                        <div className="p-6 font-mono text-[11px] leading-relaxed space-y-2 overflow-y-auto">
                            {testLogs.map((log, i) => (
                                <div key={i} className="flex gap-3 text-zinc-400">
                                    <span className="text-zinc-600 shrink-0">[{new Date().toISOString().split('T')[1].slice(0, 8)}]</span>
                                    <span className={log.includes("Sukces") ? "text-emerald-400 font-bold" : ""}>
                                        {log}
                                    </span>
                                </div>
                            ))}
                            {isTesting && (
                                <div className="flex gap-2 text-zinc-500 animate-pulse">
                                    <span>&gt;</span>
                                    <span>_</span>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
