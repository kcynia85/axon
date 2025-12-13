from sqlalchemy import Column, String, ForeignKey, DateTime, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship, declarative_base
from backend.app.modules.projects.domain.enums import HubType, Status, FileType, ReviewState
from backend.app.shared.utils.time import now_utc

Base = declarative_base()

class ProjectTable(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    domain = Column(SAEnum(HubType), nullable=False)
    status = Column(SAEnum(Status), default=Status.IDEA, nullable=False)
    owner_id = Column(UUID(as_uuid=True), nullable=False)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)

    artifacts = relationship("ArtifactTable", back_populates="project", cascade="all, delete-orphan")

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
