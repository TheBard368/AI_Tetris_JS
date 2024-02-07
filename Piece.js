class Box{
    constructor(x, y , color){
        this.x=x;
        this.y=y;
        this.color=color;
    }

    draw(unit){
        ctx.fillStyle=this.color;
        ctx.fillRect(this.x*unit, this.y*unit, unit, unit);

        ctx.strokeStyle="black";
        ctx.strokeRect(this.x*unit, this.y*unit, unit, unit);
    } 

}
//to do: dodac ,funkcje zwiekszajace przejrzystosc kodu np. zwracajaca pozycje konkretnego bloku
class Piece{
    constructor(x, y, type){
        this.x = x;
        this.y = y;
        this.type = type;
    }


    draw(rotation, unit){
        
        for(var i=0; i<4; i++){
            ctx.fillStyle=this.type[rotation][i].color;
            ctx.fillRect((this.x+this.type[rotation][i].x)*unit, (this.y+this.type[rotation][i].y)*unit, unit, unit);

            ctx.strokeStyle="black";
            ctx.strokeRect((this.x+this.type[rotation][i].x)*unit, (this.y+this.type[rotation][i].y)*unit, unit, unit);
        }
    }

    clone(){
        var piece = new Piece(this.x, this.y, this.type);
        return piece;
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