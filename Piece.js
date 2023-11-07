class Box{
    constructor(x, y , color){
        this.x=x;
        this.y=y;
        this.color=color;
    }

}

class Piece{
    constructor(x, y, type){
        this.x = x;
        this.y = y;
        this.type = type;
        this.rotation = 0;
        this.nextPiece = null;
        this.piecesSwaped = true;
    }

    createNextPiece(){
        this.piecesSwaped = false;
        let randType;
        do{
            randType = Tetrominos[Math.floor(Math.random()*7)];
        }while(randType == this.type);
        this.nextPiece = new Piece(4, -1, randType)
    }

    swapPiece(){
        let pom = this;
        this.nextPiece.nextPiece = this;
        
    }
    

    rotateL(){
        var prevRotation = this.rotation;
        this.rotation--;
        if(this.rotation<0)this.rotation=3;

        if(this.collisioncheck()){
            // wall kick w prawo (SUPER ROTATION SYSTEM); y maja przeciwne wartosci w stosunku do zwyklego tetrisa 
            if(piece.type != linTetr){
                switch(prevRotation){
                    case 0:
                        piece.x++;
                        if(piece.collisioncheck()){
                            piece.y--;
                            if(piece.collisioncheck()){
                                piece.x--;
                                piece.y+=3;
                                if(piece.collisioncheck()){
                                    piece.x++;
                                    if(piece.collisioncheck()){ // powrót do stanu poczatkowego
                                        piece.x--;
                                        piece.y-=2;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
                    case 1:
                        piece.x++;
                        if(piece.collisioncheck()){
                            piece.y++;
                            if(piece.collisioncheck()){
                                piece.x--;
                                piece.y-=3;
                                if(piece.collisioncheck()){
                                    piece.x++;
                                    if(piece.collisioncheck()){ // powrót do stanu poczatkowego
                                        piece.x--;
                                        piece.y+=2;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
                    case 2:
                        piece.x--;
                        if(piece.collisioncheck()){
                            piece.y--;
                            if(piece.collisioncheck()){
                                piece.x++;
                                piece.y+=3;
                                if(piece.collisioncheck()){
                                    piece.x--;
                                    if(piece.collisioncheck()){ // powrót do stanu poczatkowego
                                        piece.x++;
                                        piece.y-=2;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
                    case 3:
                        piece.x--;
                        if(piece.collisioncheck()){
                            piece.y++;
                            if(piece.collisioncheck()){
                                piece.x++;
                                piece.y-=3;
                                if(piece.collisioncheck()){
                                    piece.x--;
                                    if(piece.collisioncheck()){ // powrót do stanu poczatkowego
                                        piece.x++;
                                        piece.y+=2;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
        
                }
            }
            else{
                switch(piece.rotation){
                    case 0:
                        piece.x--;
                        if(piece.collisioncheck()){
                            piece.x+=3;
                            if(piece.collisioncheck()){
                                piece.x-=3;
                                piece.y-=2;
                                if(piece.collisioncheck()){
                                    piece.x+=3;
                                    piece.y+=3;
                                    if(piece.collisioncheck()){ // powrót do stanu poczatkowego
                                        piece.x-=2;
                                        piece.y++;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
                    case 1:
                        piece.x+=2;
                        if(piece.collisioncheck()){
                            piece.x-=3;
                            if(piece.collisioncheck()){
                                piece.x+=3;
                                piece.y--;
                                if(piece.collisioncheck()){
                                    piece.x-=3;
                                    piece.y+=3;
                                    if(piece.collisioncheck()){ // powrót do stanu poczatkowego
                                        piece.x--;
                                        piece.y-=2;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
                    case 2:
                        piece.x++;
                        if(piece.collisioncheck()){
                            piece.x-=3;
                            if(piece.collisioncheck()){
                                piece.x+=3;
                                piece.y+=2;
                                if(piece.collisioncheck()){
                                    piece.x-=3;
                                    piece.y-=3;
                                    if(piece.collisioncheck()){ // powrót do stanu poczatkowego
                                        piece.x+=2;
                                        piece.y--;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
                    case 3:
                        piece.x-=2;
                        if(piece.collisioncheck()){
                            piece.x+=3;
                            if(piece.collisioncheck()){
                                piece.x-=3;
                                piece.y++;
                                if(piece.collisioncheck()){
                                    piece.x+=3;
                                    piece.y-=3;
                                    if(piece.collisioncheck()){ // powrót do stanu poczatkowego
                                        piece.x--;
                                        piece.y+=2;
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

    rotateR(){
        var prevRotation = this.rotation;
        this.rotation++;
        if(this.rotation>3)this.rotation=0;

        if(this.collisioncheck()){
            // wall kick w prawo (SUPER ROTATION SYSTEM); y maja przeciwne wartosci w stosunku do zwyklego tetrisa 
            if(piece.type != linTetr){
                switch(prevRotation){
                    case 0:
                        piece.x--;
                        if(piece.collisioncheck()){
                            piece.y--;
                            if(piece.collisioncheck()){
                                piece.x++;
                                piece.y+=3;
                                if(piece.collisioncheck()){
                                    piece.x--;
                                    if(piece.collisioncheck()){ // powrót do stanu poczatkowego
                                        piece.x++;
                                        piece.y-=2;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
                    case 1:
                        piece.x++;
                        if(piece.collisioncheck()){
                            piece.y++;
                            if(piece.collisioncheck()){
                                piece.x--;
                                piece.y-=3;
                                if(piece.collisioncheck()){
                                    piece.x++;
                                    if(piece.collisioncheck()){ // powrót do stanu poczatkowego
                                        piece.x--;
                                        piece.y+=2;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
                    case 2:
                        piece.x++;
                        if(piece.collisioncheck()){
                            piece.y--;
                            if(piece.collisioncheck()){
                                piece.x--;
                                piece.y+=3;
                                if(piece.collisioncheck()){
                                    piece.x++;
                                    if(piece.collisioncheck()){ // powrót do stanu poczatkowego
                                        piece.x--;
                                        piece.y-=2;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
                    case 3:
                        piece.x--;
                        if(piece.collisioncheck()){
                            piece.y++;
                            if(piece.collisioncheck()){
                                piece.x++;
                                piece.y-=3;
                                if(piece.collisioncheck()){
                                    piece.x--;
                                    if(piece.collisioncheck()){ // powrót do stanu poczatkowego
                                        piece.x++;
                                        piece.y+=2;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
        
                }
            }
            else{
                switch(piece.rotation){
                    case 0:
                        piece.x-=2;
                        if(piece.collisioncheck()){
                            piece.x+=3;
                            if(piece.collisioncheck()){
                                piece.x-=3;
                                piece.y++;
                                if(piece.collisioncheck()){
                                    piece.x+=3;
                                    piece.y-=3;
                                    if(piece.collisioncheck()){ // powrót do stanu poczatkowego
                                        piece.x--;
                                        piece.y+=2;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
                    case 1:
                        piece.x--;
                        if(piece.collisioncheck()){
                            piece.x+=3;
                            if(piece.collisioncheck()){
                                piece.x-=3;
                                piece.y-=2;
                                if(piece.collisioncheck()){
                                    piece.x+=3;
                                    piece.y+=3;
                                    if(piece.collisioncheck()){ // powrót do stanu poczatkowego
                                        piece.x-=2;
                                        piece.y++;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
                    case 2:
                        piece.x+=2;
                        if(piece.collisioncheck()){
                            piece.x-=3;
                            if(piece.collisioncheck()){
                                piece.x+=3;
                                piece.y--;
                                if(piece.collisioncheck()){
                                    piece.x-=3;
                                    piece.y+=3;
                                    if(piece.collisioncheck()){ // powrót do stanu poczatkowego
                                        piece.x--;
                                        piece.y-=2;
                                        this.rotation = prevRotation;
                                    }
                                }
                            }
                        }
                        break;
                    case 3:
                        piece.x++;
                        if(piece.collisioncheck()){
                            piece.x-=3;
                            if(piece.collisioncheck()){
                                piece.x+=3;
                                piece.y+=2;
                                if(piece.collisioncheck()){
                                    piece.x-=3;
                                    piece.y-=3;
                                    if(piece.collisioncheck()){ // powrót do stanu poczatkowego
                                        piece.x+=2;
                                        piece.y--;
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

    collisioncheck(){
        for(var j=0; j<4; j++){
            if(this.type[this.rotation][j].x+this.x<0 || this.type[this.rotation][j].x+this.x>9 || this.type[this.rotation][j].y+this.y>19) return true;
    
            for(var i=0; i< down.length; i++){
                if(this.type[this.rotation][j].x+this.x==down[i].x && this.type[this.rotation][j].y+this.y==down[i].y)return true;
            }
        }
        return false;
    }


    draw(){
        
        for(var i=0; i<4; i++){
            ctx.fillStyle=piece.type[piece.rotation][i].color;
            ctx.fillRect((piece.type[piece.rotation][i].x+piece.x)*unit, (piece.type[piece.rotation][i].y+piece.y)*unit, unit, unit);
    
            ctx.strokeStyle="black";
            ctx.strokeRect((piece.type[piece.rotation][i].x+piece.x)*unit, (piece.type[piece.rotation][i].y+piece.y)*unit, unit, unit);
        }
    }
}

//klocki

const tTetr=[
    [new Box(-1, -1, "violet"), new Box(0, -1, "violet"), new Box(1, -1, "violet"), new Box(0, -2, "violet")],
    [new Box(0, -2, "violet"), new Box(0, -1, "violet"), new Box(0, 0, "violet"), new Box(1, -1, "violet")],
    [new Box(1, -1, "violet"), new Box(0, -1, "violet"), new Box(-1, -1, "violet"), new Box(0, 0, "violet")],
    [new Box(0, 0, "violet"), new Box(0, -1, "violet"), new Box(0, -2, "violet"), new Box(-1, -1, "violet")] 
];

const lTetr=[
    [new Box(0, -2, "blue"), new Box(0, -1, "blue"), new Box(0, 0, "blue"), new Box(1, 0, "blue")],
    [new Box(1, -1, "blue"), new Box(0, -1, "blue"), new Box(-1, -1, "blue"), new Box(-1, 0, "blue")],
    [new Box(0, 0, "blue"), new Box(0, -1, "blue"), new Box(0, -2, "blue"), new Box(-1, -2, "blue")],
    [new Box(-1, -1, "blue"), new Box(0, -1, "blue"), new Box(1, -1, "blue"), new Box(1, -2, "blue")]
      
];

const rlTetr=[
    [new Box(0, -2, "red"), new Box(0, -1, "red"), new Box(0, 0, "red"), new Box(-1, 0, "red")],
    [new Box(1, -1, "red"), new Box(0, -1, "red"), new Box(-1, -1, "red"), new Box(-1, -2, "red")],
    [new Box(0, 0, "red"), new Box(0, -1, "red"), new Box(0, -2, "red"), new Box(1, -2, "red")],
    [new Box(-1, -1, "red"), new Box(0, -1, "red"), new Box(1, -1, "red"), new Box(1, 0, "red")]
];

const sqTetr=[
    [new Box(0, 0, "yellow"), new Box(0, -1, "yellow"), new Box(1, -1, "yellow"), new Box(1, 0, "yellow")],
    [new Box(0, 0, "yellow"), new Box(0, -1, "yellow"), new Box(1, -1, "yellow"), new Box(1, 0, "yellow")],
    [new Box(0, 0, "yellow"), new Box(0, -1, "yellow"), new Box(1, -1, "yellow"), new Box(1, 0, "yellow")],
    [new Box(0, 0, "yellow"), new Box(0, -1, "yellow"), new Box(1, -1, "yellow"), new Box(1, 0, "yellow")]
];

const zTetr=[
    [new Box(1, -1, "orange"), new Box(0, -1, "orange"), new Box(0, 0, "orange"), new Box(-1, 0, "orange")],
    [new Box(0, -2, "orange"), new Box(0, -1, "orange"), new Box(1, -1, "orange"), new Box(1, 0, "orange")],
    [new Box(-1, -1, "orange"), new Box(0, -1, "orange"), new Box(0, -2, "orange"), new Box(1, -2, "orange")],
    [new Box(0, 0, "orange"), new Box(0, -1, "orange"), new Box(-1, -1, "orange"), new Box(-1, -2, "orange")]
];

const rzTetr=[
    [new Box(-1, -1, "green"), new Box(0, -1, "green"), new Box(0, 0, "green"), new Box(1, 0, "green")],
    [new Box(0, 0, "green"), new Box(0, -1, "green"), new Box(1, -1, "green"), new Box(1, -2, "green")],
    [new Box(1, -1, "green"), new Box(0, -1, "green"), new Box(0, -2, "green"), new Box(-1, -2, "green")],
    [new Box(0, -2, "green"), new Box(0, -1, "green"), new Box(-1, -1, "green"), new Box(-1, 0, "green")]
];

const linTetr=[
    [new Box(-1, -1, "gold"), new Box(0, -1, "gold"), new Box(1, -1, "gold"), new Box(2, -1, "gold")],
    [new Box(1, -2, "gold"), new Box(1, -1, "gold"), new Box(1, 0, "gold"), new Box(1, 1, "gold")],
    [new Box(-1, 0, "gold"), new Box(0, 0, "gold"), new Box(1, 0, "gold"), new Box(2, 0, "gold")],
    [new Box(0, -2, "gold"), new Box(0, -1, "gold"), new Box(0, 0, "gold"), new Box(0, 1, "gold")]
];

const Tetrominos=[tTetr, lTetr, rlTetr, sqTetr, zTetr, rzTetr, linTetr];