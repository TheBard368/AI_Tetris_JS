// const unit=20;
// //const cvs=document.getElementById("board");
// //const ctx=cvs.getContext("2d");


//     play(){
//         // ctx.clearRect(0, 0, 10*unit, 20*unit);
        
//         // piece.draw();

//         // for(var i=0; i<down.length; i++){
//         //     ctx.fillStyle=down[i].color;
//         //     ctx.fillRect(down[i].x*unit, down[i].y*unit, unit, unit);

//         //     //ctx.fillStyle="black";
//         //     //ctx.fillText(i,down[i].x*unit+10, down[i].y*unit+10);

//         //     ctx.strokeStyle="black";
//         //     ctx.strokeRect(down[i].x*unit, down[i].y*unit, unit, unit);
//         // }
//         //refreshPiecePosition();
//         drawBoard();
//         updateMatrix();


//         //deletePiecePosition();
//         piece.y++;
//         if(piece.collisioncheck()){
//             piece.y--;
//             addDown();
//             removeLine();
//             if(end()){
//                 clearInterval(game);
//                 setTimeout(() => {
//                     window.alert("GAME OVER")
//                 }, 100);
//             }
//             if(schowek==0){
//                 piece = new Piece(4, -1, Tetrominos[Math.floor(Math.random()*7)]);
//             }
//             else{
//                 piece = new Piece(4, -1, schowek.type);
//                 schowek = 0;
//             }
//         }
//     }

//     rotateL(){
//         var prevRotation = this.rotation;
//         this.rotation--;
//         if(this.rotation<0)this.rotation=3;

//         if(this.collisioncheck()){
//             // wall kick w prawo (SUPER ROTATION SYSTEM); y maja przeciwne wartosci w stosunku do zwyklego tetrisa 
//             if(this.piece.type != linTetr){
//                 switch(prevRotation){
//                     case 0:
//                         this.piece.x++;
//                         if(this.collisioncheck()){
//                             this.piece.y--;
//                             if(this.collisioncheck()){
//                                 this.piece.x--;
//                                 this.piece.y+=3;
//                                 if(this.collisioncheck()){
//                                     this.piece.x++;
//                                     if(this.collisioncheck()){ // powrót do stanu poczatkowego
//                                         this.piece.x--;
//                                         this.piece.y-=2;
//                                         this.rotation = prevRotation;
//                                     }
//                                 }
//                             }
//                         }
//                         break;
//                     case 1:
//                         this.piece.x++;
//                         if(this.piece.collisioncheck()){
//                             this.piece.y++;
//                             if(this.piece.collisioncheck()){
//                                 this.piece.x--;
//                                 this.piece.y-=3;
//                                 if(this.piece.collisioncheck()){
//                                     this.piece.x++;
//                                     if(this.piece.collisioncheck()){ // powrót do stanu poczatkowego
//                                         this.piece.x--;
//                                         this.piece.y+=2;
//                                         this.rotation = prevRotation;
//                                     }
//                                 }
//                             }
//                         }
//                         break;
//                     case 2:
//                         this.piece.x--;
//                         if(this.piece.collisioncheck()){
//                             this.piece.y--;
//                             if(this.piece.collisioncheck()){
//                                 this.piece.x++;
//                                 this.piece.y+=3;
//                                 if(this.piece.collisioncheck()){
//                                     this.piece.x--;
//                                     if(this.piece.collisioncheck()){ // powrót do stanu poczatkowego
//                                         this.piece.x++;
//                                         this.piece.y-=2;
//                                         this.rotation = prevRotation;
//                                     }
//                                 }
//                             }
//                         }
//                         break;
//                     case 3:
//                         this.piece.x--;
//                         if(this.piece.collisioncheck()){
//                             this.piece.y++;
//                             if(this.piece.collisioncheck()){
//                                 this.piece.x++;
//                                 this.piece.y-=3;
//                                 if(this.piece.collisioncheck()){
//                                     this.piece.x--;
//                                     if(this.piece.collisioncheck()){ // powrót do stanu poczatkowego
//                                         this.piece.x++;
//                                         this.piece.y+=2;
//                                         this.rotation = prevRotation;
//                                     }
//                                 }
//                             }
//                         }
//                         break;
        
