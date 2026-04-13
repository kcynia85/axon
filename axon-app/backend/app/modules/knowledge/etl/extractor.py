import os
from typing import List
from langchain_community.document_loaders import (
    PyPDFLoader,
    Docx2txtLoader,
    TextLoader
)
from langchain_core.documents import Document

def extract_documents(file_path: str) -> List[Document]:
    """
    Extracts documents from a file using LangChain community loaders.
    """
    ext = os.path.splitext(file_path)[1].lower()
    
    if ext == '.pdf':
        loader = PyPDFLoader(file_path)
        return loader.load()
    elif ext in ['.docx', '.doc']:
        loader = Docx2txtLoader(file_path)
        return loader.load()
    elif ext == '.md':
        # Fallback to TextLoader if unstructured is not installed
        loader = TextLoader(file_path, encoding='utf-8')
        return loader.load()
    else:
        # Default to TextLoader
        loader = TextLoader(file_path, autodetect_encoding=True)
        return loader.load()
