/** Human-friendly names for mock knowledge hub IDs */
export const KNOWLEDGE_HUB_NAMES: Record<string, string> = {
  "123e4567-e89b-12d3-a456-426614174010": "Internal Wiki",
  "123e4567-e89b-12d3-a456-426614174011": "Product Specs",
  "123e4567-e89b-12d3-a456-426614174012": "Customer Feedback",
  "123e4567-e89b-12d3-a456-426614174013": "Market Reports",
  "kh-product-management": "Product Management Hub",
  "kh-strategy-frameworks": "Strategy Frameworks",
  "kh-discovery-hub": "Discovery Hub",
  "kh-jtbd-library": "JTBD Library",
  "kh-design-system": "Design System Hub",
  "kh-engineering-standards": "Engineering Standards",
  "kh-architecture-patterns": "Architecture Patterns",
  "kh-brand-guidelines": "Brand Guidelines",
  "kh-seo-playbook": "SEO Playbook",
};

/** Human-friendly names for LLM models */
export const LLM_MODEL_NAMES: Record<string, string> = {
  "123e4567-e89b-12d3-a456-426614174000": "Gemini 2.5 Pro",
  "123e4567-e89b-12d3-a456-426614174001": "Gemini 2.0 Flash",
  "123e4567-e89b-12d3-a456-426614174002": "GPT-4o",
  "123e4567-e89b-12d3-a456-426614174003": "GPT-4-turbo",
  "123e4567-e89b-12d3-a456-426614174004": "Claude 3.5 Sonnet",
  "123e4567-e89b-12d3-a456-426614174005": "Claude 3 Opus",
  "model-gpt4o": "GPT-4o",
  "model-gpt4o-mini": "GPT-4o Mini",
  "model-claude-sonnet": "Claude 3.5 Sonnet",
};

export const GLOBAL_AVAILABILITY = "Global Availability";

export const WORKSPACE_OPTIONS = [
  { id: "ws-discovery", label: "Discovery" },
  { id: "ws-design", label: "Design" },
  { id: "ws-delivery", label: "Delivery" },
  { id: "ws-product", label: "Product Management" },
  { id: "ws-growth", label: "Growth & Market" },
];

export const ALL_WORKSPACE_OPTIONS = [
  { id: GLOBAL_AVAILABILITY, label: GLOBAL_AVAILABILITY },
  ...WORKSPACE_OPTIONS,
];

/**
 * Returns the human-readable label for a workspace ID or label.
 * Case-insensitive and robust against both IDs and plain labels.
 */
export const getWorkspaceLabel = (id: string): string => {
  if (!id) return "";
  
  const normalizedInput = id.trim().toLowerCase();
  
  // 1. Try to find by ID or Label (case-insensitive)
  const found = ALL_WORKSPACE_OPTIONS.find(
    opt => opt.id.toLowerCase() === normalizedInput || opt.label.toLowerCase() === normalizedInput
  );
  
  if (found) return found.label;
  
  // 2. Fallback for older IDs or unknown values
  return id
    .replace(/^ws-/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};
