/**
 * AI.js – sztuczna inteligencja grająca w Tetrisa oraz algorytm genetyczny dobierający jej wagi.
 *
 * Zasada działania:
 *  - Phenotype (osobnik) dla każdego nowego klocka wyszukuje (BFS) wszystkie osiągalne pozycje
 *    końcowe – zarówno dla bieżącego klocka, jak i dla następnego (po zamianie "swap").
 *    Każdą pozycję ocenia funkcją kosztu = ważona suma cech planszy (dziury, wysokość,
 *    nierówność...). Wybiera pozycję o najmniejszym koszcie i wykonuje prowadzące do niej ruchy.
 *  - Population (populacja) prowadzi kilka gier równolegle. Gdy wszystkie się skończą,
 *    najlepszy osobnik przechodzi bez zmian do następnej generacji (elitaryzm), a pozostałe
 *    miejsca zajmują jego dzieci (krzyżowanie z innymi osobnikami + mutacja).
 */

// Nazwy wag funkcji kosztu (kolejność ma znaczenie przy krzyżowaniu jednopunktowym)
const WEIGHT_NAMES = ['holes', 'chasms', 'bumpiness', 'pillars', 'totalPillarsHeight', 'height', 'tetrised'];

// Bazowe wartości wag, wokół których losowana jest pierwsza populacja
const BASE_WEIGHTS = {
    holes: 180,             // zakryte dziury
    chasms: 150,            // "szczeliny" – puste pola, które da się zapełnić wsuwając klocek z boku
    bumpiness: 40,          // nierówność powierzchni (suma różnic wysokości sąsiednich kolumn)
    pillars: 10,            // liczba "filarów" (różnica wysokości z sąsiadem > 2)
    totalPillarsHeight: 20, // łączna wysokość filarów
    height: 120,            // wysokość najwyższej kolumny
    tetrised: 100           // nagroda (odejmowana od kosztu) za usunięcie 4 linii naraz
};

const MUTATION_RATE = 0.1;          // prawdopodobieństwo mutacji pojedynczej wagi
const MUTATION_RANGE = [0.9, 1.1];  // zakres mnożnika przy mutacji
const INITIAL_SPREAD = [0.5, 1.5];  // zakres mnożnika wag bazowych w losowej populacji
const SEED_MUTATION_RATE = 0.5;     // mutacja kopii wczytanego modelu (większa różnorodność)
const GAME_OVER_COST = 1e9;         // kara za pozycję wystającą ponad planszę (koniec gry)
const DEBUG = false;                // true = logowanie nieudanych ruchów w konsoli


//klasa reprezentująca pojedynczego osobnika (zestaw wag + logika sterowania jedną grą)
class Phenotype{
    /**
     * @param {Object|null} weights gotowe wagi (np. wczytane z zapisu); null = losowe
     */
    constructor(weights = null){
        if(weights){
            // brakujące wagi (np. ze starszego zapisu) uzupełniamy wartościami bazowymi
            this.weights = Object.assign({}, BASE_WEIGHTS, weights);
        }
        else{
            this.randomizeWeights();
        }

        this.reset();
    }

    //przygotowuje osobnika do nowej gry (wagi zostają bez zmian)
    reset(){
        this.movePlan = new MovePlan();
        this.needsNewMovementPlan = true;
        this.gameEnded = false;
        this.boardState = new BoardState();
        this.pieceCount = 0;
    }

    //odczytuje stan gry; gdy pojawił się nowy klocek – zaznacza potrzebę nowego planu ruchów
    updateBoardState(game){
        this.boardState.updateMatrix(game);
        this.gameEnded = this.boardState.gameDead;
        if(this.pieceCount != this.boardState.pieceCount){
            this.pieceCount = this.boardState.pieceCount;
            this.needsNewMovementPlan = true;
        }
    }

    //każda waga z prawdopodobieństwem `rate` jest mnożona przez losową wartość z MUTATION_RANGE
    mutate(rate = MUTATION_RATE){
        for(const name of WEIGHT_NAMES){
            if(Math.random() < rate){
                this.weights[name] *= random(MUTATION_RANGE[0], MUTATION_RANGE[1]);
            }
        }
    }

    //funkcja kosztu planszy – im mniejsza wartość, tym lepsza pozycja
    getCostOfBoard(matrix){
        return this.weights.holes * matrix.holes +
               this.weights.chasms * matrix.chasms +
               this.weights.bumpiness * matrix.bumpiness +
               this.weights.pillars * matrix.pillars +
               this.weights.totalPillarsHeight * matrix.totalPillarsHeight +
               this.weights.height * matrix.height -
               this.weights.tetrised * matrix.tetrised +
               (matrix.overflow ? GAME_OVER_COST : 0);
    }

