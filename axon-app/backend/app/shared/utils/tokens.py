import tiktoken
from typing import Optional

def count_tokens(text: str, model_name: str = "gpt-5-nano") -> int:
    """
    Counts the number of tokens in a string using tiktoken.
    Defaults to gpt-5-nano encoding.
    """
    if not text:
        return 0
        
    try:
        # Map some common models to their base encodings
        if "gpt-4" in model_name or "gpt-3.5" in model_name:
            encoding = tiktoken.encoding_for_model(model_name)
        else:
            # Default to cl100k_base for most modern models
            encoding = tiktoken.get_encoding("cl100k_base")
            
        return len(encoding.encode(text))
    except Exception:
        # Fallback to cl100k_base if model mapping fails
        encoding = tiktoken.get_encoding("cl100k_base")
        return len(encoding.encode(text))
