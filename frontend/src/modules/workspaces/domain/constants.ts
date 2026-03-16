/** Human-friendly names for Agents */
export const AGENT_REAL_NAMES: Record<string, string> = {
  "a-product-owner": "Alex Morgan",
  "a-tech-writer": "Elena Vance",
  "a-user-researcher": "Marcus Chen",
  "a-competitor-analyst": "Sarah Jenkins",
  "a-ui-designer": "Olivia Aris",
  "a-developer": "David Kessler",
  "a-qa-engineer": "Jordan Smith",
  "a-copywriter": "Mia Thorne",
};

/** Human-friendly names for mock knowledge hub IDs */
export const KNOWLEDGE_HUB_NAMES: Record<string, string> = {
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
  "model-gpt4o": "GPT-4o",
  "model-gpt4o-mini": "GPT-4o Mini",
  "model-claude-sonnet": "Claude 3.5 Sonnet",
};

export const GLOBAL_AVAILABILITY = "Global Availability";

export const WORKSPACE_OPTIONS = [
  "Discovery",
  "Design",
  "Delivery",
  "Product Management",
  "Growth & Market",
];

export const ALL_WORKSPACE_OPTIONS = [
  GLOBAL_AVAILABILITY,
  ...WORKSPACE_OPTIONS,
];
