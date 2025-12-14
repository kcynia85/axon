import glob
from pathlib import Path
import asyncio
from uuid import uuid4
from typing import List

from backend.app.shared.infrastructure.database import AsyncSessionLocal
from backend.app.shared.infrastructure.adk import GoogleADK
from backend.app.modules.knowledge.domain.models import Asset
from backend.app.modules.knowledge.infrastructure.repo import AssetRepository, KnowledgeVectorStore

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
    chunks = []
    start = 0
    if not text:
        return []
    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunks.append(text[start:end])
        if end == len(text):
            break
        start += chunk_size - overlap
    return chunks

async def ingest_knowledge(docs_path: str = "docs/axon-context"):
    print(f"Starting ingestion from: {docs_path}")
    
    # Initialize services
    vector_store = KnowledgeVectorStore()
    
    async with AsyncSessionLocal() as session:
        repo = AssetRepository(session)
        
        # Router Pattern Logic
        files = glob.glob(f"{docs_path}/**/*.md", recursive=True)
        print(f"Found {len(files)} files.")
        
        for file_path in files:
            path = Path(file_path)
            try:
                content = path.read_text()
            except Exception as e:
                print(f"Error reading {file_path}: {e}")
                continue
                
            filename = path.name
            
            # Classification
            if "Template" in filename or "SOP" in filename or "Checklist" in filename:
                # Path B: Asset (Full Document)
                slug = filename.lower().replace(" ", "-").replace(".md", "")
                
                # Check if exists (Idempotency)
                existing = await repo.get_by_slug(slug)
                if existing:
                    print(f"Skipping existing Asset: {slug}")
                    continue

                asset = Asset(
                    slug=slug,
                    title=filename.replace(".md", ""),
                    content=content,
                    type="template" if "Template" in filename in filename else "sop",
                    domain="general", 
                    metadata={"source_path": file_path}
                )
                
                # Embed Title for Asset Search
                embedding = await GoogleADK.get_embeddings(asset.title)
                await repo.create(asset, embedding)
                print(f"Ingested Asset: {slug}")
                
            else:
                # Path A: Wisdom (Chunking & Vector Store)
                print(f"Processing Wisdom: {filename}")
                chunks = chunk_text(content)
                records = []
                
                for i, chunk in enumerate(chunks):
                    # Embed Chunk
                    embedding = await GoogleADK.get_embeddings(chunk)
                    
                    records.append((
                        str(uuid4()),       # ID
                        embedding,          # Vector
                        {                   # Metadata
                            "source": filename,
                            "chunk_index": i,
                            "content": chunk,
                            "path": file_path
                        }
                    ))
                
                # Upsert to Vector Store
                if records:
                    vector_store.knowledge.upsert(records=records)
                    print(f"  -> Upserted {len(records)} chunks.")

if __name__ == "__main__":
    asyncio.run(ingest_knowledge())