    //wykonuje jeden ruch w podanej grze (wywoływane w każdym takcie pętli)
    move(game){
        this.updateBoardState(game);
        if(this.gameEnded){
            return;
        }

        if(DEBUG && this.needsNewMovementPlan && this.movePlan.length() != 0){
            console.log("Klocek zablokował się, zanim plan ruchów został wykonany");
        }
        this.calculateMoves();

        // plan wyczerpany – klocek stoi na docelowej pozycji, więc "dociskamy" go w dół,
        // co od razu go blokuje (nie czekamy na timer gry, dzięki czemu trening jest szybszy)
        if(this.movePlan.length() == 0){
            game.movePieceDown();
            return;
        }

        var nextMove = this.movePlan.getMove();
        var success = true;

        switch(nextMove) {
            case "swap":
                game.swapPiece();
                break;
            case "rotateR":
                success = game.rotateR();
                break;
            case "rotateL":
                success = game.rotateL();
                break;
            case "right":
                success = game.movePieceRight();
                break;
            case "left":
                success = game.movePieceLeft();
                break;
            case "down":
                success = game.movePieceDown();
                break;
        }

        if(DEBUG && !success){
            console.log("Nie udało się wykonać ruchu: " + nextMove);
        }
    }

    //wyznacza nowy plan ruchów, jeśli pojawił się nowy klocek
    calculateMoves(){
        if(!this.needsNewMovementPlan) return;

        var board = this.boardState.clone();
        var copyCurrent = new PieceVM(board.currentPiece.x, board.currentPiece.y, board.currentPiece.type);
        var copyNext = new PieceVM(board.nextPiece.x, board.nextPiece.y, board.nextPiece.type);
        copyNext.moveHistory.addSwap(); // ruchy następnego klocka poprzedza zamiana

        var endPositions = this.findEndPositions(copyCurrent, board);
        // zamiana na ten sam typ klocka nic nie zmienia – pomijamy
        if(copyCurrent.type != copyNext.type){
            endPositions = endPositions.concat(this.findEndPositions(copyNext, board));
        }

        var bestMove = this.findBestEndPosition(endPositions, board);

        this.movePlan = bestMove.moveHistory.clone();
        this.needsNewMovementPlan = false;
    }

    //zwraca pozycję końcową o najmniejszym koszcie
    findBestEndPosition(endPositions, matrix){
        var minCost = Infinity;
        var bestPiece = endPositions[0];

        for(const position of endPositions){
            var board = matrix.clone();
            board.pushPieceIn(position);
            board.analyze();

            var cost = this.getCostOfBoard(board);
            if(cost < minCost){
                minCost = cost;
                bestPiece = position;
            }
        }
        return bestPiece;
    }

    /**
     * Przeszukiwanie wszerz (BFS) wszystkich pozycji osiągalnych dla klocka.
     * Dzięki BFS każda pozycja jest osiągana najkrótszą sekwencją ruchów (zapisaną w moveHistory).
     * Zwraca pozycje, z których klocek nie może już zjechać niżej (pozycje końcowe).
     */
    findEndPositions(piece, matrix){
        var endPositions = [];
        var checkedPositions = new CheckedPositions();
        // wszystkie ruchy, które może wykonać klocek (kolejność: lewo, prawo, obrót L, obrót P, dół)
        var moves = [
            p => p.moveLeft(matrix),
            p => p.moveRight(matrix),
            p => p.rotateL(matrix),
            p => p.rotateR(matrix),
            p => p.moveDown(matrix)
        ];

        checkedPositions.setChecked(piece.x, piece.y, piece.rotation);
        var queue = [piece];

        // zamiast queue.splice(0, 1) używamy indeksu głowy kolejki – O(1) zamiast O(n)
        for(var head = 0; head < queue.length; head++){
            var current = queue[head];

            if(!current.canMoveDown(matrix)){
                endPositions.push(current);
            }

            for(const makeMove of moves){
                var next = current.clone();
                if(makeMove(next) && !checkedPositions.hasPositionBeenChecked(next.x, next.y, next.rotation)){
                    checkedPositions.setChecked(next.x, next.y, next.rotation);
                    queue.push(next);
                }
            }
        }

        return endPositions;
    }

    /**
     * Przystosowanie (fitness) używane przy selekcji: wynik gry + liczba postawionych klocków.
     * Drobny bonus za przetrwanie pozwala odróżnić osobniki, gdy żaden jeszcze nie zdobył punktów.
     */
    getFitness(){
        return this.boardState.currentScore + this.boardState.pieceCount;
    }

    getScore(){
        return this.boardState.currentScore;
    }

    getPieceCount(){
        return this.boardState.pieceCount;
    }

