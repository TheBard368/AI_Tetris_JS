/**
 * MovePlan.js – kolejka ruchów do wykonania przez AI.
 *
 * PieceVM zapisuje tu każdy wykonany na próbę ruch, a po wybraniu najlepszej pozycji
 * Phenotype pobiera z planu po jednym ruchu na takt i wykonuje go w prawdziwej grze.
 * Możliwe ruchy: "left", "right", "down", "rotateR", "rotateL", "swap".
 */
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

    //zamiana klocków zawsze musi być pierwszym ruchem, dlatego trafia na początek kolejki
    addSwap(){
        this.moveList.unshift("swap");
    }

    clone(){
        var copy = new MovePlan();
        copy.moveList = this.moveList.slice();
        return copy;
    }

    //zdejmuje i zwraca pierwszy ruch z kolejki (undefined, gdy kolejka jest pusta)
    getMove(){
        return this.moveList.shift();
    }

    length(){
        return this.moveList.length;
    }
}
