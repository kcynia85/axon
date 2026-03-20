import { Asset } from "../../../domain";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { FileText, Calendar, Code, CheckSquare } from "lucide-react";
import React from "react";

type AssetCardProps = {
    readonly asset: Asset;
}

const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
        case 'sop': return <FileText className="h-4 w-4" />;
        case 'template': return <Code className="h-4 w-4" />;
        case 'checklist': return <CheckSquare className="h-4 w-4" />;
        default: return <FileText className="h-4 w-4" />;
    }
}

export const AssetCard = ({ asset }: AssetCardProps) => {
    return (
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        {getIcon(asset.type)}
                        <Badge variant="outline" className="text-xs uppercase">{asset.type}</Badge>
                    </div>
                    <Badge variant="secondary" className="text-xs">{asset.domain}</Badge>
                </div>
                <CardTitle className="mt-3 text-lg leading-tight">{asset.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {asset.content.substring(0, 150)}...
                </p>
            </CardContent>
            <CardFooter className="pt-0 text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span suppressHydrationWarning>{new Date(asset.created_at).toLocaleDateString()}</span>
            </CardFooter>
        </Card>
    );
};
