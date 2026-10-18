/**
 * Draw.js – rysowanie gier na canvasie.
 *
 * Na jednym canvasie rysowanych jest 8 gier w układzie 4 kolumny x 2 wiersze.
 * Każda gra zajmuje 18 x 21 jednostek: plansza 10 x 20 + panel z następnym klockiem i statystykami.
 */

const unit=20; //rozmiar jednego pola w pikselach (wielokrotność 2)
const GAMES_PER_ROW = 4;
const cvs=document.getElementById("board");
const ctx=cvs.getContext("2d");

ctx.font = "15px Arial";
ctx.translate(1,1);     // przesunięcie o 1px, żeby krawędzie planszy nie były ucięte


function drawBox(box){
    ctx.fillStyle=box.color;
    ctx.fillRect(box.x*unit, box.y*unit, unit, unit);

    ctx.strokeStyle="black";
    ctx.strokeRect(box.x*unit, box.y*unit, unit, unit);
}

//rysuje spadający klocek (pomija bloki znajdujące się jeszcze nad planszą)
function drawPiece(piece, rotation){
    for(var i=0; i<4; i++){
        var box = piece.type[rotation][i];
        if(piece.y+box.y>=0){
            ctx.fillStyle=box.color;
            ctx.fillRect((piece.x+box.x)*unit, (piece.y+box.y)*unit, unit, unit);

            ctx.strokeStyle="black";
            ctx.strokeRect((piece.x+box.x)*unit, (piece.y+box.y)*unit, unit, unit);
        }
    }
}

//rysuje bloki leżące na dnie planszy
function drawDown(down){
    for(var i=0; i<down.length; i++){
        drawBox(down[i]);
    }
}

//rysuje całą grę w jej miejscu na canvasie (miejsce zależy od game.Id)
function drawGame(game){
    ctx.save();
    ctx.translate(unit*18*(game.Id%GAMES_PER_ROW), unit*21*Math.floor(game.Id/GAMES_PER_ROW));
    ctx.clearRect(0, 0, 17*unit, 20*unit);

    drawPiece(game.piece, game.rotation);
    drawDown(game.down);
    drawNext(game.nextPiece);
    drawStats(game);

    drawGrid();
    ctx.restore();
}

//podgląd następnego klocka
function drawNext(piece){
    ctx.strokeStyle="black";
    ctx.strokeRect(11*unit, 2*unit, 6*unit, 6*unit);

    ctx.fillStyle = piece.type[0][0].color;
    for(var i=0; i<4; i++){
        ctx.fillRect((13+piece.type[0][i].x)*unit, (5+piece.type[0][i].y)*unit, unit, unit);

        ctx.strokeRect((13+piece.type[0][i].x)*unit, (5+piece.type[0][i].y)*unit, unit, unit);
    }
}

function drawStats(game){
    ctx.fillStyle = 'black';
    ctx.fillText("Gra #" + (game.Id + 1), 11.5*unit, 1.2*unit);
    ctx.fillText("Poziom : " + game.level, 11.5*unit, 10*unit);
    ctx.fillText("Wynik : " + game.score, 11.5*unit, 12*unit);
    ctx.fillText("Klocki : " + game.pieceCount, 11.5*unit, 14*unit);

    if(game.gameDead){
        ctx.fillStyle = 'firebrick';
        ctx.fillText("KONIEC GRY", 11.5*unit, 17*unit);
    }
}

//siatka planszy 10 x 20
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
