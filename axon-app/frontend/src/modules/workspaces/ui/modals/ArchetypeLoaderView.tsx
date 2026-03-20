"use client";

import * as React from "react";
import { usePromptArchetypes } from "@/modules/resources/application/usePromptArchetypes";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { Search, Sparkles, Filter, Check, ChevronLeft } from "lucide-react";
import { Input } from "@/shared/ui/ui/Input";
import { Button } from "@/shared/ui/ui/Button";
import { PromptArchetype } from "@/shared/domain/resources";
import { cn } from "@/shared/lib/utils";

type ArchetypeLoaderViewProps = {
  onSelect: (archetype: PromptArchetype) => void;
  onBack: () => void;
};

/**
 * ArchetypeLoaderView - Step 2 of the New Agent Wizard.
 * Allows browsing and selecting predefined agent personas.
 */
export const ArchetypeLoaderView = ({ onSelect, onBack }: ArchetypeLoaderViewProps) => {
  const [search, setSearch] = React.useState("");
  const { data: archetypes, isLoading } = usePromptArchetypes();

  const filteredArchetypes = archetypes?.filter(a =>
    a.archetype_name.toLowerCase().includes(search.toLowerCase()) ||
    a.archetype_role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Search Header */}
      <div className="p-8 border-b bg-muted/20 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Biblioteka Archetypów</span>
            </div>
            <h2 className="text-2xl font-bold font-display">Wybierz wzorzec</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ChevronLeft className="w-4 h-4" /> Wróć do wyboru
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Szukaj (np. Researcher, QA, UX Writer)..."
              className="pl-10 h-11 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-11 gap-2 px-6">
            <Filter className="w-4 h-4" /> Filtry
          </Button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto p-8 bg-muted/5">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
          </div>
        ) : filteredArchetypes?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
            <div className="p-4 bg-muted rounded-full">
              <Search className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground italic">Nie znaleziono archetypów pasujących do &quot;{search}&quot;</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {filteredArchetypes?.map((archetype) => (
              <ArchetypeCard 
                key={archetype.id} 
                archetype={archetype} 
                onClick={() => onSelect(archetype)} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t bg-background text-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest opacity-60">
          Wybrany archetyp uzupełni pola Tożsamości oraz Silnika w kolejnym kroku.
        </p>
      </div>
    </div>
  );
};

const ArchetypeCard = ({ archetype, onClick }: { archetype: PromptArchetype, onClick: () => void }) => (
  <Card
    className="hover:border-primary transition-all cursor-pointer group hover:shadow-xl relative overflow-hidden bg-background border-2"
    onClick={onClick}
  >
    <CardHeader className="p-6">
      <div className="flex justify-between items-start mb-4">
        <Badge variant="secondary" className="text-[8px] h-4 leading-none uppercase font-bold italic bg-primary/10 text-primary border-none">
          {archetype.workspace_domain}
        </Badge>
        <div className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
          <div className="bg-primary rounded-full p-1 text-primary-foreground shadow-lg shadow-primary/20">
            <Check className="w-3 h-3" />
          </div>
        </div>
      </div>
      
      <CardTitle className="text-lg font-bold font-display group-hover:text-primary transition-colors">
        {archetype.archetype_name}
      </CardTitle>
      
      <p className="text-xs font-medium text-muted-foreground/80 mt-1 uppercase tracking-widest">
        {archetype.archetype_role}
      </p>
      
      <CardDescription className="text-xs line-clamp-2 mt-4 leading-relaxed">
        {archetype.archetype_description || "Specjalistyczny archetyp z predefiniowanymi umiejętnościami."}
      </CardDescription>
    </CardHeader>
    
    {/* Decorative element */}
    <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
  </Card>
);
