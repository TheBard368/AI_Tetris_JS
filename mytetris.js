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

}

function learn(){
    if(population.allDead()){
        if(population.finalGen == population.generation){
            clearInterval(learning);
            return;;
        }
        else{
            population.selection();
            games.forEach(g => g.reset());
            population.useMoves(games);
        }
    }
    else{
        population.useMoves(games);
    }
}

function mode(event){
    switch(event.keyCode){
        case 65 :   // a
            break;
        case 83 :   // s
            break;
    }
}


function direction(event){
    if(event.keyCode==37){
        game.movePieceLeft();
    }else if(event.keyCode==76){    // l
        game.rotateR();
    }else if(event.keyCode==75){    // k
        game.rotateL();     
    }else if(event.keyCode==39){
        game.movePieceRight();
    }else if(event.keyCode==40){
        game.movePieceDown();
    }
}



setUp();
games.forEach(g => g.start());
var learning = setInterval(learn, 0);
