import {
  Agent,
  Crew,
  Pattern,
  Template,
  Workspace,
  Automation,
  Service
} from "@/shared/domain/workspaces";

// --- Mock Data ---

const MOCK_WORKSPACES: Workspace[] = [
  {
    id: "ws-product",
    name: "Product Management",
    description: "Product strategy, requirements, and roadmap planning.",
    created_at: "2026-01-10T09:00:00Z",
    updated_at: "2026-02-24T12:00:00Z",
  },
  {
    id: "ws-discovery",
    name: "Discovery",
    description: "User research, competitive analysis, and opportunity mapping.",
    created_at: "2026-01-12T09:00:00Z",
    updated_at: "2026-02-22T10:00:00Z",
  },
  {
    id: "ws-design",
    name: "Design",
    description: "UI/UX design, prototyping, and design system management.",
    created_at: "2026-01-15T09:00:00Z",
    updated_at: "2026-02-23T14:00:00Z",
  },
  {
    id: "ws-delivery",
    name: "Delivery",
    description: "Sprint execution, code reviews, QA, and deployment.",
    created_at: "2026-01-18T09:00:00Z",
    updated_at: "2026-02-24T08:00:00Z",
  },
  {
    id: "ws-growth",
    name: "Growth & Market",
    description: "Marketing campaigns, content strategy, and growth experiments.",
    created_at: "2026-01-20T09:00:00Z",
    updated_at: "2026-02-20T16:00:00Z",
  },
];

