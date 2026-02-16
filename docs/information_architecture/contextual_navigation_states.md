Canvas Node Inspector States (Right Panel)
The Right Panel is highly context-sensitive and changes based on:
Node Type (Agent, Crew, Pattern, Service, Automation, Template)
Execution State (Missing Context, Briefing, Working, Consultation, Done, Error)

### Agent: Missing Context

┌─────────────────────────────────────┐
│ ⚠️ Agent: Customer Interview Agent  │
│ ───────────────────────────────────│
│                                     │
│ ⚠️ Uzupełnij wymagany Context       │
│                                     │
│ Agent potrzebuje tych danych:       │
│                                     │
│ Context Form:                       │
│ ┌───────────────────────────────┐  │
│ │ target_audience *              │  │
│ │ [Text input]                   │  │
│ └───────────────────────────────┘  │
│ ┌───────────────────────────────┐  │
│ │ research_goals *               │  │
│ │ [Textarea]                     │  │
│ └───────────────────────────────┘  │
│                                     │
│ + Add Context                       │
│                                     │
│ [Wygeneruj Plan (Briefing)]         │ ← Disabled until valid
│                                     │
└─────────────────────────────────────┘

Behavior:
- Button disabled until all required (*) fields filled
- Validation on blur
- Error messages under invalid fields


### Agent: Briefing

┌─────────────────────────────────────┐
│ 🤖 Agent: Customer Interview Agent  │
│ ───────────────────────────────────│
│                                     │
│ Plan pracy:                         │
│                                     │
│ Koszt: ~ 8k tokenów (ok. $0.50)     │
│                                     │
│ □ Krok 1: Przygotuj listę pytań... │
│ □ Krok 2: Zidentyfikuj wzorce...   │
│ □ Krok 3: Zapisz rekomendacje...   │
│                                     │
│ ┌─────────────────────────────────┐│
│ │   [Tak, Zaczynaj]               ││ ← Primary
│ └─────────────────────────────────┘│
│                                     │
│ [Zmień Plan]                        │ ← Secondary (back to context)
│                                     │
└─────────────────────────────────────┘

Behavior:
- Plan is read-only
- "Tak, Zaczynaj" → Transitions to Working state
- "Zmień Plan" → Returns to Missing Context (editable)

### Agent: Working

┌─────────────────────────────────────┐
│ ⚡ Agent: Customer Interview Agent  │
│ ───────────────────────────────────│
│                                     │
│ Aktualnie pracuję dla Ciebie...    │
│                                     │
│ [▓▓▓▓▓▓▓▓▓▓░░░░░░] 45%             │
│                                     │
│ Live Thoughts:                      │
│ ☑ Przygotowałam strukturę           │
│ ☑ Przeanalizowałam odpowiedzi       │
│ ⚙️ Zbieram dane z API...            │
│                                     │
│ Szczegóły:                          │
│ • Minęło: 1 min 20 s                │
│ • Zużyto: 3,200 tokenów             │
│ • Pozostało: ~90 s                  │
│ • Szacowane total: ~7,000 tokenów   │
│                                     │
│ [Zatrzymaj pracę]                   │ ← Stop button
│                                     │
└─────────────────────────────────────┘

Behavior:
- Progress bar updates in real-time (WebSocket)
- Live thoughts stream in
- Checkboxes auto-check as steps complete
- Stop button → Cancels execution (confirmation modal)

### Agent: Consultation

┌─────────────────────────────────────┐
│ 💬 Agent: Customer Interview Agent  │
│ ───────────────────────────────────│
│                                     │
│ Pytanie:                            │
│                                     │
│ Dla kogo jest ten produkt?          │
│ B2B czy B2C?                        │
│                                     │
│ ┌───────────────────────────────┐  │
│ │ [Wpisz odpowiedź...]           │  │
│ │                                │  │
│ │                                │  │
│ └───────────────────────────────┘  │
│                                     │
│ [Wyślij odpowiedź]                  │
│                                     │
└─────────────────────────────────────┘

Behavior:
- Chat-like interface
- Agent question shown in bubble
- User types answer
- Send → Agent continues working
- Supports multiple back-and-forth

### Agent: Done

┌─────────────────────────────────────┐
│ ✅ Agent: Customer Interview Agent  │
│ ───────────────────────────────────│
│                                     │
│ Twój raport jest gotowy              │
│                                     │
│ Całkowity czas: 4 min               │
│ Całkowite zużycie: 6,800 tokenów    │
│                                     │
│ Rezultaty:                          │
│ • Zidentyfikowano 5 głównych pain points │
│ • Przygotowano strukturę wywiadów   │
│ • Wygenerowano rekomendacje         │
│                                     │
│ Artifacts:                          │
│ ┌───────────────────────────────┐  │
│ │ 📄 interview_summary.md        │  │
│ │ [View] [Download]              │  │
│ └───────────────────────────────┘  │
│                                     │
│ [Nowe zadanie]  [Historia Wersji]  │
│                                     │
│ [Szczegóły ▼]                       │ ← Collapsible
│                                     │
└─────────────────────────────────────┘

