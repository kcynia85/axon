import os
import re
from pathlib import Path
from typing import Dict, List, Optional

# --- Definicje Heurystyk ---

CREW_SIGNALS = {
    "keywords": ["załoga", "zespół", "skrypt", "checklist", "rytuały", "scrum"],
    "structure": [re.compile(r"^(#+\s*Krok\s*\d+|^\d+\.)", re.IGNORECASE | re.MULTILINE)],
}

FLOW_SIGNALS = {
    "keywords": ["proces", "strategy", "strategia", "framework", "mapa", "roadmap", "model", "analiza", "analysis", "canvas", "journey"],
}

# Mapowanie nazw folderów na 'target_workspace'
WORKSPACE_MAP = {
    "01. Product Management": "Product Management",
    "02. Discovery": "Discovery",
    "03. Design": "Design",
    "04. Delivery": "Delivery",
    "05. Growth & Market": "Growth & Market",
}

def has_frontmatter(content: str) -> bool:
    """Sprawdza, czy plik już posiada frontmatter."""
    return content.startswith("---")

def classify_template_type(content: str) -> str:
    """Decyduje, czy szablon to 'crew' czy 'flow' na podstawie heurystyk."""
    lower_content = content.lower()

    # Sprawdź sygnały dla 'crew'
    if any(keyword in lower_content for keyword in CREW_SIGNALS["keywords"]):
        return "crew"
    for pattern in CREW_SIGNALS["structure"]:
        if pattern.search(content):
            return "crew"

    # Sprawdź sygnały dla 'flow'
    if any(keyword in lower_content for keyword in FLOW_SIGNALS["keywords"]):
        return "flow"

    # Domyślny fallback
    return "flow"

def extract_description(content: str) -> Optional[str]:
    """Wydobywa pierwszy znaczący paragraf jako opis."""
    # Usuń tytuł H1 i ewentualne puste linie po nim
    content_after_title = re.sub(r"^#\s*.*?\n\s*", "", content, count=1)
    
    match = re.search(r"^\s*([A-ZĄĆĘŁŃÓŚŹŻ].*?)(?=\n\n|---|\n#)", content_after_title, re.DOTALL)
    if match:
        description = match.group(1).strip().replace("\n", " ")
        # Usuń znaki specjalne i ogranicz długość
        description = re.sub(r'["\']', '', description)
        return description[:200]
    return None

def get_target_workspace(path: Path) -> Optional[str]:
    """Określa 'target_workspace' na podstawie ścieżki pliku."""
    parts = path.parts
    for i, part in enumerate(parts):
        if part in WORKSPACE_MAP:
            return WORKSPACE_MAP[part]
    return None

def process_markdown_file(file_path: Path):
    """Główna funkcja przetwarzająca pojedynczy plik markdown."""
    try:
        content = file_path.read_text(encoding="utf-8")

        if has_frontmatter(content):
            print(f"Skipping (has frontmatter): {file_path}")
            return

        # Klasyfikacja i ekstrakcja metadanych
        template_type = classify_template_type(content)
        workspace = get_target_workspace(file_path)
        description = extract_description(content)

        # Budowanie bloku frontmatter
        frontmatter = ["---"]
        frontmatter.append(f"template_type: {template_type}")
        if workspace:
            frontmatter.append(f"target_workspace: {workspace}")
        if description:
            frontmatter.append(f'description: "{description}"')
        frontmatter.append("---")
        
        new_content = "\n".join(frontmatter) + "\n\n" + content

        # Zapisanie pliku z nową zawartością
        file_path.write_text(new_content, encoding="utf-8")
        print(f"Updated: {file_path}")

    except Exception as e:
        print(f"Error processing {file_path}: {e}")

def main(root_dir: str):
    """Skanuje podany katalog i przetwarza wszystkie pliki .md."""
    root_path = Path(root_dir)
    if not root_path.is_dir():
        print(f"Error: Directory not found at {root_dir}")
        return

    print(f"Starting classification in: {root_dir}")
    for md_file in root_path.rglob("*.md"):
        process_markdown_file(md_file)
    print("Classification finished.")

if __name__ == "__main__":
    # Uruchomienie skryptu na docelowym folderze
    # W naszym przypadku będzie to ścieżka do 'workflow-performance-design'
    target_directory = "docs/product/workflow-performance-design"
    main(target_directory)
