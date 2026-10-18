# AI Tetris JS

Sztuczna inteligencja, która uczy się grać w Tetrisa za pomocą **algorytmu genetycznego**.
Napisana w czystym JavaScripcie (bez bibliotek), działa w całości w przeglądarce.

Na ekranie jednocześnie toczy się 8 gier. Każdą prowadzi inny osobnik populacji. Po każdej
epoce (generacji) najlepszy osobnik jest zapisywany, a z jego wag powstaje kolejne pokolenie.

## Uruchomienie

Nie trzeba niczego instalować ani budować.

1. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/TheBard368/AI_Tetris_JS.git
   ```
2. Otwórz plik `mytetris.html` w przeglądarce (Chrome, Edge, Firefox).

Opcjonalnie możesz uruchomić prosty serwer lokalny, np. `npx serve .` albo
`python -m http.server`, i wejść na `http://localhost:8000/mytetris.html`.
Projekt działa też na **GitHub Pages**: włącz Pages dla gałęzi `main` i otwórz
`https://<twoj-login>.github.io/AI_Tetris_JS/mytetris.html`.

## Menu

Po otwarciu strony pojawia się menu:

| Opcja | Działanie |
|---|---|
| **Nowy trening od początku** | Tworzy populację z losowymi wagami i trenuje przez podaną liczbę epok (0 = bez limitu). |
| **Kontynuuj trening z wybranego modelu** | Pierwszy osobnik to dokładnie wybrany model, pozostałe to jego zmutowane kopie. Numeracja epok jest kontynuowana. |
| **Pokaż grę wybranego modelu** | Wszystkie 8 plansz gra tym samym modelem, bez ewolucji. Przydaje się do oceny modelu. |
| **Importuj z pliku / Eksportuj do pliku** | Wczytanie lub pobranie zapisanych epok w formacie JSON. |
| **Usuń zapisy** | Czyści listę zapisanych epok w przeglądarce. |

Podczas treningu na górze widać pasek stanu: numer epoki, liczbę grających AI, rekord
i wynik ostatniej epoki. Możesz tam zmienić **szybkość** (ile ruchów wykonuje AI w jednym
takcie), wyeksportować zapisy i wrócić do menu.

## Zapisywanie najlepszych epok

- Po każdej epoce najlepszy osobnik (wagi, wynik, liczba klocków, data) trafia do
  `localStorage` przeglądarki pod kluczem `aiTetris.savedEpochs`.
- Lista jest posortowana od najlepszego wyniku i ograniczona do **20** najlepszych epok
  ze wszystkich treningów. Słabsze wpisy są usuwane automatycznie.
- Zapis w `localStorage` działa tylko w tej przeglądarce i na tym komputerze. Żeby
  przenieść modele, użyj **Eksportuj do pliku**. Pobierzesz plik `ai-tetris-epoki.json`,
  który potem wczytasz przyciskiem **Importuj z pliku**.

Przykładowy plik eksportu:

```json
{
  "app": "AI_Tetris_JS",
  "version": 1,
  "exportedAt": "2026-10-18T12:00:00.000Z",
  "epochs": [
    {
      "id": "mgx1abc-7",
      "runId": "mgx1abc",
      "generation": 7,
      "fitness": 5321,
      "score": 5100,
      "pieces": 221,
      "date": "2026-10-18T11:58:12.000Z",
      "weights": {
        "holes": 176.4,
        "chasms": 141.2,
        "bumpiness": 38.9,
        "pillars": 11.3,
        "totalPillarsHeight": 19.7,
        "height": 118.0,
        "tetrised": 104.5
      }
    }
  ]
}
```

## Jak działa AI

### Wybór ruchu

Dla każdego nowego klocka AI:

1. Przeszukuje wszerz (BFS) wszystkie pozycje, do których klocek może dotrzeć ruchami
   w lewo, w prawo, w dół oraz obrotami (z wall kickami SRS). To samo robi dla następnego
   klocka, bo można go zamienić z bieżącym.
2. Dla każdej pozycji końcowej wstawia klocek na kopię planszy, usuwa pełne linie
   i liczy **koszt** planszy:

   ```
   koszt = w_holes·dziury + w_chasms·szczeliny + w_bumpiness·nierówność
         + w_pillars·filary + w_totalPillarsHeight·wysokość_filarów
         + w_height·wysokość − w_tetrised·tetris
   ```

   | Cecha | Znaczenie |
   |---|---|
   | dziury (`holes`) | puste pola zakryte od góry |
   | szczeliny (`chasms`) | puste pola pod blokami, które da się jeszcze zapełnić wsuwając klocek z boku |
   | nierówność (`bumpiness`) | suma różnic wysokości sąsiednich kolumn |
   | filary (`pillars`) | kolumny różniące się od sąsiada o więcej niż 2 pola |
   | wysokość (`height`) | wysokość najwyższej kolumny |
   | tetris (`tetrised`) | 1, jeśli ruch usuwa 4 linie naraz (nagroda) |

   Pozycja, w której klocek wystaje ponad planszę, dostaje ogromną karę, bo kończy grę.
