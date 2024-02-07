class MoveHistory{
    constructor(){
        this.moveList = [];
    }
    
    addMoveLeft(){
        this.moveList.push("left");
    }

    addMoveRight(){
        this.moveList.push("right");
    }

    addMoveDown(){
        this.moveList.push("down");
    }

    addRotateRight(){
        this.moveList.push("rotateR");
    }

    addRotateLeft(){
        this.moveList.push("rotateL");
    }

    addSwap(){
        this.moveList.unshift("swap");
    }

    clone(){
        var copy = new MoveHistory();
        this.moveList.forEach(m => {
            copy.moveList.push(m);
        });

        return copy;
    }
}