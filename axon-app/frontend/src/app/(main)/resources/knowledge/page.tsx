'use client';

import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { KnowledgeBrowser } from "@/modules/resources/ui/knowledge/KnowledgeBrowser";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const KnowledgePage = () => {
    const router = useRouter();

    const goToAddResourceStudio = () => {
        router.push("/resources/knowledge/studio");
    };

    return (
        <PageLayout
            title="Baza Wiedzy"
            description={
                <span className="flex items-center gap-1">
                    Silnik RAG
                    <ArrowRight className="w-3 h-3" />
                    <Link href="/settings/knowledge-engine" className="hover:underline text-primary">
                        Settings/Knowledge Engine
                    </Link>
                </span>
            }
            actions={
                <ActionButton 
                    label="Dodaj Zasób" 
                    onClick={goToAddResourceStudio} 
                />
            }
        >
            <KnowledgeBrowser />
        </PageLayout>
    );
};

export default KnowledgePage;