3. Wybiera pozycję o najniższym koszcie i wykonuje zapisaną sekwencję ruchów (BFS daje
   najkrótszą). Na końcu dociska klocek w dół.

### Algorytm genetyczny

- **Osobnik** (`Phenotype`) to zestaw 7 wag funkcji kosztu.
- **Przystosowanie** (fitness) to wynik gry plus liczba postawionych klocków. Mały bonus za
  przetrwanie odróżnia osobniki, zanim którykolwiek zdobędzie punkty.
- **Selekcja z elitaryzmem**: najlepszy osobnik przechodzi do następnej epoki bez zmian.
- **Krzyżowanie równomierne**: każda waga dziecka pochodzi losowo od najlepszego osobnika
  albo od innego członka populacji.
- **Mutacja**: każda waga z prawdopodobieństwem 10% jest mnożona przez losową liczbę
  z przedziału [0.9, 1.1].

Parametry są na początku pliku [`AI.js`](AI.js) (`BASE_WEIGHTS`, `MUTATION_RATE`, `MUTATION_RANGE`, ...).

## Struktura projektu

| Plik | Zawartość |
|---|---|
| [`mytetris.html`](mytetris.html) | Strona: canvas, menu, pasek stanu |
| [`mytetris.js`](mytetris.js) | Punkt wejścia: menu, pętla treningu i pokazu, obsługa interfejsu |
| [`Game.js`](Game.js) | Logika gry: ruchy, obroty SRS, usuwanie linii, punktacja, poziomy |
| [`Piece.js`](Piece.js) | Klocki (`Box`, `Piece`) i kształty 7 tetromin |
| [`Draw.js`](Draw.js) | Rysowanie 8 plansz na canvasie |
| [`AI.js`](AI.js) | `Phenotype` (AI jednej gry) i `Population` (algorytm genetyczny) |
| [`BoardState.js`](BoardState.js) | Macierz planszy do analizy i liczenie cech funkcji kosztu |
| [`CheckedPositions.js`](CheckedPositions.js) | `PieceVM` (wirtualny klocek do symulacji ruchów) i zbiór odwiedzonych pozycji BFS |
| [`MovePlan.js`](MovePlan.js) | Kolejka ruchów do wykonania |
| [`Storage.js`](Storage.js) | Zapis, odczyt, eksport i import najlepszych epok |

## Najważniejsze poprawki względem poprzedniej wersji

- Plik `AI.js` był wczytywany pod złą nazwą (`Ai.js`). Na serwerach rozróżniających
  wielkość liter (np. GitHub Pages) skrypt się nie ładował.
- `clearTimeout()` bez argumentu nie zatrzymywał timera gry. Po każdym resecie przybywało
  timerów i klocki opadały coraz szybciej.
- `start()` nadpisywał metodę `pause()` (`this.pause = false`).
- Funkcja `random(a, b)` zwracała liczby z zakresu [0, 1.7) zamiast [a, b), więc mutacje
  i wagi początkowe były przypadkowe.
- Usuwanie linii w grze gubiło kolejne pełne linie, gdy nad usuwaną nie było bloków.
  Usuwanie linii w symulacji AI przesuwało wiersze w złym kierunku.
- Zamienione indeksy przy liczeniu szczelin i błędne liczenie wysokości planszy.
- Kolizje indeksów w tablicy odwiedzonych pozycji BFS. Część ruchów była pomijana.
- Mutacja nie obejmowała wag `height` i `tetrised`. Literówka w `weightsNames` psuła
  krzyżowanie jednopunktowe.
- Gdy wszystkie pozycje miały koszt powyżej 1 000 000, wybór ruchu kończył się błędem.
- Usunięto martwy i niedziałający kod (`selection2`, `needsMoveList`, globalna funkcja `direction`).

## Sterowanie ręczne (opcjonalne)

`new Game(id, true)` tworzy grę sterowaną klawiaturą:
←/→ ruch, ↑ obrót w prawo, Shift obrót w lewo, ↓ w dół, C zamiana klocka.
