import fs from "fs";
import path from "path";

export interface BacklogItem {
  title: string;
  description: string[]; // Array of strings for multiline description
  role?: string; // Optional role field
  priority?: 'high' | 'medium' | 'low'; // Add priority field
}

export interface BacklogSectionItems {
  high: BacklogItem[];
  medium: BacklogItem[];
  low: BacklogItem[];
}

export interface MajorBacklogSection {
  title: string; // e.g., "Core & Infrastructure (Kernel)"
  items: BacklogSectionItems;
}

export interface StructuredBacklog {
  mainTitle: string;
  sections: MajorBacklogSection[];
}

export const getBacklogContent = async (): Promise<StructuredBacklog> => {
  try {
    const docsPath = path.join(process.cwd(), "..", "docs");
    const backlogPath = path.join(docsPath, "axon-context", "backlog-axon.md");
    
    if (!fs.existsSync(backlogPath)) {
      return {
        mainTitle: "Backlog Not Found",
        sections: [
          {
            title: "Error",
            items: { high: [], medium: [], low: [] },
          },
        ],
      };
    }

    const content = fs.readFileSync(backlogPath, "utf-8");
    const lines = content.split("\n");
    
    let mainTitle = "";
    const sections: MajorBacklogSection[] = [];
    let currentMajorSection: MajorBacklogSection | null = null;
    let currentBacklogItem: BacklogItem | null = null;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      if (line.startsWith("# ")) {
        mainTitle = line.replace(/^#\s*/, '').trim();
      }
      else if (line.startsWith("## ")) {
        if (currentMajorSection) {
          sections.push(currentMajorSection);
        }
        const sectionTitle = line.replace(/^##\s*/, '').trim();
        currentMajorSection = {
          title: sectionTitle,
          items: { high: [], medium: [], low: [] },
        };
        currentBacklogItem = null; // Reset item for new section
      }
      else if (currentMajorSection && line.startsWith("- [ ]")) {
        const priorityMatch = line.match(/\(Priority:\s*(High|Medium|Low)\)/i);
        const itemTitleMatch = line.match(/\- \[ \]\s*\*\*(.*?)\*\*/);
        let itemTitle = itemTitleMatch ? itemTitleMatch[1].trim() : trimmedLine.replace(/^- \[ \]\s*/, '').trim();
        
        // Remove priority tag from title if present
        itemTitle = itemTitle.replace(/\(Priority:\s*(High|Medium|Low)\)/i, '').trim();

        currentBacklogItem = {
          title: itemTitle,
          description: [],
          role: undefined,
          priority: undefined, // Initialize priority
        };

        if (priorityMatch) {
          const priority = priorityMatch[1].toLowerCase() as 'high' | 'medium' | 'low';
          currentBacklogItem.priority = priority;
          currentMajorSection.items[priority].push(currentBacklogItem);
        } else {
          currentBacklogItem.priority = 'medium'; // Default to Medium
          currentMajorSection.items.medium.push(currentBacklogItem); // Default to Medium
        }
      }
      else if (currentBacklogItem && trimmedLine.startsWith("- **Rola:**")) {
        const roleText = trimmedLine.replace(/^- \*\*Rola:\*\*\s*/, '').trim();
        currentBacklogItem.role = roleText;
      }
      else if (currentBacklogItem && trimmedLine.startsWith("- **Opis:**")) {
        const descriptionText = trimmedLine.replace(/^- \*\*Opis:\*\*\s*/, '').trim();
        currentBacklogItem.description.push(descriptionText);
      } else if (currentBacklogItem && trimmedLine.length > 0 && line.startsWith("    -")) { // Continuation of description
        currentBacklogItem.description.push(trimmedLine.trim());
      } else if (currentBacklogItem && trimmedLine.length > 0 && !line.startsWith("#") && !line.startsWith("##")) { // Any other text under an item, treat as description if not a specific tag
        currentBacklogItem.description.push(trimmedLine);
      }
    });

    if (currentMajorSection) {
      sections.push(currentMajorSection);
    }

    return {
      mainTitle: mainTitle || "Axon System Backlog",
      sections: sections,
    };

  } catch (error) {
    console.error("Error reading backlog:", error);
    return {
      mainTitle: "Error",
      sections: [
        {
          title: "Failed to read backlog file.",
          items: { high: [], medium: [], low: [] },
        },
      ],
    };
  }
};

export const getChangelogContent = async () => {
  try {
    const docsPath = path.join(process.cwd(), "..", "docs");
    const impPath = path.join(docsPath, "IMPLEMENTATION.md");
    
    if (!fs.existsSync(impPath)) {
      return "# Changelog not found\n\nCould not locate `docs/IMPLEMENTATION.md`.";
    }

    const content = fs.readFileSync(impPath, "utf-8");
    const lines = content.split("\n");
    
    let changelogBody = "";
    let currentSection = "";
    let hasTasksInSection = false;
    let sectionBuffer = "";

    const today = new Date().toISOString().split('T')[0];

    lines.forEach(line => {
      const trimmed = line.trim();
      
      if (line.startsWith("### Phase")) {
        if (hasTasksInSection) {
          changelogBody += sectionBuffer;
        }
        currentSection = line.replace(/###\s*/, "").trim();
        sectionBuffer = `\n### ${currentSection}\n`;
        hasTasksInSection = false;
      } 
      else if (trimmed.startsWith("- [x]")) {
        const taskText = trimmed.replace("- [x]", "").replace(/\*\*/g, "").trim();
        sectionBuffer += `- ${taskText}\n`;
        hasTasksInSection = true;
      }
    });

    if (hasTasksInSection) {
      changelogBody += sectionBuffer;
    }

    if (!changelogBody) {
      return "# Changelog\n\nNo completed tasks found in IMPLEMENTATION.md.";
    }

    return `# Changelog\n\n## ${today} (MVP Release)\n${changelogBody}`;

  } catch (error) {
    console.error("Error reading changelog:", error);
    return "# Error\n\nFailed to read implementation plan.";
  }
};
