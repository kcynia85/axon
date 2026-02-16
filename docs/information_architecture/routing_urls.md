/                                    → Dashboard
/projects                            → Projects List
/projects/:id                        → Project Detail (Overview tab default)
/projects/:id?tab=artifacts          → Project Detail (Artifacts tab)
/spaces                              → Spaces Overview
/spaces/:id                          → Canvas View
/workspaces                          → Workspaces Overview
/workspaces/:workspace               → Workspace Detail (e.g., /workspaces/discovery)
/workspaces/:workspace/agents        → Agents List (filtered)
/workspaces/:workspace/agents/:id    → Agent Detail (Side Peek or Full Page)
/resources/knowledge                 → Knowledge Hubs List
/resources/knowledge/:hubId          → Hub Detail
/resources/knowledge/:hubId/:sourceId → Source Detail
/resources/prompts                   → Archetypes List
/resources/automations               → Automations List
/resources/services                  → Services List
/resources/tools                     → Tools List
/inbox                               → Inbox List
/settings                            → Settings Home
/settings/llms/providers             → Providers List
/settings/llms/models                → Model Registry
/settings/llms/routers               → Routers List
/settings/knowledge-engine/embedding → Embedding Models
/settings/knowledge-engine/chunking  → Chunking Strategies
/settings/knowledge-engine/vectors   → Vector Databases

Query Parameters:

?tab=artifacts                       → Tab selection
?filter[workspace]=discovery         → Filter state
?filter[status]=in_progress          → Filter state
?sort=name_asc                       → Sort state
?search=customer                     → Search term
?modal=new                           → Open modal on load