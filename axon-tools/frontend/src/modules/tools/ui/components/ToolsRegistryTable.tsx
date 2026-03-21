import React from "react";
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  type SortDescriptor
} from "@heroui/react";
import { 
  Play, EllipsisVertical 
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { Tool } from "../../domain/tool.types";

export type ToolsRegistryTableProps = {
  readonly items: readonly Tool[];
  readonly sortDescriptor: SortDescriptor;
  readonly onSortChange: (descriptor: SortDescriptor) => void;
  readonly onToolSelect: (tool: Tool) => void;
};

export const  ToolsRegistryTable = ({
  items,
  sortDescriptor,
  onSortChange,
  onToolSelect,
}: ToolsRegistryTableProps) => {
  return (
    <div className="bg-[#0a0a0a] overflow-hidden border border-zinc-800/50 rounded-2xl shadow-2xl mt-2">
      <Table 
        aria-label="Internal Tools Registry"
        selectionMode="single"
        sortDescriptor={sortDescriptor}
        onSortChange={onSortChange}
        onRowAction={(key) => {
          const tool = items.find(t => t.name === key);
          if (tool) onToolSelect(tool);
        }}
        classNames={{
          base: "overflow-visible",
          table: "min-w-full border-separate border-spacing-0",
          thead: "bg-zinc-950",
          th: [
            "bg-zinc-900 text-zinc-400 border-b border-zinc-700 text-[11px] font-mono font-black uppercase tracking-widest px-8 h-12 shadow-sm align-middle text-left py-0",
            "data-[sortable=true]:cursor-pointer",
            "[&>div]:flex [&>div]:flex-row [&>div]:items-center [&>div]:gap-4",
            "[&_svg]:inline-block [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ml-6 [&_svg]:text-zinc-500",
            "aria-[sort=descending]:[&_svg]:rotate-180"
          ].join(" "),
          tr: "hover:bg-zinc-800/50 even:bg-white/[0.02] cursor-pointer group transition-all duration-200",
          td: "py-0 px-8 border-b border-zinc-800/40 text-left h-[56px] align-middle relative group-hover:bg-zinc-800/30 transition-colors",
        }}
        removeWrapper
      >

        <TableHeader>
          <TableColumn key="function_name" allowsSorting>Identity</TableColumn>
          <TableColumn key="description">Business Goal</TableColumn>
          <TableColumn key="status" allowsSorting>Status</TableColumn>
          <TableColumn key="keywords" >Keywords</TableColumn>
          <TableColumn key="actions" width={40}>&nbsp;</TableColumn>
        </TableHeader>
        <TableBody emptyContent="Brak wykrytych narzędzi w systemie.">
          {items.map((t) => (
            <TableRow key={t.name}>
              <TableCell>
                <span className="font-bold text-white text-[14px] tracking-tight transition-colors">{t.function_name}</span>
              </TableCell>
              <TableCell>
                <p className="text-zinc-400 text-[14px] font-medium line-clamp-1 leading-relaxed">
                  {t.description || "—"}
                </p>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                   <span className={cn(
                     "text-[11px] py-0.5 px-2 rounded-md font-mono font-bold capitalize border transition-all",
                     t.status === "production" 
                       ? "bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.2)]" 
                       : "border-zinc-800 bg-zinc-900/50 text-zinc-400 group-hover:text-zinc-200 group-hover:border-zinc-700"
                   )}>
                    {t.status === "draft" ? "In Draft" : t.status.replace(/_/g, ' ')}
                   </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap items-center gap-1">
                   {(Array.isArray(t.keywords) ? t.keywords : [])
                     .filter(tag => tag && tag.toLowerCase() !== "python" && tag.toLowerCase() !== "synced")
                     .map((tag, idx) => (
                       <span key={idx} className="text-[14px] text-zinc-600 font-mono">
                        #{tag.toLowerCase()}
                       </span>
                   ))}
                </div>
              </TableCell>
              <TableCell>
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="light" className="text-zinc-600 hover:text-white">
                      <EllipsisVertical size={16} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu 
                    aria-label="Action menu"
                    className="bg-zinc-900 text-xs border border-zinc-800 text-zinc-300"
                    onAction={(key) => {
                      if (key === "run") {
                        onToolSelect(t);
                      }
                    }}
                  >
                    <DropdownItem key="run" startContent={<Play size={14}/>}>Execute Test</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