//                 }
//             }
//             else{
//                 switch(this.rotation){
//                     case 0:
//                         this.piece.x--;
//                         if(this.collisioncheck()){
//                             this.piece.x+=3;
//                             if(this.collisioncheck()){
//                                 this.piece.x-=3;
//                                 this.piece.y-=2;
//                                 if(this.collisioncheck()){
//                                     this.piece.x+=3;
//                                     this.piece.y+=3;
//                                     if(this.collisioncheck()){ // powrót do stanu poczatkowego
//                                         this.piece.x-=2;
//                                         this.piece.y++;
//                                         this.rotation = prevRotation;
//                                     }
//                                 }
//                             }
//                         }
//                         break;
//                     case 1:
//                         this.piece.x+=2;
//                         if(this.collisioncheck()){
//                             this.piece.x-=3;
//                             if(this.collisioncheck()){
//                                 this.piece.x+=3;
//                                 this.piece.y--;
//                                 if(this.collisioncheck()){
//                                     this.piece.x-=3;
//                                     this.piece.y+=3;
//                                     if(this.collisioncheck()){ // powrót do stanu poczatkowego
//                                         this.piece.x--;
//                                         this.piece.y-=2;
//                                         this.rotation = prevRotation;
//                                     }
//                                 }
//                             }
//                         }
//                         break;
//                     case 2:
//                         this.piece.x++;
//                         if(this.collisioncheck()){
//                             this.piece.x-=3;
//                             if(this.collisioncheck()){
//                                 this.piece.x+=3;
//                                 this.piece.y+=2;
//                                 if(this.collisioncheck()){
//                                     this.piece.x-=3;
//                                     this.piece.y-=3;
//                                     if(this.collisioncheck()){ // powrót do stanu poczatkowego
//                                         this.piece.x+=2;
//                                         this.piece.y--;
//                                         this.rotation = prevRotation;
//                                     }
//                                 }
//                             }
//                         }
//                         break;
//                     case 3:
//                         this.piece.x-=2;
//                         if(this.collisioncheck()){
//                             this.piece.x+=3;
//                             if(this.collisioncheck()){
//                                 this.piece.x-=3;
//                                 this.piece.y++;
//                                 if(this.collisioncheck()){
//                                     this.piece.x+=3;
//                                     this.piece.y-=3;
//                                     if(this.collisioncheck()){ // powrót do stanu poczatkowego
//                                         this.piece.x--;
//                                         this.piece.y+=2;
//                                         this.rotation = prevRotation;
//                                     }
//                                 }
//                             }
//                         }
//                         break;
//                 }
//             }
//         }
//     }

//     rotateR(){
//         var prevRotation = this.rotation;
//         this.rotation++;
//         if(this.rotation>3)this.rotation=0;

