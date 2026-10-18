/**
 * Piece.js – klocki (tetromina) i ich kształty.
 *
 * Każdy kształt to tablica 4 obrotów, a każdy obrót to 4 bloki (Box) z przesunięciem
 * względem punktu obrotu klocka (piece.x, piece.y). Oś y rośnie w dół planszy,
 * więc ujemne y oznacza bloki powyżej punktu obrotu.
 */

//pojedynczy kwadrat planszy (część klocka albo blok leżący na dnie)
class Box{
    constructor(x, y , color){
        this.x=x;
        this.y=y;
        this.color=color;
    }
}

//klocek w grze: pozycja punktu obrotu + kształt (jedna z tablic z Tetrominos)
class Piece{
    constructor(x, y, type){
        this.x = x;
        this.y = y;
        this.type = type;
    }

    clone(){
        return new Piece(this.x, this.y, this.type);
    }
}

//kształty klocków (obroty 0 -> 1 -> 2 -> 3 to kolejne obroty w prawo)

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

//wszystkie typy klocków – losowane w Game.js
const Tetrominos=[tTetr, lTetr, rlTetr, sqTetr, zTetr, rzTetr, linTetr];