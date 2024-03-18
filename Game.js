class Game{
    constructor(id, humanControlled){
        if(humanControlled){
            document.addEventListener("keydown", direction);
        }
        this.Id = id;
        this.score = 0;
        this.level = 0;
        this.droppingSpeed = 800;
        this.amoutOfLinesCleared = 0;
        this.down=[];
        this.piece = new Piece(4, -1, Tetrominos[Math.floor(Math.random()*7)]);
        this.nextPiece = new Piece(4, -1, Tetrominos[Math.floor(Math.random()*7)]);
        this.piecesSwapped = false;
        this.rotation = 0;
        this.gameDead = false;
        this.pieceCount = 1;
    }

    generateNextPiece(){
        this.rotation = 0;
        this.pieceCount++;
        this.piece = this.nextPiece;
        this.nextPiece = new Piece(4, -1, Tetrominos[Math.floor(Math.random()*7)]);
    }

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

    start(){
        //this.level = level;
        this.game = setTimeout(this.play.bind(this), this.droppingSpeed);
    }


    play(){
        if(this.gameDead) return;

        this.movePieceDown();
        if(this.gameDead) return;

        this.game = setTimeout(this.play.bind(this), this.droppingSpeed);
    }

    reset(){
        this.score = 0;
        this.level = 0;
        this.droppingSpeed = 800;
        this.amoutOfLinesCleared = 0;
        this.down=[];
        this.piece = new Piece(4, -1, Tetrominos[Math.floor(Math.random()*7)]);
        this.nextPiece = new Piece(4, -1, Tetrominos[Math.floor(Math.random()*7)]);
        this.piecesSwapped = false;
        this.rotation = 0;
        this.gameDead = false;
        this.pieceCount = 1;

        this.start();
    }

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


    collisioncheck(){
        for(var j=0; j<4; j++){
            if(this.piece.type[this.rotation][j].x+this.piece.x<0 || this.piece.type[this.rotation][j].x+this.piece.x>9 || this.piece.type[this.rotation][j].y+this.piece.y>19) return true;
    
            for(var i=0; i< this.down.length; i++){
                if(this.piece.type[this.rotation][j].x+this.piece.x==this.down[i].x && this.piece.type[this.rotation][j].y+this.piece.y==this.down[i].y)return true;
            }
        }
        return false;
    }

    removeLine(){
        var count=0, y=this.down.length-1, linescleared=0;

        //petla czysci pelne linie i usuwa je z pamieci
        for(var i=this.down.length-1; i>=0; i--){
            if(this.down[i].y!=this.down[y].y){
                count=1;
                y=i;
            }else count++;
    
            if(count==10){
                linescleared++;
                y-=9;
                this.down.splice(y, 10);
    
                
                for(var j=y; j<this.down.length; j++)this.down[j].y++; //przesuwanie wyzszego poziomu w dol

                if(y>=this.down.length)y=this.down.length-1;    //jesli nie bylo elementow powyzej usuwanej lini przesuwamy y
            }
            
        }
        
        //w przypadku gdy linia zostala usunieta, w zaleznosi od ich ilosci zwiekszamy punkty i poziom
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

    addDown(){
        var j;
        var pom;
    
        for(var i=0; i<4; i++){
            for(j=0; j<this.down.length && this.piece.type[this.rotation][i].y+this.piece.y<this.down[j].y; j++); //szukamy wysokosci wiersza w "dole"
    
            pom=new Box(this.piece.type[this.rotation][i].x+this.piece.x, this.piece.type[this.rotation][i].y+this.piece.y, this.piece.type[this.rotation][i].color);
            this.down.splice(j, 0, pom);
        }
        
    }

    //sprawdza czy gra się skończyła
    end(){
        for(var i=0; i<4; i++){
            if(this.piece.type[this.rotation][i].y+this.piece.y<=-1)return true;
        }
        
        return false;
    }


    //kończy gre
    gameOver(){
        clearTimeout();
        //document.removeEventListener("keydown", direction);
        this.gameDead = true;
        // setTimeout(() => {
        //     window.alert("GAME OVER")
        // }, 100);
    }

    direction(event){
        switch(event.keyCode){
            case 37:
                this.movePieceLeft();
                break;
            case 38:
                this.rotateR();
                break;
            case 16:
                this.rotateL();
                break;
            case 39:
                this.movePieceRight();
                break;
            case 0:
                this.movePieceDown();
                break;
        }
    }
}