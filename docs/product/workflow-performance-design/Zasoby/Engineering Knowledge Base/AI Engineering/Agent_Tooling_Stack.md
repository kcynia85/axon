---
template_type: flow
---

# Agent Tooling & Ecosystem

> **Status:** Tech Stack Standard
> **Domain:** DevOps & Tools
> **Context:** Narzędzia do budowy, łączenia i orkiestracji agentów.

---

## 1. Orkiestracja: LangChain vs LangGraph

Wybór frameworka zależy od topologii przepływu danych.

### LangChain (Linear Chains)
Biblioteka do budowania sekwencyjnych łańcuchów zdarzeń (Chains).
*   **Struktura:** DAG (Directed Acyclic Graph) - przepływ w jedną stronę.
*   **Use Case:** Prosty RAG, chatbot bez pamięci długoterminowej, jednorazowe zadania (Summarization).
*   **Wada:** Trudno zaimplementować pętle (Loops) i skomplikowaną logikę warunkową.

### LangGraph (Cyclic Graphs)
Rozszerzenie LangChain stworzone specjalnie dla Agentów.
*   **Struktura:** Graf z obsługą cykli (Loops) i stanem (State).
*   **Use Case:** Multi-Agent Systems, pętla "Plan -> Act -> Observe -> Repeat", Human-in-the-loop.
*   **Kluczowa cecha:** Kontrola nad stanem. Każdy węzeł (Node) otrzymuje stan, przetwarza go i przekazuje dalej.

| Cecha | LangChain | LangGraph |
| :--- | :--- | :--- |
| **Przepływ** | Liniowy (Chain) | Cykliczny (Graph) |
| **Pamięć** | Zewnętrzna (Memory classes) | Wbudowana w Stan (State Schema) |
| **Kontrola** | Sztywna sekwencja | Dynamiczne krawędzie (Conditional Edges) |
| **Idealny do** | QA, Summarization | Autonomous Agents, Coding Assistants |

---

## 2. MCP (Model Context Protocol)

Otwarty standard łączenia LLM z zewnętrznymi danymi i narzędziami. Zamiast pisać własne "Tools" w Pythonie, używamy gotowych serwerów MCP.

### Kluczowe Serwery MCP

#### A. Figma Dev Mode MCP
Umożliwia agentowi "widzenie" designu i pobieranie kodu.

*   **`get_node`**: Pobiera szczegóły warstwy/komponentu.
*   **`get_code`**: Generuje kod (React/Tailwind) na podstawie designu.
*   **`get_variables`**: Pobiera Design Tokens (kolory, fonty) - kluczowe dla spójności!
*   **Best Practice:** Używaj adnotacji w Figmie (Dev Mode Annotations). Agent traktuje je jako bezpośrednie instrukcje (np. "To ma być animowane przy hover").

#### B. Inne Serwery
*   **Git / GitHub:** Do zarządzania kodem, tworzenia PR-ów i analizy historii zmian.
*   **Postgres / Supabase:** Do bezpośredniego SQL-a na bazie danych.
*   **Filesystem:** Do operacji na plikach lokalnych (bezpieczne sandboxy).

### Przykład użycia (CLI)
```bash
# Instalacja i uruchomienie serwera MCP (np. Serena)
gemini mcp add serena uvx --from git+https://github.com/oraios/serena serena start-mcp-server
```

---

## 3. Low-Code Orchestration (n8n)

Platforma do wizualnego łączenia agentów z API biznesowym.

*   **Rola:** "Krwiobieg" systemu. Łączy Agenta (mózg) z systemami firmy (Slack, Jira, CRM, Email).
*   **Use Case:** Customer Support Agent.
    1.  Webhook z maila (n8n).
    2.  Analiza sentymentu (LLM Node).
    3.  Decyzja (Router Node):
        *   Sentyment < 0.2 -> Utwórz ticket w Jira (Jira Node).
        *   Sentyment > 0.8 -> Wyślij podziękowanie (Gmail Node).
*   **Szablony:** Dostępne gotowe workflowy dla Supportu, Researchu i Social Media.
