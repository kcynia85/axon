# Axon Backend — Przegląd Systemu (Dokumentacja Nietechniczna)

> **Rola:** Przewodnik Użytkownika & Logika Biznesowa
> **Zakres:** Logika Agentów, System Wiedzy, Możliwości.

## 🤖 "Mózg" Systemu Axon (Agenci)

Backend pełni rolę silnika poznawczego platformy Axon. To nie tylko baza danych; to aktywny system, który "myśli" i pracuje ramię w ramię z użytkownikiem.

### Inteligentni Agenci
System nie korzysta z jednego uniwersalnego "Chatbota". Zamiast tego zatrudnia wyspecjalizowanych **Agentów** o konkretnych rolach, przypominających prawdziwy zespół produktowy:

| Rola Agenta | Opis | Najlepszy do... |
| :--- | :--- | :--- |
| **MANAGER** | Lider Zespołu. Rozbija złożone cele na zadania, recenzuje plany i dba o spójność działań. | Rozpoczynania projektu, tworzenia mapy drogowej (roadmapy). |
| **RESEARCHER**| Analityk. Skanuje wewnętrzną bazę wiedzy i zewnętrzne dokumenty w poszukiwaniu faktów. | "Jak zaimplementować X?", "Znajdź najlepsze praktyki dla Y". |
| **BUILDER** | Inżynier. Generuje kod, konfiguracje i specyfikacje techniczne. | Pisania fragmentów kodu, debugowania, tworzenia szkieletów aplikacji. |
| **WRITER** | Copywriter. Tworzy dokumentację, teksty marketingowe i dokumenty PRD. | Pisania postów na bloga, redagowania treści. |

---

## 🧠 Jak to działa? (System RAG)

Axon różni się od standardowego ChatGPT tym, że jest **"Uziemiony" (Grounded)**. Zna kontekst *Twojego* projektu i organizacji.

### 1. Baza Wiedzy (Biblioteka)
System utrzymuje bibliotekę zawierającą:
*   **Zasoby (Assets):** Pełne szablony (np. "Szablon PRD", "Checklista Designu").
*   **Wspomnienia (Memories):** Małe fragmenty wiedzy wyekstrahowane z poprzednich projektów.

### 2. Proces Myślenia (RAG)
Kiedy zadajesz pytanie:
1.  **Szukanie:** Agent najpierw przeszukuje "Bibliotekę" pod kątem informacji pasujących do pytania.
2.  **Kontekst:** Czyta odnalezione dokumenty.
3.  **Odpowiedź:** Generuje odpowiedź w oparciu **wyłącznie o te dane**, często cytując źródła.

*Rezultat:* Mniej halucynacji, bardziej precyzyjne odpowiedzi.

---

## ⚡️ Interakcja w Czasie Rzeczywistym

Stawiamy na szybkość i płynność działania.
*   **Strumieniowanie (Streaming):** Widzisz odpowiedź pojawiającą się natychmiast (znak po znaku), zamiast czekać, aż Agent "dokończy myśl".
*   **Pamięć:** Agent pamięta historię rozmowy w ramach Sesji, co pozwala na zadawanie pytań doprecyzowujących.

---

## 🛡 Bezpieczeństwo i Prywatność

*   **Izolacja Projektów:** Dane z "Projektu A" nigdy nie są dostępne dla "Projektu B", chyba że wyraźnie na to pozwolisz.
*   **Bezpieczne Przechowywanie:** Wszystkie dane są przechowywane w profesjonalnej bazie danych klasy enterprise (Supabase).