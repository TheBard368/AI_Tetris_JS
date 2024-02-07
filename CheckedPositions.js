class CheckedPositions{
    constructor(boardState_){
        this.boardState = boardState_;
        //this.pieceMoveHistory = moveHistory_.clone();
        //this.piece = piece_.clone();

        this.checkedPositions = [];
        this.setAllToFalse();
    }

    //dla macierzy testowych sprawdza pozycje elemntu, czy jest wolne




    getIndexOfCoordinates(x,y,r){
        return x + 10*y  + 200*r;
    }

    setAllToFalse(){
        this.checkedPositions = [];
        for (let i = 0; i < 8000; i++) {
            this.checkedPositions.push(false);
        }
    }

    hasPositionBeenChecked(x, y, r) {
        return this.checkedPositions[this.getIndexOfCoordinates(x,y,r)];
    }

    setCheckedPositionsArrayValue(x, y, r, value) {
        this.checkedPositions[this.getIndexOfCoordinates(x,y,r)] = value;
    }
}

class PieceVM{
    constructor(x, y, type){
        this.x = x;
        this.y = y;
        this.type = type;
        this.rotation = 0;
        this.moveHistory = new MoveHistory();
    }


    rotateL(analizesMatrix){
        var prevRotation = this.rotation;
        this.rotation--;
        if(this.rotation<0)this.rotation=3;

        if(analizesMatrix.isPieceLegal(this)){
            // wall kick w prawo (SUPER ROTATION SYSTEM); y maja przeciwne wartosci w stosunku do zwyklego tetrisa 
            if(this.type != linTetr){
                switch(prevRotation){
                    case 0:
                        this.x++;
                        if(analizesMatrix.isPieceLegal(this)){
                            this.y--;
                            if(analizesMatrix.isPieceLegal(this)){
                                this.x--;
                                this.y+=3;
                                if(analizesMatrix.isPieceLegal(this)){
                                    this.x++;
                                    if(analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x--;
                                        this.y-=2;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
                    case 1:
                        this.x++;
                        if(analizesMatrix.isPieceLegal(this)){
                            this.y++;
                            if(analizesMatrix.isPieceLegal(this)){
                                this.x--;
                                this.y-=3;
                                if(analizesMatrix.isPieceLegal(this)){
                                    this.x++;
                                    if(analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x--;
                                        this.y+=2;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
                    case 2:
                        this.x--;
                        if(analizesMatrix.isPieceLegal(this)()){
                            this.y--;
                            if(analizesMatrix.isPieceLegal(this)){
                                this.x++;
                                this.y+=3;
                                if(analizesMatrix.isPieceLegal(this)){
                                    this.x--;
                                    if(analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x++;
                                        this.y-=2;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
                    case 3:
                        this.x--;
                        if(analizesMatrix.isPieceLegal(this)){
                            this.y++;
                            if(analizesMatrix.isPieceLegal(this)){
                                this.x++;
                                this.y-=3;
                                if(analizesMatrix.isPieceLegal(this)){
                                    this.x--;
                                    if(analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x++;
                                        this.y+=2;
                                        this.rotation = prevRotation;
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
                        if(analizesMatrix.isPieceLegal(this)){
                            this.x+=3;
                            if(analizesMatrix.isPieceLegal(this)){
                                this.x-=3;
                                this.y-=2;
                                if(analizesMatrix.isPieceLegal(this)){
                                    this.x+=3;
                                    this.y+=3;
                                    if(analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x-=2;
                                        this.y++;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
                    case 1:
                        this.x+=2;
                        if(analizesMatrix.isPieceLegal(this)){
                            this.x-=3;
                            if(analizesMatrix.isPieceLegal(this)){
                                this.x+=3;
                                this.y--;
                                if(analizesMatrix.isPieceLegal(this)){
                                    this.x-=3;
                                    this.y+=3;
                                    if(analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x--;
                                        this.y-=2;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
                    case 2:
                        this.x++;
                        if(analizesMatrix.isPieceLegal(this)){
                            this.x-=3;
                            if(analizesMatrix.isPieceLegal(this)){
                                this.x+=3;
                                this.y+=2;
                                if(analizesMatrix.isPieceLegal(this)){
                                    this.x-=3;
                                    this.y-=3;
                                    if(analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x+=2;
                                        this.y--;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
                    case 3:
                        this.x-=2;
                        if(analizesMatrix.isPieceLegal(this)){
                            this.x+=3;
                            if(analizesMatrix.isPieceLegal(this)){
                                this.x-=3;
                                this.y++;
                                if(analizesMatrix.isPieceLegal(this)){
                                    this.x+=3;
                                    this.y-=3;
                                    if(analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x--;
                                        this.y+=2;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
                }
            }
        }
    }

    rotateR(analizesMatrix){
        var prevRotation = this.rotation;
        this.rotation++;
        if(this.rotation>3)this.rotation=0;

        if(analizesMatrix.isPieceLegal(this)){
            // wall kick w prawo (SUPER ROTATION SYSTEM); y maja przeciwne wartosci w stosunku do zwyklego tetrisa 
            if(this.type != linTetr){
                switch(prevRotation){
                    case 0:
                        this.x--;
                        if(analizesMatrix.isPieceLegal(this)){
                            this.y--;
                            if(analizesMatrix.isPieceLegal(this)){
                                this.x++;
                                this.y+=3;
                                if(analizesMatrix.isPieceLegal(this)){
                                    this.x--;
                                    if(analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x++;
                                        this.y-=2;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
                    case 1:
                        this.x++;
                        if(analizesMatrix.isPieceLegal(this)){
                            this.y++;
                            if(analizesMatrix.isPieceLegal(this)){
                                this.x--;
                                this.y-=3;
                                if(analizesMatrix.isPieceLegal(this)){
                                    this.x++;
                                    if(analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x--;
                                        this.y+=2;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
                    case 2:
                        this.x++;
                        if(analizesMatrix.isPieceLegal(this)){
                            this.y--;
                            if(analizesMatrix.isPieceLegal(this)){
                                this.x--;
                                this.y+=3;
                                if(analizesMatrix.isPieceLegal(this)){
                                    this.x++;
                                    if(analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x--;
                                        this.y-=2;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
                    case 3:
                        this.x--;
                        if(analizesMatrix.isPieceLegal(this)){
                            this.y++;
                            if(analizesMatrix.isPieceLegal(this)){
                                this.x++;
                                this.y-=3;
                                if(analizesMatrix.isPieceLegal(this)){
                                    this.x--;
                                    if(analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x++;
                                        this.y+=2;
                                        this.rotation = prevRotation;
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
                        if(analizesMatrix.isPieceLegal(this)){
                            this.x+=3;
                            if(analizesMatrix.isPieceLegal(this)){
                                this.x-=3;
                                this.y++;
                                if(analizesMatrix.isPieceLegal(this)){
                                    this.x+=3;
                                    this.y-=3;
                                    if(analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x--;
                                        this.y+=2;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
                    case 1:
                        this.x--;
                        if(analizesMatrix.isPieceLegal(this)){
                            this.x+=3;
                            if(analizesMatrix.isPieceLegal(this)){
                                this.x-=3;
                                this.y-=2;
                                if(analizesMatrix.isPieceLegal(this)){
                                    this.x+=3;
                                    this.y+=3;
                                    if(analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x-=2;
                                        this.y++;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
                    case 2:
                        this.x+=2;
                        if(analizesMatrix.isPieceLegal(this)){
                            this.x-=3;
                            if(analizesMatrix.isPieceLegal(this)){
                                this.x+=3;
                                this.y--;
                                if(analizesMatrix.isPieceLegal(this)){
                                    this.x-=3;
                                    this.y+=3;
                                    if(analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x--;
                                        this.y-=2;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
                    case 3:
                        this.x++;
                        if(analizesMatrix.isPieceLegal(this)){
                            this.x-=3;
                            if(analizesMatrix.isPieceLegal(this)){
                                this.x+=3;
                                this.y+=2;
                                if(analizesMatrix.isPieceLegal(this)){
                                    this.x-=3;
                                    this.y-=3;
                                    if(analizesMatrix.isPieceLegal(this)){ // powrót do stanu poczatkowego
                                        this.x+=2;
                                        this.y--;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
                }
            }
        }

    }

    clone(){
        var piece = new Piece(this.x, this.y, this.type);
        piece.rotation = this.rotation;
        piece.moveHistory = this.moveHistory.clone();
        return piece;
    }
}