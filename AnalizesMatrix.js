// funkcjonalnie api do gry

class BoardState{
    constructor(){
        this.analizingMatrix = [[0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0]];
        this.pieceCount = 0;
        this.holes = 0;
        this.chasms = 0;
        this.bumpiness = 0;
        this.height = 0;     // wysokosc najwyzszego pilara
        this.holesDepth = 0;
        this.pillars = 0;
        this.totalPillarsHeight = 0;
        this.currentScore = 0;
        this.currentLevel = 0;
        this.pieceHeight = 0;
        this.gameDead = false;
        this.currentPiece = null;
        this.nextPiece = null;
        
    }

    clone(){
        var copy = new BoardState();

        for(let i=0; i< this.analizingMatrix.length; i++){
            for(var j=0; j<this.analizingMatrix[i].length; j++){
                copy.analizingMatrix[i][j] = this.analizingMatrix[i][j];
            }
        }

        copy.currentPiece = this.currentPiece.clone();
        copy.nextPiece = this.nextPiece.clone();

        return copy;
    }

    // copyBoardState(){
    //     var copy = [];

    //     for(let i=0; i< this.analizingMatrix.length; i++){
    //         for(var j=0; j<this.analizingMatrix[i].length; j++){
    //             copy[i][j] = this.analizingMatrix[i][j];
    //         }
    //     }
    //     return copy;
    // }
     

    pushPieceIn(piece){
        for(var i=0; i<4; i++){
            if(piece.y + piece.type[piece.rotation][i].y>=0){
                this.analizingMatrix[piece.y + piece.type[piece.rotation][i].y][piece.x + piece.type[piece.rotation][i].x] = 1;
            }
        }
        this.areThereClearedLines();
    }

    areThereClearedLines(){
        var linesCleared = 0;
        for(var i=0; i<20; i++){
            var count = 0;
            for(var j=0; j<10; j++){
                if(this.analizingMatrix[i][j]!=0){
                    count++;
                }

                //przesuwanie lini w dol
                if(i>0){
                    this.analizingMatrix[i][j] = this.analizingMatrix[i-linesCleared][j];
                }
            }

            if(count == 10){
                linesCleared++;
            }
        }
    }

    //revizja
    updateMatrix(game){
        for(var i=0; i<this.analizingMatrix.length; i++){
            for(var j=0; j<this.analizingMatrix[i].length; j++){
                this.analizingMatrix[i][j] = 0;
            }
        }

        for(var i=0; i<game.down.length; i++){
            if(game.down[i].y>=0){
                this.analizingMatrix[game.down[i].y][game.down[i].x] = 1;
            }else{
                this.gameDead = true;
            }
        }

        if(this.pieceCount != game.pieceCount){
            this.currentPiece = game.piece.clone();
            this.nextPiece = game.nextPiece.clone();

            this.currentScore = game.score;
            this.currentLevel = game.level;
            this.pieceCount = game.pieceCount;
        }
    }

    //funkcja ma na celu odswierzenie polozenia bloku w tablicy do analizy dla ai
    // function refreshPiecePosition(){ 
    //     for(var i=0; i<4; i++){
    //         if(piece.y + piece.type[piece.rotation][i].y > 0){
    //             board[piece.x + piece.type[piece.rotation][i].x][piece.y + piece.type[piece.rotation][i].y] = 2;
    //         }
    //     }
    // }
    // //funkcja ma na celu usunięcie poprzedniego polozenia bloku w tablicy do analizy dla ai
    // function deletePiecePosition(){
    //     for(var i=0; i<4; i++){
    //         if(piece.y + piece.type[piece.rotation][i].y > 0){
    //             board[piece.x + piece.type[piece.rotation][i].x][piece.y + piece.type[piece.rotation][i].y] = 0;
    //         }
    //     }
    // }

    countHolesAndChasms(){
        this.holes = 0;
        this.chasms = 0;
        this.holesDepth = 0;
        
        //petla sprawdza kolumna po kolumnie dziury w planszy
        for(var i=0; i<10; i++){
            var foundBlock = false;
            var foundBlocksCount = 0;
            for(var j=0; j<20; j++){
                if(this.analizingMatrix[j][i] != 0){
                    foundBlock = true;
                    foundBlocksCount++;
                }else if(foundBlock){ 
                    this.holesDepth += foundBlocksCount;

                    //sprawdzamy czy dziure mozna zapełnić klockiem przez jego przesuniecie w lewo lub w prawo
                    if (i < 8) {
                        //sprawdzenie prawej
                        if ((this.analizingMatrix[j][i + 1] == 0 && this.analizingMatrix[j][i + 2] == 0) &&
                            (j == 19 || this.analizingMatrix[i+1][j+1] != 0 )) {
                            this.chasms++
                            continue;

                        } 
                    }

                    if (i >= 2) {
                        //sprawdzenie lewej
                        if ((this.analizingMatrix[j][i - 1] === null && this.analizingMatrix[j][i - 2] == 0) &&
                            (j == 19 || this.analizingMatrix[i-1][j+1] != 0 )){ 
                            this.chasms++
                            continue;
                        }
                    }

                    this.holes++;
                }
            }
        }
    }

    countPillars(){
        this.pillars = 0;
        this.totalPillarsHeight = 0;
        this.height = 0;

        var j, prevHeight;
        for(j = 0; j<20 && this.analizingMatrix[j][0]==0; j++);
        prevHeight = j;
    

        for(var i = 0; i < 10; i++){
            for(j = 0; j<20 && this.analizingMatrix[j][i]==0; j++);

            if(Math.abs(prevHeight-j) > 2){
                this.pillars++
                this.totalPillarsHeight += 20-j;
            }
            if(this.height < j) this.height = 20-j;
            prevHeight = j;
        }
    }

    checkBumpiness(){
        this.bumpiness = 0;
        var j, prevHeight;
        for(j = 0; j<20 && this.analizingMatrix[j][0]==0; j++);
        prevHeight = j;
    

        for(var i = 0; i < 10; i++){
            for(j = 0; j<20 && this.analizingMatrix[j][i]==0; j++);

            if(i != prevHeight){
                this.bumpiness++;
                prevHeight = j;
            }
            
        }
    }
    //sprawdza legalnosc ruchu
    isPieceLegal(piece){

        for(var i=0; i<4; i++){

            if(piece.y + piece.type[piece.rotation][i].y >= 20 || piece.x + piece.type[piece.rotation][i].x < 0 || piece.x + piece.type[piece.rotation][i].x >= 10) return false;

            if(piece.y + piece.type[piece.rotation][i].y >= 0 && this.analizingMatrix[piece.y + piece.type[piece.rotation][i].y][piece.x + piece.type[piece.rotation][i].x] != 0){
                return false;
            }
            
        }

        return true;
    }

    cost
}


