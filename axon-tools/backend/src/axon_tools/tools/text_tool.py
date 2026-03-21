from . import tool
from typing import Dict, Any

@tool("Text Statistics", keywords=["text", "analysis", "utility"])
def get_text_stats(text: str) -> Dict[str, Any]:
    """
    Analizuje tekst i zwraca statystyki (liczba słów, znaków, zdań).
    Args:
        text: Tekst do analizy.
    """
    chars = len(text)
    words = len(text.split())
    sentences = text.count('.') + text.count('!') + text.count('?')
    
    return {
        "characters": chars,
        "words": words,
        "sentences": max(sentences, 1 if words > 0 else 0)
    }
