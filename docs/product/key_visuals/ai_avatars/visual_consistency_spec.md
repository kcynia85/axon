# KOMPLETNA SPECYFIKACJA WIZUALNA: AI AGENTS "HUMAN STYLE"

Zoptymalizowana dla modelu: Nano Banana Pro (narrative brief mode)

## 1. FUNDAMENTY WIZUALNE (CORE DESIGN)

| Parametr | Wytyczna Techniczna | Cel |
| :--- | :--- | :--- |
| **Pochodzenie stylu** | **Wymagane** użycie linku do `image_5.png` jako obrazu referencyjnego (Style Reference). | Spójność oświetlenia i tekstur między agentami. |
| **Kompozycja/Kadrowanie** | Plan Średni (Medium Shot), od talii/pasa w górę, ale **wykadrowany luźno (loose framing)**. | Skupienie na twarzy przy zachowaniu profesjonalnej sylwetki. |
| **Margines Bezpieczeństwa (NOWE)** | **Musi istnieć mandatoryjny, widoczny margines czystego białego tła wokół całej postaci. Żaden element ciała (łokcie, ramiona, czubek głowy) nie może dotykać krawędzi kadru.** | Postać "pływa" wewnątrz karty, co ułatwia wdrażanie w UI bez obcinania elementów sylwetki. |
| **Format obrazu** | **Pionowy, format karty 2:3**. | Idealne dopasowanie do pionowej karty w interfejsie aplikacji. |
| **Kolorystyka** | Ścisły Monochrom (Strictly Black & White). | Nowoczesny, minimalistyczny i profesjonalny wygląd. |
| **Tło** | **Pure White (#FFFFFF)**, jednolite, bez cieni i tekstur. | Pełna izolacja postaci dla łatwego wdrażania w UI. |

## 2. PARAMETRY JAKOŚCIOWE (TECHNICAL FINE-TUNING)

* **Oświetlenie:** Miękkie studyjne, z wyraźnym światłem konturowym (Rim Light), aby "odkleić" postać od białego tła.
* **Detale Twarzy:** Wymagany żywy **Catchlight w oczach** (błysk) oraz realistyczne **Micro-detail on skin** (tekstura skóry, brak efektu plastiku).
* **Tekstura:** Wysoka szczegółowość i wyczuwalność materiałów ubrań (Palpable fabric textures).

## 3. ZMIENNE

### Płeć [PŁEĆ]

Wybierz tożsamość postaci, która najlepiej pasuje do danej roli.

* `female`
* `male`
* `non-binary`
* `androgynous`

### Kolor Skóry [KOLOR_SKÓRY]

Tonacja skóry pomaga generatorowi odpowiednio wyważyć kontrast w czerni i bieli.

* `fair` (jasna / blada)
* `olive` (oliwkowa)
* `tan` (śniada / opalona)
* `dark` (ciemna)
* `deep dark` (bardzo ciemna / głęboka)

### Cechy Wyglądu [CECHY_WYGLĄDU]

Wybierz fryzurę i ewentualny zarost. Generatory najlepiej radzą sobie z prostymi, fizycznymi opisami.

* `short professional curly hair` (krótkie, profesjonalne loki)
* `long straight hair tucked behind ears` (długie proste włosy, założone za uszy)
* `shoulder-length wavy hair` (falowane włosy do ramion)
* `neat short natural texture hair` (krótkie naturalne włosy/afro)
* `elegant slicked-back bun` (elegancki gładki kok)
* `short neat styled hair and a clean-shaven face` (krótkie włosy, gładko ogolony)
* `neat short beard and styled hair` (krótka, zadbana broda, ułożone włosy)
* `short textured dark hair with a well-groomed stubble` (krótkie włosy, zadbany kilkudniowy zarost)
* `bald with a neat goatee` (łysy z zadbaną bródką)
* `silver hair with a modern professional cut` (siwe włosy, nowoczesne cięcie – dla eksperta/seniora)

### Specjalność [SPECJALNOŚĆ]

Nadaje postaci odpowiedni kontekst i subtelnie wpływa na jej "vibe" (pewność siebie, otwartość).

* `wealth management and investment strategy` (Finanse / Doradztwo)
* `corporate law and financial compliance` (Prawo / Biznes)
* `cybersecurity and risk assessment` (IT / Bezpieczeństwo)
* `data science and predictive analytics` (IT / Analityka)
* `cloud architecture and systems engineering` (IT / Inżynieria)
* `brand strategy and creative direction` (Marketing / Strategia)
* `UX/UI design and user research` (Projektowanie / UX)
* `human resources and employee wellness` (HR / Dobrostan)
* `customer success and empathetic support` (Obsługa Klienta / Wsparcie)
* `medical consulting and health wellness` (Medycyna / Zdrowie)

### Styl Ubioru [STYL_UBIORU]

Zgodnie z naszymi ustaleniami, ubiór determinuje ostateczny charakter wizualny agenta.

* `a tailored dark blazer over a high-quality charcoal turtleneck` (Styl: Modern Executive)
* `a premium textured tech-material zip-up jacket` (Styl: Tech Minimalist)
* `a dark textured linen shirt with a mandarin collar` (Styl: Creative Professional)
* `a high-quality textured cashmere crewneck sweater` (Styl: Soft Business)

---

## 4. MASTER PROMPT TEMPLATE (OPT. NANO BANANA PRO)

*Użyj poniższej, narracyjnej formy briefu. Skopiuj całość, uzupełniając zmienne w nawiasach kwadratowych. Zmiana dotycząca marginesu została zintegrowana z tekstem.*

> **[ATTACHED EXAMPLE]** Create a high-end, strictly monochrome wertykalny format 2:3 professional photograph, using the attached reference image as a strict style reference (Sref) for lighting and quality. The subject is a **[PŁEĆ]** AI agent, who is an expert specializing in **[SPECJALNOŚĆ]**. They have **[KOLOR_SKÓRY]** skin tone and **[CECHY_WYGLĄDU]**, looking directly into the camera lens with a confident, friendly, and approachable smile. They are wearing **[STYL_UBIORU]**. The entire figure is isolated against a seamless, flawlessly uniform solid pure white background. **The composition is a loose medium shot from the waist up, maintaining a clear and mandatory margin of negative pure white space surrounding the entire figure; no part of the body, including elbows or head, must touch the frame edges.** Studio lighting is crisp yet soft, creating rich black and white tones. Ensure high fidelity micro-details are present in both skin and fabric textures, and there is a lively catchlight in their eyes. Focus is sharp. Strictly minimalist aesthetic, no graphics.

---

## 5. PRZYKŁAD GOTOWEGO PROMPTU (DO KOPIOWANIA)

*Przykładowa konfiguracja: Kobieta, Specjalistka IT, Tech Minimalist, z poprawnym kadrowaniem.*

`https://s.mj.run/image_5.png Create a high-end, strictly monochrome wertykalny format 2:3 professional photograph, using the attached reference image as a strict style reference (Sref) for lighting and quality. The subject is a female AI agent, who is an expert specializing in technical systems and cybersecurity. They have fair skin tone and short professional hair, looking directly into the camera lens with a confident, friendly, and approachable smile. Wearing a premium textured tech-material zip-up jacket. Isolated against a seamless, flawlessly uniform solid pure white background. The composition is a loose medium shot from the waist up, maintaining a clear and mandatory margin of negative pure white space surrounding the entire figure; no part of the body, including elbows or head, must touch the frame edges. Studio lighting is crisp yet soft, creating rich black and white tones. Ensure high fidelity micro-details are present in both skin and fabric textures, and there is a lively catchlight in their eyes. Focus is sharp. Strictly minimalist aesthetic, no graphics.`
