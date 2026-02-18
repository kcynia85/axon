- Tips
    
    ## ✅ Finalny układ (canonical pattern)
    
    ### 1️⃣ Jedno query do pobrania danych
    
    **TanStack Query = transport + cache**
    
    - pobierasz **pełną listę Flow**
    - robisz to rzadko
    - cache jest źródłem prawdy
    
    ```tsx
    useQuery({
    queryKey: ['flows'],
    queryFn: fetchFlows,
    staleTime:5 *60 *1000,
    })
    
    ```
    
    Efekt:
    
    - brak fetchów na każde kliknięcie
    - brak debounce
    - brak migania UI
    
    ---
    
    ### 2️⃣ Lokalny stan wyszukiwania
    
    **UI state ≠ server state**
    
    ```tsx
    const [search, setSearch] =useState('')
    
    ```
    
    Efekt:
    
    - natychmiastowa reakcja na input
    - pełna kontrola UX
    - zero side effectów sieciowych
    
    ---
    
    ### 3️⃣ Filtrowanie po stronie klienta
    
    **Szybkie, deterministyczne, przewidywalne**
    
    ```tsx
    const filteredFlows =useMemo(() => {
    if (!search)return flows
    
    const q = search.toLowerCase()
    
    return flows.filter(flow =>
        flow.name.toLowerCase().includes(q) ||
        flow.tags?.some(tag => tag.toLowerCase().includes(q))
      )
    }, [flows, search])
    
    ```
    
    Efekt:
    
    - zero requestów
    - zero debounce
    - UX jak w natywnej aplikacji
    
    ---
    
    ## 🧠 Dlaczego to jest „właściwy standard”, a nie kompromis
    
    - **TanStack Query** robi to, co robi najlepiej
        
        → cache, refetch, synchronizacja
        
    - **React state** robi to, co robi najlepiej
        
        → szybkie interakcje
        
    - **Filtrowanie lokalne** robi to, co robi najlepiej
        
        → instant feedback
        
    
    Każda warstwa ma **jedną odpowiedzialność**.
    
    ---
    
    ## 🚨 Kiedy ten model przestaje wystarczać?
    
    Tylko gdy:
    
    - lista Flow ma **tysiące+ elementów**
    - potrzebujesz:
        - fuzzy search
        - semantycznego rankingu
        - paginacji
    
    Wtedy:
    
    - zostawiasz **lokalny state**
    - ale zmieniasz **strategię fetch**
    
    ---
    
    ## Bonus (opcjonalny, ale polecam)
    
    Jeśli lista urośnie:
    
    - zamień `filter` na **Fuse.js**
    - albo dodaj **AI suggestions** jako osobny async call
    
    To nadal **nie dotyka queryKey**.
    
    ---
    
    ## Jedno zdanie na koniec
    
    👉 **Tak — jedno query + lokalny state + client-side filtering to najlepszy, świadomy standard dla Twojego case’u.**
    
- **Wzorzec:** Jedno query do cache (`staleTime: 5min`) + Lokalne filtrowanie po stronie klienta (instant search).