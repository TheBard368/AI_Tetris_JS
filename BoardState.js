/**
 * BoardState.js – uproszczony obraz planszy, na którym "myśli" AI.
 *
 * Plansza to macierz 20 wierszy x 10 kolumn (0 = puste pole, 1 = zajęte).
 * Wiersz 0 to góra planszy. Klasa pozwala:
 *  - odczytać stan prawdziwej gry (updateMatrix),
 *  - "wstawić" klocek na próbę na kopii planszy (pushPieceIn),
 *  - policzyć cechy planszy używane w funkcji kosztu AI (analyze).
 */

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

//tworzy pustą macierz planszy
function createEmptyMatrix(){
    var matrix = [];
    for(var i=0; i<BOARD_HEIGHT; i++){
        matrix.push(new Array(BOARD_WIDTH).fill(0));
    }
    return matrix;
}

class BoardState{
    constructor(){
        this.analizingMatrix = createEmptyMatrix();
        this.pieceCount = 0;
        this.holes = 0;
        this.chasms = 0;
        this.bumpiness = 0;
        this.height = 0;            // wysokość najwyższej kolumny
        this.holesDepth = 0;        // suma liczby bloków nad dziurami (obecnie nieużywane w koszcie)
        this.pillars = 0;
        this.totalPillarsHeight = 0;
        this.currentScore = 0;
        this.currentLevel = 0;
        this.gameDead = false;
        this.currentPiece = null;
        this.nextPiece = null;
        this.linesCleared = 0;      // ile linii usunęło ostatnie wstawienie klocka
        this.tetrised = 0;          // 0 - nie było tetrisa, 1 - był tetris (4 linie naraz)
        this.overflow = false;      // true - wstawiony klocek wystaje ponad planszę (koniec gry)
    }

    //kopia planszy wraz z bieżącym i następnym klockiem (cechy są liczone od nowa)
    clone(){
        var copy = new BoardState();

        for(let i=0; i<BOARD_HEIGHT; i++){
            for(let j=0; j<BOARD_WIDTH; j++){
                copy.analizingMatrix[i][j] = this.analizingMatrix[i][j];
            }
        }

        copy.currentPiece = this.currentPiece.clone();
        copy.nextPiece = this.nextPiece.clone();

        return copy;
    }

    //wstawia klocek (PieceVM) na planszę i usuwa ewentualne pełne linie
    pushPieceIn(piece){
        for(var i=0; i<4; i++){
            var box = piece.type[piece.rotation][i];
            if(piece.y + box.y >= 0){
                this.analizingMatrix[piece.y + box.y][piece.x + box.x] = 1;
            }
            else{
                // blok poza planszą – w prawdziwej grze oznacza to koniec gry
                this.overflow = true;
            }
        }
        this.areThereClearedLines();
    }

    /**
     * Usuwa pełne linie i przesuwa wyższe wiersze w dół.
     * Poprawka: poprzednia wersja przepisywała wiersze w złym kierunku (nadpisywała wiersze
     * poniżej usuniętej linii) i nie usuwała samej pełnej linii.
     */
    areThereClearedLines(){
        var remaining = this.analizingMatrix.filter(row => row.some(cell => cell == 0));
        this.linesCleared = BOARD_HEIGHT - remaining.length;

        while(remaining.length < BOARD_HEIGHT){
            remaining.unshift(new Array(BOARD_WIDTH).fill(0));
        }
        this.analizingMatrix = remaining;

        this.tetrised = this.linesCleared == 4 ? 1 : 0;
    }

    //odczytuje stan prawdziwej gry (Game) do macierzy
    updateMatrix(game){
        for(var i=0; i<BOARD_HEIGHT; i++){
            this.analizingMatrix[i].fill(0);
        }

        this.gameDead = game.gameDead;
        for(var i=0; i<game.down.length; i++){
            if(game.down[i].y>=0){
                this.analizingMatrix[game.down[i].y][game.down[i].x] = 1;
            }else{
                this.gameDead = true;
            }
        }

        // wynik aktualizujemy zawsze – inaczej punkty za ostatni klocek przed końcem gry by przepadały
        this.currentScore = game.score;
        this.currentLevel = game.level;

        // nowy klocek w grze – zapamiętujemy go, by AI mogło wyznaczyć nowy plan
        if(this.pieceCount != game.pieceCount){
            this.currentPiece = game.piece.clone();
            this.nextPiece = game.nextPiece.clone();
            this.pieceCount = game.pieceCount;
        }
    }

