import re

def clean_text(text: str) -> str:
    """
    Cleans raw text before chunking and embedding.
    - Removes excessive blank lines
    - Normalizes whitespace
    - Strips simple boilerplate (e.g. repeated page footers like 'Page X of Y')
    """
    if not text:
        return ""

    # Remove excessive blank lines (more than 2)
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # Normalize multiple spaces to a single space
    text = re.sub(r'[ \t]+', ' ', text)
    
    # Optional: Remove generic footers like "Page 1 of 10" or "Company Confidential"
    text = re.sub(r'(?i)\n\s*page\s+\d+\s+of\s+\d+\s*\n', '\n', text)
    text = re.sub(r'(?i)\n\s*company confidential\s*\n', '\n', text)
    
    # Strip leading/trailing whitespace
    return text.strip()