const MOCK_AGENTS: Record<string, Agent[]> = {
  "ws-product": [
    {
      id: "123e4567-e89b-12d3-a456-426614174020",
      agent_name: "Product Owner",
      agent_role_text: "Lead Product Strategy",
      agent_goal: "Define requirements, prioritize backlog, and align stakeholders.",
      agent_backstory: "Experienced product lead with 10+ years building SaaS products. Expert in PRDs and OKR frameworks.",
      guardrails: { instructions: ["Always reference user research data", "Include success metrics"], constraints: ["No speculative features"] },
      few_shot_examples: [],
      reflexion: true,
      temperature: 0.7,
      rag_enforcement: true,
      input_schema: { user_research_summary: "json", market_segment: "string", okr_context: "string" },
      output_schema: { prd_document: "markdown", backlog_items: "json", priority_matrix: "json" },
      knowledge_hub_ids: ["123e4567-e89b-12d3-a456-426614174030", "123e4567-e89b-12d3-a456-426614174030"],
      llm_model_id: "123e4567-e89b-12d3-a456-426614174000",
      availability_workspace: ["ws-product", "ws-discovery"],
      agent_keywords: ["product", "strategy", "prd", "requirements"],
      auto_start: false,
      grounded_mode: true,
      native_skills: [],
      custom_functions: [],
      data_interface: { context: [], artefacts: [] },
      created_at: "2026-01-10T09:00:00Z",
      updated_at: "2026-02-20T12:00:00Z",
    },
    {
      id: "a-tech-writer",
      agent_name: "Technical Writer",
      agent_role_text: "Documentation Specialist",
      agent_goal: "Create clear, comprehensive technical documentation.",
      agent_backstory: "Documentation expert who believes good docs save more time than good code. Specializes in API docs and architecture decision records.",
      guardrails: { instructions: ["Use structured templates", "Include code examples"], constraints: ["No jargon without explanation"] },
      few_shot_examples: [],
      reflexion: false,
      temperature: 0.5,
      rag_enforcement: true,
      input_schema: { source_code: "string", api_endpoints: "json", architecture_notes: "string" },
      output_schema: { documentation: "markdown", api_reference: "json" },
      knowledge_hub_ids: ["123e4567-e89b-12d3-a456-426614174030"],
      llm_model_id: "123e4567-e89b-12d3-a456-426614174000",
      availability_workspace: ["ws-product"],
      agent_keywords: ["documentation", "writing", "api-docs"],
      auto_start: false,
      grounded_mode: false,
      native_skills: [],
      custom_functions: [],
      data_interface: { context: [], artefacts: [] },
      created_at: "2026-01-11T09:00:00Z",
      updated_at: "2026-02-18T10:00:00Z",
    },
  ],
  "ws-discovery": [
    {
      id: "a-user-researcher",
      agent_name: "User Researcher",
      agent_role_text: "UX Research Lead",
      agent_goal: "Discover user pain points and validate product hypotheses.",
      agent_backstory: "PhD in HCI with experience running 500+ user interviews. Expert in Jobs-to-be-Done framework.",
      guardrails: { instructions: ["Use JTBD framework", "Cite sources"], constraints: ["No assumptions without data"] },
      few_shot_examples: [],
      reflexion: true,
      temperature: 0.6,
      rag_enforcement: true,
      input_schema: { interview_transcripts: "json", survey_responses: "csv", persona_profiles: "json" },
      output_schema: { research_findings: "json", insight_map: "json", recommendations: "markdown" },
      knowledge_hub_ids: ["123e4567-e89b-12d3-a456-426614174030", "123e4567-e89b-12d3-a456-426614174030"],
      llm_model_id: "123e4567-e89b-12d3-a456-426614174001",
      availability_workspace: ["ws-discovery"],
      agent_keywords: ["research", "ux", "interviews", "jtbd"],
      auto_start: false,
      grounded_mode: false,
      native_skills: [],
      custom_functions: [],
      data_interface: { context: [], artefacts: [] },
      created_at: "2026-01-12T09:00:00Z",
      updated_at: "2026-02-19T10:00:00Z",
    },
    {
      id: "a-competitor-analyst",
      agent_name: "Competitive Analyst",
      agent_role_text: "Market Intelligence",
      agent_goal: "Analyze competitor landscape and identify opportunities.",
      agent_backstory: "Former strategy consultant at McKinsey. Expert in Porter's Five Forces and Blue Ocean Strategy.",
      guardrails: { instructions: ["Use structured frameworks", "Include data tables"], constraints: ["No subjective opinions"] },
      few_shot_examples: [],
      reflexion: false,
      temperature: 0.4,
      rag_enforcement: true,
      input_schema: { competitors_list: "json", market_data: "csv" },
      output_schema: { competitive_matrix: "json", opportunity_report: "markdown" },
      knowledge_hub_ids: ["123e4567-e89b-12d3-a456-426614174030"],
      llm_model_id: "123e4567-e89b-12d3-a456-426614174000",
      availability_workspace: ["ws-discovery", "ws-product"],
      agent_keywords: ["competitors", "market", "analysis"],
      auto_start: false,
      grounded_mode: false,
      native_skills: [],
      custom_functions: [],
      data_interface: { context: [], artefacts: [] },
      created_at: "2026-01-13T09:00:00Z",
      updated_at: "2026-02-21T10:00:00Z",
    },
  ],
  "ws-design": [
    {
      id: "a-ui-designer",
      agent_name: "UI Designer",
      agent_role_text: "Visual Design Lead",
      agent_goal: "Create beautiful, accessible, and consistent UI designs.",
      agent_backstory: "Design systems architect who built Shopify Polaris v3. Expert in Figma and accessibility.",
      guardrails: { instructions: ["Follow design system tokens", "WCAG AA compliance"], constraints: ["No custom colors outside palette"] },
      few_shot_examples: [],
      reflexion: false,
      temperature: 0.8,
      rag_enforcement: false,
      input_schema: { brand_guidelines: "json", figma_tokens: "json" },
      output_schema: { component_spec: "json", design_tokens: "json" },
      knowledge_hub_ids: ["123e4567-e89b-12d3-a456-426614174030"],
      llm_model_id: "123e4567-e89b-12d3-a456-426614174001",
      availability_workspace: ["ws-design"],
      agent_keywords: ["ui", "design", "figma", "accessibility"],
      auto_start: false,
      grounded_mode: false,
      native_skills: [],
      custom_functions: [],
      data_interface: { context: [], artefacts: [] },
      created_at: "2026-01-15T09:00:00Z",
      updated_at: "2026-02-22T10:00:00Z",
    },
  ],
  "ws-delivery": [
    {
      id: "a-developer",
      agent_name: "Full-Stack Developer",
      agent_role_text: "Implementation Lead",
      agent_goal: "Implement features based on specs with clean, tested code.",
      agent_backstory: "Senior engineer specializing in Next.js 15, FastAPI, and PostgreSQL. Strong advocate of DDD.",
      guardrails: { instructions: ["Follow DDD patterns", "Write tests first"], constraints: ["No any types", "Max 500 LOC per file"] },
      few_shot_examples: [],
      reflexion: true,
      temperature: 0.3,
      rag_enforcement: true,
      input_schema: { feature_spec: "markdown", acceptance_criteria: "json", design_tokens: "json" },
      output_schema: { source_code: "string", test_suite: "string", migration_files: "string" },
      knowledge_hub_ids: ["123e4567-e89b-12d3-a456-426614174030", "123e4567-e89b-12d3-a456-426614174030"],
      llm_model_id: "123e4567-e89b-12d3-a456-426614174000",
      availability_workspace: ["ws-delivery"],
      agent_keywords: ["coding", "typescript", "python", "testing"],
      auto_start: false,
      grounded_mode: false,
      native_skills: [],
      custom_functions: [],
      data_interface: { context: [], artefacts: [] },
      created_at: "2026-01-18T09:00:00Z",
      updated_at: "2026-02-24T08:00:00Z",
    },
    {
      id: "a-qa-engineer",
      agent_name: "QA Engineer",
      agent_role_text: "Quality Assurance",
      agent_goal: "Ensure software quality through systematic testing strategies.",
      agent_backstory: "Test automation expert. Built CI pipelines for 50+ microservices at Stripe.",
      guardrails: { instructions: ["Cover happy path + edge cases", "Include regression checks"], constraints: ["No manual-only tests"] },
      few_shot_examples: [],
      reflexion: false,
      temperature: 0.3,
      rag_enforcement: false,
      input_schema: { source_code: "string", test_plan: "json" },
      output_schema: { test_results: "json", coverage_report: "json", bug_report: "markdown" },
      knowledge_hub_ids: ["123e4567-e89b-12d3-a456-426614174030"],
      llm_model_id: "123e4567-e89b-12d3-a456-426614174002",
      availability_workspace: ["ws-delivery"],
      agent_keywords: ["qa", "testing", "automation", "ci"],
      auto_start: false,
      grounded_mode: false,
      native_skills: [],
      custom_functions: [],
      data_interface: { context: [], artefacts: [] },
      created_at: "2026-01-19T09:00:00Z",
      updated_at: "2026-02-23T10:00:00Z",
    },
  ],
  "ws-growth": [
    {
      id: "a-copywriter",
      agent_name: "Copywriter",
      agent_role_text: "Content & Copy Lead",
      agent_goal: "Write compelling copy that converts visitors into users.",
      agent_backstory: "Former head of content at Buffer. Expert in AIDA framework and SEO copywriting.",
      guardrails: { instructions: ["Use AIDA framework", "Max 8th-grade reading level"], constraints: ["No clickbait", "No false claims"] },
      few_shot_examples: [],
      reflexion: false,
      temperature: 0.9,
      rag_enforcement: false,
      input_schema: { brand_voice: "string", target_audience: "json", campaign_brief: "markdown" },
      output_schema: { ad_copy: "string", landing_page_copy: "markdown", social_posts: "json" },
      knowledge_hub_ids: ["123e4567-e89b-12d3-a456-426614174030", "123e4567-e89b-12d3-a456-426614174030"],
      llm_model_id: "123e4567-e89b-12d3-a456-426614174001",
      availability_workspace: ["ws-growth"],
      agent_keywords: ["copy", "marketing", "content", "seo"],
      auto_start: false,
      grounded_mode: false,
      native_skills: [],
      custom_functions: [],
      data_interface: { context: [], artefacts: [] },
      created_at: "2026-01-20T09:00:00Z",
      updated_at: "2026-02-20T10:00:00Z",
    },
  ],
};

