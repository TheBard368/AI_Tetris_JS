class MovePlan{
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
        var copy = new MovePlan();
        for(var i = 0; i<this.moveList.length; i++){
            copy.moveList.push("" + this.moveList[i]);
        }

        return copy;
    }

    getMove(){
        return this.moveList.splice(0, 1)[0];
    }

    length(){
        return this.moveList.length;
    }
}