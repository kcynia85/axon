---
template_type: flow
---

# Hexagonal Structure Snippet (Python/FastAPI)

> **Cel:** Gotowa struktura folderów i kodu dla architektury heksagonalnej w projekcie AI.

## 📂 Struktura Katalogów

```text
src/
├── domain/                 # JĄDRO (Czysty Python, 0 zależności)
│   ├── models/             # Encje (Dataclasses/Pydantic)
│   ├── ports/              # Interfejsy (Abstrakcje)
│   │   ├── inputs.py       # Use Cases (Serwisy)
│   │   └── outputs.py      # Repozytoria, AIProvider
│   └── services.py         # Logika Biznesowa
│
├── infrastructure/         # ADAPTERY (Technologia)
│   ├── adapters/
│   │   ├── openai_adapter.py
│   │   ├── postgres_repo.py
│   │   └── in_memory_repo.py
│   └── config.py
│
└── presentation/           # WEJŚCIE (API/CLI)
    └── api/
        └── routes.py       # FastAPI Router
```

## 💻 Kod (Implementation)

### 1. Domain (Port)
`src/domain/ports/outputs.py`

```python
from abc import ABC, abstractmethod

class AIProvider(ABC):
    @abstractmethod
    async def generate_summary(self, text: str) -> str:
        """Generuje podsumowanie tekstu."""
        pass
```

### 2. Infrastructure (Adapter)
`src/infrastructure/adapters/openai_adapter.py`

```python
from src.domain.ports.outputs import AIProvider
import openai

class OpenAIAdapter(AIProvider):
    def __init__(self, api_key: str, model: str = "gpt-4o"):
        self.client = openai.AsyncOpenAI(api_key=api_key)
        self.model = model

    async def generate_summary(self, text: str) -> str:
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "Summarize this."},
                {"role": "user", "content": text}
            ]
        )
        return response.choices[0].message.content
```

### 3. Application (Wiring)
`src/main.py`

```python
from fastapi import FastAPI, Depends
from src.infrastructure.adapters.openai_adapter import OpenAIAdapter
from src.domain.services import SummarizationService

app = FastAPI()

# Dependency Injection
def get_ai_service():
    adapter = OpenAIAdapter(api_key="sk-...")
    return SummarizationService(ai_provider=adapter)

@app.post("/summarize")
async def summarize(text: str, service = Depends(get_ai_service)):
    return await service.execute(text)
```
