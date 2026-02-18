from sqlalchemy import Column, String, ForeignKey, DateTime, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from backend.app.shared.infrastructure.base import Base
from backend.app.shared.utils.time import now_utc
from backend.app.modules.projects.domain.enums import ProjectStatus, ResourceProvider, ApprovalStatus

class ProjectTable(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True)
    project_name = Column(String, nullable=False)
    project_status = Column(SAEnum(ProjectStatus), default=ProjectStatus.IDEA, nullable=False)
    project_summary = Column(String, nullable=True)
    project_keywords = Column(JSONB, default=[])
    project_strategy_url = Column(String, nullable=True)
    space_id = Column(UUID(as_uuid=True), ForeignKey("spaces.id"), nullable=True)
    owner_id = Column(UUID(as_uuid=True), nullable=False)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)

    # Relationships
    key_resources = relationship("KeyResourceTable", back_populates="project", cascade="all, delete-orphan")
    artifacts = relationship("ArtifactTable", back_populates="project", cascade="all, delete-orphan")
    # space relationship defined in spaces module or implicit

    __table_args__ = (
        {"extend_existing": True}, # For migration safety if table exists
    )

class KeyResourceTable(Base):
    __tablename__ = "project_key_resources"

    id = Column(UUID(as_uuid=True), primary_key=True)
    resource_provider_type = Column(SAEnum(ResourceProvider), nullable=False)
    resource_label = Column(String, nullable=False)
    resource_url = Column(String, nullable=False)
    resource_icon = Column(String, nullable=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)

    project = relationship("ProjectTable", back_populates="key_resources")

class ArtifactTable(Base):
    __tablename__ = "project_artifacts"

    id = Column(UUID(as_uuid=True), primary_key=True)
    artifact_name = Column(String, nullable=False)
    artifact_source_path = Column(String, nullable=False)
    artifact_deliverable_url = Column(String, nullable=False)
    workspace_domain = Column(String, nullable=True)
    artifact_approval_status = Column(SAEnum(ApprovalStatus), default=ApprovalStatus.DRAFT, nullable=False)
    approved_by_user_id = Column(UUID(as_uuid=True), nullable=True)
    artifact_approved_at = Column(DateTime(timezone=True), nullable=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)

    project = relationship("ProjectTable", back_populates="artifacts")
    # Note: Renamed table from 'artifacts' to 'project_artifacts' to align with CM and avoid conflicts
    # Migration will handle data move or table rename.