const MOCK_CREWS: Record<string, Crew[]> = {
  "ws-product": [
    {
      id: "c-prd-crew",
      crew_name: "PRD Production Crew",
      crew_description: "Creates comprehensive Product Requirements Documents from discovery insights.",
      crew_process_type: "Sequential",
      agent_member_ids: ["123e4567-e89b-12d3-a456-426614174020", "a-tech-writer", "a-user-researcher", "a-competitor-analyst", "a-ui-designer"],
      availability_workspace: ["ws-product"],
      crew_keywords: ["prd", "writing", "strategy"],
      metadata: {},
      created_at: "2026-01-15T09:00:00Z",
      updated_at: "2026-02-20T12:00:00Z",
    },
  ],
  "ws-discovery": [
    {
      id: "c-research-crew",
      crew_name: "Research & Analysis Crew",
      crew_description: "Runs user research and competitive analysis in parallel.",
      crew_process_type: "Parallel",
      agent_member_ids: ["a-user-researcher", "a-competitor-analyst"],
      availability_workspace: ["ws-discovery"],
      crew_keywords: ["research", "analysis", "market"],
      metadata: {},
      created_at: "2026-01-16T09:00:00Z",
      updated_at: "2026-02-21T10:00:00Z",
    },
  ],
  "ws-design": [],
  "ws-delivery": [
    {
      id: "c-dev-crew",
      crew_name: "Feature Delivery Crew",
      crew_description: "Implements and tests features end-to-end based on technical specs.",
      crew_process_type: "Sequential",
      agent_member_ids: ["a-developer", "a-qa-engineer"],
      availability_workspace: ["ws-delivery"],
      crew_keywords: ["delivery", "implementation", "qa"],
      metadata: {},
      created_at: "2026-01-20T09:00:00Z",
      updated_at: "2026-02-24T08:00:00Z",
    },
  ],
  "ws-growth": [],
};

