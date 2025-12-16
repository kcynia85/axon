from sqlalchemy import Column, String, DateTime, Boolean, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from pgvector.sqlalchemy import Vector
from backend.app.shared.utils.time import now_utc
from backend.app.shared.infrastructure.base import Base

class AssetTable(Base):
    __tablename__ = "assets"

    id = Column(UUID(as_uuid=True), primary_key=True)
    slug = Column(String, unique=True, nullable=False, index=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    type = Column(String, nullable=False)
    domain = Column(String, nullable=False)
    metadata_ = Column("metadata", JSONB, default={})
    description_embedding = Column(Vector(768))
    is_deleted = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)

    __table_args__ = (
        Index("idx_assets_metadata", "metadata", postgresql_using="gin"),
        Index("idx_assets_embedding", "description_embedding", postgresql_using="hnsw", postgresql_ops={"description_embedding": "vector_cosine_ops"}),
    )
