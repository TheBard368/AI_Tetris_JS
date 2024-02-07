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
        
    }

    clone(){
        var copy = new BoardState();

        for(let i=0; i< this.analizingMatrix.length; i++){
            for(var j=0; j<this.analizingMatrix[i].length; j++){
                copy.analizingMatrix[i][j] = this.analizingMatrix[i][j];
            }
        }

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

     
    //do rewizji
    updateMatrix(tetro, game){
        for(var i=0; i<this.analizingMatrix.length; i++){
            for(var j=0; j<this.analizingMatrix[i].length; j++){
                this.analizingMatrix[i][j] = 0;
            }
        }

        for(var i=0; i<down.length; i++){
            this.analizingMatrix[game.down[i].y][game.down[i].x] = 1;
        }

        for(var i=0; i<4; i++){
            if(piece.y + piece.type[tetro.rotation][i].y > 0){
                this.analizingMatrix[tetro.y + tetro.type[tetro.rotation][i].y][tetro.x + tetro.type[tetro.rotation][i].x] = 2;
            }
        }

        this.currentScore = game.score;
        this.currentLevel = game.level;
    }

    //revizja
    // updateMatrix(game){
    //     for(var i=0; i<this.analizingMatrix.length; i++){
    //         for(var j=0; j<this.analizingMatrix[i].length; j++){
    //             this.analizingMatrix[i][j] = 0;
    //         }
    //     }

    //     for(var i=0; i<down.length; i++){
    //         this.analizingMatrix[game.down[i].y][game.down[i].x] = 1;
    //     }

    //     this.currentPiece = game.piece.clone();
    //     this.nextPiece = game.nextPiece.clone();

    //     this.currentScore = game.score;
    //     this.currentLevel = game.level;
    // }

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
                if(this.analizingMatrix[i][j] != 0){
                    foundBlock = true;
                    foundBlocksCount++;
                }else if(foundBlock){ 
                    this.holesDepth += foundBlocksCount;

                    //sprawdzamy czy dziure mozna zapełnić klockiem przez jego przesuniecie w lewo lub w prawo
                    if (i < 8) {
                        //sprawdzenie prawej
                        if ((this.analizingMatrix[i + 1][j] == 0 && this.analizingMatrix[i + 2][j] == 0) &&
                            (j == 19 || this.analizingMatrix[i+1][j+1] != 0 )) {
                            this.chasms++
                            continue;

                        } 
                    }

                    if (i >= 2) {
                        //sprawdzenie lewej
                        if ((this.analizingMatrix[i - 1][j] === null && this.analizingMatrix[i - 2][j] == 0) &&
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
        for(j = 0; this.analizingMatrix[j][0]==1 && j<20; j++);
        prevHeight = i;
    

        for(var i = 0; i < 10; i++){
            for(j = 0; this.analizingMatrix[j][0]==1 && j<20; j++)

            if(Math.abs(prevHeight-i) > 2){
                this.pillars++
                this.totalPillarsHeight += i;
            }
            if(this.height < i) this.height = i;
            prevHeight = i;
        }
    }

    checkBumpines(){
        this.bumpiness = 0;
        var j, prevHeight;
        for(j = 0; this.analizingMatrix[j][0]==1 && j<20; j++);
        prevHeight = i;
    

        for(var i = 0; i < 10; i++){
            for(j = 0; this.analizingMatrix[j][0]==1 && j<20; j++)

            if(i != prevHeight){
                this.bumpiness += Math.abs(prevHeight-i);
                prevHeight = i;
            }
            
        }
    }
    //sprawdza legalnosc ruchu
    isPieceLegal(piece){
        for(var i=0; i<4; i++){
            if(piece.y + piece.type[tetro.rotation][i].y != 0){
                return false;
            }
        }

        return true;
    }
}