const MOCK_PATTERNS: Record<string, Pattern[]> = {
  "ws-product": [
    {
      id: "p-prd-flow",
      pattern_name: "PRD Creation Flow",
      pattern_okr_context: "Achieve 100% PRD coverage for core features in Q1.",
      pattern_graph_structure: {
        nodes: { 1: "Input", 2: "Analysis", 3: "Writing", 4: "Output" },
        edges: { "1-2": "flows to", "2-3": "flows to", "3-4": "completes" },
        components: ["t-prd-template", "c-prd-crew"]
      },
      pattern_inputs: { user_research_summary: "json", market_segment: "string" },
      pattern_outputs: { prd_document: "markdown", priority_matrix: "json" },
      pattern_keywords: ["prd", "flow", "product", "standard"],
      availability_workspace: ["ws-product", "ws-discovery"],
      created_at: "2026-01-20T09:00:00Z",
      updated_at: "2026-02-18T10:00:00Z",
    },
  ],
  "ws-discovery": [
    {
      id: "p-research-flow",
      pattern_name: "Discovery Research Pipeline",
      pattern_okr_context: "User understanding OKR",
      pattern_graph_structure: { nodes: 6, edges: 5 },
      pattern_inputs: {},
      pattern_outputs: {},
      pattern_keywords: ["research", "discovery"],
      availability_workspace: ["ws-discovery"],
      created_at: "2026-01-22T09:00:00Z",
      updated_at: "2026-02-19T10:00:00Z",
    },
  ],
  "ws-design": [
    {
      id: "p-design-audit",
      pattern_name: "Design System Audit",
      pattern_okr_context: "Design quality OKR",
      pattern_graph_structure: { nodes: 3, edges: 2 },
      pattern_inputs: {},
      pattern_outputs: {},
      pattern_keywords: ["design", "audit", "system"],
      availability_workspace: ["ws-design"],
      created_at: "2026-01-25T09:00:00Z",
      updated_at: "2026-02-22T10:00:00Z",
    },
  ],
  "ws-delivery": [],
  "ws-growth": [
    {
      id: "p-launch-campaign",
      pattern_name: "Product Launch Campaign",
      pattern_okr_context: "Growth OKR",
      pattern_graph_structure: { nodes: 5, edges: 4 },
      pattern_inputs: {},
      pattern_outputs: {},
      pattern_keywords: ["launch", "campaign", "marketing"],
      availability_workspace: ["ws-growth"],
      created_at: "2026-01-28T09:00:00Z",
      updated_at: "2026-02-20T10:00:00Z",
    },
  ],
};

