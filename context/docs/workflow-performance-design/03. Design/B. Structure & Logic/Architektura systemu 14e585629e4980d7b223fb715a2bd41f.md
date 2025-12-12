# Architektura systemu

### Typowe pytania, na które odpowiada architekt oprogramowania:

<aside>

**Technologie frontendowe i backendowe**

- W jakim języku piszemy stronę/aplikację? (np. JavaScript z React dla frontendu, Python z Django dla backendu).
- Czy potrzebujemy frameworków, takich jak Next.js, Angular, czy może lepiej coś prostszego?

</aside>

<aside>

**Baza danych**

- Jaka baza danych najlepiej spełni wymagania projektu? (np. SQL - PostgreSQL dla ustrukturyzowanych danych, czy NoSQL - MongoDB dla elastycznych schematów).
- Czy baza musi obsługiwać duże ilości zapytań w czasie rzeczywistym?

</aside>

<aside>

**Skalowalność i wydajność**

- Jak zaprojektować system, aby radził sobie z rosnącym ruchem? (np. użycie load balancerów, rozwiązań serverless, czy skalowania horyzontalnego).
- Jak zarządzać sesjami użytkowników w środowisku rozproszonym?

</aside>

<aside>

**Integracje i API**:

- Jak systemy komunikują się ze sobą? REST API, GraphQL czy inne?
- Jakie narzędzia do integracji (np. middleware, webhooki) będą potrzebne?

</aside>

<aside>

**Bezpieczeństwo i dostępność**:

- Jakie środki ochrony danych wdrożyć? (np. szyfrowanie, polityki dostępu, uwierzytelnianie).
- Czy aplikacja wymaga ciągłej dostępności? Jak zapobiegać przestojom (np. strategie failover)?

</aside>

<aside>

**Hosting i środowisko uruchomieniowe**:

- Czy użyjemy chmury (AWS, GCP, Azure), czy lokalnych serwerów?
- Jakie narzędzia CI/CD wdrożyć, aby przyspieszyć procesy developerskie?

</aside>

### Kiedy to się dzieje?

<aside>

Te decyzje podejmowane są **po zdefiniowaniu system flows**, ponieważ:

- **System flows** wskazują, jakie procesy będą zachodzić wewnątrz systemu, co determinuje wymagania techniczne.
- Dopiero znając szczegóły logiki biznesowej i przepływów danych, można dobrać optymalne technologie.

</aside>