Behavior:
- Success state with summary
- Artifacts ready for download/view
- "Nowe zadanie" → Resets to Missing Context
- "Historia Wersji" → Shows execution history
- "Szczegóły" → Expands full logs, metrics


### Agent: Error

┌─────────────────────────────────────┐
│ ❌ Agent: Customer Interview Agent  │
│ ───────────────────────────────────│
│                                     │
│ Wystąpił błąd podczas wykonywania   │
│                                     │
│ Error: LLM API timeout after 30s    │
│                                     │
│ [Szczegóły błędu ▼]                 │ ← Collapsible
│ │ Technical details:                │
│ │ Status code: 504                  │
│ │ Provider: OpenAI                  │
│ │ Model: gpt-4o                     │
│ │ Timestamp: 2026-02-14 15:23:45    │
│ │                                   │
│ │ Logs:                             │
│ │ [Full log output...]              │
│ └──────────────────────────────────│
│                                     │
│ [Spróbuj ponownie]  [Edytuj context]│
│                                     │
└─────────────────────────────────────┘

Behavior:
- Error message prominent
- Details collapsible (for technical users)
- "Spróbuj ponownie" → Retries execution
- "Edytuj context" → Back to Missing Context (maybe issue with inputs)

### Template Node: Actions Checklist

┌─────────────────────────────────────┐
│ 📝 Template: Analiza Konkurencji    │
│ ───────────────────────────────────│
│                                     │
│ Actions (To-Do):                    │
│ Progress: 1/6 Actions Done          │
│ [▓▓░░░░░░░░░░░░░░] 17%             │
│                                     │
│ ☑ Zidentyfikuj grupę odbiorców      │ Completed
│ ⚙️ Sprawdź ceny                     │ In Progress
│ ☐ Znajdź Keywords                   │ Pending
│ ☐ Spisz wnioski                     │ Pending
│ ☐ Komunikacja                       │ Pending
│ ☐ Marketing                         │ Pending
│                                     │
│ + Dodaj Akcję                       │
│                                     │
│ [Standard Context/Artifacts below]  │
│                                     │
└─────────────────────────────────────┘

Behavior:
- Checklist items from template markdown
- User can manually check/uncheck
- Progress bar auto-updates
- Useful for manual workflows alongside AI

### Crew Hierarchical: Manager Briefing: Briefing State

┌─────────────────────────────────────┐
│ 👥 Crew: Research Team (Hierarchical)│
│ ───────────────────────────────────│
│                                     │
│ Manager Briefing:                   │
│                                     │
│ 🤖 Manager: Social Media Manager    │
│                                     │
│ Plan Ready (Needs Approval):        │
│                                     │
│ Proposed Sequence:                  │
│ 1. Social Media Analyzer            │
│    → Task: Pobierz cenniki z 5 stron│
│ 2. Data Analyst                     │
│    → Task: Wylicz średnią i medianę │
│                                     │
│ Koszt: ~ 8k tokenów (ok. $0.50)     │
│                                     │
│ [Zatwierdź kolejkę]  [Edytuj Cele]  │
│                                     │
└─────────────────────────────────────┘

#### Crew Hierarchical: Manager Briefing: Working State

┌─────────────────────────────────────┐
│ 👥 Crew: Research Team (Hierarchical)│
│ ───────────────────────────────────│
│                                     │
│ Manager Briefing:                   │
│                                     │
│ 🤖 Manager: Social Media Manager    │
│                                     │
│ Plan Ready (Needs Approval):        │
│                                     │
│ Proposed Sequence:                  │
│ 1. Social Media Analyzer            │
│    → Task: Pobierz cenniki z 5 stron│
│ 2. Data Analyst                     │
│    → Task: Wylicz średnią i medianę │
│                                     │
│ Koszt: ~ 8k tokenów (ok. $0.50)     │
│                                     │
│ [Zatwierdź kolejkę]  [Edytuj Cele]  │
│                                     │
└─────────────────────────────────────┘

### Breadcrumbs

[Section] > [Subsection] > [Page] > [Current Item]
   ↓           ↓             ↓            ↓
clickable  clickable    clickable   not clickable (current)

Resources > Knowledge Base > PM Hub > Roadmap_2025.md
Settings > LLMs > Providers > OpenAI
Workspaces > Discovery > Agents > Web Researcher

Styling:
- Separator: > 
- Clickable items: Blue text, hover underline
- Current item: Black/gray text, bold, no hover