const MOCK_TEMPLATES: Record<string, Template[]> = {
  "ws-product": [
    {
      id: "t-prd-template",
      template_name: "PRD Template",
      template_description: "Standard Product Requirements Document with user stories and acceptance criteria.",
      template_markdown_content: "# Product Requirements Document\n\n## Problem Statement\n\n## User Stories\n\n## Acceptance Criteria\n\n## Success Metrics",
      template_checklist_items: [
        { 
          id: "c1", 
          label: "Define problem statement", 
          isCompleted: true,
          subactions: [
            { id: "s1", label: "Analyze user pain points", isCompleted: true },
            { id: "s2", label: "Define core objective", isCompleted: true }
          ]
        },
        { id: "c2", label: "Write user stories", isCompleted: false },
        { id: "c3", label: "Define acceptance criteria", isCompleted: false },
        { id: "c4", label: "Set success metrics", isCompleted: false },
      ],
      template_inputs: [
        { id: "ctx-research", label: "user_research_report", expectedType: "file" as const, isRequired: true },
        { id: "ctx-competitors", label: "competitor_analysis", expectedType: "json" as const, isRequired: true },
      ],
      template_outputs: [
        { id: "art-prd", label: "prd_document", outputType: "text" as const, isRequired: true },
      ],
      template_keywords: ["prd", "requirements", "product"],
      availability_workspace: ["ws-product"],
      created_at: "2026-01-15T09:00:00Z",
      updated_at: "2026-02-20T12:00:00Z",
    },
  ],
  "ws-discovery": [
    {
      id: "t-comp-analysis",
      template_name: "Analiza Konkurencji",
      template_description: "Kompleksowa analiza otoczenia rynkowego i konkurentów.",
      template_markdown_content: "# Analiza Konkurencji\n\n## Cel Analizy\nZidentyfikowanie przewag konkurencyjnych oraz luk rynkowych.\n\n## Zakres\n- Analiza produktowa\n- Model biznesowy\n- Strategia marketingowa",
      template_checklist_items: [
        { id: "c1", label: "Zidentyfikuj Top 3 konkurentów", isCompleted: true },
        { id: "c2", label: "Przeanalizuj cenniki", isCompleted: false },
        { id: "c3", label: "Zrób analizę SWOT", isCompleted: false },
      ],
      template_inputs: [
        { id: "ctx-brand", label: "brand_guidelines", expectedType: "link" as const, isRequired: true },
        { id: "ctx-persona", label: "persona", expectedType: "text" as const, isRequired: true },
      ],
      template_outputs: [
        { id: "art-comp-list", label: "competitors_list", outputType: "file" as const, isRequired: true },
        { id: "art-bench", label: "benchmark_link", outputType: "link" as const, isRequired: true },
      ],
      template_keywords: ["research", "marketing", "strategy"],
      availability_workspace: ["ws-design", "ws-discovery"],
      created_at: "2026-02-01T10:00:00Z",
      updated_at: "2026-02-24T12:00:00Z",
    },
    {
      id: "t-research-report",
      template_name: "Research Report",
      template_description: "Structured user research findings with insights and recommendations.",
      template_markdown_content: "# Research Report\n\n## Methodology\n\n## Key Findings\n\n## Insights\n\n## Recommendations",
      template_checklist_items: [
        { id: "c1", label: "Document methodology", isCompleted: false },
        { id: "c2", label: "Compile findings", isCompleted: false },
      ],
      template_inputs: [
        { id: "input-interviews", label: "interview_transcripts", expectedType: "file" as const, isRequired: true },
      ],
      template_outputs: [
        { id: "output-report", label: "research_report", outputType: "file" as const, isRequired: true },
      ],
      template_keywords: ["research", "ux", "findings"],
      availability_workspace: ["ws-discovery"],
      created_at: "2026-01-16T09:00:00Z",
      updated_at: "2026-02-21T10:00:00Z",
    },
  ],
  "ws-design": [],
  "ws-delivery": [
    {
      id: "t-sprint-retro",
      template_name: "Sprint Retrospective",
      template_description: "Structure for sprint reviews and feedback loops.",
      template_markdown_content: "# Sprint Retrospective\n\n## What went well?\n\n## What could be improved?\n\n## Action Items",
      template_checklist_items: [
        { id: "c1", label: "Post-it collection", isCompleted: true },
        { id: "c2", label: "Action points definition", isCompleted: false },
      ],
      template_inputs: [
        { id: "input-jira", label: "jira_sprint_report", expectedType: "link" as const, isRequired: true },
      ],
      template_outputs: [
        { id: "output-actions", label: "retrospective_actions", outputType: "text" as const, isRequired: true },
      ],
      template_keywords: ["agile", "delivery", "team"],
      availability_workspace: ["ws-delivery"],
      created_at: "2026-01-25T09:00:00Z",
      updated_at: "2026-02-23T10:00:00Z",
    },
  ],
  "ws-growth": [
    {
      id: "t-campaign-brief",
      template_name: "Campaign Brief",
      template_description: "Marketing campaign planning template with channels, budget, and KPIs.",
      template_markdown_content: "# Campaign Brief\n\n## Objective\n\n## Target Audience\n\n## Channels\n\n## Budget\n\n## KPIs",
      template_checklist_items: [
        { id: "c1", label: "Define objective", isCompleted: false },
        { id: "c2", label: "Identify target audience", isCompleted: false },
      ],
      template_inputs: [
        { id: "input-brand", label: "brand_guidelines", expectedType: "link" as const, isRequired: true },
      ],
      template_outputs: [
        { id: "output-brief", label: "campaign_brief", outputType: "file" as const, isRequired: true },
      ],
      template_keywords: ["campaign", "marketing", "growth"],
      availability_workspace: ["ws-growth"],
      created_at: "2026-01-28T09:00:00Z",
      updated_at: "2026-02-20T10:00:00Z",
    },
  ],
};

