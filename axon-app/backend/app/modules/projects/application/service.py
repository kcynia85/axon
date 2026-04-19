from uuid import UUID
from typing import List
from fastapi import HTTPException

from app.modules.projects.infrastructure.repo import ProjectRepository
from app.modules.projects.domain.models import Project, KeyResource, Artifact
from app.modules.projects.application.schemas import (
    ProjectCreateDTO, 
    ProjectUpdateDTO,
    ResourceCreateDTO,
    ArtifactCreateDTO
)
from app.shared.security.schemas import UserPayload
from app.modules.spaces.infrastructure.repo import SpaceRepository
from app.modules.projects.domain.enums import ApprovalStatus

# Function-First Service Layer (Decoupled from FastAPI Depends)

async def create_project_use_case(
    command: ProjectCreateDTO,
    user: UserPayload,
    repository: ProjectRepository
) -> Project:
    new_project = Project(
        project_name=command.project_name,
        project_status=command.project_status,
        project_summary=command.project_summary,
        project_keywords=command.project_keywords,
        project_strategy_url=command.project_strategy_url,
        space_ids=command.space_ids,
        owner_id=user.sub
    )
    return await repository.create(new_project)

async def list_projects_use_case(
    limit: int,
    offset: int,
    user: UserPayload,
    repository: ProjectRepository,
    space_repository: SpaceRepository = None
) -> List[Project]:
    projects = await repository.list_by_user(user.sub, limit=limit, offset=offset)
    
    # If we have space repository, enrich projects with aggregated artifact counts
    if space_repository:
        for project in projects:
            # We already have static artifacts count
            static_count = len(project.artifacts)
            dynamic_count = 0
            
            # Fetch spaces for this project to count artifacts in canvas
            spaces = await space_repository.list_by_project(project.id)
            for space in spaces:
                canvas_data = space.canvas_data or {}
                nodes = canvas_data.get("nodes", [])
                for node in nodes:
                    node_data = node.get("data", {})
                    # Same logic as list_artifacts_use_case to identify real artifacts
                    artefacts_raw = node_data.get("artefacts") or node_data.get("data_interface", {}).get("artefacts")
                    if artefacts_raw and isinstance(artefacts_raw, list):
                        for art in artefacts_raw:
                            if art.get("deliverable_url") or art.get("artifact_deliverable_url") or art.get("link"):
                                dynamic_count += 1
            
            # Update the officially defined field in the model
            project.aggregated_artifacts_count = static_count + dynamic_count
            
    return projects

async def get_project_use_case(
    project_id: UUID,
    user: UserPayload,
    repository: ProjectRepository
) -> Project:
    project = await repository.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project.owner_id != user.sub:
         raise HTTPException(status_code=403, detail="Not authorized")
         
    return project

async def update_project_use_case(
    project_id: UUID,
    command: ProjectUpdateDTO,
    user: UserPayload,
    repository: ProjectRepository
) -> Project:
    # Check existence & auth
    await get_project_use_case(project_id, user, repository)
    
    return await repository.update(project_id, command.model_dump(exclude_unset=True))

async def delete_project_use_case(
    project_id: UUID,
    user: UserPayload,
    repository: ProjectRepository
) -> dict:
    await get_project_use_case(project_id, user, repository)
    await repository.delete(project_id)
    return {"message": "Project deleted"}

async def add_key_resource_use_case(
    project_id: UUID,
    command: ResourceCreateDTO,
    user: UserPayload,
    repository: ProjectRepository
) -> KeyResource:
    await get_project_use_case(project_id, user, repository)
    
    resource = KeyResource(
        project_id=project_id,
        **command.model_dump()
    )
    return await repository.add_resource(resource)

async def add_artifact_use_case(
    project_id: UUID,
    command: ArtifactCreateDTO,
    user: UserPayload,
    repository: ProjectRepository
) -> Artifact:
    await get_project_use_case(project_id, user, repository)
    
    artifact = Artifact(
        project_id=project_id,
        **command.model_dump()
    )
    return await repository.add_artifact(artifact)

async def list_artifacts_use_case(
    project_id: UUID,
    user: UserPayload,
    repository: ProjectRepository,
    space_repository: SpaceRepository = None
) -> List[Artifact]:
    project = await get_project_use_case(project_id, user, repository)
    
    # Start with explicit artifacts from project table
    all_artifacts = list(project.artifacts)
    
    # Aggregate artifacts from spaces
    if space_repository:
        spaces = await space_repository.list_by_project(project_id)
        for space in spaces:
            canvas_data = space.canvas_data or {}
            nodes = canvas_data.get("nodes", [])
            
            # 1. Build a map of zone labels for path construction
            zone_map = {}
            for node in nodes:
                if node.get("type") == "zone":
                    zone_id = node.get("id")
                    zone_label = node.get("data", {}).get("label") or node.get("data", {}).get("zoneColor") or "General"
                    zone_map[zone_id] = zone_label.upper()

            # 2. Extract artifacts from component nodes
            for node in nodes:
                node_type = node.get("type")
                if node_type in ["zone", "note"]: continue # Skip non-component nodes

                node_data = node.get("data", {})
                node_label = node.get("node_label") or node_data.get("label") or node_data.get("crew_name") or node_data.get("agent_name") or "node"

                # Determine zone label
                parent_id = node.get("parentId")
                zone_name = zone_map.get(parent_id) or node_data.get("zoneColor", "GENERAL").upper()

                # Check for artefacts
                artefacts_raw = node_data.get("artefacts") or node_data.get("data_interface", {}).get("artefacts")
                
                if artefacts_raw and isinstance(artefacts_raw, list):
                    for art in artefacts_raw:
                        # CRITICAL: Only include items that have a link/deliverable_url.
                        # Filter out interface definitions (value=null, link missing, etc.)
                        artifact_url = art.get("deliverable_url") or art.get("artifact_deliverable_url") or art.get("link")
                        if not artifact_url:
                            continue

                        try:
                            artifact_name = art.get("name") or art.get("artifact_name") or art.get("label") or "Unnamed"
                            
                            # Requested structure: [zone]/[node]/[name_artefact]
                            artifact_path = f"{zone_name}/{node_label}/{artifact_name}"
                            
                            # Standardize status to match enum
                            raw_status = (art.get("status") or "").lower().replace("_", "")
                            status = ApprovalStatus.DRAFT
                            if "review" in raw_status:
                                status = ApprovalStatus.IN_REVIEW
                            elif "approve" in raw_status:
                                status = ApprovalStatus.APPROVED

                            # Generate deterministic UUID based on artifact name and node ID if missing
                            artifact_id = project_id
                            if "id" in art:
                                try:
                                    artifact_id = UUID(str(art["id"]))
                                except ValueError:
                                    pass

                            all_artifacts.append(Artifact(
                                id=artifact_id,
                                artifact_name=artifact_name,
                                artifact_source_path=artifact_path,
                                artifact_deliverable_url=str(artifact_url),
                                workspace_domain=zone_name,
                                artifact_approval_status=status,
                                project_id=project_id,
                                space_id=space.id,
                                node_id=node.get("id"),
                                created_at=project.created_at,
                                updated_at=project.updated_at
                            ))
                        except Exception as e:
                            print(f"Skipping artifact in space {space.id} node {node.get('id')}: {e}")

    return all_artifacts
