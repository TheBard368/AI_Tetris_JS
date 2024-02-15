class Phenotype{
    constructor(){
        //this.setStartingWeights();
        this.randomizeWeights();

        this.movePlan = new MoveHistory();
        this.needsNewMovementPlan = true;
        this.gameEnded = false;
        this.boardState = new BoardState();
        this.pieceCount = 0;
    }

    updateBoardState(game){
        this.boardState.updateMatrix(game);
        this.gameEnded = this.boardState.gameDead;
        if(this.pieceCount!=this.boardState.pieceCount){
            this.pieceCount = this.boardState.pieceCount;
            this.needsNewMovementPlan = true; 
        }
    }

    mutate(){
        var mutationRate = 0.1;
        this.weights.holes *= Math.random(1.0) < mutationRate ? random(0.90, 1.10) : 1;
        this.weights.chasms *= Math.random(1.0) < mutationRate ? random(0.90, 1.10) : 1;
        this.weights.bumpiness *= Math.random(1.0) < mutationRate ? random(0.90, 1.10) : 1;
        this.weights.pillars *= Math.random(1.0) < mutationRate ? random(0.90, 1.10) : 1;
        this.weights.totalPillarsHeight *= Math.random(1.0) < mutationRate ? random(0.90, 1.10) : 1;
        //this.weights.currentScore *= random(1.0) < mutationRate ? random(0.95, 1.05) : 1;

    }

    getCostOfBoard(matrix){
        return this.weights.holes * matrix.holes +
               this.weights.chasms * matrix.chasms +
               this.weights.bumpiness * matrix.bumpiness +
               this.weights.pillars * matrix.pillars +
               this.weights.totalPillarsHeight * matrix.totalPillarsHeight +
               this.weights.height * matrix.height -
               this.weights.tetrised * matrix.tetrised;
               //this.weights.currentScore * matrix.currentScore;

    }

    move(game){

        this.updateBoardState(game);
        if(this.gameEnded){
            return;
        }
        
        if(this.needsNewMovementPlan==true && this.movePlan.length()!=0){
            console.log("niewyrobilem sie");
        }
        this.calculteMoves();

        var nextMove = this.movePlan.getMove();

        switch(nextMove) {
            case "swap":
                game.swapPiece();
                break;
            case "rotateR":
                game.rotateR();
                break;
            case "rotateL":
                game.rotateL();
                break;
            case "right":
                game.movePieceRight();
                break;
            case "left":
                game.movePieceLeft();
                break;
            case "down":
                game.movePieceDown();
                break;
        }
        // if(this.movePlan.length() == 0){
        //     console.log("move plan empty");
        // }
    }

    calculteMoves(){
        if(this.needsNewMovementPlan){
            var pomTab = this.boardState.clone();
            var copyCurrent = new PieceVM(pomTab.currentPiece.x, pomTab.currentPiece.y, pomTab.currentPiece.type);
            var copyNext = new PieceVM(pomTab.nextPiece.x, pomTab.nextPiece.y, pomTab.nextPiece.type)
            copyNext.moveHistory.addSwap();
            
            var endPositionForCurrent = this.findShortestsPaths(copyCurrent, pomTab);
            var endPositionForNext = [];
            if(copyCurrent.type != copyNext.type)endPositionForNext = this.findShortestsPaths(copyNext, pomTab);

            var endPositions = [...endPositionForCurrent, ...endPositionForNext];

            var bestMove = this.findBestEndPosition(endPositions, pomTab);



            this.movePlan = bestMove.moveHistory.clone();

            // this.movePlan.addMoveDown(); //testowa
            // this.bestPieceCopy = bestMove.clone();
            this.needsNewMovementPlan = false;
        }
    }


    findBestEndPosition(endPositions, matrix){
        var minCost = 1000000;
        var bestPiece;
        var pomTab;
        // var bestTab;

        for(var i=0; i<endPositions.length; i++){
            pomTab = matrix.clone();
            pomTab.pushPieceIn(endPositions[i]);
            pomTab.countHolesAndChasms();
            pomTab.countPillars();
            pomTab.checkBumpiness();
            if(minCost>this.getCostOfBoard(pomTab)){
                minCost = this.getCostOfBoard(pomTab);
                bestPiece = endPositions[i];
                // bestTab = pomTab;
            }
        }
        return bestPiece;
    }

    findShortestsPaths(piece, matrix){
        var counter = 0;
        var endPositions = [];
        var checkedPositions = new CheckedPositions(matrix);
        var checkDirection = (queue, piece, moveDirection, rotate) => {
            var tmpPiece = piece.clone();
            switch(rotate){
                case 1 :
                    if(tmpPiece.rotateR(matrix) && !checkedPositions.hasPositionBeenChecked(tmpPiece.x, tmpPiece.y, tmpPiece.rotation)){
                        checkedPositions.setCheckedPositionsArrayValue(tmpPiece.x, tmpPiece.y, tmpPiece.rotation, true);
                        queue.push(tmpPiece);
                    }
                    break;
                case -1 :
                    if(tmpPiece.rotateL(matrix) && !checkedPositions.hasPositionBeenChecked(tmpPiece.x, tmpPiece.y, tmpPiece.rotation)){
                        checkedPositions.setCheckedPositionsArrayValue(tmpPiece.x, tmpPiece.y, tmpPiece.rotation, true);
                        queue.push(tmpPiece);
                    }
                    break;
                default :
                    switch(moveDirection){
                    case 1 :
                        if(tmpPiece.moveRight(matrix) && !checkedPositions.hasPositionBeenChecked(tmpPiece.x, tmpPiece.y, tmpPiece.rotation)){
                            checkedPositions.setCheckedPositionsArrayValue(tmpPiece.x, tmpPiece.y, tmpPiece.rotation, true);
                            queue.push(tmpPiece);
                        }
                        break;
                    case -1 :
                        if(tmpPiece.moveLeft(matrix) && !checkedPositions.hasPositionBeenChecked(tmpPiece.x, tmpPiece.y, tmpPiece.rotation)){
                            checkedPositions.setCheckedPositionsArrayValue(tmpPiece.x, tmpPiece.y, tmpPiece.rotation, true);
                            queue.push(tmpPiece);
                        }
                        break;
                    default :
                    if(tmpPiece.moveDown(matrix) && !checkedPositions.hasPositionBeenChecked(tmpPiece.x, tmpPiece.y, tmpPiece.rotation)){
                        checkedPositions.setCheckedPositionsArrayValue(tmpPiece.x, tmpPiece.y, tmpPiece.rotation, true);
                        queue.push(tmpPiece);
                    }
                    break;
                    }
                break;

            }
        };


        var queue = [];
        queue.push(piece);
        while (queue.length > 0) {

            counter++;

            var pomPiece = queue.splice(0, 1)[0];

            
            if (!pomPiece.canMoveDown(matrix)) {
                endPositions.push(pomPiece.clone());
            }

            
            checkDirection(queue, pomPiece, -1, 0);//sprawdz lewo
            checkDirection(queue, pomPiece, 1, 0);//sprawdz prawo
            checkDirection(queue, pomPiece, 0, -1);//sprwdz obrod w lewo
            checkDirection(queue, pomPiece, 0, 1);//sprwdz obrod w prawo
            checkDirection(queue, pomPiece);//check down
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
            height: 100,
            tetrised: 100
            //currentScore: 100,
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

    randomizeWeights(){
        this.weights = {
            holes: 180*random(0.90, 1.10),
            chasms: 120*random(0.90, 1.10),
            bumpiness: 90*random(0.90, 1.10),
            pillars: 70*random(0.90, 1.10),
            totalPillarsHeight: 90*random(0.90, 1.10),
            height: 200*random(0.90, 1.10),
            tetrised: 120*random(0.90, 1.10)
            //currentScore: 100,
        }
    }

}

//klasa trzymająca i zarządzająca populacjami
class Popultaion{
    constructor(popCount, finalGen){
        this.finalGen = finalGen;
        this.generation = 0;
        this.popCount = popCount;
        this.createPop();
    }

    createPop(){
        this.phenotypes = [];
        for(var i=0; i<this.popCount; i++){
            this.phenotypes.push(new Phenotype());
        }
    }

    // savePop(){

    // }

    findBest(){
        var maxFit = -1;
        var best;

        for(var i=0; i<this.popCount; i++){
            if(this.phenotypes[i].getFittnes() > maxFit){
                maxFit = this.phenotypes[i].getFittnes();
                best = this.phenotypes[i];
            }
        }

        return best;
    }

    selection(){
        var newGen = [];

        var best = this.findBest();

        best.mutate();
        newGen.push(best);

        for(var i=1; i<this.popCount; i++){
            newGen.push(Phenotype.createChild(best, this.phenotypes[i])); //wstępne krzyżowanie
        }

        this.phenotypes = newGen;
        this.generation++;
    }


    useMoves(games){
        for(var i=0; i<this.popCount; i++){
            this.phenotypes[i].move(games[i]);
        }
    }
   

    getTotalFittnes(){
        var totalFittnes = 0;
        this.phenotypes.forEach(p => totalFittnes += p.getFittnes);


        return totalFittnes;
    }

    isDead(id){
        return this.phenotypes[i].gameDead;
    }

    needsMoveList(){
        return this.phenotypes[i].needsMoveList;
    }

    allDead(){
        var deadCount = 0;
        for(var i=0; i<this.popCount; i++){
            if(this.phenotypes[i].boardState.gameDead){
                deadCount++;
            }
        }
        if(deadCount == this.popCount) return true;
        return false;
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

function random(a, b){
    return Math.floor(Math.random()*((a-b+1)+a)*10000)/10000;
}