    //liczy wszystkie cechy planszy potrzebne do funkcji kosztu
    analyze(){
        this.countHolesAndChasms();
        this.countPillars();
        this.checkBumpiness();
    }

    //zwraca indeks pierwszego zajętego wiersza w kolumnie (20 = kolumna pusta)
    getColumnTop(column){
        var j;
        for(j = 0; j<BOARD_HEIGHT && this.analizingMatrix[j][column]==0; j++);
        return j;
    }

    /**
     * Liczy puste pola znajdujące się pod zajętymi polami:
     *  - chasms ("szczeliny") – pole da się jeszcze zapełnić wsuwając klocek z boku
     *    (dwa pola obok są puste, a pod polem obok jest podparcie),
     *  - holes (dziury) – pozostałe, całkowicie zakryte pola.
     */
    countHolesAndChasms(){
        this.holes = 0;
        this.chasms = 0;
        this.holesDepth = 0;
        var m = this.analizingMatrix;

        //petla sprawdza kolumna po kolumnie dziury w planszy
        for(var i=0; i<BOARD_WIDTH; i++){
            var foundBlock = false;
            var foundBlocksCount = 0;
            for(var j=0; j<BOARD_HEIGHT; j++){
                if(m[j][i] != 0){
                    foundBlock = true;
                    foundBlocksCount++;
                }else if(foundBlock){
                    this.holesDepth += foundBlocksCount;

                    // poprawka: wcześniej indeksy były zamienione (m[i+1][j+1] zamiast m[j+1][i+1])
                    //sprawdzenie prawej
                    if(i < BOARD_WIDTH-2 && m[j][i+1] == 0 && m[j][i+2] == 0 &&
                       (j == BOARD_HEIGHT-1 || m[j+1][i+1] != 0)){
                        this.chasms++;
                        continue;
                    }
                    //sprawdzenie lewej
                    if(i >= 2 && m[j][i-1] == 0 && m[j][i-2] == 0 &&
                       (j == BOARD_HEIGHT-1 || m[j+1][i-1] != 0)){
                        this.chasms++;
                        continue;
                    }

                    this.holes++;
                }
            }
        }
    }

    /**
     * Filar = kolumna różniąca się wysokością od lewego sąsiada o więcej niż 2.
     * Przy okazji liczona jest wysokość najwyższej kolumny.
     */
    countPillars(){
        this.pillars = 0;
        this.totalPillarsHeight = 0;
        this.height = 0;

        var prevTop = this.getColumnTop(0);

        for(var i = 0; i < BOARD_WIDTH; i++){
            var top = this.getColumnTop(i);
            var columnHeight = BOARD_HEIGHT - top;

            if(Math.abs(prevTop - top) > 2){
                this.pillars++;
                this.totalPillarsHeight += columnHeight;
            }
            // poprawka: wcześniej porównywano wysokość z indeksem wiersza (this.height < j)
            if(this.height < columnHeight) this.height = columnHeight;
            prevTop = top;
        }
    }

    //nierówność = suma różnic wysokości sąsiednich kolumn
    checkBumpiness(){
        this.bumpiness = 0;
        var prevTop = this.getColumnTop(0);

        for(var i = 1; i < BOARD_WIDTH; i++){
            var top = this.getColumnTop(i);
            this.bumpiness += Math.abs(top - prevTop);
            prevTop = top;
        }
    }

    //sprawdza legalność pozycji klocka (granice planszy i kolizje z zajętymi polami)
    isPieceLegal(piece){
        for(var i=0; i<4; i++){
            var x = piece.x + piece.type[piece.rotation][i].x;
            var y = piece.y + piece.type[piece.rotation][i].y;

            if(y > BOARD_HEIGHT-1 || x < 0 || x > BOARD_WIDTH-1) return false;

            // pola nad planszą (y < 0) są zawsze wolne
            if(y >= 0 && this.analizingMatrix[y][x] != 0) return false;
        }

        return true;
    }
}
