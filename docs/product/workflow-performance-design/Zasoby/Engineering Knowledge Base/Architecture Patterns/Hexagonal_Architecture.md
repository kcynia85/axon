---
template_type: crew
---

# Hexagonal Architecture (Porty i Adaptery)

> **Cel:** Całkowita izolacja logiki biznesowej (Domeny) od technologii zewnętrznych (Frameworki, Bazy Danych, Modele AI).
> **Dlaczego w AI?** Aby móc wymienić model (np. GPT-4 -> Claude 3) bez przepisywania ani jednej linii kodu w logice biznesowej.

---

## 🏛️ Główne Założenia

### 1. The Core (Jądro / Domena)
To serce aplikacji. Zawiera czystą logikę biznesową, encje i reguły.
*   **Zasada:** Core NIE WIE nic o świecie zewnętrznym. Nie ma tu importów z `sqlalchemy`, `fastapi` czy `openai`.
*   **Język:** Czysty Python/TypeScript.

### 2. Ports (Porty / Interfejsy)
To kontrakty, które definiuje Core. Mówią one "Czego potrzebuję", ale nie "Jak to zrobić".
*   **Driving Ports (Wejściowe):** Interfejsy dla usług aplikacji (np. `UserService`).
*   **Driven Ports (Wyjściowe):** Interfejsy dla infrastruktury (np. `UserRepository`, `AIProvider`).

### 3. Adapters (Adaptery)
Konkretne implementacje Portów.
*   **Driver Adapters (Wejście):** Kontrolery API, CLI, UI (np. FastAPI Router).
*   **Driven Adapters (Wyjście):** Implementacje baz danych, klienty API (np. `PostgresRepository`, `OpenAIAdapter`).

---

## 🔌 Zastosowanie w AI (The "AI Provider" Pattern)

W systemach AI kluczowe jest odseparowanie logiki ("Co chcę uzyskać od AI") od implementacji ("Jakim modelem to robię").

### Przykład:
Zamiast pisać `openai.ChatCompletion.create(...)` w środku serwisu, definiujesz port.

#### Krok 1: Port (Wewnątrz Domeny)
```python
# domain/ports.py
from abc import ABC, abstractmethod

class AIProvider(ABC):
    @abstractmethod
    def generate_text(self, prompt: str) -> str:
        pass
```

#### Krok 2: Adapter (W Infrastrukturze)
```python
# infrastructure/adapters/openai_adapter.py
class OpenAIAdapter(AIProvider):
    def generate_text(self, prompt: str) -> str:
        return openai.Client().chat.completions.create(...)

# infrastructure/adapters/anthropic_adapter.py
class AnthropicAdapter(AIProvider):
    def generate_text(self, prompt: str) -> str:
        return anthropic.Client().messages.create(...)
```

#### Krok 3: Dependency Injection (W Aplikacji)
Wstrzykujesz odpowiedni adapter przy starcie aplikacji.

---

## ✅ Zalety
1.  **Testowalność:** Możesz napisać `FakeAIProvider`, który zwraca gotowe stringi w testach. 0 kosztów, 100% determinizmu.
2.  **Elastyczność:** Zmiana GPT-4 na Llama 3 odbywa się w pliku konfiguracyjnym (podmiana Adaptera).
3.  **Czystość:** Kod biznesowy nie jest zaśmiecony technicznymi szczegółami API (retry, timeouty, autoryzacja).

## ⚠️ Kiedy NIE stosować?
*   W prostych skryptach (CRUD).
*   Gdy aplikacja jest ściśle związana z jednym, specyficznym featurem danego modelu (np. tylko OpenAI Functions w specyficzny sposób), choć nawet wtedy warto to opakować.
