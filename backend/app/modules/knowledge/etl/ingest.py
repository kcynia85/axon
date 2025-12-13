import glob
from pathlib import Path
import asyncio
from backend.app.shared.infrastructure.database import AsyncSessionLocal
from backend.app.modules.knowledge.domain.models import Asset
from backend.app.modules.knowledge.infrastructure.repo import AssetRepository
# Placeholder for embedding service - in real impl, inject this
def mock_embed(text: str):
    return [0.1] * 768

async def ingest_knowledge(docs_path: str = "docs/axon-context"):
    async with AsyncSessionLocal() as session:
        repo = AssetRepository(session)
        
        # Router Pattern Logic (Simplified)
        files = glob.glob(f"{docs_path}/**/*.md", recursive=True)
        
        for file_path in files:
            path = Path(file_path)
            content = path.read_text()
            filename = path.name
            
            # Classification
            if "Template" in filename or "SOP" in filename or "Checklist" in filename:
                # Path B: Asset
                slug = filename.lower().replace(" ", "-").replace(".md", "")
                
                # Check if exists
                existing = await repo.get_by_slug(slug)
                if existing:
                    print(f"Skipping existing asset: {slug}")
                    continue

                asset = Asset(
                    slug=slug,
                    title=filename.replace(".md", ""),
                    content=content,
                    type="template" if "Template" in filename else "sop",
                    domain="general", # Should infer from folder structure
                    metadata={"source_path": file_path}
                )
                embedding = mock_embed(asset.title) # Embed title only for assets
                await repo.create(asset, embedding)
                print(f"Ingested Asset: {slug}")
            else:
                # Path A: Wisdom (Chunking & Vector Store)
                # In real impl: chunk text -> embed -> store in vecs
                pass

if __name__ == "__main__":
    asyncio.run(ingest_knowledge())
