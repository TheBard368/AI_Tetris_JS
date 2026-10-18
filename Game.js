/**
 * Game.js – logika pojedynczej gry w Tetrisa (plansza 10 x 20).
 *
 * Stan planszy:
 *  - this.piece / this.rotation – spadający klocek i jego obrót (0-3),
 *  - this.nextPiece – następny klocek (można go zamienić z bieżącym raz na klocek: swapPiece),
 *  - this.down – tablica bloków (Box), które już leżą na planszy, posortowana malejąco po y
 *    (od dołu planszy do góry).
 * Klocek opada samoczynnie co `droppingSpeed` ms (setTimeout), niezależnie od ruchów AI.
 * Każda zmiana stanu jest od razu rysowana (drawGame z Draw.js).
 */

//losuje nowy klocek w pozycji startowej
function randomPiece(){
    return new Piece(4, -1, Tetrominos[Math.floor(Math.random()*Tetrominos.length)]);
}

class Game{
    /**
     * @param {number} id numer gry – decyduje o miejscu planszy na canvasie
     * @param {boolean} humanControlled true = sterowanie klawiaturą (strzałki, góra/Shift = obrót)
     */
    constructor(id, humanControlled){
        if(humanControlled){
            document.addEventListener("keydown", this.direction.bind(this));
        }
        this.Id = id;
        this.game = null;   // uchwyt timera opadania klocka
        this.paused = true;
        this.initState();
    }

    //ustawia stan początkowy gry (wspólne dla konstruktora i reset)
    initState(){
        this.score = 0;
        this.level = 0;
        this.droppingSpeed = 800;
        this.amoutOfLinesCleared = 0;
        this.down=[];
        this.piece = randomPiece();
        this.nextPiece = randomPiece();
        this.piecesSwapped = false;
        this.rotation = 0;
        this.gameDead = false;
        this.pieceCount = 1;
    }

    //bieżącym klockiem staje się następny, losujemy nowy następny
    generateNextPiece(){
        this.rotation = 0;
        this.pieceCount++;
        this.piece = this.nextPiece;
        this.nextPiece = randomPiece();
    }

    //zamiana bieżącego klocka z następnym (dozwolona raz na każdy klocek)
    swapPiece(){
        if(!this.piecesSwapped){
            var pom = this.piece;
            this.rotation = 0;
            this.piece = this.nextPiece;
            this.nextPiece = pom;
            this.nextPiece.x = 4;
            this.nextPiece.y = -1;
            this.piecesSwapped = true;
            drawGame(this);
        }
    }

    //uruchamia samoczynne opadanie klocka
    start(){
        // poprawka: wcześniej było `this.pause = false`, co nadpisywało metodę pause()
        clearTimeout(this.game);
        this.paused = false;
        this.game = setTimeout(this.play.bind(this), this.droppingSpeed);
    }

    //jeden krok timera – klocek opada o jedno pole
    play(){
        if(this.gameDead || this.paused) return;

        this.movePieceDown();
        if(this.gameDead) return;

        this.game = setTimeout(this.play.bind(this), this.droppingSpeed);
    }

    //zatrzymuje samoczynne opadanie klocka
    pause(){
        this.paused = true;
        // poprawka: clearInterval()/clearTimeout() bez argumentu niczego nie zatrzymywało
        clearTimeout(this.game);
    }

    //nowa gra na tej samej planszy
    reset(){
        // poprawka: bez podania uchwytu stary timer działał dalej i po każdym resecie
        // przybywało timerów – klocki opadały coraz szybciej
        clearTimeout(this.game);
        this.initState();
        this.start();
    }

    //przesuwa klocek w dół; gdy nie może – blokuje go, usuwa pełne linie i losuje nowy klocek
    movePieceDown(){
        this.piece.y++;
        if(this.collisioncheck()){
            this.piece.y--;
            this.addDown();
            this.removeLine();
            if(this.end()){
                this.gameOver();
                return false;
            }
            if(this.piecesSwapped){
                this.piecesSwapped = false;
            }

            this.generateNextPiece();
           
        }
        drawGame(this);
        return true;
    }

    //ruchy w bok zwracają false, gdy ruch jest niemożliwy
    movePieceLeft(){
        this.piece.x--;
        if(this.collisioncheck()){
            this.piece.x++;
            return false;
        }

        drawGame(this);
        return true;
    }

    movePieceRight(){
        this.piece.x++;
        if(this.collisioncheck()){
            this.piece.x--;
            return false;
        }

        drawGame(this);
        return true;
    }


