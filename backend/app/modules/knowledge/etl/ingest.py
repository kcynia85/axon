import asyncio
import os
import glob
from uuid import uuid4
from sqlalchemy import select, delete
from backend.app.shared.infrastructure.database import AsyncSessionLocal
from backend.app.modules.knowledge.infrastructure.tables import AssetTable
from backend.app.shared.infrastructure.adk import GoogleADK
from backend.app.shared.infrastructure.vecs_client import get_vecs_client
import vecs

# --- Configuration ---
POSSIBLE_PATHS = [
    "docs/product/workflow-performance-design",
    "../docs/product/workflow-performance-design",
    "../../docs/product/workflow-performance-design"
]

DOMAIN_MAPPING = {
    "00. Hubs": {"domain": "meta", "type": "hub_definition"},
    "01. Product Management": {"domain": "product_management", "type": "methodology"},
    "02. Discovery": {"domain": "discovery", "type": "methodology"},
    "03. Design": {"domain": "design", "type": "methodology"},
    "04. Delivery": {"domain": "delivery", "type": "methodology"},
    "05. Growth & Market": {"domain": "growth", "type": "methodology"},
    "Zasoby/Engineering Knowledge Base": {"domain": "delivery", "type": "pattern"},
    "Zasoby/Psychology": {"domain": "design", "type": "psychology"},
}

ASSET_KEYWORDS = ["Template", "SOP", "Checklist", "Szablon"]

async def process_file(file_path: str, root_dir: str, vecs_client):
    """
    Process a single markdown file.
    """
    filename = os.path.basename(file_path)
    rel_path = os.path.relpath(file_path, root_dir)
    
    # Determine Domain & Type
    domain = "general"
    doc_type = "note"
    
    for key, meta in DOMAIN_MAPPING.items():
        if rel_path.startswith(key):
            domain = meta["domain"]
            doc_type = meta["type"]
            break

    # Determine Category (Asset vs Wisdom)
    # Case-insensitive check
    filename_lower = filename.lower()
    is_asset = any(kw.lower() in filename_lower for kw in ASSET_KEYWORDS)
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"⚠️ Failed to read {filename}: {e}")
        return

    if is_asset:
        await ingest_asset(filename, content, domain, doc_type, file_path)
    else:
        await ingest_wisdom(filename, content, domain, doc_type, file_path, vecs_client)

async def ingest_asset(filename: str, content: str, domain: str, doc_type: str, file_path: str):
    slug = filename.lower().replace(".md", "").replace(" ", "-")
    title = filename.replace(".md", "")
    
    asset_type = "template"
    if "SOP" in filename or "sop" in filename:
        asset_type = "sop"
    elif "Checklist" in filename or "checklist" in filename:
        asset_type = "checklist"
    
    print(f"  [ASSET] {slug}")
    
    # Generate Embedding (Fallback to mock if API fails)
    desc_proxy = content[:200]
    embedding = await GoogleADK.get_embeddings(f"{title}\n{desc_proxy}")
    
    async with AsyncSessionLocal() as session:
        stmt = select(AssetTable).where(AssetTable.slug == slug)
        result = await session.execute(stmt)
        existing = result.scalar_one_or_none()
        
        if existing:
            existing.title = title
            existing.content = content
            existing.type = asset_type
            existing.domain = domain
            existing.description_embedding = embedding
            existing.metadata_ = {"source": file_path, "inferred_type": doc_type}
        else:
            new_asset = AssetTable(
                id=uuid4(),
                slug=slug,
                title=title,
                content=content,
                type=asset_type,
                domain=domain,
                description_embedding=embedding,
                metadata_={"source": file_path, "inferred_type": doc_type}
            )
            session.add(new_asset)
        
        await session.commit()

async def ingest_wisdom(filename: str, content: str, domain: str, doc_type: str, file_path: str, vecs_client):
    # print(f"  [WISDOM] {filename}")
    
    # Use shared client
    docs = vecs_client.get_or_create_collection(name="knowledge_base", dimension=768)
    
    # Chunking
    chunk_size = 1000
    overlap = 200
    chunks = []
    
    start = 0
    while start < len(content):
        end = start + chunk_size
        chunk_text = content[start:end]
        chunks.append(chunk_text)
        start += (chunk_size - overlap)
        
    # Embed and Upsert
    records = []
    for i, chunk in enumerate(chunks):
        embedding = await GoogleADK.get_embeddings(chunk)
        records.append(
            (
                f"{filename}_{i}",          # ID
                embedding,                  # Vector
                {"source": filename, "domain": domain, "type": doc_type, "text": chunk} # Metadata
            )
        )
    
    # Upsert to vecs
    if records:
        docs.upsert(records=records)

async def main():
    target_dir = None
    for p in POSSIBLE_PATHS:
        if os.path.exists(p):
            target_dir = p
            break
            
    if not target_dir:
        print("❌ Error: Could not find documentation directory.")
        return

    print(f"🚀 Starting ingestion from: {target_dir}")
    
    # Initialize Shared Resources
    try:
        vx = get_vecs_client()
    except Exception as e:
        print(f"❌ Failed to connect to Vector DB: {e}")
        return

    files = glob.glob(os.path.join(target_dir, "**/*.md"), recursive=True)
    print(f"Found {len(files)} markdown files.")
    
    for i, f in enumerate(files):
        try:
            if i % 10 == 0:
                print(f"🔄 Processing {i}/{len(files)}...")
            await process_file(f, target_dir, vx)
            # Rate limit protection (Gemini Free Tier is sensitive)
            await asyncio.sleep(1.0) 
        except Exception as e:
            print(f"❌ Failed to process {f}: {e}")
            await asyncio.sleep(0.1)

if __name__ == "__main__":
    asyncio.run(main())
