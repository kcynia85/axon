# AI & Law Compliance Checklist

> **Status:** Operational Standard
> **Context:** Ensuring legal and ethical safety when deploying AI in business.
> **Source:** Adapted from `Raw/AI-Business/.../Prawo i AI 287...md`

---

## 🛡️ 4 Filary Bezpieczeństwa AI

### 1. Dostawca (Vendor Risk)
*   [ ] **Wiarygodność:** Czy to znany gracz (Google, MS, OpenAI) czy "firma krzak"?
*   [ ] **Lokalizacja Danych:** Czy dane opuszczają EOG (Europejski Obszar Gospodarczy)?
*   [ ] **Zabezpieczenia:** Szyfrowanie, SOC2, ISO 27001.
*   [ ] **Kontrola:** Czy mogę usunąć dane po zakończeniu współpracy?

### 2. Dane (Data Governance)
*   [ ] **"Serce Firmy":** Zidentyfikowano dane krytyczne (tajemnica przedsiębiorstwa).
*   [ ] **Trening Modelu:** Czy moje dane są używane do trenowania publicznego modelu? (Wersje Enterprise zazwyczaj mają to wyłączone; Free - włączone).
*   [ ] **Zasada Zero Trust:** Poufnych danych (finanse, PII klientów) NIGDY nie wrzucamy do publicznych, darmowych narzędzi.

### 3. Treści (IP & Copyright)
*   [ ] **Własność:** Kto jest właścicielem outputu? (Większość płatnych licencji przekazuje prawa użytkownikowi).
*   [ ] **Komercyjne Użycie:** Czy licencja na to pozwala?
*   [ ] **Weryfikacja:** "Human-in-the-loop" dla każdej treści wychodzącej na zewnątrz (halucynacje).
*   [ ] **Transparentność:** Notka "Wspierane przez AI" tam, gdzie to buduje zaufanie.

### 4. Zespół (Policies & Culture)
*   [ ] **Polityka AI:** Spisany dokument (co wolno, czego nie).
*   [ ] **Shadow AI:** Edukacja zamiast zakazów (ludzie i tak będą używać, lepiej żeby robili to bezpiecznie).

---

## 🚦 Business vs Consumer AI (Różnice)

| Aspekt | Consumer AI (ChatGPT Plus, Gemini Adv.) | Business AI (Copilot for M365, Gemini Enterprise) |
| :--- | :--- | :--- |
| **Prywatność** | Dostawca widzi prompty. | Prompty są szyfrowane i prywatne. |
| **Trening** | Dane mogą uczyć model. | Dane NIE uczą modelu. |
| **Zastosowanie** | Testy, nauka, prywatne projekty. | Praca na danych firmowych, dokumenty. |

> **Złota zasada:** Do zadań firmowych używaj wyłącznie narzędzi z licencją Enterprise/Team, która gwarantuje "Data Privacy".