const MOCK_SERVICES: Record<string, Service[]> = {
  "ws-product": [],
  "ws-discovery": [],
  "ws-design": [
    {
      id: "s-figma",
      service_name: "Figma",
      service_description: "Design and prototyping platform.",
      service_category: "Utility" as any,
      service_url: "https://figma.com",
      service_keywords: ["design", "ui"],
      capabilities: [{ capability_name: "Prototyping", capability_description: "Design prototyping" }],
      availability_workspace: ["ws-design"],
      created_at: "2026-01-20T09:00:00Z",
      updated_at: "2026-02-22T10:00:00Z",
    },
  ],
  "ws-delivery": [
    {
      id: "s-github",
      service_name: "GitHub",
      service_description: "Code hosting and collaboration platform.",
      service_category: "Utility" as any,
      service_url: "https://github.com",
      service_keywords: ["git", "code"],
      capabilities: [{ capability_name: "CI/CD", capability_description: "Deployment" }],
      availability_workspace: ["ws-delivery"],
      created_at: "2026-01-22T09:00:00Z",
      updated_at: "2026-02-23T10:00:00Z",
    },
  ],
  "ws-growth": [
    {
      id: "s-elevenlabs",
      service_name: "ElevenLabs",
      service_description: "AI voice generation platform for podcasts and video.",
      service_category: "GenAI" as any,
      service_url: "https://elevenlabs.io",
      service_keywords: ["voice", "ai"],
      capabilities: [{ capability_name: "TTS", capability_description: "Text to speech" }],
      availability_workspace: ["ws-growth"],
      created_at: "2026-01-25T09:00:00Z",
      updated_at: "2026-02-20T10:00:00Z",
    },
  ],
};

