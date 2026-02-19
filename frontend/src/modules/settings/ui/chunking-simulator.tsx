"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/card";
import { Button } from "@/shared/ui/ui/button";
import { Textarea } from "@/shared/ui/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/ui/ui/select";
import { Input } from "@/shared/ui/ui/input";
import { Scissors, Play, Database, Layers, Info, Trash2, RefreshCcw } from "lucide-react";
import { Badge } from "@/shared/ui/ui/badge";
import { cn } from "@/shared/lib/utils";

export const ChunkingSimulator = () => {
    const [text, setText] = React.useState("");
    const [method, setMethod] = React.useState("Recursive_Character");
    const [size, setSize] = React.useState(1000);
    const [overlap, setOverlap] = React.useState(200);
    const [chunks, setChunks] = React.useState<string[]>([]);
    const [isSimulating, setIsSimulating] = React.useState(false);

    const simulate = () => {
        setIsSimulating(true);
        // Mimic API latency
        setTimeout(() => {
            if (!text) {
                setChunks([]);
                setIsSimulating(false);
                return;
            }

            // Simple client-side Mock for visualization
            const mockChunks = [];
            let start = 0;
            while (start < text.length) {
                mockChunks.push(text.slice(start, start + size));
                start += (size - overlap);
                if (mockChunks.length > 50) break; // Safety
            }
            setChunks(mockChunks);
            setIsSimulating(false);
        }, 600);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <Card className="border-primary/10 shadow-xl overflow-hidden">
                    <CardHeader className="bg-muted/30 border-b">
                        <div className="flex items-center gap-2">
                            <Scissors className="w-5 h-5 text-primary" />
                            <h3 className="font-bold font-display">Slicing Preview</h3>
                        </div>
                        <CardTitle className="text-xl font-bold font-display">Tox-Engine Simulator</CardTitle>
                        <CardDescription className="text-xs">
                            Paste reference material to test chunking precision before committing to Knowledge Hub.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground">Source Material</span>
                                <span className="text-[10px] font-mono opacity-60">{text.length} chars</span>
                            </div>
                            <Textarea
                                placeholder="Paste documentation, reports or text to simulate..."
                                className="h-48 resize-none font-mono text-xs leading-relaxed"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground">Strategy</span>
                                <Select value={method} onValueChange={setMethod}>
                                    <SelectTrigger className="h-9 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Recursive_Character">Recursive (Semantic)</SelectItem>
                                        <SelectItem value="Code_Splitter">Code (Structural)</SelectItem>
                                        <SelectItem value="Token_Splitter">Token (Exact)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Size</span>
                                    <Input
                                        type="number"
                                        className="h-9 text-xs font-mono"
                                        value={size}
                                        onChange={(e) => setSize(Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Overlap</span>
                                    <Input
                                        type="number"
                                        className="h-9 text-xs font-mono"
                                        value={overlap}
                                        onChange={(e) => setOverlap(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full gap-2 shadow-lg shadow-primary/20"
                            onClick={simulate}
                            disabled={isSimulating || !text}
                        >
                            {isSimulating ? (
                                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                            ) : (
                                <Play className="w-4 h-4 fill-current text-white" />
                            )}
                            Execute Slice Protocol
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Layers className="w-4 h-4" /> Resultant Fragments
                    </h3>
                    <Badge variant="secondary" className="text-[9px] font-mono">{chunks.length} Chunks</Badge>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/10">
                    {chunks.map((chunk, i) => (
                        <Card key={i} className="group border-primary/5 hover:border-primary/20 transition-all bg-background/50">
                            <div className="p-3">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[9px] font-bold font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded uppercase">Fragment #{i + 1}</span>
                                    <span className="text-[9px] text-muted-foreground">{chunk.length} tokens est.</span>
                                </div>
                                <p className="text-[11px] leading-relaxed line-clamp-4 font-serif text-foreground/80">
                                    {chunk}
                                </p>
                                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                                    <Button variant="ghost" size="icon" className="h-6 w-6"><Info className="w-3 h-3" /></Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive"><Trash2 className="w-3 h-3" /></Button>
                                </div>
                            </div>
                        </Card>
                    ))}

                    <div className="h-64 border border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground italic gap-2 text-center p-10">
                        <Scissors className="w-10 h-10 opacity-10" />
                        <p className="text-sm">Simulator Idle. Run protocol to visualize data atomization.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RefreshCw = ({ className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
);
