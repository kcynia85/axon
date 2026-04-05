import React from "react";
import { FileText, Code, Image as ImageIcon, CheckCircle, XCircle } from "lucide-react";
import { InboxItem } from "../../../domain";
import { Button } from "@/shared/ui/ui/Button";
import { TableCell, TableRow } from "@/shared/ui/ui/Table";
import { StatusBadge, StatusVariant } from "@/shared/ui/complex/StatusBadge";

export type InboxItemViewProps = {
    readonly item: InboxItem;
    readonly onApprove: (id: string) => void;
    readonly onReject: (id: string) => void;
}

const getIcon = (type: string) => {
    switch(type) {
        case 'DOCUMENT': return FileText;
        case 'CODE': return Code;
        case 'IMAGE': return ImageIcon;
        default: return FileText;
    }
};

const getStatusVariant = (status: string): StatusVariant => {
    switch(status) {
        case 'DRAFT': return 'default';
        case 'REVIEW': return 'review';
        case 'APPROVED': return 'success';
        case 'REJECTED': return 'error';
        default: return 'default';
    }
};

export const InboxItemView = ({ 
    item, 
    onApprove, 
    onReject 
}: InboxItemViewProps): React.ReactNode => {
    const Icon = getIcon(item.type);

    return (
        <TableRow key={item.id} className="group hover:bg-zinc-50/80 dark:hover:bg-white/[0.02] border-zinc-100 dark:border-zinc-900 transition-colors">
            <TableCell className="py-5 px-6">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-500 group-hover:text-black dark:group-hover:text-white transition-colors">
                        <Icon size={18} />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{item.title}</span>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-tight" suppressHydrationWarning>
                            {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </TableCell>
            <TableCell className="py-5 px-6">
                <span className="text-xs font-medium text-zinc-500">{item.projectName}</span>
            </TableCell>
            <TableCell className="py-5 px-6">
                <StatusBadge status={item.status} variant={getStatusVariant(item.status)} />
            </TableCell>
            <TableCell className="py-5 px-6 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onReject(item.id)}
                        className="h-8 px-3 text-[10px] font-black uppercase tracking-widest border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-950/30"
                    >
                        <XCircle size={14} className="mr-1.5" />
                        Reject
                    </Button>
                    <Button 
                        size="sm" 
                        onClick={() => onApprove(item.id)}
                        className="h-8 px-3 text-[10px] font-black uppercase tracking-widest bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                    >
                        <CheckCircle size={14} className="mr-1.5" />
                        Approve
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
};
