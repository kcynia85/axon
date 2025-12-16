import glob
from pathlib import Path
import asyncio
from uuid import uuid4
from typing import List, Tuple

from backend.app.shared.infrastructure.database import AsyncSessionLocal
from backend.app.shared.infrastructure.adk import GoogleADK
from backend.app.modules.knowledge.domain.models import Asset
from backend.app.modules.knowledge.infrastructure.repo import AssetRepository, KnowledgeVectorStore

# Mapping Configuration
DOMAIN_MAP = {
    "00. Hubs": "meta",
    "01. Product Management": "product_management",
    "02. Discovery": "discovery",
    "03. Design": "design",
    "04. Delivery": "delivery",
    "05. Growth & Market": "growth",
    "Zasoby/Engineering Knowledge Base": "delivery",
    "Zasoby/Psychology": "design"
}

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

def determine_domain(file_path: Path) -> str:
    """
    Determines the domain based on the file path.
    Checks if any key from DOMAIN_MAP is in the path parts.
    """
    parts = file_path.parts
    # Iterate through map to find partial matches in path
    for key, domain in DOMAIN_MAP.items():
        # Heuristic: Check if the key (e.g. "01. Product Management") is a substring of the path
        # or exactly in the parts.
        # Since 'parts' splits by separator, we construct the relative path string for matching
        if key in str(file_path): 
            return domain
    return "general"

def determine_asset_type(filename: str) -> str:
    lower_name = filename.lower()
    if "template" in lower_name or "szablon" in lower_name:
        return "template"
    if "checklist" in lower_name or "checklista" in lower_name:
        return "checklist"
    if "sop" in lower_name or "protocol" in lower_name:
        return "sop"
    return "knowledge_asset"

async def ingest_knowledge(docs_path: str = "docs/axon-context"):
    print(f"Starting ingestion from: {docs_path}")
    
    # Initialize services
    vector_store = KnowledgeVectorStore()
    
    async with AsyncSessionLocal() as session:
        repo = AssetRepository(session)
        
        # Router Pattern Logic
        files = glob.glob(f"{docs_path}/**/*.md", recursive=True)
        print(f"Found {len(files)} files.")
        
        for file_path_str in files:
            path = Path(file_path_str)
            try:
                content = path.read_text(encoding='utf-8')
            except Exception as e:
                print(f"Error reading {file_path_str}: {e}")
                continue
                
            filename = path.name
            domain = determine_domain(path)
            
            # Classification
            asset_type_keywords = ["Template", "SOP", "Checklist", "Szablon", "Protocol"]
            is_asset = any(k in filename for k in asset_type_keywords)
            
            if is_asset:
                # Path B: Asset (Full Document)
                slug = filename.lower().replace(" ", "-").replace(".md", "")
                asset_type = determine_asset_type(filename)
                
                # Check if exists (Idempotency)
                existing = await repo.get_by_slug(slug)
                if existing:
                    print(f"Skipping existing Asset: {slug}")
                    continue

                asset = Asset(
                    slug=slug,
                    title=filename.replace(".md", ""),
                    content=content,
                    type=asset_type,
                    domain=domain, 
                    metadata={
                        "source_path": file_path_str,
                        "original_filename": filename
                    }
                )
                
                # Embed Title for Asset Search
                try:
                    embedding = await GoogleADK.get_embeddings(asset.title)
                    await repo.create(asset, embedding)
                    print(f"Ingested Asset: {slug} | Domain: {domain} | Type: {asset_type}")
                except Exception as e:
                    print(f"Failed to embed/save Asset {slug}: {e}")
                
            else:
                # Path A: Wisdom (Chunking & Vector Store)
                print(f"Processing Wisdom: {filename} | Domain: {domain}")
                chunks = chunk_text(content)
                records = []
                
                for i, chunk in enumerate(chunks):
                    try:
                        # Embed Chunk
                        embedding = await GoogleADK.get_embeddings(chunk)
                        
                        records.append((
                            str(uuid4()),       # ID
                            embedding,          # Vector
                            {                   # Metadata
                                "source": filename,
                                "chunk_index": i,
                                "content": chunk,
                                "path": file_path_str,
                                "domain": domain,
                                "type": "wisdom"
                            }
                        ))
                    except Exception as e:
                        print(f"Failed to embed chunk {i} of {filename}: {e}")
                
                # Upsert to Vector Store
                if records:
                    try:
                        vector_store.knowledge.upsert(records=records)
                        print(f"  -> Upserted {len(records)} chunks.")
                    except Exception as e:
                         print(f"  -> Failed to upsert chunks for {filename}: {e}")

if __name__ == "__main__":
    asyncio.run(ingest_knowledge())