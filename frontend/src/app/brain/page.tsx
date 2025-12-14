import React, { Suspense } from "react";
import { AssetList } from "@/modules/knowledge";

export default function BrainPage() {
    return (
        <div className="container mx-auto py-10 px-4">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Brain</h1>
                <p className="text-muted-foreground mt-2">
                    Knowledge Graph & Asset Browser
                </p>
            </header>
            <main>
                <h2 className="text-xl font-semibold mb-4">Assets Library</h2>
                <AssetList />
            </main>
        </div>
    );
}