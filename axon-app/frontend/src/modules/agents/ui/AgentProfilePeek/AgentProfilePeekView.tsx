import React from "react";
import Image from "next/image";
import { Badge } from "@/shared/ui/ui/Badge";
import { 
    SidePeek, 
    SidePeekSection, 
    SidePeekGrid, 
    SidePeekGridItem 
} from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { BookOpen, Edit2, Trash2, Code2 } from "lucide-react";
import { AgentProfilePeekViewProps } from "./AgentProfilePeekView.types";

export const AgentProfilePeekView = ({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  title,
  description,
  avatarUrl,
  goal,
  llmModelName,
  keywords,
  inputFields,
  outputFields,
  knowledgeHubs,
  allSkills,
  availabilityLabels,
  agentId,
}: AgentProfilePeekViewProps) => {
  return (
    <SidePeek
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title={title}
      description={description}
      modal={false}
      image={
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-black">
          <Image
            src={avatarUrl}
            alt={title}
            fill
            className="object-cover object-top scale-110"
          />
        </div>
      }
      footer={
        <div className="flex w-full justify-between items-center">
          <Button 
            variant="ghost" 
            size="icon-lg"
            className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 shrink-0" 
            onClick={() => onDelete(agentId)}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 font-bold" 
            size="lg"
            onClick={onEdit}
          >
            <Edit2 className="w-4 h-4 mr-2" /> {agentId === "draft" ? "Kontynuuj projektowanie" : "Edytuj Agenta"}
          </Button>
        </div>
      }
    >
      <div className="space-y-12">
        {/* ── Main Description ── */}
        {goal && (
          <div className="bg-muted/50 p-4 rounded-xl">
            <p className="text-base leading-relaxed text-foreground/80 font-normal">
              {goal}
            </p>
          </div>
        )}

        {/* ── Metadata Summary ── */}
        <SidePeekGrid>
            <SidePeekGridItem label="Cost" value="Medium" />
            <SidePeekGridItem 
                label="Model LLM" 
                value={llmModelName} 
            />
        </SidePeekGrid>

        {/* ── Keywords ── */}
        {keywords.length > 0 && (
          <SidePeekSection title="Keywords">
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((kw, i) => (
                <Badge key={i} variant="secondary" className="text-base font-normal">
                  #{kw}
                </Badge>
              ))}
            </div>
          </SidePeekSection>
        )}

        {/* ── Context (Input Schema) ── */}
        {inputFields.length > 0 && (
          <SidePeekSection title="Context">
            <div className="space-y-1.5">
              {inputFields.map(({ name, type }) => (
                <div key={name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                  <span className="text-base font-mono font-semibold">{name}</span>
                  <Badge variant="outline" className="text-xs h-5 px-2 py-0 font-bold">
                    {type}
                  </Badge>
                </div>
              ))}
            </div>
          </SidePeekSection>
        )}

        {/* ── Artefacts (Output Schema) ── */}
        {outputFields.length > 0 && (
          <SidePeekSection title="Artefacts">
            <div className="space-y-1.5">
              {outputFields.map(({ name, type }) => (
                <div key={name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                  <span className="text-base font-mono font-semibold">{name}</span>
                  <Badge variant="outline" className="text-xs h-5 px-2 py-0 font-bold">
                    {type}
                  </Badge>
                </div>
              ))}
            </div>
          </SidePeekSection>
        )}

        {/* ── Knowledge ── */}
        {knowledgeHubs.length > 0 && (
          <SidePeekSection title="Wiedza (RAG)">
            <div className="space-y-1.5">
              {knowledgeHubs.map((name, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 border border-primary/5">
                  <BookOpen className="w-4 h-4 text-primary/60 shrink-0" />
                  <span className="text-base font-semibold">{name}</span>
                </div>
              ))}
            </div>
          </SidePeekSection>
        )}

        {/* ── Skills ── */}
        {allSkills.length > 0 && (
          <SidePeekSection title="Skills">
            <div className="space-y-1.5">
              {allSkills.map((skill, index) => {
                const Icon = skill.Icon || Code2;
                return (
                  <div key={`${skill.id}-${index}`} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-primary/60 shrink-0" />
                      <span className="text-base font-medium">{skill.name}</span>
                    </div>
                    { skill.isCustom && <Badge variant="outline" className="text-[10px] h-4 px-1.5 font-bold opacity-50">Custom</Badge> }
                  </div>
                );
              })}
            </div>
          </SidePeekSection>
        )}

        {/* ── Availability ── */}
        {availabilityLabels.length > 0 && (
          <SidePeekSection title="Dostępność">
            <div className="flex flex-wrap gap-1.5">
              {availabilityLabels.map((label) => (
                <Badge key={label} variant="outline" className="text-base font-normal">
                  {label}
                </Badge>
              ))}
            </div>
          </SidePeekSection>
        )}
      </div>
    </SidePeek>
  );
};
