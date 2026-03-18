import { TemplateChecklistItem } from "../../types/template-studio.types";

/**
 * Parses markdown content into a structured checklist.
 * # Header or **Header** -> Main Action (TemplateChecklistItem)
 * - [ ] Item or * [ ] Item -> Subaction under the last Header
 */
export const parseMarkdownToChecklist = (markdown: string): TemplateChecklistItem[] => {
  if (!markdown) return [];

  const lines = markdown.split('\n');
  const items: TemplateChecklistItem[] = [];
  let currentItem: TemplateChecklistItem | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Match Headers (# Title) or Bold (**Title**)
    const headerMatch = trimmed.match(/^#+\s*(.*)/) || trimmed.match(/^\*\*(.*)\*\*/);
    
    if (headerMatch) {
      const label = headerMatch[1].replace(/\*\*/g, "").trim();
      if (label) {
        currentItem = {
          id: crypto.randomUUID(),
          label,
          description: "",
          isCompleted: false,
          subactions: []
        };
        items.push(currentItem);
      }
      continue;
    }

    // Match Checklist Items (- [ ] Item or * [ ] Item or - [x] Item)
    const checkMatch = trimmed.match(/^[-*]\s*\[([ xX])\]\s*(.*)/);
    if (checkMatch) {
      if (!currentItem) {
        currentItem = {
          id: crypto.randomUUID(),
          label: "Actions",
          description: "",
          isCompleted: false,
          subactions: []
        };
        items.push(currentItem);
      }
      
      const isCompleted = checkMatch[1].toLowerCase() === 'x';
      const label = checkMatch[2].trim();
      
      if (label) {
        currentItem.subactions?.push({
          id: crypto.randomUUID(),
          label,
          isCompleted
        });
      }
      continue;
    }

    // If it's just text and we have a current item, treat it as a description
    if (currentItem && !trimmed.startsWith('-') && !trimmed.startsWith('*') && !trimmed.startsWith('#')) {
      if (!currentItem.description) {
        currentItem.description = trimmed;
      } else {
        currentItem.description += ' ' + trimmed;
      }
    }
  }

  return items;
};
