---
template_type: flow
---

# Manifesto: Zderzenie Epok

> *Dokument definiujący przejście z roli "Programisty" na "Architekta Systemów AI".*

## 1. Twardy Standard (Fundamenty)
Te koncepcje stanowią skałę macierzystą. Bez nich AI generuje "spaghetti code".

*   **Domain-Driven Design (DDD):** Język Prawdy.
    *   *Bounded Context:* Granice znaczeniowe (np. "Produkt" w magazynie vs w sprzedaży).
    *   *Ubiquitous Language:* Kod mówi językiem biznesu (`shipOrder()` a nie `updateRow()`).
*   **ADR (Architecture Decision Records):** "Dlaczego" stojące za kodem. Konstytucja dla Agenta AI.
*   **System Design:** Rate Limiting, Circuit Breakers, Idempotency (kluczowe przy agentach, którzy mogą ponawiać żądania).
*   **Hexagonal Architecture:** Izolacja logiki biznesowej od frameworków.
*   **CQRS:** Rozdział zapisu (skomplikowany) od odczytu (szybki).

## 2. Nowy Standard AI (Emerging Tech)
Techniki pracy z LLM w inżynierii.

*   **Vibe Coding:** Prototypowanie z prędkością myśli, gdzie człowiek jest dyrygentem, a AI orkiestrą.
*   **Context Engineering:** Zarządzanie oknem kontekstowym. Wstrzykiwanie *dokładnie* tego, co potrzebne (RAG).
*   **PRP (Product Requirements Prompt):** Wykonywalna specyfikacja dla AI. Tłumaczenie "chcę sklep" na "Użyj Zod schema, Prisma i Stripe".
*   **Chain of Thought:** Wymuszanie na AI "pomyślenia" (planowania) przed napisaniem kodu.

## 3. Profil: AI-Native Architect
Ktoś, kto używa **Twardych Standardów** do tworzenia barier, a **Nowych Standardów**, by wypełnić je kodem w rekordowym czasie.