//         if(this.collisioncheck()){
//             // wall kick w prawo (SUPER ROTATION SYSTEM); y maja przeciwne wartosci w stosunku do zwyklego tetrisa 
//             if(this.piece.type != linTetr){
//                 switch(prevRotation){
//                     case 0:
//                         this.piece.x--;
//                         if(this.collisioncheck()){
//                             this.piece.y--;
//                             if(this.collisioncheck()){
//                                 this.piece.x++;
//                                 this.piece.y+=3;
//                                 if(this.collisioncheck()){
//                                     this.piece.x--;
//                                     if(this.collisioncheck()){ // powrót do stanu poczatkowego
//                                         this.piece.x++;
//                                         this.piece.y-=2;
//                                         this.rotation = prevRotation;
//                                     }
//                                 }
//                             }
//                         }
//                         break;
//                     case 1:
//                         this.piece.x++;
//                         if(this.collisioncheck()){
//                             this.piece.y++;
//                             if(this.collisioncheck()){
//                                 this.piece.x--;
//                                 this.piece.y-=3;
//                                 if(this.collisioncheck()){
//                                     this.piece.x++;
//                                     if(this.collisioncheck()){ // powrót do stanu poczatkowego
//                                         this.piece.x--;
//                                         this.piece.y+=2;
//                                         this.rotation = prevRotation;
//                                     }
//                                 }
//                             }
//                         }
//                         break;
//                     case 2:
//                         this.piece.x++;
//                         if(this.collisioncheck()){
//                             this.piece.y--;
//                             if(this.collisioncheck()){
//                                 this.piece.x--;
//                                 this.piece.y+=3;
//                                 if(this.collisioncheck()){
//                                     this.piece.x++;
//                                     if(this.collisioncheck()){ // powrót do stanu poczatkowego
//                                         this.piece.x--;
//                                         this.piece.y-=2;
//                                         this.rotation = prevRotation;
//                                     }
//                                 }
//                             }
//                         }
//                         break;
//                     case 3:
//                         this.piece.x--;
//                         if(this.collisioncheck()){
//                             this.piece.y++;
//                             if(this.collisioncheck()){
//                                 this.piece.x++;
//                                 this.piece.y-=3;
//                                 if(this.collisioncheck()){
//                                     this.piece.x--;
//                                     if(this.collisioncheck()){ // powrót do stanu poczatkowego
//                                         this.piece.x++;
//                                         this.piece.y+=2;
//                                         this.rotation = prevRotation;
//                                     }
//                                 }
//                             }
//                         }
//                         break;
        
//                 }
//             }
//             else{
//                 switch(this.rotation){
//                     case 0:
//                         this.piece.x-=2;
//                         if(this.collisioncheck()){
//                             this.piece.x+=3;
//                             if(this.collisioncheck()){
//                                 this.piece.x-=3;
//                                 this.piece.y++;
//                                 if(this.collisioncheck()){
//                                     this.piece.x+=3;
//                                     this.piece.y-=3;
//                                     if(this.collisioncheck()){ // powrót do stanu poczatkowego
//                                         this.piece.x--;
//                                         this.piece.y+=2;
//                                         this.rotation = prevRotation;
//                                     }
//                                 }
//                             }
//                         }
//                         break;
//                     case 1:
//                         this.piece.x--;
//                         if(this.collisioncheck()){
//                             this.piece.x+=3;
//                             if(this.collisioncheck()){
//                                 this.piece.x-=3;
//                                 this.piece.y-=2;
//                                 if(this.collisioncheck()){
//                                     this.piece.x+=3;
//                                     this.piece.y+=3;
//                                     if(this.collisioncheck()){ // powrót do stanu poczatkowego
//                                         this.piece.x-=2;
//                                         this.piece.y++;
//                                         this.rotation = prevRotation;
//                                     }
//                                 }
//                             }
//                         }
//                         break;
//                     case 2:
//                         this.piece.x+=2;
//                         if(this.collisioncheck()){
//                             this.piece.x-=3;
//                             if(this.collisioncheck()){
//                                 this.piece.x+=3;
//                                 this.piece.y--;
//                                 if(this.collisioncheck()){
//                                     this.piece.x-=3;
//                                     this.piece.y+=3;
//                                     if(this.collisioncheck()){ // powrót do stanu poczatkowego
//                                         this.piece.x--;
//                                         this.piece.y-=2;
//                                         this.rotation = prevRotation;
//                                     }
//                                 }
//                             }
//                         }
//                         break;
//                     case 3:
//                         this.piece.x++;
//                         if(this.collisioncheck()){
//                             this.piece.x-=3;
//                             if(this.collisioncheck()){
//                                 this.piece.x+=3;
//                                 this.piece.y+=2;
//                                 if(this.collisioncheck()){
//                                     this.piece.x-=3;
//                                     this.piece.y-=3;
//                                     if(this.collisioncheck()){ // powrót do stanu poczatkowego
//                                         this.piece.x+=2;
//                                         this.piece.y--;
//                                         this.rotation = prevRotation;
//                                     }
//                                 }
//                             }
//                         }
//                         break;
//                 }
//             }
//         }

