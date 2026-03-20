# Axon Internal Tools Dev Env (`axon-tools`)

Narzędzie CLI oraz lokalny panel webowy do testowania Internal Tools dla aplikacji Axon i frameworka CrewAI.

## Wymagania

- Python >= 3.10

## Instalacja z repozytorium (deweloperska)

W katalogu `packages/axon-tools/cli`:

```bash
pip install -e .
```

Oraz budowanie frontendu:

```bash
cd packages/axon-tools/ui
npm install
npm run build
```

Pliki z katalogu `out` zostaną automatycznie przeniesione do paczki Pythonowej (zgodnie z `next.config.ts`).

## Uruchamianie

W katalogu, w którym znajdują się Twoje narzędzia w Pythonie (pliki z dekoratorami `@tool`):

```bash
axon-tools dev .
```

Aplikacja uruchomi się pod adresem: `http://localhost:8000`

## Funkcje

- **Automatyczne skanowanie**: Wyszukuje funkcje z dekoratorem `@tool`.
- **Interaktywne testowanie**: Formularz na podstawie argumentów funkcji. Obejmuje `stdout` i podaje błędy bez przerywania działania.
- **Synchronizacja**: Możliwość automatycznego przesłania narzędzia do głównej aplikacji Axon poprzez kliknięcie "Synchronizuj z Axon" po pomyślnym wykonaniu testu. Zależy to od uruchomionego backendu Axon (domyślnie 8080).
