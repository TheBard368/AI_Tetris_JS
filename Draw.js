const unit=20; //unit ma byc wielokrotnocia 2
const cvs=document.getElementById("board");
const ctx=cvs.getContext("2d");

ctx.font = "15px Arial";



function drawBox(box){
    ctx.fillStyle=box.color;
    ctx.fillRect(box.x*unit, box.y*unit, unit, unit);

    ctx.strokeStyle="black";
    ctx.strokeRect(box.x*unit, box.y*unit, unit, unit);
}

function drawPiece(piece, rotation){
    for(var i=0; i<4; i++){
        if(piece.y+piece.type[rotation][i].y>=0){
            ctx.fillStyle=piece.type[rotation][i].color;
            ctx.fillRect((piece.x+piece.type[rotation][i].x)*unit, (piece.y+piece.type[rotation][i].y)*unit, unit, unit);

            ctx.strokeStyle="black";
            ctx.strokeRect((piece.x+piece.type[rotation][i].x)*unit, (piece.y+piece.type[rotation][i].y)*unit, unit, unit);
        }
    }
}

function drawDown(down){
    for(var i=0; i<down.length; i++){
        down[i].draw(unit);
     }
}

function drawGame(game){
    ctx.save();
    ctx.translate(unit*18*((game.Id)%4), unit*21*(Math.floor(game.Id/4)));
    ctx.clearRect(0, 0, 10*unit, 20*unit);

    drawPiece(game.piece, game.rotation)
    drawDown(game.down);
    drawNext(game.nextPiece);
    drawStats(game);

    drawGrid();
    ctx.restore();
}

function drawNext(piece){
    ctx.clearRect(11*unit, 2*unit, 6*unit, 6*unit);
    ctx.strokeStyle="black";
    ctx.strokeRect(11*unit, 2*unit, 6*unit, 6*unit);

    ctx.fillStyle = piece.type[0][0].color;
    for(var i=0; i<4; i++){
        ctx.fillRect((13+piece.type[0][i].x)*unit, (5+piece.type[0][i].y)*unit, unit, unit);

        ctx.strokeRect((13+piece.type[0][i].x)*unit, (5+piece.type[0][i].y)*unit, unit, unit);
    }
}

function drawStats(game){
    ctx.clearRect(11*unit, 9*unit, 6*unit, 10*unit);
    ctx.fillStyle = 'black';
    ctx.fillText("Level : " + game.level, 11.5*unit, 10*unit);
    ctx.fillStyle = 'black';
    ctx.fillText("Score : " + game.score, 11.5*unit, 12*unit);

}

function drawGrid(){

    ctx.strokeStyle="black";
    ctx.strokeRect(0, 0, 10*unit, 20*unit);

    for(var i=1; i<10; i++){
        ctx.beginPath();
        ctx.moveTo(unit*i, 0);
        ctx.lineTo(unit*i, 20*unit);
        ctx.stroke();
    }

    for(var i=1; i<20; i++){
        ctx.beginPath();
        ctx.moveTo(0, unit*i);
        ctx.lineTo(unit*10, unit*i);
        ctx.stroke();
    }
}

// function drawGames(games){
//     ctx.clearRect(0, 0, 11*unit*games.length, 20*unit);
//     ctx.save();

//     games.forEach(g => {
//         drawGame(g)
//         ctx.translate(unit*11, 0);
//     });

//     ctx.restore();
// }