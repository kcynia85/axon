"use client";

import { useState } from "react";
import { InboxItem } from "../../../domain";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Code, Image as ImageIcon, CheckCircle, XCircle } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const getIcon = (type: string) => {
    switch(type) {
        case 'DOCUMENT': return FileText;
        case 'CODE': return Code;
        case 'IMAGE': return ImageIcon;
        default: return FileText;
    }
};

interface InboxListProps {
    items: InboxItem[];
}

export const InboxList = ({ items }: InboxListProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const statusFilter = searchParams.get("status") || "new";

    const handleFilterChange = (status: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("status", status);
        router.push(`${pathname}?${params.toString()}`);
    };

    const filteredItems = items.filter((item) => {
        if (statusFilter === "new") return item.status === "REVIEW" || item.status === "NEW";
        if (statusFilter === "resolved") return item.status === "APPROVED" || item.status === "REJECTED";
        return true;
    });

    if (items.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                No items to review.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Status Filters */}
            <Tabs value={statusFilter} onValueChange={handleFilterChange}>
                <TabsList className="grid w-full max-w-xs grid-cols-2">
                    <TabsTrigger value="new">New</TabsTrigger>
                    <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="space-y-4">
                {filteredItems.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        No {statusFilter} items.
                    </div>
                ) : (
                    filteredItems.map((item) => {
                        const Icon = getIcon(item.type);
                        return (
                            <Card key={item.id} className="flex flex-col md:flex-row items-start md:items-center p-4 gap-4">
                                <div className="p-3 bg-muted rounded-full">
                                    <Icon className="h-6 w-6 text-muted-foreground" />
                                </div>
                                
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-lg">{item.title}</h3>
                                        <Badge variant={item.status === 'REVIEW' || item.status === 'NEW' ? 'default' : 'secondary'}>
                                            {item.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {item.projectName} • {new Date(item.createdAt).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-foreground/80 line-clamp-1 italic border-l-2 pl-2 border-primary/20">
                                        &quot;{item.preview}&quot;
                                    </p>
                                </div>

                                <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                                    <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50">
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reject
                                    </Button>
                                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Approve
                                    </Button>
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
};