    //krzyżowanie równomierne – każda waga dziecka pochodzi losowo od jednego z rodziców
    static createChild(p1, p2){
        var weights = {};
        for(const name of WEIGHT_NAMES){
            weights[name] = choseRandom(p1.weights[name], p2.weights[name]);
        }

        var child = new Phenotype(weights);
        child.mutate();
        return child;
    }

    //krzyżowanie jednopunktowe – alternatywa dla createChild, zwraca dwoje dzieci
    static createChild2(p1, p2){
        var weights1 = {};
        var weights2 = {};
        var point = Math.floor(Math.random() * (WEIGHT_NAMES.length + 1));

        WEIGHT_NAMES.forEach((name, i) => {
            weights1[name] = i < point ? p1.weights[name] : p2.weights[name];
            weights2[name] = i < point ? p2.weights[name] : p1.weights[name];
        });

        var child1 = new Phenotype(weights1);
        var child2 = new Phenotype(weights2);
        child1.mutate();
        child2.mutate();

        return [child1, child2];
    }

    //losuje wagi wokół wartości bazowych
    randomizeWeights(){
        this.weights = {};
        for(const name of WEIGHT_NAMES){
            this.weights[name] = BASE_WEIGHTS[name] * random(INITIAL_SPREAD[0], INITIAL_SPREAD[1]);
        }
    }

}

//klasa trzymająca i zarządzająca populacją
class Population{
    /**
     * @param {number} popCount liczba osobników (= liczba równoległych gier)
     * @param {number} maxGenerations ile generacji przeprowadzić (0 = bez limitu)
     * @param {Object|null} seedWeights wagi wczytanego modelu, od którego zaczynamy (null = losowo)
     * @param {Object} options exactCopies – wszystkie osobniki są dokładną kopią seedWeights (tryb pokazu);
     *                         startGeneration – numer pierwszej generacji (kontynuacja treningu)
     */
    constructor(popCount, maxGenerations, seedWeights = null, options = {}){
        this.popCount = popCount;
        this.maxGenerations = maxGenerations;
        this.startGeneration = options.startGeneration || 0;
        this.generation = this.startGeneration;
        this.createPop(seedWeights, !!options.exactCopies);
    }

    createPop(seedWeights, exactCopies){
        this.phenotypes = [];

        if(!seedWeights){
            for(var i=0; i<this.popCount; i++){
                this.phenotypes.push(new Phenotype());
            }
            return;
        }

        // pierwszy osobnik to dokładnie wczytany model, reszta to jego (zmutowane) kopie
        this.phenotypes.push(new Phenotype(seedWeights));
        while(this.phenotypes.length < this.popCount){
            var copy = new Phenotype(seedWeights);
            if(!exactCopies) copy.mutate(SEED_MUTATION_RATE);
            this.phenotypes.push(copy);
        }
    }

    //ile generacji zostało już ukończonych w tym treningu (łącznie z bieżącą)
    generationsDone(){
        return this.generation - this.startGeneration + 1;
    }

    //czy bieżąca generacja jest ostatnią
    isFinished(){
        return this.maxGenerations > 0 && this.generationsDone() >= this.maxGenerations;
    }

    findBest(){
        var best = this.phenotypes[0];

        for(const p of this.phenotypes){
            if(p.getFitness() > best.getFitness()){
                best = p;
            }
        }

        return best;
    }

    //tworzy nową generację: elita (najlepszy bez zmian) + dzieci najlepszego z pozostałymi osobnikami
    selection(){
        var best = this.findBest();
        var newGen = [new Phenotype(best.weights)];

        for(var i=1; i<this.popCount; i++){
            newGen.push(Phenotype.createChild(best, this.phenotypes[i]));
        }

        this.phenotypes = newGen;
        this.generation++;
    }

    //nowa runda bez ewolucji (tryb pokazu) – wagi zostają, zerujemy tylko stan gier
    resetAll(){
        this.phenotypes.forEach(p => p.reset());
        this.generation++;
    }

    //każdy osobnik wykonuje jeden ruch w swojej grze
    useMoves(games){
        for(var i=0; i<this.popCount; i++){
            this.phenotypes[i].move(games[i]);
        }
    }

    getTotalFitness(){
        return this.phenotypes.reduce((sum, p) => sum + p.getFitness(), 0);
    }

    isDead(id){
        return this.phenotypes[id].boardState.gameDead;
    }

    aliveCount(){
        return this.phenotypes.filter(p => !p.boardState.gameDead).length;
    }

    allDead(){
        return this.aliveCount() == 0;
    }
}

//zwraca losowo jeden z dwóch argumentów
function choseRandom(a, b){
    return Math.random() < 0.5 ? a : b;
}

//losowa liczba z przedziału [a, b), zaokrąglona do 4 miejsc po przecinku
function random(a, b){
    return Math.round((a + Math.random() * (b - a)) * 10000) / 10000;
}
