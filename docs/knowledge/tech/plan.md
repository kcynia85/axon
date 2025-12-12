 Wykonaj kolejną krytyczna analizę mojego global context

✦ Z przyjemnością. Przyjrzyjmy się stanowi na teraz (Global Context 3.1) i poszukajmy ostatnich słabości przed "zamrożeniem" standardu.

  Stan obecny:
   - Modularność: Tech stacki są super (React, Node, Python).
   - Proces: Workflow A/B/C, Audit Log (LOG.md), Memory (memory.md).
   - Jakość: DoD, Manual Verification.
   - Bezpieczeństwo: DevOps standards, Secrets management.

  Wszystko wygląda na "enterprise-grade". Ale...

  🕵️ Krytyczna Analiza 4.0 (The "Human Factor" Check)

  1. Słabość: Przeciążenie Informacyjne (Information Overload)
  Stworzyliśmy potwora.
   - Aby zrobić prosty ficzer, AI musi: wczytać GEMINI, memory, process, core-principles, stack-file, PRP, Implementation, LOG, DoD.
   - Ryzyko: Przy małym oknie kontekstowym (nawet 128k/1M tokenów) AI może zacząć gubić wątki lub ignorować starsze instrukcje na rzecz nowszych
     (recency bias).
   - Objaw: AI może zapomnieć o aktualizacji LOG.md w połowie zadania, bo skupi się na implementation-template.md.
   - Rekomendacja: Skoro mamy Smart Context Loading, to jest dobrze. Ale w GEMINI.md warto dodać instrukcję "Context Cleanup" – "Jeśli kończysz fazę
     planowania, możesz zapomnieć o plikach `tech-prd` i skupić się tylko na `implementation`". (To może być trudne do wyegzekwowania automatycznie).

  2. Słabość: Brak standardu "Naming Convention" dla plików logów
  Mamy Docs/LOG.md. Ale co jeśli pracujemy nad 5 ficzerami naraz (w różnych branchach)?
   - Ryzyko: Konflikty w LOG.md przy merge'owaniu.
   - Rekomendacja: Zmienić nazwę na Docs/logs/TASK-[ID].md lub Docs/session-log.md. Ale dla jednoosobowego zespołu LOG.md jest OK.

  3. Słabość: "Zombie Tests"
  Wymagamy testów w DoD. Ale nie mamy standardu utrzymania testów.
   - AI często pisze testy, one przechodzą, a potem przy refaktorze (Path C) AI zmienia kod, ale zapomina zaktualizować testy (lub po prostu je
     usuwa/komentuje, żeby przeszło).
   - Rekomendacja: Dodać do refactor-plan-template.md punkt: "Tests must be updated, NOT deleted/disabled".

  4. Luka w stack-python.md: Dependency Management
  W stack-nodejs mamy jasność: package.json.
  W stack-python mamy uv lub poetry.
   - Ale jak AI ma instalować paczki? pip install? uv add? poetry add?
   - Ryzyko: AI raz użyje pip, raz poetry, i rozwali środowisko wirtualne.
   - Rekomendacja: Wymusić w stack-python.md jedną, konkretną komendę dodawania zależności (zależnie od wykrytego narzędzia).

  ---

  Decyzja

  Najbardziej realnym problemem, który będzie Cię irytował na co dzień, jest Punkt 4 (Python Dependencies) oraz potencjalnie Punkt 3 (Testy przy
  refaktorze).

  Punkt 1 (Overload) jest inherentną cechą LLM – musimy po prostu ufać, że Smart Loading działa.

  Plan naprawczy "Last Mile":
   1. Doprecyzować stack-python.md: Dodaj sekcję "Dependency Management Commands" (Jeśli pyproject.toml ma tool.poetry -> używaj poetry add, jeśli
      tool.uv -> uv add).
   2. Doprecyzować refactor-plan-template.md: Dodać zasadę "Test Preservation Rule".

  Czy wchodzimy w to? To są małe, chirurgiczne cięcia.

> Aby poradzić sobie z overload, dodaj bramkę human-in-the-loop, opisanie w terminalu co zamierza zrobić, tak jak to robisz teraz. A dla 3 i 4 punktu
  wykonaj to co zarekomendowałeś. Przedstaw oczywiście plan do akceptacji.

✦ Oto plan "Final Polish" z dodatkiem krytycznej bramki bezpieczeństwa (Human Check).

  📋 PLAN: Global Context 4.0 (Human Guard & Precision)

  Faza 1: Walka z Overload (Human-in-the-Loop)
  Cel: Zamiast ładować AI toną tekstu i liczyć na cud, zmuszamy je do zatrzymania się i wyjaśnienia planu przed każdą destrukcyjną akcją.

   - [ ] 1.1. Aktualizacja `GEMINI.md` (Sekcja Interaction Style / Safety):
       - Dodanie nowej "Złotej Zasady": The "Speak Before You Act" Rule.
       - Instrukcja: "Zanim wykonasz serię edycji plików lub komend shell, przedstaw w terminalu zwięzły plan (bullet points) i czekaj na reakcję
         użytkownika (lub założoną milczącą zgodę, jeśli tak ustalono, ale domyślnie - informuj)."
       - To de facto sformalizowanie tego, co robię teraz ("Przedstawiam plan...").

  Faza 2: Precyzja Pythona (Dependency Hell Prevention)
  Cel: Uniknięcie mieszania pip, poetry i uv.

   - [ ] 2.1. Aktualizacja `knowledge/tech/stack-python.md`:
       - Dodanie sekcji "Dependency Management Protocol".
       - Algorytm decyzyjny dla AI:
           - Widzisz uv.lock? -> Używaj uv add.
           - Widzisz poetry.lock? -> Używaj poetry add.
           - Widzisz tylko requirements.txt? -> Używaj pip install + freeze.

  Faza 3: Ochrona Testów (Refactor Safety)
  Cel: Zapobieganie usuwaniu testów, które "przeszkadzają".

   - [ ] 3.1. Aktualizacja `templates/refactor-plan-template.md`:
       - Dodanie punktu w Checklist: "Test Preservation: Existing tests updated, NOT deleted."
       - Dodanie sekcji w strategii: "Regression Safety".

  ---

  Czy akceptujesz ten plan? (Po Twoim "Tak" zacznę od Fazy 1 w GEMINI.md).