//     }

//     collisioncheck(){
//         for(var j=0; j<4; j++){
//             if(this.piece.type[this.rotation][j].x+this.piece.x<0 || this.piece.type[this.rotation][j].x+this.piece.x>9 || this.piece.type[this.rotation][j].y+this.piece.y>19) return true;
    
//             for(var i=0; i< this.down.length; i++){
//                 if(this.piece.type[this.rotation][j].x+this.piece.x==down[i].x && this.piece.type[this.rotation][j].y+this.piece.y==down[i].y)return true;
//             }
//         }
//         return false;
//     }

//     removeLine(){
//         var count=0, y=this.down.length-1, linescleared=0;

//         //petla czysci pelne linie i usuwa je z pamieci
//         for(var i=this.down.length-1; i>=0; i--){
//             if(this.down[i].y!=this.down[y].y){
//                 count=1;
//                 y=i;
//             }else count++;
    
//             if(count==10){
//                 linescleared++;
//                 y-=9;
//                 this.down.splice(y, 10);
    
//                 for(var j=0; j<10; j++){
                    
//                 }
                
//                 for(var j=y; j<this.down.length; j++)this.down[j].y++; //przesuwanie wyzszego poziomu w dol
//             }
//         }
        
//         //w przypadku gdy linia zostala usunieta, w zaleznosi od ich ilosci zwiekszamy punkty i poziom
//         switch(linescleared){
//             default :
//                 break;
//             case 1 :
//                 this.score+=40*(level+1);
//                 break;
//             case 2 :
//                 this.score+=100*(level+1);
//                 break;
//             case 3 :
//                 this.score+=300*(level+1);
//                 break;
//             case 4 :
//                 this.score+=1200*(level+1);
//                 break;
    
//         }
//         this.amoutOfLinesCleared+=linescleared;
    
//         if(this.amoutOfLinesCleared>=10){
//             this.amoutOfLinesCleared-=10;
//             this.level++;
//         }
    
//         //zmiana predkosc opuszczanie elementu w zaleznoci od poziomu
//         switch(this.level){
//             case 0 :
//                 break;
//             case 1 :
//                 this.droppingSpeed = 720;
//                 break;
//             case 2 :
//                 this.droppingSpeed = 640;
//                 break;
//             case 3 :
//                 this.droppingSpeed = 550;
//                 break;
//             case 4 :
//                 this.droppingSpeed = 430;
//                 break;
//             case 5 :
//                 this.droppingSpeed = 380;
//                 break;
//             case 6 :
//                 this.droppingSpeed = 305;
//                 break;
//             case 7 :
//                 this.droppingSpeed = 220;
//                 break;
//             case 8 :
//                 this.droppingSpeed = 185;
//                 break;
//             case 9 :
//                 this.droppingSpeed = 105;
//                 break;
//             case 10 :
//             case 11 :
//             case 12 :
//                 this.droppingSpeed = 85;
//                 break;
//             case 13 :
//             case 14 :
//             case 15 :
//                 this.droppingSpeed = 65;
//                 break;
//             case 16 :
//             case 17 :
//             case 18 :
//                 this.droppingSpeed = 50;
//                 break;
//             case 19 :
//             case 20 :
//             case 21 :
//             case 22 :
//             case 23 :
//             case 24 :
//             case 25 :
//             case 26 :
//             case 27 :
//             case 28 :
//                 this.droppingSpeed = 33;
//                 break;
//             default :
//                 this.droppingSpeed = 15;
//                 break;
//         }
    
//     }

//     addDown(){
//         var j;
//         var pom;
    
