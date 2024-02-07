class Phenotype{
    constructor(){
        this.setStartingWeights();

        this.movePlan = new MoveHistory();
        this.gameEnded = false;
        this.boardState = new BoardState();
    }

    mutate(){
        var mutationRate = 0.1;
        this.weights.holes *= random(1.0) < mutationRate ? random(0.95, 1.05) : 1;
        this.weights.chasms *= random(1.0) < mutationRate ? random(0.95, 1.05) : 1;
        this.weights.bumpiness *= random(1.0) < mutationRate ? random(0.95, 1.05) : 1;
        this.weights.pillars *= random(1.0) < mutationRate ? random(0.95, 1.05) : 1;
        this.weights.totalPillarsHeight *= random(1.0) < mutationRate ? random(0.95, 1.05) : 1;
        this.weights.currentScore *= random(1.0) < mutationRate ? random(0.95, 1.05) : 1;

    }

    getCostOfBoard(analizesMatrix){
        return this.weights.holes * analizesMatrix.holes +
               this.weights.chasms * analizesMatrix.chasms +
               this.weights.bumpiness * analizesMatrix.bumpiness +
               this.weights.pillars * analizesMatrix.pillars +
               this.weights.totalPillarsHeight * analizesMatrix.totalPillarsHeight +
               this.weights.currentScore * analizesMatrix.currentScore;

    }

    calculteMoves(currentPiece, nextPiece, analizesMatrix){
        if(this.movePlan.moveList.length != 0){
            var pomTab = analizesMatrix.clone();
            var copyCurrent = new PieceVM(currentPiece.x, currentPiece.y, currentPiece.type);
            var copyNext = new PieceVM(nextPiece.x, nextPiece.y, nextPiece.type)
            
            var bestEndPositionForCurrent = this.findBestPositions(copyCurrent, pomTab);
            var bestEndPositionForNext = [];
            if(currentPiece.type != nextPiece.type)bestEndPositionForNext = this.findBestPositions(copyNext, pomTab);
            
        }
    }

    findShortestsPaths(piece, matrix){
        var counter = 0;
        var endPositions = [];
        var checkedPositions = new CheckedPositions(matrix);
        var checkInDirection = (queue, piece, x, y, r) => {
            if (r) {
                if (shape.canRotateShape(true, blockMatrix)) {
                    var pieceRotated = piece.clone();
                    pieceRotated.rotateShape(true,blockMatrix);

                    if (!checkedPositions.hasShapesPositionBeenChecked(rotatedShape)) {
                        checkedPositions.setCheckedPositionsArrayValueAtShapesPosition(rotatedShape, true);
                        queue.push(rotatedShape);
                    }
                }
            } else {
                if (shape.canMoveInDirection(x, y, blockMatrix)) {
                    var movedShape = shape.clone();
                    movedShape.moveShape(x, y,blockMatrix);

                }
            }
        };


        var queue = [];
        queue.push(piece);
        while (queue.length > 0) {

            counter++;
            //grab a shape off the front of the queue
            var shape = queue.splice(0, 1)[0];

            //if the shape cannot move down then it is a possible end position
            if (!shape.canMoveDown(blockMatrix)) {
                endPositions.push(shape.clone());
            }

            //check if you can move this shape in each way, if you can move it then add it to the back of the queue

            checkInDirection(queue, shape, -1, 0);//check left
            checkInDirection(queue, shape, 1, 0);//check right
            checkInDirection(queue, shape, 0, 0, 1);//check rotation
            checkInDirection(queue, shape, 0, 1);//check down
        }

        return endPositions;

    }

    

    setStartingWeights(){
        this.weights = {
            holes: 100,
            chasms: 100,
            bumpiness: 100,
            pillars: 100,
            totalPillarsHeight: 100,
            currentScore: 100,
        }
    }

    getFittnes(){
        return this.boardState.currentScore;
    }

    static createChild(p1, p2){
        var child = new Phenotype();

        child.weights.bumpiness = choseRandom(p1.weights.bumpiness, p2.weights.bumpiness);
        child.weights.chasms = choseRandom(p1.weights.chasms, p2.weights.chasms);
        child.weights.holes = choseRandom(p1.weights.holes, p2.weights.holes);
        child.weights.pillars = choseRandom(p1.weights.pillars, p2.weights.pillars);
        child.weights.totalPillarsHeight = choseRandom(p1.weights.totalPillarsHeight, p2.weights.totalPillarsHeight);
        child.weights.currentScore = choseRandom(p1.weights.currentScore, p2.weights.currentScore);

        child.mutate();

        return child;
    }

    // randomizeWeights(){

    // }

}

//klasa trzymająca i zarządzająca populacjami
class Popultaion{
    constructor(popCount, prevPop){
        this.generation = 0
        this.popCount = popCount;
        this.phenotypes = [];
        this.createPop(prevPop);
    }

    // createPop(prevPop){
    //     for(var i=0; i<this.popCount; i++){
    //         this.phenotypes.push(new Phenotype());
    //     }

    //     for(var i=0; i<prevPop.popCount; i++){
    //         prevPop().phenotypes.pop(); 
    //     }
    // }

    savePop(){

    }

    selection(){
        var newGen = []

        for(var i=0; i<this.phenotypes.length/2; i++){
            newGen.push(Phenotype.createChild(this.phenotypes[i], this.phenotypes[this.phenotypes.length-i])); //wstępne krzyżowanie
        }

        this.phenotypes = newGen;
        this.generation++;
    }

    

    getTotalFittnes(){
        var totalFittnes = 0;
        this.phenotypes.forEach(p => totalFittnes += p.getFittnes);


        return totalFittnes;
    }

    
}

function choseRandom(a, b){
    if(Math.random()<0.5){
        return a;
    }
    else{
        return b;
    }
}