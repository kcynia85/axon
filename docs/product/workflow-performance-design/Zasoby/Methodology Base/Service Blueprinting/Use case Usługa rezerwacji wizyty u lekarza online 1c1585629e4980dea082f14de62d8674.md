# Use case: Usługa rezerwacji wizyty u lekarza online

Oto przykładowy **Service Blueprint** dla usługi **rezerwacji wizyty u lekarza online** w formie tabeli.

| **Etap** | **Customer Actions** (Działania klienta) | **Frontstage Actions** (Widoczne działania pracowników/systemu) | **Backstage Actions** (Niewidoczne działania) | **Support Processes** (Procesy wspierające) |
| --- | --- | --- | --- | --- |
| **1. Poszukiwanie lekarza** | Przegląda stronę, szuka lekarza według specjalizacji | System wyświetla listę lekarzy z wolnymi terminami | Algorytm sortuje lekarzy według dostępności i opinii | Baza danych lekarzy, ich harmonogramów i opinii |
| **2. Wybór lekarza i terminu** | Wybiera lekarza i godzinę wizyty | Formularz rezerwacji się ładuje | System sprawdza dostępność terminu | API kalendarza lekarzy |
| **3. Wprowadzenie danych** | Wpisuje swoje dane i potwierdza rezerwację | System wysyła kod potwierdzający na e-mail/SMS | Walidacja danych pacjenta | System autoryzacji i SMS gateway |
| **4. Potwierdzenie wizyty** | Odbiera SMS/e-mail z potwierdzeniem | Status wizyty zmienia się na „potwierdzona” | System zapisuje rezerwację w bazie | Baza rezerwacji i integracja z kalendarzem lekarza |
| **5. Przygotowanie do wizyty** | Przychodzi do kliniki / loguje się na wideowizytę | Recepcja prosi o potwierdzenie przybycia / System loguje pacjenta do wideokonsultacji | System przypomina lekarzowi o wizycie | System powiadomień i CRM |
| **6. Wizyta u lekarza** | Spotyka się z lekarzem osobiście lub online | Lekarz otwiera kartę pacjenta i prowadzi konsultację | System rejestruje notatki z wizyty | Elektroniczna dokumentacja pacjenta (EHR) |
| **7. Płatność za wizytę** | Płaci online lub na miejscu | System generuje fakturę i potwierdzenie płatności | Weryfikacja płatności | Integracja z systemem płatności |
| **8. Otrzymanie zaleceń** | Odbiera e-mail/SMS z zaleceniami i e-receptą | System wysyła podsumowanie wizyty | Przetwarzanie danych wizyty | System e-recept i aptek |
| **9. Opinia o usłudze** | Wystawia opinię o lekarzu/usłudze | System zachęca do oceny i analizy satysfakcji | Analiza opinii pacjentów | Narzędzie do analizy NPS/sentiment analysis |

To klasyczny przykład **Service Blueprint**, który można dostosować do różnych usług. Potrzebujesz jakichś modyfikacji lub innego przypadku użycia? 😊