//         for(var i=0; i<4; i++){
//             for(j=0; j<this.down.length && this.piece.type[this.rotation][i].y+this.piece.y<down[j].y; j++);
    
//             board[this.piece.x + this.piece.type[this.rotation][i].x][this.piece.y + this.piece.type[this.rotation][i].y] = 2; //zaznaczanie pojawienie się nowego elementu na dole
    
//             pom=new Box(this.piece.type[this.rotation][i].x+this.piece.x, this.piece.type[this.rotation][i].y+this.piece.y, this.piece.type[this.rotation][i].color);
//             this.down.splice(j, 0, pom);
//         }
        
//     }

// var score = 0;
// var level = 0;
// var droppingSpeed = 800;
// var amoutOfLinesCleared = 0;

// var d=0;

// function direction(event){
//     //deletePiecePosition();
//     if(event.keyCode==37){
//         piece.x--;
//         if(piece.collisioncheck())piece.x++;
//     }else if(event.keyCode==38){
//         piece.rotateR();
//     }else if(event.keyCode==39){
//         piece.x++;
//         if(piece.collisioncheck())piece.x--;
//     }else if(event.keyCode==40){
//         piece.y++;
//         if(piece.collisioncheck()){
//             piece.y--;
//             addDown();
//             removeLine();
//             if(end()){
//                 clearInterval(game);
//                 setTimeout(() => {
//                     window.alert("GAME OVER")
//                 }, 100);
//             }
//             if(schowek==0){
//                 piece = new Piece(4, -1, Tetrominos[Math.floor(Math.random()*7)]);
//             }
//             else{
//                 piece = new Piece(4, -1, schowek.type);
//                 schowek = 0;
//             }
//         }
//     }
//     drawBoard();
//     //refreshPiecePosition();
//     updateMatrix();
// }

// // function hold(piece){
// //     schowek = piece.type;
// //     piece.x=4;
// //     piece.y=-1;
// //     piece.rotation=0;
// //     piece.type=Math.floor(Math.random()*7);
// // }


// function drawBoard(){
//     gameT.ctx.clearRect(0, 0, 10*unit, 20*unit);

//     piece.draw(this.rotation, unit);

//     for(var i=0; i<down.length; i++){
//         gameT.ctx.fillStyle=down[i].color;
//         gameT.ctx.fillRect(down[i].x*unit, down[i].y*unit, unit, unit);

//         gameT.ctx.strokeStyle="black";
//         gameT.ctx.strokeRect(down[i].x*unit, down[i].y*unit, unit, unit);
//     }
// }


// function addDown(){
//     var j;
//     var pom;

//     for(var i=0; i<4; i++){
//         for(j=0; j<down.length && piece.type[piece.rotation][i].y+piece.y<down[j].y; j++);

//         board[piece.x + piece.type[piece.rotation][i].x][piece.y + piece.type[piece.rotation][i].y] = 2; //zaznaczanie pojawienie się nowego elementu na dole

//         pom=new Box(piece.type[piece.rotation][i].x+piece.x, piece.type[piece.rotation][i].y+piece.y, piece.type[piece.rotation][i].color);
//         down.splice(j, 0, pom);
//     }
    
// }

// function removeLine(){
//     var count=0, y=down.length-1, linescleared=0;

//     for(var i=down.length-1; i>=0; i--){
//         if(down[i].y!=down[y].y){
//             count=1;
//             y=i;
//         }else count++;

//         if(count==10){
//             linescleared++;
//             y-=9;
//             down.splice(y, 10);

//             for(var j=0; j<10; j++){
                
//             }
            
//             for(var j=y; j<down.length; j++)down[j].y++;
//         }
//     }
    
//     switch(linescleared){
//         default :
//             break;
//         case 1 :
//             score+=40*(level+1);
//             break;
//         case 2 :
//             score+=100*(level+1);
//             break;
//         case 3 :
//             score+=300*(level+1);
//             break;
//         case 4 :
//             score+=1200*(level+1);
//             break;