    /**
     * Obrót w lewo. Gdy obrócony klocek koliduje, próbujemy kolejnych przesunięć
     * ("wall kicków") według Super Rotation System – osobna tabela dla klocka I (linTetr).
     * Gdy żadne przesunięcie nie pomaga, klocek wraca do stanu sprzed obrotu i zwracamy false.
     */
    rotateL(){
        var prevRotation = this.rotation;
        this.rotation--;
        if(this.rotation<0)this.rotation=3;

        if(this.collisioncheck()){
            // wall kick w prawo (SUPER ROTATION SYSTEM); y maja przeciwne wartosci w stosunku do zwyklego tetrisa 
            if(this.piece.type != linTetr){
                switch(prevRotation){
                    case 0:
                        this.piece.x++;
                        if(this.collisioncheck()){
                            this.piece.y--;
                            if(this.collisioncheck()){
                                this.piece.x--;
                                this.piece.y+=3;
                                if(this.collisioncheck()){
                                    this.piece.x++;
                                    if(this.collisioncheck()){ // powrót do stanu poczatkowego
                                        this.piece.x--;
                                        this.piece.y-=2;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                    case 1:
                        this.piece.x++;
                        if(this.collisioncheck()){
                            this.piece.y++;
                            if(this.collisioncheck()){
                                this.piece.x--;
                                this.piece.y-=3;
                                if(this.collisioncheck()){
                                    this.piece.x++;
                                    if(this.collisioncheck()){ // powrót do stanu poczatkowego
                                        this.piece.x--;
                                        this.piece.y+=2;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                    case 2:
                        this.piece.x--;
                        if(this.collisioncheck()){
                            this.piece.y--;
                            if(this.collisioncheck()){
                                this.piece.x++;
                                this.piece.y+=3;
                                if(this.collisioncheck()){
                                    this.piece.x--;
                                    if(this.collisioncheck()){ // powrót do stanu poczatkowego
                                        this.piece.x++;
                                        this.piece.y-=2;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                    case 3:
                        this.piece.x--;
                        if(this.collisioncheck()){
                            this.piece.y++;
                            if(this.collisioncheck()){
                                this.piece.x++;
                                this.piece.y-=3;
                                if(this.collisioncheck()){
                                    this.piece.x--;
                                    if(this.collisioncheck()){ // powrót do stanu poczatkowego
                                        this.piece.x++;
                                        this.piece.y+=2;
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
                        this.piece.x--;
                        if(this.collisioncheck()){
                            this.piece.x+=3;
                            if(this.collisioncheck()){
                                this.piece.x-=3;
                                this.piece.y-=2;
                                if(this.collisioncheck()){
                                    this.piece.x+=3;
                                    this.piece.y+=3;
                                    if(this.collisioncheck()){ // powrót do stanu poczatkowego
                                        this.piece.x-=2;
                                        this.piece.y++;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                    case 1:
                        this.piece.x+=2;
                        if(this.collisioncheck()){
                            this.piece.x-=3;
                            if(this.collisioncheck()){
                                this.piece.x+=3;
                                this.piece.y--;
                                if(this.collisioncheck()){
                                    this.piece.x-=3;
                                    this.piece.y+=3;
                                    if(this.collisioncheck()){ // powrót do stanu poczatkowego
                                        this.piece.x--;
                                        this.piece.y-=2;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                    case 2:
                        this.piece.x++;
                        if(this.collisioncheck()){
                            this.piece.x-=3;
                            if(this.collisioncheck()){
                                this.piece.x+=3;
                                this.piece.y+=2;
                                if(this.collisioncheck()){
                                    this.piece.x-=3;
                                    this.piece.y-=3;
                                    if(this.collisioncheck()){ // powrót do stanu poczatkowego
                                        this.piece.x+=2;
                                        this.piece.y--;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                    case 3:
                        this.piece.x-=2;
                        if(this.collisioncheck()){
                            this.piece.x+=3;
                            if(this.collisioncheck()){
                                this.piece.x-=3;
                                this.piece.y++;
                                if(this.collisioncheck()){
                                    this.piece.x+=3;
                                    this.piece.y-=3;
                                    if(this.collisioncheck()){ // powrót do stanu poczatkowego
                                        this.piece.x--;
                                        this.piece.y+=2;
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
        drawGame(this);
        return true;
    }

    //obrót w prawo – analogicznie do rotateL
    rotateR(){
        var prevRotation = this.rotation;
        this.rotation++;
        if(this.rotation>3)this.rotation=0;

        if(this.collisioncheck()){
            // wall kick w prawo (SUPER ROTATION SYSTEM); y maja przeciwne wartosci w stosunku do zwyklego tetrisa 
            if(this.piece.type != linTetr){
                switch(prevRotation){
                    case 0:
                        this.piece.x--;
                        if(this.collisioncheck()){
                            this.piece.y--;
                            if(this.collisioncheck()){
                                this.piece.x++;
                                this.piece.y+=3;
                                if(this.collisioncheck()){
                                    this.piece.x--;
                                    if(this.collisioncheck()){ // powrót do stanu poczatkowego
                                        this.piece.x++;
                                        this.piece.y-=2;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                    case 1:
                        this.piece.x++;
                        if(this.collisioncheck()){
                            this.piece.y++;
                            if(this.collisioncheck()){
                                this.piece.x--;
                                this.piece.y-=3;
                                if(this.collisioncheck()){
                                    this.piece.x++;
                                    if(this.collisioncheck()){ // powrót do stanu poczatkowego
                                        this.piece.x--;
                                        this.piece.y+=2;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                    case 2:
                        this.piece.x++;
                        if(this.collisioncheck()){
                            this.piece.y--;
                            if(this.collisioncheck()){
                                this.piece.x--;
                                this.piece.y+=3;
                                if(this.collisioncheck()){
                                    this.piece.x++;
                                    if(this.collisioncheck()){ // powrót do stanu poczatkowego
                                        this.piece.x--;
                                        this.piece.y-=2;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                    case 3:
                        this.piece.x--;
                        if(this.collisioncheck()){
                            this.piece.y++;
                            if(this.collisioncheck()){
                                this.piece.x++;
                                this.piece.y-=3;
                                if(this.collisioncheck()){
                                    this.piece.x--;
                                    if(this.collisioncheck()){ // powrót do stanu poczatkowego
                                        this.piece.x++;
                                        this.piece.y+=2;
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
                        this.piece.x-=2;
                        if(this.collisioncheck()){
                            this.piece.x+=3;
                            if(this.collisioncheck()){
                                this.piece.x-=3;
                                this.piece.y++;
                                if(this.collisioncheck()){
                                    this.piece.x+=3;
                                    this.piece.y-=3;
                                    if(this.collisioncheck()){ // powrót do stanu poczatkowego
                                        this.piece.x--;
                                        this.piece.y+=2;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                    case 1:
                        this.piece.x--;
                        if(this.collisioncheck()){
                            this.piece.x+=3;
                            if(this.collisioncheck()){
                                this.piece.x-=3;
                                this.piece.y-=2;
                                if(this.collisioncheck()){
                                    this.piece.x+=3;
                                    this.piece.y+=3;
                                    if(this.collisioncheck()){ // powrót do stanu poczatkowego
                                        this.piece.x-=2;
                                        this.piece.y++;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                    case 2:
                        this.piece.x+=2;
                        if(this.collisioncheck()){
                            this.piece.x-=3;
                            if(this.collisioncheck()){
                                this.piece.x+=3;
                                this.piece.y--;
                                if(this.collisioncheck()){
                                    this.piece.x-=3;
                                    this.piece.y+=3;
                                    if(this.collisioncheck()){ // powrót do stanu poczatkowego
                                        this.piece.x--;
                                        this.piece.y-=2;
                                        this.rotation = prevRotation;
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                    case 3:
                        this.piece.x++;
                        if(this.collisioncheck()){
                            this.piece.x-=3;
                            if(this.collisioncheck()){
                                this.piece.x+=3;
                                this.piece.y+=2;
                                if(this.collisioncheck()){
                                    this.piece.x-=3;
                                    this.piece.y-=3;
                                    if(this.collisioncheck()){ // powrót do stanu poczatkowego
                                        this.piece.x+=2;
                                        this.piece.y--;
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

        drawGame(this);
        return true;
    }


    //true = bieżący klocek wychodzi poza planszę (bok/dół) lub nachodzi na leżące bloki
    collisioncheck(){
        for(var j=0; j<4; j++){
            var x = this.piece.type[this.rotation][j].x + this.piece.x;
            var y = this.piece.type[this.rotation][j].y + this.piece.y;

            if(x<0 || x>9 || y>19) return true;

            for(var i=0; i< this.down.length; i++){
                if(x==this.down[i].x && y==this.down[i].y) return true;
            }
        }
        return false;
    }

    /**
     * Usuwa pełne linie, przesuwa wyższe bloki w dół, nalicza punkty i poziom.
     * Poprawka: poprzednia wersja (liczenie bloków o tym samym y "w ciągu") gubiła drugą
     * i kolejne pełne linie, gdy nad usuwaną linią nie było już żadnych bloków.
     */
    removeLine(){
        //liczymy bloki w każdym wierszu
        var rowCounts = {};
        this.down.forEach(box => rowCounts[box.y] = (rowCounts[box.y] || 0) + 1);

        var fullRows = Object.keys(rowCounts).filter(y => rowCounts[y] == 10).map(Number);
        var linescleared = fullRows.length;

        if(linescleared > 0){
            //usuwamy bloki z pełnych linii, a pozostałe przesuwamy w dół o liczbę usuniętych linii pod nimi
            //(kolejność tablicy - malejąco po y - zostaje zachowana)
            this.down = this.down.filter(box => rowCounts[box.y] != 10);
            this.down.forEach(box => box.y += fullRows.filter(row => row > box.y).length);
        }

        //w przypadku gdy linia zostala usunieta, w zaleznosi od ich ilosci zwiekszamy punkty i poziom
        //(punktacja jak w oryginalnym Tetrisie na NES)
        switch(linescleared){
            default :
                break;
            case 1 :
                this.score+=40*(this.level+1);
                break;
            case 2 :
                this.score+=100*(this.level+1);
                break;
            case 3 :
                this.score+=300*(this.level+1);
                break;
            case 4 :
                this.score+=1200*(this.level+1);
                break;
    
        }
        this.amoutOfLinesCleared+=linescleared;
    
        if(this.amoutOfLinesCleared>=10){
            this.amoutOfLinesCleared-=10;
            this.level++;
        }
    
        //zmiana predkosc opuszczanie elementu w zaleznoci od poziomu
        switch(this.level){
            case 0 :
                break;
            case 1 :
                this.droppingSpeed = 720;
                break;
            case 2 :
                this.droppingSpeed = 640;
                break;
            case 3 :
                this.droppingSpeed = 550;
                break;
            case 4 :
                this.droppingSpeed = 430;
                break;
            case 5 :
                this.droppingSpeed = 380;
                break;
            case 6 :
                this.droppingSpeed = 305;
                break;
            case 7 :
                this.droppingSpeed = 220;
                break;
            case 8 :
                this.droppingSpeed = 185;
                break;
            case 9 :
                this.droppingSpeed = 105;
                break;
            case 10 :
            case 11 :
            case 12 :
                this.droppingSpeed = 85;
                break;
            case 13 :
            case 14 :
            case 15 :
                this.droppingSpeed = 65;
                break;
            case 16 :
            case 17 :
            case 18 :
                this.droppingSpeed = 50;
                break;
            case 19 :
            case 20 :
            case 21 :
            case 22 :
            case 23 :
            case 24 :
            case 25 :
            case 26 :
            case 27 :
            case 28 :
                this.droppingSpeed = 33;
                break;
            default :
                this.droppingSpeed = 15;
                break;
        }
    
    }

    //zapisuje bloki zablokowanego klocka do this.down (z zachowaniem sortowania malejąco po y)
    addDown(){
        var j;
        var pom;
    
        for(var i=0; i<4; i++){
            for(j=0; j<this.down.length && this.piece.type[this.rotation][i].y+this.piece.y<this.down[j].y; j++); //szukamy wysokosci wiersza w "dole"
    
            pom=new Box(this.piece.type[this.rotation][i].x+this.piece.x, this.piece.type[this.rotation][i].y+this.piece.y, this.piece.type[this.rotation][i].color);
            this.down.splice(j, 0, pom);
        }
        
    }

    //sprawdza czy gra się skończyła (zablokowany klocek wystaje ponad planszę)
    end(){
        for(var i=0; i<4; i++){
            if(this.piece.type[this.rotation][i].y+this.piece.y<=-1)return true;
        }
        
        return false;
    }


    //kończy gre
    gameOver(){
        clearTimeout(this.game);
        this.gameDead = true;
        drawGame(this);  // odświeżamy planszę, by pokazać napis o końcu gry
    }

    //sterowanie klawiaturą (tylko dla gry z humanControlled = true)
    direction(event){
        if(this.gameDead) return;
        switch(event.keyCode){
            case 37:    // strzałka w lewo
                this.movePieceLeft();
                break;
            case 38:    // strzałka w górę
                this.rotateR();
                break;
            case 16:    // Shift
                this.rotateL();
                break;
            case 39:    // strzałka w prawo
                this.movePieceRight();
                break;
            case 40:    // strzałka w dół (poprawka: wcześniej był kod 0, który nie istnieje)
                this.movePieceDown();
                break;
            case 67:    // C - zamiana z następnym klockiem
                this.swapPiece();
                break;
        }
    }
}