const MOCK_AUTOMATIONS: Record<string, Automation[]> = {
  "ws-product": [],
  "ws-discovery": [],
  "ws-design": [],
  "ws-delivery": [
    {
      id: "auto-deploy",
      automation_name: "Deploy Pipeline",
      automation_description: "Triggers production deployment via n8n webhook.",
      automation_platform: "n8n",
      automation_status: "Active" as const,
      automation_webhook_url: "https://n8n.axon.ai/webhook/deploy",
      automation_http_method: "POST",
      automation_keywords: ["deploy", "ci-cd", "production"],
      automation_validation_status: "Valid",
      availability_workspace: ["ws-delivery"],
      created_at: "2026-01-28T09:00:00Z",
      updated_at: "2026-02-24T08:00:00Z",
    },
  ],
  "ws-growth": [
    {
      id: "auto-social",
      automation_name: "Social Media Publisher",
      automation_description: "Publishes approved content to social media channels.",
      automation_platform: "Zapier",
      automation_status: "Active" as const,
      automation_webhook_url: "https://hooks.zapier.com/v1/event",
      automation_http_method: "POST",
      automation_keywords: ["social", "marketing", "autopilot"],
      automation_validation_status: "Valid",
      availability_workspace: ["ws-growth"],
      created_at: "2026-02-01T09:00:00Z",
      updated_at: "2026-02-20T10:00:00Z",
    },
  ],
};

// --- Mock Functions ---

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  getWorkspaces: async (limit: number = 100, offset: number = 0): Promise<Workspace[]> => {
    return MOCK_WORKSPACES.slice(offset, offset + limit);
  },

  getWorkspace: async (id: string): Promise<Workspace | null> => {
    await delay(400);
    return MOCK_WORKSPACES.find((workspace) => workspace.id === id) || null;
  },

  getAgents: async (workspaceId: string, limit: number = 100, offset: number = 0): Promise<Agent[]> => {
    await delay(500);
    const items = MOCK_AGENTS[workspaceId] ?? [];
    return items.slice(offset, offset + limit);
  },

  getAgent: async (id: string): Promise<Agent | null> => {
    await delay(300);
    for (const workspaceId in MOCK_AGENTS) {
      const agent = MOCK_AGENTS[workspaceId].find(a => a.id === id);
      if (agent) return agent;
    }
    return null;
  },

  getCrews: async (workspaceId: string, limit: number = 100, offset: number = 0): Promise<Crew[]> => {
    await delay(500);
    const items = MOCK_CREWS[workspaceId] ?? [];
    return items.slice(offset, offset + limit);
  },

  getCrew: async (id: string): Promise<Crew | null> => {
    await delay(300);
    for (const workspaceId in MOCK_CREWS) {
      const crew = MOCK_CREWS[workspaceId].find(c => c.id === id);
      if (crew) return crew;
    }
    return null;
  },

  getPatterns: async (workspaceId: string, limit: number = 100, offset: number = 0): Promise<Pattern[]> => {
    await delay(300);
    const items = MOCK_PATTERNS[workspaceId] ?? [];
    return items.slice(offset, offset + limit);
  },

  getTemplates: async (workspaceId: string, limit: number = 100, offset: number = 0): Promise<Template[]> => {
    await delay(300);
    const items = MOCK_TEMPLATES[workspaceId] ?? [];
    return items.slice(offset, offset + limit);
  },

  getTemplate: async (id: string): Promise<Template | null> => {
    await delay(300);
    for (const workspaceId in MOCK_TEMPLATES) {
      const template = MOCK_TEMPLATES[workspaceId].find(t => t.id === id);
      if (template) return template;
    }
    return null;
  },

  getServices: async (workspaceId: string, limit: number = 100, offset: number = 0): Promise<Service[]> => {
    await delay(300);
    const items = MOCK_SERVICES[workspaceId] ?? [];
    return items.slice(offset, offset + limit);
  },

  getService: async (id: string): Promise<Service | null> => {
    await delay(300);
    for (const workspaceId in MOCK_SERVICES) {
      const service = MOCK_SERVICES[workspaceId].find(s => s.id === id);
      if (service) return service;
    }
    return null;
  },

  getAutomations: async (workspaceId: string, limit: number = 100, offset: number = 0): Promise<Automation[]> => {
    await delay(300);
    const items = MOCK_AUTOMATIONS[workspaceId] ?? [];
    return items.slice(offset, offset + limit);
  },

  getAutomation: async (id: string): Promise<Automation | null> => {
    await delay(300);
    for (const workspaceId in MOCK_AUTOMATIONS) {
      const automation = MOCK_AUTOMATIONS[workspaceId].find(a => a.id === id);
      if (automation) return automation;
    }
    return null;
  }
};
