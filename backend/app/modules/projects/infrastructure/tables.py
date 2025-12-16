from sqlalchemy import Column, String, ForeignKey, DateTime, Enum as SAEnum, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from backend.app.modules.projects.domain.enums import HubType, Status, FileType, ReviewState
from backend.app.shared.utils.time import now_utc
from backend.app.shared.infrastructure.base import Base

class ProjectTable(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    domain = Column(SAEnum(HubType), nullable=False)
    status = Column(SAEnum(Status), default=Status.IDEA, nullable=False)
    owner_id = Column(UUID(as_uuid=True), nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True) # Soft Delete
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)

    # Async compatibility: lazy="selectin"
    artifacts = relationship("ArtifactTable", back_populates="project", cascade="all, delete-orphan", lazy="selectin")

class ArtifactTable(Base):
    __tablename__ = "artifacts"

    id = Column(UUID(as_uuid=True), primary_key=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    title = Column(String, nullable=False)
    type = Column(SAEnum(FileType), nullable=False)
    content = Column(String, nullable=False)
    status = Column(SAEnum(ReviewState), default=ReviewState.DRAFT, nullable=False)
    metadata_ = Column("metadata", JSONB, default={}) # 'metadata' is reserved in SQLAlchemy Base
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)

    project = relationship("ProjectTable", back_populates="artifacts")

    __table_args__ = (
        Index("idx_artifacts_metadata", "metadata", postgresql_using="gin"),
    )

class ScenarioTable(Base):
    __tablename__ = "scenarios"

    id = Column(UUID(as_uuid=True), primary_key=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, nullable=False)
    prompt_template = Column(String, nullable=False)
    icon = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)
