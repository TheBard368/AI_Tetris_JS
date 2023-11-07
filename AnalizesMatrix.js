class BoardAnalizes{
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
        this.height = 0;

        
    }

    clone(){
        var copy = new BoardAnalizes();

        for(let i=0; i< this.analizingMatrix.length; i++){
            for(var j=0; j<this.analizingMatrix[i].length; j++){
                copy[i][j] = this.analizingMatrix[i][j];
            }
        }

        return copy;
    }

    

    updateMatrix(tetro){
        for(var i=0; i<this.analizingMatrix.length; i++){
            for(var j=0; j<this.analizingMatrix[i].length; j++){
                this.analizingMatrix[i][j] = 0;
            }
        }

        for(var i=0; i<down.length; i++){
            this.analizingMatrix[down[i].x][down[i].y] = 1;
        }

        for(var i=0; i<4; i++){
            if(piece.y + piece.type[tetro.rotation][i].y > 0){
                this.analizingMatrix[tetro.x + tetro.type[tetro.rotation][i].x][tetro.y + tetro.type[tetro.rotation][i].y] = 2;
            }
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
        
    }
}


