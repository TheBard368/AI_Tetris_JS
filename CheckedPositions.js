/**
 * CheckedPositions.js – narzędzia do przeszukiwania możliwych ruchów przez AI.
 *
 *  - CheckedPositions – zbiór pozycji (x, y, obrót) odwiedzonych już w trakcie BFS,
 *  - PieceVM – "wirtualny" klocek poruszany po kopii planszy (BoardState), który zapamiętuje
 *    historię swoich ruchów (MovePlan). Zasady ruchu i obrotów (wall kicki SRS) są identyczne
 *    jak w Game.js, więc zaplanowana sekwencja da się odtworzyć w prawdziwej grze.
 */

class CheckedPositions{
    /**
     * Poprawka: wcześniej pozycje mapowano na indeks x + 10*(y+1) + 210*r w tablicy 840 elementów.
     * Dla x < 0 lub x > 9 (możliwe, bo x to środek klocka, a nie jego lewa krawędź) oraz dla
     * y > 19 indeksy nachodziły na siebie i część pozycji była błędnie uznawana za sprawdzoną.
     * Teraz używamy zbioru Set z kluczem tekstowym – każda pozycja ma unikalny klucz.
     */
    constructor(){
        this.checkedPositions = new Set();
    }

    static key(x, y, r){
        return x + "," + y + "," + r;
    }

    hasPositionBeenChecked(x, y, r) {
        return this.checkedPositions.has(CheckedPositions.key(x, y, r));
    }

    setChecked(x, y, r) {
        this.checkedPositions.add(CheckedPositions.key(x, y, r));
    }
}

class PieceVM{
    constructor(x, y, type){
        this.x = x;
        this.y = y;
        this.type = type;
        this.rotation = 0;
        this.moveHistory = new MovePlan();  // ruchy prowadzące od pozycji startowej do bieżącej
    }

    // RUCHY ZMIENIAJĄ POŁOŻENIE I ZWRACAJĄ MOŻLIWOŚĆ RUCHU (true = ruch wykonany i zapisany w historii)