//     }
//     amoutOfLinesCleared+=linescleared;

//     if(amoutOfLinesCleared>=10){
//         amoutOfLinesCleared-=10;
//         level++;
//     }

//     //opuszczanie elementu
//     switch(level){
//         case 0 :
//             break;
//         case 1 :
//             droppingSpeed = 720;
//             break;
//         case 2 :
//             droppingSpeed = 640;
//             break;
//         case 3 :
//             droppingSpeed = 550;
//             break;
//         case 4 :
//             droppingSpeed = 430;
//             break;
//         case 5 :
//             droppingSpeed = 380;
//             break;
//         case 6 :
//             droppingSpeed = 305;
//             break;
//         case 7 :
//             droppingSpeed = 220;
//             break;
//         case 8 :
//             droppingSpeed = 185;
//             break;
//         case 9 :
//             droppingSpeed = 105;
//             break;
//         case 10 :
//         case 11 :
//         case 12 :
//             droppingSpeed = 85;
//             break;
//         case 13 :
//         case 14 :
//         case 15 :
//             droppingSpeed = 65;
//             break;
//         case 16 :
//         case 17 :
//         case 18 :
//             droppingSpeed = 50;
//             break;
//         case 19 :
//         case 20 :
//         case 21 :
//         case 22 :
//         case 23 :
//         case 24 :
//         case 25 :
//         case 26 :
//         case 27 :
//         case 28 :
//             droppingSpeed = 33;
//             break;
//         default :
//             droppingSpeed = 15;
//             break;
//     }

// }
// function end(){
//     for(var i=0; i<4; i++){
//         if(piece.type[piece.rotation][i].y+piece.y<=-1)return true;
//     }

//     return false;
// }

// var gameT = new Game(board, true, unit);
// //var piece = new Piece(4, -1, Tetrominos[Math.floor(Math.random()*7)]);

// function play(){
//     // ctx.clearRect(0, 0, 10*unit, 20*unit);
    
//     // piece.draw();

//     // for(var i=0; i<down.length; i++){
//     //     ctx.fillStyle=down[i].color;
//     //     ctx.fillRect(down[i].x*unit, down[i].y*unit, unit, unit);

//     //     //ctx.fillStyle="black";
//     //     //ctx.fillText(i,down[i].x*unit+10, down[i].y*unit+10);

//     //     ctx.strokeStyle="black";
//     //     ctx.strokeRect(down[i].x*unit, down[i].y*unit, unit, unit);
//     // }
//     //refreshPiecePosition();
//     drawBoard();
//     updateMatrix();


//     //deletePiecePosition();
//     piece.y++;
//     if(piece.collisioncheck()){
//         piece.y--;
//         addDown();
//         removeLine();
//         if(end()){
//             clearInterval(game);
//             setTimeout(() => {
//                 window.alert("GAME OVER")
//             }, 100);
//         }
//         if(schowek==0){
//             piece = new Piece(4, -1, Tetrominos[Math.floor(Math.random()*7)]);
//         }
//         else{
//             piece = new Piece(4, -1, schowek.type);
//             schowek = 0;
//         }
//     }
// }


// var game=setInterval(gameT.play,droppingSpeed);

function direction(event){
    //deletePiecePosition();
    if(event.keyCode==37){
        game.piece.x--;
        if(game.collisioncheck())game.piece.x++;
    }else if(event.keyCode==38){
        game.rotateR();
    }else if(event.keyCode==39){
        game.piece.x++;
        if(game.collisioncheck())game.piece.x--;
    }else if(event.keyCode==40){
        game.piece.y++;
        if(game.collisioncheck()){
            game.piece.y--;
            game.addDown();
            game.removeLine();
            if(game.end()){
                game.gameOver();
            }
        }
    }
    game.drawBoard();
    //refreshPiecePosition();
}


const unit=20;

var game = new Game("board", true, unit);

var ctx = game.ctx;





game.start(0);