const popCount = 8;
var games = [];
var population;
var learning;

function setUp(){
    population = new Popultaion(popCount, 10);
    for(var i=0; i<popCount; i++){
        games.push(new Game(i, false));
        drawGame(games[i]);
    }
    //drawGames(games);

}

function learn(){
    if(population.allDead()){
        if(population.finalGen == population.generation){
            clearTimeout(learning);
            return;;
        }
        else{
            population.selection();
            games.forEach(g => g.reset());
        }
    }
    else{
        population.useMoves(games);
    }
    //drawGames(games);

    learning = setTimeout(learn, 0);
}


// function learn(){
//     games.forEach(g => g.start(0));

//     while(!(population.allDead() && population.finalGen == population.generation)){
//         if(population.allDead()){
//             population.selection();
//             games.forEach(g => g.reset());
//         }
//         else{
//             population.useMoves(games);
//         }
//         //drawGames(games);
//     }
// }


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
            }else{
                game.generateNextPiece();
            }
        }
    }
    game.drawBoard();
    //refreshPiecePosition();
}


setUp();
games.forEach(g => g.start(0));
var learning = setTimeout(learn, 0);