    //obrót w lewo z próbą "wall kicków" (Super Rotation System)
    rotateL(analizesMatrix){
        var prevRotation = this.rotation;
        this.rotation--;
        if(this.rotation<0)this.rotation=3;

        if(!analizesMatrix.isPieceLegal(this)){
            // wall kick w prawo (SUPER ROTATION SYSTEM); y maja przeciwne wartosci w stosunku do zwyklego tetrisa 
            if(this.type != linTetr){
                switch(prevRotation){
                    case 0:
                        this.x++;
                        if(!analizesMatrix.isPieceLegal(this)){
                            this.y--;
                            if(!analizesMatrix.isPieceLegal(this)){
                                this.x--;
                                this.y+=3;
                                if(!analizesMatrix.isPieceLegal(this)){
                                    this.x++;
                                    if(!analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x--;
                                        this.y-=2;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                    case 1:
                        this.x++;
                        if(!analizesMatrix.isPieceLegal(this)){
                            this.y++;
                            if(!analizesMatrix.isPieceLegal(this)){
                                this.x--;
                                this.y-=3;
                                if(!analizesMatrix.isPieceLegal(this)){
                                    this.x++;
                                    if(!analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x--;
                                        this.y+=2;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                    case 2:
                        this.x--;
                        if(!analizesMatrix.isPieceLegal(this)){
                            this.y--;
                            if(!analizesMatrix.isPieceLegal(this)){
                                this.x++;
                                this.y+=3;
                                if(!analizesMatrix.isPieceLegal(this)){
                                    this.x--;
                                    if(!analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x++;
                                        this.y-=2;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                    case 3:
                        this.x--;
                        if(!analizesMatrix.isPieceLegal(this)){
                            this.y++;
                            if(!analizesMatrix.isPieceLegal(this)){
                                this.x++;
                                this.y-=3;
                                if(!analizesMatrix.isPieceLegal(this)){
                                    this.x--;
                                    if(!analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x++;
                                        this.y+=2;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
        
                }
            }
            else{
                switch(this.rotation){
                    case 0:
                        this.x--;
                        if(!analizesMatrix.isPieceLegal(this)){
                            this.x+=3;
                            if(!analizesMatrix.isPieceLegal(this)){
                                this.x-=3;
                                this.y-=2;
                                if(!analizesMatrix.isPieceLegal(this)){
                                    this.x+=3;
                                    this.y+=3;
                                    if(!analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x-=2;
                                        this.y++;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                    case 1:
                        this.x+=2;
                        if(!analizesMatrix.isPieceLegal(this)){
                            this.x-=3;
                            if(!analizesMatrix.isPieceLegal(this)){
                                this.x+=3;
                                this.y--;
                                if(!analizesMatrix.isPieceLegal(this)){
                                    this.x-=3;
                                    this.y+=3;
                                    if(!analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x--;
                                        this.y-=2;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                    case 2:
                        this.x++;
                        if(!analizesMatrix.isPieceLegal(this)){
                            this.x-=3;
                            if(!analizesMatrix.isPieceLegal(this)){
                                this.x+=3;
                                this.y+=2;
                                if(!analizesMatrix.isPieceLegal(this)){
                                    this.x-=3;
                                    this.y-=3;
                                    if(!analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x+=2;
                                        this.y--;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                    case 3:
                        this.x-=2;
                        if(!analizesMatrix.isPieceLegal(this)){
                            this.x+=3;
                            if(!analizesMatrix.isPieceLegal(this)){
                                this.x-=3;
                                this.y++;
                                if(!analizesMatrix.isPieceLegal(this)){
                                    this.x+=3;
                                    this.y-=3;
                                    if(!analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x--;
                                        this.y+=2;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                }
            }
        }
        this.moveHistory.addRotateLeft();
        return true;
    }

    //obrót w prawo z próbą "wall kicków" (Super Rotation System)
    rotateR(analizesMatrix){
        var prevRotation = this.rotation;
        this.rotation++;
        if(this.rotation>3)this.rotation=0;

        if(!analizesMatrix.isPieceLegal(this)){
            // wall kick w prawo (SUPER ROTATION SYSTEM); y maja przeciwne wartosci w stosunku do zwyklego tetrisa 
            if(this.type != linTetr){
                switch(prevRotation){
                    case 0:
                        this.x--;
                        if(!analizesMatrix.isPieceLegal(this)){
                            this.y--;
                            if(!analizesMatrix.isPieceLegal(this)){
                                this.x++;
                                this.y+=3;
                                if(!analizesMatrix.isPieceLegal(this)){
                                    this.x--;
                                    if(!analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x++;
                                        this.y-=2;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                    case 1:
                        this.x++;
                        if(!analizesMatrix.isPieceLegal(this)){
                            this.y++;
                            if(!analizesMatrix.isPieceLegal(this)){
                                this.x--;
                                this.y-=3;
                                if(!analizesMatrix.isPieceLegal(this)){
                                    this.x++;
                                    if(!analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x--;
                                        this.y+=2;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                    case 2:
                        this.x++;
                        if(!analizesMatrix.isPieceLegal(this)){
                            this.y--;
                            if(!analizesMatrix.isPieceLegal(this)){
                                this.x--;
                                this.y+=3;
                                if(!analizesMatrix.isPieceLegal(this)){
                                    this.x++;
                                    if(!analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x--;
                                        this.y-=2;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                    case 3:
                        this.x--;
                        if(!analizesMatrix.isPieceLegal(this)){
                            this.y++;
                            if(!analizesMatrix.isPieceLegal(this)){
                                this.x++;
                                this.y-=3;
                                if(!analizesMatrix.isPieceLegal(this)){
                                    this.x--;
                                    if(!analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x++;
                                        this.y+=2;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
        
                }
            }
            else{
                switch(this.rotation){
                    case 0:
                        this.x-=2;
                        if(!analizesMatrix.isPieceLegal(this)){
                            this.x+=3;
                            if(!analizesMatrix.isPieceLegal(this)){
                                this.x-=3;
                                this.y++;
                                if(!analizesMatrix.isPieceLegal(this)){
                                    this.x+=3;
                                    this.y-=3;
                                    if(!analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x--;
                                        this.y+=2;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                    case 1:
                        this.x--;
                        if(!analizesMatrix.isPieceLegal(this)){
                            this.x+=3;
                            if(!analizesMatrix.isPieceLegal(this)){
                                this.x-=3;
                                this.y-=2;
                                if(!analizesMatrix.isPieceLegal(this)){
                                    this.x+=3;
                                    this.y+=3;
                                    if(!analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x-=2;
                                        this.y++;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                    case 2:
                        this.x+=2;
                        if(!analizesMatrix.isPieceLegal(this)){
                            this.x-=3;
                            if(!analizesMatrix.isPieceLegal(this)){
                                this.x+=3;
                                this.y--;
                                if(!analizesMatrix.isPieceLegal(this)){
                                    this.x-=3;
                                    this.y+=3;
                                    if(!analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x--;
                                        this.y-=2;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                    case 3:
                        this.x++;
                        if(!analizesMatrix.isPieceLegal(this)){
                            this.x-=3;
                            if(!analizesMatrix.isPieceLegal(this)){
                                this.x+=3;
                                this.y+=2;
                                if(!analizesMatrix.isPieceLegal(this)){
                                    this.x-=3;
                                    this.y-=3;
                                    if(!analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x+=2;
                                        this.y--;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                }
            }
        }
        this.moveHistory.addRotateRight();
        return true;

    }

    moveDown(analizesMatrix){
        this.y++;
        if(!analizesMatrix.isPieceLegal(this)){
            this.y--;
            return false;
        }

        this.moveHistory.addMoveDown();
        return true;
    }

    //sprawdza, czy klocek może zjechać niżej (bez zmiany położenia i historii)
    canMoveDown(analizesMatrix){
        this.y++;
        if(!analizesMatrix.isPieceLegal(this)){
            this.y--;
            return false;
        }

        this.y--;
        return true;
    }

    moveRight(analizesMatrix){
        this.x++;
        if(!analizesMatrix.isPieceLegal(this)){
            this.x--;
            return false;
        }
        this.moveHistory.addMoveRight();
        return true;
    }

    moveLeft(analizesMatrix){
        this.x--;
        if(!analizesMatrix.isPieceLegal(this)){
            this.x++;
            return false;
        }
        this.moveHistory.addMoveLeft();
        return true;
    }

    //głęboka kopia klocka razem z historią ruchów
    clone(){
        var piece = new PieceVM(this.x, this.y, this.type);
        piece.rotation = this.rotation;
        piece.moveHistory = this.moveHistory.clone();
        return piece;
    }
}