"use client";

import React from "react";
import Link from "next/link";
import { LucideIcon, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";
import { Separator } from "@/shared/ui/ui/Separator";
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarFooter,
} from "@/shared/ui/ui/Sidebar";
import { cn } from "@/shared/lib/utils";
import { Tooltip } from "@/shared/ui/ui/Tooltip";

export type NavigationItem = {
  readonly name: string;
  readonly href: string;
  readonly icon: LucideIcon;
  readonly badge?: number;
  readonly onClick?: (e: React.MouseEvent) => void;
  readonly hasCollapseToggle?: boolean;
};

export type SidebarProps = {
  readonly items: readonly NavigationItem[];
  readonly bottomItems: readonly NavigationItem[];
  readonly isCollapsed: boolean;
  readonly onToggle: () => void;
  readonly pathname: string;
  readonly className?: string;
};

type SidebarItemProps = {
  readonly item: NavigationItem;
  readonly isCollapsed: boolean;
  readonly onToggle: () => void;
  readonly pathname: string;
};

const SidebarItem = ({
  item,
  isCollapsed,
  onToggle,
  pathname,
}: SidebarItemProps): React.ReactNode => {
  const { name, href, icon: Icon, badge, onClick, hasCollapseToggle } = item;
  const isActive = pathname === href || pathname?.startsWith(`${href}/`);
  const isItemSelected = isActive;

  const renderIcon = (): React.ReactNode => (
    <div className="relative flex items-center justify-center shrink-0">
      <Icon
        className={cn(
          "h-[18px] w-[18px] shrink-0 transition-transform",
          isItemSelected && "scale-110"
        )}
      />
      {badge !== undefined && badge > 0 && (
        <span
          className={cn(
            "absolute -top-1 -right-1 flex h-2 w-2 items-center justify-center rounded-full bg-blue-500 border border-white dark:border-zinc-950 transition-transform",
            isCollapsed ? "scale-110" : "scale-100"
          )}
        />
      )}
    </div>
  );

  const renderLabel = (): React.ReactNode =>
    !isCollapsed && (
      <>
        <span className="truncate text-sm font-semibold tracking-tight">
          {name}
        </span>
        {badge !== undefined && badge > 0 && (
          <span className="ml-auto bg-blue-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black leading-none">
            {badge}
          </span>
        )}
      </>
    );

  const itemButton = (
    <Button
      variant={isItemSelected ? "secondary" : "ghost"}
      asChild={!onClick}
      onClick={onClick}
      className={cn(
        "w-full justify-start transition-all duration-200 relative group/item rounded-xl h-11 px-3 gap-4",
        isItemSelected
          ? "text-zinc-900 dark:text-zinc-100 bg-zinc-100/80 dark:bg-zinc-900/80 font-bold shadow-sm ring-1 ring-zinc-200/50 dark:ring-zinc-800/50"
          : "text-muted-foreground hover:text-foreground hover:bg-zinc-100/60 dark:hover:bg-zinc-900/40",
        isCollapsed && "justify-center px-0 h-10 w-10 shrink-0",
        !isCollapsed && hasCollapseToggle && "pr-12"
      )}
    >
      {onClick ? (
        <>
          {renderIcon()}
          {renderLabel()}
        </>
      ) : (
        <Link href={href}>
          {renderIcon()}
          {!isCollapsed && (
            <span className="truncate text-sm font-semibold tracking-tight">
              {name}
            </span>
          )}
        </Link>
      )}
    </Button>
  );

  const contentWithToggle =
    !isCollapsed && hasCollapseToggle ? (
      <div className="relative w-full">
        {itemButton}
        <div className="absolute right-1 top-1/2 -translate-y-1/2">
          <Tooltip content="Collapse Sidebar" side="right" sideOffset={10}>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Collapse Sidebar"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onToggle();
                        }}
                        className="h-8 w-8 text-muted-foreground transition-colors hover:text-foreground shrink-0 rounded-lg bg-transparent hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
                      >
                        <PanelLeftClose size={18} />
                      </Button>
                    </Tooltip>        </div>
      </div>
    ) : (
      itemButton
    );

  if (isCollapsed) {
    return (
      <div className="flex justify-center w-full py-2">
        <Tooltip content={name} side="right">
          {contentWithToggle}
        </Tooltip>
      </div>
    );
  }

  return <div className="py-1">{contentWithToggle}</div>;
};

export const Sidebar = ({
  items,
  bottomItems,
  isCollapsed,
  onToggle,
  pathname,
  className,
}: SidebarProps): React.ReactNode => {
  return (
    <aside
      className={cn(
        "h-screen flex-shrink-0 transition-all duration-300 ease-in-out p-4 pr-2",
        isCollapsed ? "w-[90px]" : "w-[260px]",
        className
      )}
    >
      <SidebarContainer
        className={cn(
          "h-full rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl shadow-zinc-200/20 dark:shadow-none overflow-hidden bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl",
          "transition-all duration-300 ease-in-out z-[70] w-full"
        )}
      >
        <SidebarContent
          className={cn(
            "text-left custom-scrollbar overflow-x-hidden flex flex-col",
            isCollapsed ? "px-0 pt-6" : "px-4 pt-6"
          )}
        >
          {isCollapsed && (
            <div className="flex justify-center mb-6">
              <Tooltip content="Expand Sidebar" side="right" sideOffset={10}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onToggle}
                  aria-label="Expand Sidebar"
                  className="h-10 w-10 text-muted-foreground transition-colors hover:text-foreground shrink-0 rounded-xl hover:bg-zinc-100/60 dark:hover:bg-zinc-900/40"
                >
                  <PanelLeftOpen size={20} />
                </Button>

              </Tooltip>
            </div>
          )}

          <SidebarGroup className="pt-0 pb-2 px-0 w-full">
            <SidebarMenu className="w-full gap-2">
              {items.map((item) => (
                <SidebarItem
                  key={item.name}
                  item={item}
                  isCollapsed={isCollapsed}
                  onToggle={onToggle}
                  pathname={pathname}
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <div className="flex-1" />
        </SidebarContent>

        <SidebarFooter
          className={cn("pb-6 flex flex-col", isCollapsed ? "px-0" : "px-4")}
        >
          <Separator
            className={cn("mb-4 opacity-50", isCollapsed ? "mx-4" : "mx-0")}
          />
          <SidebarGroup className="py-2 px-0 w-full">
            <SidebarMenu className="w-full text-center gap-2">
              {bottomItems.map((item) => (
                <SidebarItem
                  key={item.name}
                  item={item}
                  isCollapsed={isCollapsed}
                  onToggle={onToggle}
                  pathname={pathname}
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarFooter>
      </SidebarContainer>
    </aside>
  );
};
